-- Run once in the Supabase Dashboard SQL Editor, then run `npm run db:seed`.
-- This is safe to rerun for this project's existing catalog tables.

begin;

create table if not exists public.categories (
  id serial primary key,
  name text not null,
  slug text not null unique
);

create table if not exists public.products (
  id serial primary key,
  title text not null,
  slug text not null unique,
  description text not null,
  price numeric(12, 2) not null,
  category_id integer not null references public.categories(id),
  popularity integer not null default 0,
  customizable boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id serial primary key,
  product_id integer not null references public.products(id) on delete cascade,
  url text not null,
  alt text not null,
  position integer not null default 0
);

alter table public.products add column if not exists ideal_for text[] not null default '{}'::text[];
alter table public.products add column if not exists occasion text[] not null default '{}'::text[];
alter table public.products add column if not exists work text[] not null default '{}'::text[];
alter table public.products add column if not exists fabric text[] not null default '{}'::text[];
alter table public.products add column if not exists segment text[] not null default '{}'::text[];
alter table public.products add column if not exists suitable_for text[] not null default '{}'::text[];
alter table public.products add column if not exists raw_materials text[] not null default '{}'::text[];
alter table public.products add column if not exists pattern text[] not null default '{}'::text[];
alter table public.products add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
  ) stored;

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_price_idx on public.products(price);
create index if not exists products_created_at_idx on public.products(created_at);
create index if not exists products_popularity_idx on public.products(popularity);
create index if not exists products_ideal_for_idx on public.products using gin(ideal_for);
create index if not exists products_occasion_idx on public.products using gin(occasion);
create index if not exists products_work_idx on public.products using gin(work);
create index if not exists products_fabric_idx on public.products using gin(fabric);
create index if not exists products_segment_idx on public.products using gin(segment);
create index if not exists products_suitable_for_idx on public.products using gin(suitable_for);
create index if not exists products_raw_materials_idx on public.products using gin(raw_materials);
create index if not exists products_pattern_idx on public.products using gin(pattern);
create index if not exists products_search_vector_idx on public.products using gin(search_vector);
create index if not exists product_images_product_position_idx on public.product_images(product_id, position);

-- The browser uses this app's REST API. Only the backend secret key accesses
-- these tables, so no public RLS policies are needed.
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;

grant usage on schema public to service_role;
grant select, insert, update, delete on public.categories, public.products, public.product_images to service_role;
grant usage, select on sequence public.categories_id_seq, public.products_id_seq, public.product_images_id_seq to service_role;

commit;

notify pgrst, 'reload schema';
