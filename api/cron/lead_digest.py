import json
import os
import smtplib
from datetime import datetime
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler
from zoneinfo import ZoneInfo


INDIA_TZ = ZoneInfo("Asia/Kolkata")


def _get_env(*names: str) -> str:
    for name in names:
        value = os.environ.get(name, "").strip()
        if value:
            return value
    return ""


def _get_supabase():
    """Returns a Supabase client using service-role key."""
    url = _get_env("SUPABASE_URL")
    key = _get_env("SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_KEY")
    if not url or not key:
        raise RuntimeError("Supabase configuration is missing")

    from supabase import create_client

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


def _send_json(handler: BaseHTTPRequestHandler, status: int, payload: dict):
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Cache-Control", "no-store")
    handler.end_headers()
    handler.wfile.write(json.dumps(payload).encode())


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Called by Vercel Cron every 4 hours to send unsent enquiries."""
        cron_secret = os.environ.get("CRON_SECRET", "")
        auth_header = self.headers.get("Authorization", "")
        if cron_secret and auth_header != f"Bearer {cron_secret}":
            _send_json(self, 401, {"error": "Unauthorized"})
            return

        try:
            supabase = _get_supabase()

            result = (
                supabase.table("enquiries")
                .select("*")
                .eq("digest_sent", False)
                .order("created_at", desc=False)
                .execute()
            )

            rows = result.data or []

            if not rows:
                _send_json(self, 200, {"message": "No new enquiries for the 4-hour digest"})
                return

            lines = []
            ids = []
            for i, row in enumerate(rows, 1):
                ids.append(row["id"])
                lines.append(
                    f"Lead #{i}\n"
                    f"  Name     : {row.get('name', 'N/A')}\n"
                    f"  Phone    : {row.get('phone', 'N/A')}\n"
                    f"  Area     : {row.get('area', 'N/A')}\n"
                    f"  Product  : {row.get('product', 'N/A')}\n"
                    f"  Budget   : {row.get('budget', 'N/A')}\n"
                    f"  Timeline : {row.get('purchase_timeline', 'N/A')}\n"
                    f"  Call Time: {row.get('preferred_contact_time', 'N/A')}\n"
                    f"  Offer ID : {row.get('offer_id', 'N/A')}\n"
                    f"  Message  : {row.get('message', 'N/A')}\n"
                    f"  Source   : {row.get('source_path', 'N/A')}\n"
                    f"  Date     : {row.get('created_at', 'N/A')}\n"
                )

            now_str = datetime.now(INDIA_TZ).strftime("%d %b %Y, %I:%M %p IST")
            body = (
                "JJ Appliances - 4-hour Lead Digest\n"
                f"Generated: {now_str}\n"
                f"{'=' * 50}\n\n"
                f"{len(rows)} new lead(s) are waiting for follow-up:\n\n"
                + "\n".join(lines)
                + f"\n{'=' * 50}\n"
                "Action: call or WhatsApp each lead, then view all records in your Supabase dashboard."
            )

            email_sent = _send_email(
                subject=f"[JJ Appliances] 4-hour lead digest - {len(rows)} new lead(s) ({now_str})",
                body=body,
            )

            if not email_sent:
                _send_json(self, 503, {
                    "error": "Lead digest email could not be sent. Enquiries were left pending.",
                    "count": len(rows),
                })
                return

            for enquiry_id in ids:
                (
                    supabase.table("enquiries")
                    .update({"digest_sent": True})
                    .eq("id", enquiry_id)
                    .execute()
                )

            _send_json(self, 200, {
                "message": f"4-hour lead digest sent with {len(rows)} enquiry/enquiries",
                "count": len(rows),
            })

        except Exception as e:
            print(f"4-hour digest error: {e}")
            _send_json(self, 500, {"error": str(e)})
