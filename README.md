# mettā muse product catalog

A product listing and detail site backed by an Express API and Supabase. The frontend and backend share one npm workspace.

## Live URLs

| Service | URL |
| --- | --- |
| Frontend on Netlify | https://dashing-cascaron-efc780.netlify.app/ |
| Backend API on Render | https://appscrip-server.onrender.com |
| API health check | https://appscrip-server.onrender.com/health |

## Tech stack and choices

| Layer | Technology | Why it fits |
| --- | --- | --- |
| Frontend | Next.js App Router, React, TypeScript | Server rendering makes product content and metadata available in the first HTML response. React handles filters, the form, and the wishlist button. |
| Backend | Node.js, Express, TypeScript | A small REST API keeps validation, catalog queries, and newsletter writes outside the browser. |
| Database | Supabase Postgres | Relational tables hold products, categories, images, and newsletter subscribers. Postgres supports filtering and search. |
| Hosting | Netlify and Render | Netlify runs the Next.js site and its server routes; Render runs the Express service. |
| Repository | npm workspaces | One lockfile and root scripts manage both applications. |

## Run locally

You need Node.js **22.12 or newer**, npm, and a Supabase project. The database runs in Supabase; no local Postgres service is required.

1. Install dependencies from the repository root:

   ```bash
   npm ci
   ```

2. In Supabase **SQL Editor**, run [the catalog schema](apps/backend/supabase/schema.sql), then [the subscriber migration](apps/backend/supabase/migrations/20261008_add_client_subscriptions.sql).

3. Copy the backend environment example, then set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` to your project's values:

   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```

   `PORT` defaults to `4000`. `WEB_ORIGIN` allows `http://localhost:3000` in development; additional origins can be comma separated. Keep `SUPABASE_SECRET_KEY` on the backend, never in a `NEXT_PUBLIC_` variable.

4. Copy the frontend environment example:

   ```bash
   cp apps/frontend/.env.local.example apps/frontend/.env.local
   ```

   Use `API_BASE_URL=http://localhost:4000` and `SITE_URL=http://localhost:3000`. The first tells the Next.js server where to call Express; the second supplies the origin for SEO URLs. [Site configuration](apps/frontend/src/lib/site-config.ts) also provides development and production defaults.

5. Check the schema and add the demo catalog:

   ```bash
   npm run db:check
   npm run db:seed
   ```

   The seed upserts **5 categories and 30 demo products** and refreshes their image rows. It writes to the Supabase project configured in `apps/backend/.env`.

6. Start the services in separate terminals:

   ```bash
   npm run dev:backend
   ```

   ```bash
   npm run dev:frontend
   ```

Open `http://localhost:3000`; the API runs at `http://localhost:4000`. Restart the backend command after backend edits because its development script does not watch files. Run `npm run typecheck`, `npm test`, and `npm run build` to check the code. After building, `npm run start -w @appscrip/frontend` runs the frontend production build locally.

## Architecture and folders

```text
.
├── apps/
│   ├── backend/
│   │   ├── src/app.ts, routes.ts, server.ts   Express setup, routes, startup
│   │   ├── src/catalog/                   Query validation, handlers, data access
│   │   ├── src/newsletter/                Signup validation, handler, storage
│   │   ├── src/db/                        Supabase client, schema check, demo seed
│   │   └── supabase/                      SQL schema and migration
│   └── frontend/
│       ├── src/app/                      Next.js pages, layouts, loading, API route
│       ├── src/components/               Catalog controls, cards, header, footer
│       ├── src/lib/                      API client, site URLs, JSON-LD builders
│       ├── public/products/              Product images
│       └── netlify.toml                  Build and Next.js adapter
└── package.json                         Workspace scripts
```

The browser requests pages from Next.js. While rendering, Next.js fetches catalog data from Express. Express validates requests and queries Supabase with a server-only secret. Search, filters, sort, and pagination live in the page URL. The browser sends newsletter forms to Next.js `POST /api/subscribe`, which forwards them to Express `POST /subscriptions`. Wishlist IDs are stored in browser `localStorage`; there is no wishlist API.

## API endpoints

The API base URL is `https://appscrip-server.onrender.com`.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Process health; does not check database access. |
| `GET` | `/products` | Paginated products with search, sort, and filters. |
| `GET` | `/products/:id` | One product with ordered images. |
| `GET` | `/categories` | Category names and slugs. |
| `GET` | `/facets` | Available filter groups and values. |
| `POST` | `/subscriptions` | Validate and save a newsletter email. |

`GET /products` accepts `page` (default `1`), `limit` (default `9`, maximum `48`), `category` (slug), `minPrice`, `maxPrice`, `q` (search text), `customizable=true`, and `sort` (`recommended`, `newest`, `popular`, `price_desc`, or `price_asc`). Facet keys are `idealFor`, `occasion`, `work`, `fabric`, `segment`, `suitableFor`, `rawMaterials`, and `pattern`. Repeat a facet key to select multiple values.

```http
GET /products?category=bags&minPrice=50&sort=price_asc&page=1
POST /subscriptions
Content-Type: application/json

{"email":"person@example.com"}
```

List responses contain `data` and `pagination`; detail responses contain `data`. Expected errors include an HTTP status and `{ "error": { "code": "...", "message": "..." } }`. Repeat newsletter signups return success without adding another row. There is no public subscriber list endpoint.

## Server rendering and SEO decisions

The listing and product pages use Next.js server rendering on each request (`force-dynamic`) and uncached catalog fetches. Product content is present in the initial HTML. Loading skeletons cover navigation while a response is pending; client components handle interactive controls.

The site sets page-specific titles and descriptions, canonical URLs, Open Graph metadata, and one main heading per page. JSON-LD describes the website and organization; listing pages include `CollectionPage`, `ItemList`, and `Product`; product pages include `WebPage`, `Product`, `Offer`, and `BreadcrumbList`. Product images have descriptive file names and alt text. `next/image` serves responsive images, prioritizes the first visible images, and lazy loads others. `SITE_URL` supplies the public origin for canonical URLs and JSON-LD.

## Dependencies used and why 

| Dependency | Purpose |
| --- | --- |
| `next`, `react`, `react-dom` | App Router, rendering, and interactive UI. |
| `express` | REST routing and HTTP middleware. |
| `@supabase/supabase-js` | Backend access to Supabase's Data API. |
| `cors` | Browser origin policy for the separate frontend and API hosts. |
| `dotenv` | Local backend environment configuration. |
| `@netlify/plugin-nextjs` | Netlify runtime for server-rendered pages and Next.js routes. |
| `typescript`, `tsx`, `@types/*` | Type checking, running backend TypeScript in development, and type definitions. |

## AI usage

OpenAI Codex helped implement and review parts of the API and frontend, SEO metadata, deployment configuration, and documentation. Its suggestions were checked against code and actual deployment behavior. Also used claude for varifying the SEO metaData.

One AI suggestion needed correction during Netlify deployment as well as developemnt: earlier guidance treated the `.next` build output as sufficient for publishing. The site returned a 404 because a server-rendered Next.js app also needs Netlify's Next.js runtime. The project added `@netlify/plugin-nextjs` in [Netlify configuration](apps/frontend/netlify.toml); the site then served the pages.

## Known limitations and next improvements

- The catalog contains demo products. A real store needs an admin workflow, image management, and inventory updates.
- The wishlist stores IDs only in one browser's `localStorage`. There is no wishlist page, account, or cross-device sync; storage failures are not shown to the user.
- Newsletter signup saves addresses but does not send emails or offer subscriber management in the app.
- Catalog requests time out after eight seconds. A sleeping Render instance or slow database can make the first page request fail; a retry path and more reliable hosting would help.
- Product and catalog failures currently show generic messages. Better logging, request tracing, and end-to-end error tests would improve diagnosis.

