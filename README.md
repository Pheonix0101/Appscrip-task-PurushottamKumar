# AppScrip Product Listing Page

This npm monorepo has a React/Next.js frontend and a Node.js/Express backend. The backend reads catalog data through Supabase's Data API with a server-only secret key. The frontend renders the initial product list on the server and keeps search, filters, sorting, and pagination in the URL. The UI follows the supplied [HTML design export](./apps/frontend/figmadesignCode/Product%20Listing.html).

## Workspace

| Path | Purpose |
| --- | --- |
| `apps/frontend` | Next.js App Router frontend with TypeScript |
| `apps/backend` | Express REST API with TypeScript |
| `apps/backend/src/routes.ts` | Central HTTP endpoint registration |
| `apps/backend/src/catalog/handlers.ts` and `src/newsletter/handler.ts` | Request handlers that call feature services |
| `apps/backend/supabase/schema.sql` | Catalog tables, indexes, and access setup for Supabase |
| `apps/backend/supabase/migrations/20261008_add_client_subscriptions.sql` | Newsletter `Client` table and access rules |
| `apps/backend/src/db/seed.ts` | Repeatable 30-product demo catalog |
| `apps/frontend/public/products` | Product images from the supplied design export and generated demo photos |

## Setup

Use Node.js 22.12 or later, npm, and a Supabase project. No local database service or database connection URI is needed.

1. Run `npm install`.
2. In the Supabase Dashboard, open **SQL Editor** and run [`apps/backend/supabase/schema.sql`](./apps/backend/supabase/schema.sql), then [`apps/backend/supabase/migrations/20261008_add_client_subscriptions.sql`](./apps/backend/supabase/migrations/20261008_add_client_subscriptions.sql). The first creates the catalog; the second creates the newsletter table named `Client`. Both files are safe to rerun.
3. Create `apps/backend/.env` from `apps/backend/.env.example` if it does not exist. Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY`. `WEB_ORIGIN` defaults to `http://localhost:3000`; `PORT` defaults to `4000`.
4. Create `apps/frontend/.env.local` from `apps/frontend/.env.local.example` if needed. For local development, set `API_BASE_URL=http://localhost:4000` and `SITE_URL=http://localhost:3000`.
5. Run `npm run db:check`, then `npm run db:seed`.
6. Start separate terminals with `npm run dev:backend` and `npm run dev:frontend`.

Visit `http://localhost:3000`. The API runs at `http://localhost:4000`. Catalog routes need the SQL setup and seed; `GET /health` checks process liveness only. The seed upserts five categories and 30 products and refreshes their images. Twenty-two products use generated demo photography. These are sample listings, not real inventory. For future schema changes, add a migration file and apply it in Supabase before using new fields in code.

The backend development command runs without a file watcher; restart it after changing backend code.

The footer matches the supplied reference layout. Newsletter signup saves an email in Supabase and shows an inline success or error notification. The `Client` migration has been applied to the configured project; run it for any new project. View subscribers and their `subscribed_at` timestamps in **Supabase → Table Editor → Client**. The form records signups; sending newsletter emails is not implemented. Other destinations without implemented pages remain visual placeholders; contact phone and email are actionable links.

Run `npm run typecheck`, `npm test`, and `npm run build` to check the code.

## API

| Endpoint | Description |
| --- | --- |
| `GET /products` | Paginated products with category, price, facet, search, and sort filters |
| `GET /products/:id` | Product detail with ordered images |
| `GET /categories` | Categories for filters |
| `GET /facets` | Filter groups and allowed values |
| `GET /health` | Process health |
| `POST /subscriptions` | Save a newsletter email in the private `Client` table |

`POST /subscriptions` accepts JSON such as `{ "email": "person@example.com" }`. The backend trims and lowercases the address, validates it, and saves one row per email. First and repeat signups receive the same `200` confirmation; repeat signups retain the original `subscribed_at` value. Invalid input returns HTTP 400 with `INVALID_EMAIL`. The browser submits to the same-origin Next.js route `POST /api/subscribe`, which forwards the request to this backend endpoint. There is no public subscriber-list endpoint.

`GET /products` accepts `page` (default 1), `limit` (default 9, maximum 48), `category` (slug), `minPrice`, `maxPrice`, `q` (up to 100 characters), `customizable=true`, and `sort`. Sort values are `recommended`, `newest`, `popular`, `price_desc`, and `price_asc`. Facet keys are `idealFor`, `occasion`, `work`, `fabric`, `segment`, `suitableFor`, `rawMaterials`, and `pattern`. Repeat a key for multiple options, such as `?idealFor=Men&idealFor=Women`. Options within one facet are OR; different facets are AND.

Example: `GET /products?category=bags&minPrice=50&sort=price_asc&page=1`

Lists return `{ "data": [...], "pagination": { "page": 1, "limit": 9, "total": 30, "totalPages": 4 } }` for the current demo catalog. Single resources return `{ "data": ... }`. Invalid input returns HTTP 400 with `{ "error": { "code": "INVALID_QUERY", "message": "..." } }`; missing resources return 404. Image paths such as `/products/black-woven-roll-top-backpack-front.png` are served from the frontend's `public` directory.

The listing shows numbered page links based on the API's exact `total` count. A stale URL beyond the final page redirects to the last available page. Product IDs can have gaps after repeated seed upserts; use the table row count or API `pagination.total` to count products, not the largest ID.

## Environment and security

The backend uses `SUPABASE_URL` and `SUPABASE_SECRET_KEY`. The publishable key and JWKS URL are unused for this app. Keep the secret key only in `apps/backend/.env` or a deployment secret manager, never in a `NEXT_PUBLIC_` variable. The browser uses Next.js; the Next.js server calls Express; Express calls Supabase. RLS is enabled on catalog and newsletter tables. The `Client` table has no public read or write policy, and the newsletter API exposes only a write action.

The frontend uses `API_BASE_URL` on the Next.js server for SSR. `SITE_URL` sets canonical and Open Graph URLs. Local `.env` files are ignored by Git. Rotate any secret key shared outside a trusted secret manager and update `apps/backend/.env`.

## Dependency choices

| Package | Reason |
| --- | --- |
| Next.js, React, React DOM | App Router and server rendering |
| Express | HTTP layer for the Node.js API |
| `@supabase/supabase-js` | Server-side Supabase Data API queries |
| `cors` | Browser origin policy for separate frontend and API origins |
| `dotenv` | Local backend configuration |
| TypeScript, `tsx`, type packages | Type checks and development runtime |

No UI kit or client state library is included. Add a package only when a concrete feature needs it.
