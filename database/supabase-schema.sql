-- JJ Appliances - Supabase schema
-- Safe to run if the app tables already exist.

CREATE TABLE IF NOT EXISTS enquiries (
  id BIGSERIAL PRIMARY KEY,
  product TEXT,
  budget TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  area TEXT,
  message TEXT,
  offer_id TEXT,
  source_path TEXT,
  preferred_contact_time TEXT,
  purchase_timeline TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 999,
  title TEXT NOT NULL,
  subtitle TEXT,
  product TEXT NOT NULL,
  enquiry_product TEXT,
  discount TEXT,
  original_price TEXT,
  sale_price TEXT,
  event_name TEXT,
  badge TEXT,
  end_date TEXT NOT NULL,
  image TEXT,
  highlight BOOLEAN DEFAULT FALSE,
  terms TEXT,
  cta_text TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS product TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS budget TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS area TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS offer_id TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS source_path TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS preferred_contact_time TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS purchase_timeline TEXT;

ALTER TABLE offers ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 999;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS product TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS enquiry_product TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS discount TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS original_price TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS sale_price TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS event_name TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS end_date TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS highlight BOOLEAN DEFAULT FALSE;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS terms TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS cta_text TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE offers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

INSERT INTO offers (
  id, active, priority, title, subtitle, product, enquiry_product,
  discount, original_price, sale_price, event_name, badge, end_date,
  image, highlight, terms, cta_text
) VALUES
('monsoon-chimney-upgrade', TRUE, 1, 'Monsoon Chimney Upgrade', 'Auto-clean chimney with live demo', 'Glen 6060 BL AC 60cm', 'Glen 6060 BL AC 60cm', '32%', 'Rs. 28,990', 'Rs. 19,713', 'Monsoon Sale', 'BESTSELLER', '2026-07-15T23:59:59+05:30', '/showroom-kitchen-studio.jpg', TRUE, 'Includes showroom demo and installation guidance. Final price depends on current stock.', 'Reserve Offer'),
('chimney-hob-combo', TRUE, 2, 'Chimney + Hob Combo', 'Complete kitchen upgrade set', 'Glen 6060 + Glen 1074', 'Glen chimney and hob combo', '38%', 'Rs. 47,490', 'Rs. 29,444', 'Combo Deal', 'SAVE BIG', '2026-06-30T23:59:59+05:30', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=82&w=1200', TRUE, 'Best for new modular kitchens. Ask the store team for fitting requirements.', 'Check Combo'),
('glass-hob-install-pack', TRUE, 3, 'Glass Hob Installation Pack', '4-burner glass hob with support', 'Glen 1074 SQ BL Hob', 'Glen 1074 SQ BL Hob', '24%', 'Rs. 18,500', 'Rs. 14,060', 'Hob Week', 'HOT DEAL', '2026-06-20T23:59:59+05:30', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=82&w=1200', FALSE, 'Site visit may be needed before final installation confirmation.', 'Ask Price'),
('built-in-oven-week', TRUE, 4, 'Built-in Oven Week', 'Convection oven for modern kitchens', 'Glen 658 Black Oven', 'Glen built-in oven', '20%', 'Rs. 32,000', 'Rs. 25,600', 'Oven Week', 'LIMITED', '2026-07-31T23:59:59+05:30', 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=82&w=1200', FALSE, 'Offer applies on selected oven models while stock lasts.', 'Enquire Now')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'enquiries' AND policyname = 'Block anonymous access') THEN
    EXECUTE 'CREATE POLICY "Block anonymous access" ON enquiries FOR ALL TO anon USING (false) WITH CHECK (false)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'offers' AND policyname = 'Block anonymous offers access') THEN
    EXECUTE 'CREATE POLICY "Block anonymous offers access" ON offers FOR ALL TO anon USING (false) WITH CHECK (false)';
  END IF;
END $$;
