# Editing Website Offers

The live offers section is powered by the hidden `/admin` page and the Supabase `offers` table.

## How to edit

1. Open `/admin` on the deployed site.
2. Enter the admin password.
3. Select an existing offer or click `New`.
4. Edit the fields.
5. Click `Save Offer`.
6. Use `Active` to show or hide an offer without deleting it.

## Important fields

- `active`: checked offers show on the public website.
- `priority`: smaller numbers show first.
- `id`: short unique name, such as `summer-chimney-sale`.
- `endDate`: use this format: `2026-07-15T23:59:59+05:30`.
- `image`: choose one of the preset backgrounds or paste a full image URL.
- `highlight`: use for the most important offer.
- `terms`: short customer-friendly condition text.

## CSV fallback

`public/offers.csv` is still kept as a fallback if the offers API is unavailable, but normal editing should happen through `/admin`.

## Social links

Instagram, Facebook, and Twitter/X profile links live in `src/constants.tsx` under `SOCIAL_LINKS`.
Leave any link blank until the real profile URL is available. Blank links are hidden, so the footer will not point users to the home page by mistake.
