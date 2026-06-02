-- ============================================================
-- JJ Appliances — Supabase Database Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. Create the enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id          BIGSERIAL PRIMARY KEY,
  product     TEXT,
  budget      TEXT,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  area        TEXT,
  message     TEXT,
  offer_id    TEXT,
  source_path TEXT,
  preferred_contact_time TEXT,
  purchase_timeline TEXT,
  digest_sent BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS offer_id TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS source_path TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS preferred_contact_time TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS purchase_timeline TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS digest_sent BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS enquiries_digest_pending_idx
  ON enquiries (digest_sent, created_at)
  WHERE digest_sent = FALSE;

-- 2. Enable Row Level Security
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- 3. Allow service_role full access (Python backend uses this)
-- (service_role bypasses RLS by default, no policy needed)

-- 4. Block anonymous direct access (frontend goes through Python API)
CREATE POLICY "Block anonymous access"
  ON enquiries
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);
