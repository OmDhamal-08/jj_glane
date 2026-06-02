# Editing Website Offers

The live offers section is powered by `public/offers.csv`.

## How to edit

1. Open `public/offers.csv` in Excel, Google Sheets, or LibreOffice.
2. Edit only the rows under the header row.
3. Keep the header names exactly as they are.
4. Save/export the file as CSV.
5. Run the site and check the offers section.

## Important fields

- `active`: use `yes` to show an offer, `no` to hide it.
- `priority`: smaller numbers show first.
- `id`: short unique name, such as `summer-chimney-sale`.
- `endDate`: use this format: `2026-07-15T23:59:59+05:30`.
- `image`: paste a full image URL.
- `highlight`: use `yes` for the most important offer, `no` for normal offers.
- `terms`: short customer-friendly condition text.

## Social links

Instagram, Facebook, and Twitter/X profile links live in `src/constants.tsx` under `SOCIAL_LINKS`.
Leave any link blank until the real profile URL is available. Blank links are hidden, so the footer will not point users to the home page by mistake.
