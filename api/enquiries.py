import json
import os
import re
import smtplib
from datetime import datetime, timezone
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler
from typing import Any


MAX_BODY_BYTES = 10_000
IMMEDIATE_EMAIL_VALUES = {"1", "true", "yes", "on"}


class ValidationError(Exception):
    pass


def _get_env(*names: str) -> str:
    for name in names:
        value = os.environ.get(name, "").strip()
        if value:
            return value
    return ""


def _has_supabase_config() -> bool:
    return bool(_get_env("SUPABASE_URL") and _get_env("SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_KEY"))


def _get_supabase():
    """Returns a Supabase client using service-role key."""
    url = _get_env("SUPABASE_URL")
    key = _get_env("SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_KEY")
    if not url or not key:
        raise RuntimeError("Supabase configuration is missing")

    try:
        from supabase import create_client
    except ImportError as exc:
        raise RuntimeError("Supabase Python package is not installed") from exc

    return create_client(url, key)


def _get_smtp_port() -> int:
    try:
        return int(os.environ.get("SMTP_PORT", "587") or "587")
    except ValueError:
        return 587


def _get_smtp_config():
    """Returns SMTP config from environment variables."""
    return {
        "server": os.environ.get("SMTP_SERVER", ""),
        "port": _get_smtp_port(),
        "user": os.environ.get("SMTP_USERNAME", ""),
        "password": os.environ.get("SMTP_PASSWORD", ""),
        "receiver": os.environ.get("RECEIVER_EMAIL", "He_jani2523@yahoo.in") or "He_jani2523@yahoo.in",
    }


def _is_smtp_configured() -> bool:
    cfg = _get_smtp_config()
    return bool(cfg["server"] and cfg["user"] and cfg["password"])


def _should_send_immediate_email() -> bool:
    value = os.environ.get("SEND_IMMEDIATE_ENQUIRY_EMAIL", "").strip().lower()
    return value in IMMEDIATE_EMAIL_VALUES


def _send_email(subject: str, body: str) -> bool:
    """Send one email using SMTP."""
    cfg = _get_smtp_config()
    if not cfg["server"] or not cfg["user"] or not cfg["password"]:
        print("Email configuration missing, skipping email.")
        return False

    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = cfg["user"]
        msg["To"] = cfg["receiver"]
        msg.set_content(body)
        with smtplib.SMTP(cfg["server"], cfg["port"]) as server:
            server.starttls()
            server.login(cfg["user"], cfg["password"])
            server.send_message(msg)
        print(f"Email sent: {subject}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False


def _clean_text(value: Any, max_len: int = 160) -> str:
    if value is None:
        return ""
    text = re.sub(r"\s+", " ", str(value)).strip()
    return text[:max_len]


def _normalize_phone(value: Any) -> str:
    digits = re.sub(r"\D", "", str(value or ""))
    if len(digits) == 12 and digits.startswith("91"):
        digits = digits[2:]
    if len(digits) == 11 and digits.startswith("0"):
        digits = digits[1:]
    if len(digits) != 10 or digits[0] not in "6789":
        raise ValidationError("Enter a valid 10 digit Indian mobile number.")
    return f"+91{digits}"


def _validate_payload(data: dict[str, Any]) -> dict[str, str]:
    name = _clean_text(data.get("name"), 80)
    if len(name) < 2:
        raise ValidationError("Name is required.")

    phone = _normalize_phone(data.get("phone"))

    return {
        "product": _clean_text(data.get("product"), 180),
        "budget": _clean_text(data.get("budget"), 180),
        "name": name,
        "phone": phone,
        "area": _clean_text(data.get("area"), 120),
        "message": _clean_text(data.get("message"), 500),
        "offer_id": _clean_text(data.get("offerId") or data.get("offer_id"), 80),
        "source_path": _clean_text(data.get("sourcePath") or data.get("source_path"), 220),
        "preferred_contact_time": _clean_text(
            data.get("preferredContactTime") or data.get("preferred_contact_time"),
            80,
        ),
        "purchase_timeline": _clean_text(data.get("purchaseTimeline") or data.get("purchase_timeline"), 80),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


def _send_notification(enquiry_data: dict) -> bool:
    """Send immediate email notification for a new enquiry."""
    subject = f"New Enquiry: {enquiry_data.get('product') or 'Kitchen Appliance'}"
    body = f"""
New Enquiry Received from JJ Appliances Website:

  Product  : {enquiry_data.get('product', 'N/A')}
  Offer ID : {enquiry_data.get('offer_id', 'N/A')}
  Budget   : {enquiry_data.get('budget', 'N/A')}
  Name     : {enquiry_data.get('name', 'N/A')}
  Phone    : {enquiry_data.get('phone', 'N/A')}
  Area     : {enquiry_data.get('area', 'N/A')}
  Timeline : {enquiry_data.get('purchase_timeline', 'N/A')}
  Call Time: {enquiry_data.get('preferred_contact_time', 'N/A')}
  Message  : {enquiry_data.get('message', 'N/A')}
  Source   : {enquiry_data.get('source_path', 'N/A')}
  Date     : {enquiry_data.get('created_at', 'N/A')}
"""
    return _send_email(subject, body)


def _is_missing_optional_column_error(exc: Exception) -> bool:
    error_text = str(exc).lower()
    optional_columns = (
        "message",
        "offer_id",
        "source_path",
        "preferred_contact_time",
        "purchase_timeline",
    )
    return "column" in error_text and any(column in error_text for column in optional_columns)


def _execute_insert(supabase, payload: dict[str, str], columns: tuple[str, ...]):
    return supabase.table("enquiries").insert({column: payload[column] for column in columns}).execute()


def _insert_enquiry(supabase, payload: dict[str, str]) -> dict:
    insert_payload = {
        "product": payload["product"],
        "budget": payload["budget"],
        "name": payload["name"],
        "phone": payload["phone"],
        "area": payload["area"],
        "message": payload["message"],
        "offer_id": payload["offer_id"],
        "source_path": payload["source_path"],
        "preferred_contact_time": payload["preferred_contact_time"],
        "purchase_timeline": payload["purchase_timeline"],
    }

    full_columns = tuple(insert_payload.keys())
    current_schema_columns = (
        "product",
        "budget",
        "name",
        "phone",
        "area",
        "message",
        "offer_id",
        "source_path",
    )
    legacy_columns = ("product", "budget", "name", "phone", "area")

    try:
        result = _execute_insert(supabase, insert_payload, full_columns)
    except Exception as exc:
        if not _is_missing_optional_column_error(exc):
            raise

        try:
            result = _execute_insert(supabase, insert_payload, current_schema_columns)
        except Exception as legacy_exc:
            if not _is_missing_optional_column_error(legacy_exc):
                raise

            result = _execute_insert(supabase, insert_payload, legacy_columns)

    saved = result.data[0] if result.data else {}
    return {**payload, **saved}


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: dict):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode())

    def _read_json_body(self) -> dict:
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length > MAX_BODY_BYTES:
            raise ValidationError("Request is too large.")

        raw_body = self.rfile.read(content_length)
        if not raw_body:
            return {}

        try:
            parsed = json.loads(raw_body)
        except json.JSONDecodeError:
            raise ValidationError("Invalid request body.")

        if not isinstance(parsed, dict):
            raise ValidationError("Invalid request body.")

        return parsed

    def do_POST(self):
        try:
            data = self._read_json_body()

            if _clean_text(data.get("company"), 100):
                self._send_json(202, {"message": "Received"})
                return

            enquiry_payload = _validate_payload(data)
            enquiry_payload["source_path"] = enquiry_payload["source_path"] or self.headers.get("Referer", "")

            saved = {}
            supabase_error = ""
            supabase_misconfigured = False

            try:
                supabase = _get_supabase()
                saved = _insert_enquiry(supabase, enquiry_payload)
            except RuntimeError as e:
                supabase_misconfigured = True
                supabase_error = str(e)
                print(f"Configuration error creating enquiry: {e}")
            except Exception as e:
                supabase_error = str(e)
                print(f"Error saving enquiry: {e}")

            if saved:
                if _should_send_immediate_email() and not _send_notification(saved):
                    print("Immediate email notification failed or is not configured (enquiry still saved).")

                self._send_json(201, {
                    "id": str(saved.get("id", "")),
                    "product": saved.get("product", ""),
                    "budget": saved.get("budget", ""),
                    "name": saved.get("name", ""),
                    "phone": saved.get("phone", ""),
                    "area": saved.get("area", ""),
                    "message": saved.get("message", ""),
                    "offerId": saved.get("offer_id", ""),
                    "preferredContactTime": saved.get("preferred_contact_time", ""),
                    "purchaseTimeline": saved.get("purchase_timeline", ""),
                    "date": saved.get("created_at", ""),
                    "messageText": "Request saved. The showroom receives new leads every 4 hours and will contact you within 24 hours.",
                })
                return

            if _send_notification(enquiry_payload):
                self._send_json(202, {
                    "product": enquiry_payload.get("product", ""),
                    "budget": enquiry_payload.get("budget", ""),
                    "name": enquiry_payload.get("name", ""),
                    "phone": enquiry_payload.get("phone", ""),
                    "area": enquiry_payload.get("area", ""),
                    "message": enquiry_payload.get("message", ""),
                    "offerId": enquiry_payload.get("offer_id", ""),
                    "preferredContactTime": enquiry_payload.get("preferred_contact_time", ""),
                    "purchaseTimeline": enquiry_payload.get("purchase_timeline", ""),
                    "date": enquiry_payload.get("created_at", ""),
                    "storage": "email_only",
                    "messageText": "Request emailed to the store. The database is temporarily unavailable.",
                })
                return

            if supabase_misconfigured:
                self._send_json(503, {
                    "error": "Enquiry service is not configured. Please call or WhatsApp the store."
                })
                return

            print(f"Could not save or notify enquiry: {supabase_error}")
            self._send_json(500, {"error": "Internal server error"})

        except ValidationError as e:
            self._send_json(422, {"error": str(e)})
        except Exception as e:
            print(f"Error creating enquiry: {e}")
            self._send_json(500, {"error": "Internal server error"})

    def do_OPTIONS(self):
        """Handle CORS preflight."""
        self._send_json(200, {})

    def do_GET(self):
        self._send_json(200, {
            "ok": True,
            "service": "enquiries",
            "supabaseConfigured": _has_supabase_config(),
            "smtpConfigured": _is_smtp_configured(),
            "immediateEmailEnabled": _should_send_immediate_email(),
        })
