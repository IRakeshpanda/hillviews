# Hill Views booking integration (Phase 1)

This project is a Vite + React app deployed on Vercel. In Phase 1, the focus is on server-side Smoobu availability gating only. No booking creation or reservation mutations are implemented in this phase.

## Local setup

1. Install dependencies:
   npm install
2. Copy the required environment variables into a local server-side file such as `.env.local`.
3. Keep these variables on the server only. They must never be read in React code.

## Required environment variables

Add the following to the server environment only:

- `SMOOBU_CUSTOMER_ID`
- `SMOOBU_API_KEY`
- `SMOOBU_API_SECRET`
- `SMOOBU_CHALET_LE_JOJAU_APARTMENT_ID`
- `SMOOBU_HILL_VIEW_APARTMENT_ID`

Canonical property slugs for Phase 1:

- `chalet-le-joyau` (preferred / canonical)
- `hill-view`

The legacy spelling `chalet-le-jojau` is still accepted as an alias on the server for compatibility, but the canonical frontend and server mapping uses `chalet-le-joyau`.

Security note:
- Do not expose these values to browser code.
- Do not commit `.env`, `.env.local`, `.env.development`, or `.env.production`.
- Keep them in Vercel environment variables only.

## Run locally

Use the Vercel dev server so the server-side API routes are active on port 3000:

```bash
npx vercel dev --listen 3000
```

Then open:

- http://localhost:3000

## Test the availability API safely

The publicly exposed availability endpoint is:

```bash
curl -X POST http://localhost:3000/api/availability \
  -H "Content-Type: application/json" \
  -d '{"propertySlug":"hill-view","checkIn":"2026-12-10","checkOut":"2026-12-12"}'
```

Example response:

```json
{
  "propertySlug": "hill-view",
  "isAvailable": true,
  "blockedRanges": [],
  "message": "Available for the selected dates."
}
```

## Do not use the booking endpoint in Phase 1

This phase intentionally does not implement `POST /api/book`. Do not create, modify, cancel, or delete any real Smoobu reservation during testing.

If a booking endpoint is added in a later phase, it must be tested only in a safe staging or mock environment and must re-check availability before any reservation creation.

## Add the same variables in Vercel

1. Open the Vercel project.
2. Go to Project > Settings > Environment Variables.
3. Add the same five values as Production/Preview/Development variables.
4. Redeploy the app after saving them.

## Notes

- The frontend sends only `propertySlug`, `checkIn`, and `checkOut` to the availability API.
- The server side resolves the correct Smoobu apartment ID for each property slug.
- Overlapping dates are rejected or blocked before the user can proceed.
- All Smoobu credentials remain server-side only.
- This Phase 1 build intentionally does not expose Smoobu apartment IDs, API keys, API secrets, customer IDs, signed headers, or reservation data to browser code.
