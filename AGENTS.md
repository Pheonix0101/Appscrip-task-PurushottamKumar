# AppScrip PLP project guide

## Goal and current state

Build the supplied product listing design as a responsive, server-rendered storefront with a Node.js API, a Supabase catalog, and a publicly shareable deployment. The supplied `apps/frontend/figmadesignCode/Product Listing.html` is the visual reference. Its images are in `apps/frontend/public/products`.

The Next.js listing and product detail pages, URL-driven filters/search/sort/pagination, Express API, Supabase access code, SQL schema, and 30-product seed are implemented. The configured Supabase project has the three catalog tables and is seeded with five categories and 30 products. Live API queries and a production server-rendered listing have been verified. The newsletter form, API endpoint, and `Client` table are implemented and live signup has been verified. Browser review and deployment remain.

## How it works

```text
Browser URL and controls
  → Next.js App Router (apps/frontend)
  → server-side fetch to Express REST API (apps/backend)
  → Supabase Data API (server-only secret key)
  → catalog tables
```

A URL like `/?category=bags&minPrice=50&sort=price_asc&page=2` is read by a Next.js Server Component. The server fetches products from Express and renders them into the initial HTML. Client controls update URL parameters with the Next.js router, requesting fresh server-rendered data without a full document reload. Product detail pages use the same API. Supabase credentials stay out of frontend code and responses.

## Repository map

| Location | Responsibility |
| --- | --- |
| `apps/frontend/src/app` | Listing and detail routes, metadata, loading/error UI |
| `apps/frontend/src/components` | Header, footer, filters, cards, wishlist control |
| `apps/frontend/src/lib` | Typed server-side API client and URL helpers |
| `apps/backend/src/app.ts` | Express app, CORS, error responses |
| `apps/backend/src/server.ts` | Process startup and port validation |
| `apps/backend/src/catalog/query.ts` | URL input validation and allowed sort/filter values |
| `apps/backend/src/catalog/routes.ts` | Product, category, and facet routes |
| `apps/backend/src/catalog/service.ts` | Supabase queries, pagination, sorting, response mapping |
| `apps/backend/src/db/client.ts` | Server-only Supabase client configuration |
| `apps/backend/supabase/schema.sql` | Tables, indexes, search vector, RLS, grants |
| `apps/backend/supabase/migrations/20261008_add_client_subscriptions.sql` | Private newsletter `Client` table |
| `apps/backend/src/db/seed.ts` | Repeatable demo catalog seed |
| `apps/backend/src/newsletter` | Signup validation and write-only subscription endpoint |
| `apps/frontend/src/app/api/subscribe/route.ts` | Same-origin proxy for the footer form |
| `apps/frontend/figmadesignCode` | Bundled HTML design reference |

## Build and verification plan

### Design and frontend

The static HTML was converted to React components and responsive CSS. The PLP includes navigation, product grid, filter controls, sorting, pagination, and loading/empty/error states. Detail pages are also present. The footer now follows the later user-provided reference image, with newsletter, contact, currency, links, social marks, and payment badges. Newsletter signup posts through the Next.js server to Express, stores one normalized email per subscriber in `Client`, and shows an accessible notification. Other unimplemented destinations are presented as text instead of dead links. Check desktop, tablet, and mobile viewports against the supplied design, especially filter behavior and horizontal overflow. The original Figma file was inaccessible during initial implementation; compare it directly if access becomes available.

### Supabase catalog

The configured Supabase project has had `apps/backend/supabase/schema.sql` applied. It creates categories, products, ordered images, text-array facets, a full-text search column, and indexes. RLS is enabled; the backend secret key accesses the tables. Catalog checks and `npm run db:seed` have succeeded. The seed upserts five categories and 30 products and refreshes demo images. Eighteen added products have generated product photos; four original demo products intentionally have placeholders. All seed products are sample inventory. No direct database driver or local database container is used. For a new project, run the SQL in its Supabase SQL Editor before seeding. Keep future schema changes in migration files and apply them in Supabase before querying new fields.

The newsletter migration adds `public."Client"` with a unique email and subscription timestamp. It has been applied to the configured Supabase project. The table has RLS enabled and no public policies or grants. The server-side secret key is used only by Express. `POST /subscriptions` accepts valid email JSON, normalizes case and whitespace, and treats repeated signups as success without adding duplicate rows. No subscriber-list endpoint is public. A temporary signup was verified through the frontend proxy, then removed; repeat signup kept one row and the original timestamp.

### REST API

`GET /products` accepts pagination, category, price range, sort, search, customization, and facets. `GET /products/:id` returns a product with images or 404. `GET /categories` and `GET /facets` support filter UI. `GET /health` checks process liveness. Inputs are validated, pagination is capped, sorting uses an allowlist, CORS uses `WEB_ORIGIN`, and errors have a consistent JSON shape. Numbered page links use the API's exact total; stale out-of-range listing URLs redirect to the last available page. Product IDs are identifiers and may have gaps after repeated seed upserts. See `README.md` for the full request contract.

`POST /subscriptions` writes to the private `Client` table. The frontend form uses `POST /api/subscribe` so browsers do not need the backend URL. Invalid email input receives a 400 response; storage failures are surfaced as a friendly error without reporting a successful subscription.

### SEO, quality, and release

Listing and detail metadata, canonical URLs, Open Graph tags, ItemList/Product/BreadcrumbList JSON-LD, descriptive image names and alt text, and Next.js image optimization are implemented. Verify rendered source contains products. Run `npm run typecheck`, `npm test`, and `npm run build`. After Supabase setup, test filters, missing products, and server-rendered HTML. Review keyboard access, responsive layout, and Lighthouse before release.

Deploy frontend and backend as separate Node services. Set `API_BASE_URL` and `SITE_URL` on the frontend and `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `WEB_ORIGIN` on the backend. Apply SQL and seed in the target Supabase project. Verify the public PLP, product pages, health endpoint, and shareable URLs. Choose hosting and public domains when the target platform is known.

## Working rules

- Use npm workspaces and TypeScript. Keep frontend and backend independent except for the HTTP response contract.
- Keep the backend in Node.js/Express. Do not introduce NestJS.
- Use Supabase through the backend client. Keep secret keys out of source control and frontend code; commit only example env files.
- Add dependencies only for a concrete need and explain them in `README.md`.
- Separate HTTP parsing, catalog queries, and persistence code. Use clear names.
- Preserve the supplied HTML export as the design reference. Update this guide when architecture or project status changes.
