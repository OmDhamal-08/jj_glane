import hmac
import json
import os
import re
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler
from typing import Any
from urllib.parse import parse_qs, urlparse


MAX_BODY_BYTES = 20_000


class ValidationError(Exception):
    pass


def _get_env(*names: str) -> str:
    for name in names:
        value = os.environ.get(name, "").strip()
        if value:
            return value
    return ""


def _get_supabase():
    url = _get_env("SUPABASE_URL")
    key = _get_env("SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_KEY")
    if not url or not key:
        raise RuntimeError("Supabase configuration is missing")

    try:
        from supabase import create_client
    except ImportError as exc:
        raise RuntimeError("Supabase Python package is not installed") from exc

    return create_client(url, key)


def _clean_text(value: Any, max_len: int = 220) -> str:
    if value is None:
        return ""
    text = re.sub(r"\s+", " ", str(value)).strip()
    return text[:max_len]


def _to_bool(value: Any, fallback: bool = False) -> bool:
    if isinstance(value, bool):
        return value
    if value is None:
        return fallback
    return str(value).strip().lower() in {"1", "yes", "true", "active", "on"}


def _to_int(value: Any, fallback: int = 999) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return fallback


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug[:80] or f"offer-{int(datetime.now(timezone.utc).timestamp())}"


def _is_admin_request(headers) -> bool:
    configured_password = os.environ.get("ADMIN_PASSWORD", "").strip()
    if not configured_password:
        return False

    auth_header = headers.get("Authorization", "")
    provided = auth_header.removeprefix("Bearer ").strip()
    return hmac.compare_digest(provided, configured_password)


def _require_admin(headers):
    if not os.environ.get("ADMIN_PASSWORD", "").strip():
        raise PermissionError("Admin password is not configured.")
    if not _is_admin_request(headers):
        raise PermissionError("Invalid admin password.")


def _row_to_offer(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "active": bool(row.get("active")),
        "priority": row.get("priority") or 999,
        "id": row.get("id") or "",
        "title": row.get("title") or "",
        "subtitle": row.get("subtitle") or "",
        "product": row.get("product") or "",
        "enquiryProduct": row.get("enquiry_product") or row.get("product") or "",
        "discount": row.get("discount") or "",
        "originalPrice": row.get("original_price") or "",
        "salePrice": row.get("sale_price") or "",
        "eventName": row.get("event_name") or "Store Offer",
        "badge": row.get("badge") or "",
        "endDate": row.get("end_date") or "",
        "image": row.get("image") or "",
        "highlight": bool(row.get("highlight")),
        "terms": row.get("terms") or "",
        "ctaText": row.get("cta_text") or "Enquire Now",
    }


def _offer_to_row(data: dict[str, Any]) -> dict[str, Any]:
    title = _clean_text(data.get("title"), 140)
    product = _clean_text(data.get("product"), 180)
    end_date = _clean_text(data.get("endDate") or data.get("end_date"), 80)

    if not title:
        raise ValidationError("Offer title is required.")
    if not product:
        raise ValidationError("Product name is required.")
    if not end_date:
        raise ValidationError("End date is required.")

    raw_id = _clean_text(data.get("id"), 90)
    offer_id = _slugify(raw_id or title)

    return {
        "id": offer_id,
        "active": _to_bool(data.get("active"), True),
        "priority": _to_int(data.get("priority"), 999),
        "title": title,
        "subtitle": _clean_text(data.get("subtitle"), 180),
        "product": product,
        "enquiry_product": _clean_text(data.get("enquiryProduct") or data.get("enquiry_product"), 180) or product,
        "discount": _clean_text(data.get("discount"), 40),
        "original_price": _clean_text(data.get("originalPrice") or data.get("original_price"), 60),
        "sale_price": _clean_text(data.get("salePrice") or data.get("sale_price"), 60),
        "event_name": _clean_text(data.get("eventName") or data.get("event_name"), 80) or "Store Offer",
        "badge": _clean_text(data.get("badge"), 50),
        "end_date": end_date,
        "image": _clean_text(data.get("image"), 500),
        "highlight": _to_bool(data.get("highlight"), False),
        "terms": _clean_text(data.get("terms"), 320),
        "cta_text": _clean_text(data.get("ctaText") or data.get("cta_text"), 50) or "Enquire Now",
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }


def _sort_offers(offers: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return sorted(
        offers,
        key=lambda offer: (
            not offer.get("highlight", False),
            offer.get("priority") or 999,
            (offer.get("title") or "").lower(),
        ),
    )


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: dict):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
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

    def _query(self):
        return parse_qs(urlparse(self.path).query)

    def do_GET(self):
        try:
            admin_mode = self._query().get("admin", [""])[0] == "1"
            if admin_mode:
                _require_admin(self.headers)

            result = _get_supabase().table("offers").select("*").execute()
            offers = [_row_to_offer(row) for row in (result.data or [])]
            if not admin_mode:
                offers = [offer for offer in offers if offer["active"]]

            self._send_json(200, {"offers": _sort_offers(offers)})
        except PermissionError as exc:
            self._send_json(401, {"error": str(exc)})
        except Exception as exc:
            print(f"Offers GET error: {exc}")
            self._send_json(500, {"error": "Could not load offers."})

    def do_POST(self):
        try:
            _require_admin(self.headers)
            offer_row = _offer_to_row(self._read_json_body())
            result = _get_supabase().table("offers").upsert(offer_row).execute()
            saved = result.data[0] if result.data else offer_row
            self._send_json(200, {"offer": _row_to_offer(saved)})
        except PermissionError as exc:
            self._send_json(401, {"error": str(exc)})
        except ValidationError as exc:
            self._send_json(422, {"error": str(exc)})
        except Exception as exc:
            print(f"Offers POST error: {exc}")
            self._send_json(500, {"error": "Could not save offer."})

    def do_DELETE(self):
        try:
            _require_admin(self.headers)
            offer_id = _clean_text(self._query().get("id", [""])[0], 90)
            if not offer_id:
                raise ValidationError("Offer ID is required.")

            _get_supabase().table("offers").delete().eq("id", _slugify(offer_id)).execute()
            self._send_json(200, {"message": "Offer deleted."})
        except PermissionError as exc:
            self._send_json(401, {"error": str(exc)})
        except ValidationError as exc:
            self._send_json(422, {"error": str(exc)})
        except Exception as exc:
            print(f"Offers DELETE error: {exc}")
            self._send_json(500, {"error": "Could not delete offer."})

    def do_OPTIONS(self):
        self._send_json(200, {})
