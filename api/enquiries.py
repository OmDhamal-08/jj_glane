import json
import os
import re
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler
from typing import Any


MAX_BODY_BYTES = 10_000


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
                    "messageText": "Request saved. The showroom team will review new leads and contact you within 24 hours.",
                })
                return

            if supabase_misconfigured:
                self._send_json(503, {
                    "error": "Enquiry service is not configured. Please call or WhatsApp the store."
                })
                return

            print(f"Could not save enquiry: {supabase_error}")
            self._send_json(500, {"error": "Could not save the enquiry. Please call or WhatsApp the store."})

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
        })
