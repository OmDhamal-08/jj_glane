# JJ Kitchen Appliances Website

React + TypeScript frontend with Vercel Python API endpoints for enquiries.

## Run Locally

```bash
npm install
python -m pip install -r requirements.txt
npm run dev
```

`npm run dev` starts the Vite frontend only. To test the Python enquiry API locally, run the site with Vercel Dev, or set `VITE_ENQUIRY_API_BASE_URL` in a local env file to the deployed `/api` URL, for example:

```bash
VITE_ENQUIRY_API_BASE_URL=https://your-site.vercel.app/api
```

Build check:

```bash
npm run build
```

Python syntax check:

```bash
python -m py_compile api/enquiries.py
```

## Editable Offers

Live offers are loaded from the Supabase `offers` table through `/api/offers`.

Admins can manage offers from the hidden `/admin` page. This page is not linked from the public website and requires `ADMIN_PASSWORD`.

`public/offers.csv` is still kept as a fallback if the offers API is unavailable.

See `docs/offers-guide.md` for the field-by-field instructions.

## Social Links

Instagram, Facebook, and Twitter/X links are configured in `src/constants.tsx` under `SOCIAL_LINKS`.

Leave a link blank until the real profile URL is available. Blank social links are hidden so the footer never points users to a placeholder home page.

## Enquiries Backend

The frontend posts enquiries to `/api/enquiries`.

Required environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` with the Supabase service-role key
- `ADMIN_PASSWORD` with a long private password for `/admin`

`SUPABASE_KEY` is still accepted as a legacy fallback, but the service-role key is required because the backend writes to a table protected by RLS.

Email notifications and cron digests are disabled for the current deployment. Do not add SMTP variables in Vercel for now.

Enquiries are stored in Supabase. The showroom team can review them from the Supabase `enquiries` table or from a dashboard you connect later.

You can open `/api/enquiries` in the browser to verify the backend is deployed. It returns a JSON health response showing whether Supabase is configured.

You can open `/admin` directly to edit offers. Do not add a public link to this page.

Run `database/supabase-schema.sql` in Supabase after deleting old app tables/data and creating a fresh setup.
