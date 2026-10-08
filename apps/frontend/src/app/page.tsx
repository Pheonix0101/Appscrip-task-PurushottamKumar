import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ListingControls } from "@/components/listing-controls";
import { ProductCard } from "@/components/product-card";
import { CatalogApiError, getCategories, getFacets, getListing, queryFromSearchParams } from "@/lib/catalog";
import { listingStructuredData, siteOrigin } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };
function canonicalUrl(query: URLSearchParams) {
  const params = new URLSearchParams();
  const keys = [...new Set(query.keys())].sort();
  for (const key of keys) {
    const values = query.getAll(key).filter(Boolean).sort();
    if ((key === "page" && values[0] === "1") || (key === "sort" && values[0] === "recommended") || (key === "limit" && values[0] === "9")) continue;
    values.forEach((value) => params.append(key, value));
  }
  return `${siteOrigin}/${params.size ? `?${params}` : ""}`;
}

function listingPageDetails(params: URLSearchParams) {
  const category = params.get("category")?.replace(/-/g, " ");
  const title = category ? `${category.replace(/\b\w/g, (letter) => letter.toUpperCase())} products` : "Discover our products";
  const description = category
    ? `Browse ${category} at mettā muse. Filter, sort, and discover thoughtfully made pieces.`
    : "Discover thoughtfully made bags, accessories, toys, and home pieces at mettā muse.";
  return { title, description, url: canonicalUrl(params) };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const details = listingPageDetails(queryFromSearchParams(await searchParams));
  return {
    title: details.title,
    description: details.description,
    alternates: { canonical: details.url },
    openGraph: { title: details.title, description: details.description, url: details.url, type: "website" },
  };
}

function pageHref(query: URLSearchParams, page: number) {
  const next = new URLSearchParams(query);
  if (page === 1) next.delete("page"); else next.set("page", String(page));
  return `/${next.size ? `?${next}` : ""}`;
}

function paginationItems(current: number, total: number): (number | "ellipsis")[] {
  const visible = new Set<number>([1, total]);
  if (total <= 7) {
    for (let page = 1; page <= total; page++) visible.add(page);
  } else {
    for (let page = Math.max(1, current - 2); page <= Math.min(total, current + 2); page++) visible.add(page);
  }
  const items: (number | "ellipsis")[] = [];
  let previous = 0;
  for (const page of [...visible].sort((a, b) => a - b)) {
    if (previous && page - previous > 1) items.push("ellipsis");
    items.push(page);
    previous = page;
  }
  return items;
}

export default async function HomePage({ searchParams }: PageProps) {
  const query = queryFromSearchParams(await searchParams);
  const details = listingPageDetails(query);
  let catalog;
  let categories;
  let facets;
  let error: string | undefined;
  try {
    [catalog, categories, facets] = await Promise.all([getListing(query), getCategories(), getFacets()]);
  } catch (cause) {
    error = cause instanceof CatalogApiError && cause.status === 400
      ? "These filters are not valid. Clear them and try again."
      : "The product catalog is temporarily unavailable. Please try again shortly.";
  }

  if (catalog && catalog.pagination.totalPages > 0 && catalog.pagination.page > catalog.pagination.totalPages) {
    redirect(pageHref(query, catalog.pagination.totalPages));
  }

  const jsonLd = catalog ? listingStructuredData({ ...details, products: catalog.data }) : null;

  return <main className="page-main">
    <section className="hero" aria-labelledby="page-title">
      <h1 id="page-title">Discover our products</h1>
      <p>Explore thoughtfully made pieces for the everyday. Find something useful, personal, and made to last.</p>
    </section>
    {error ? <section className="catalog-message" role="alert"><h2>Products are unavailable</h2><p>{error}</p><Link href="/">Clear filters</Link></section> : catalog && categories && facets ? <ListingControls categories={categories} facets={facets} total={catalog.pagination.total}>
      {catalog.data.length ? <>
        <div className="product-grid">{catalog.data.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 3} />)}</div>
        {catalog.pagination.totalPages > 1 && <nav className="pagination" aria-label={`Product pages, page ${catalog.pagination.page} of ${catalog.pagination.totalPages}`}>
          {catalog.pagination.page > 1 && <Link href={pageHref(query, catalog.pagination.page - 1)}>Previous</Link>}
          {paginationItems(catalog.pagination.page, catalog.pagination.totalPages).map((item, index) =>
            item === "ellipsis" ? <span className="pagination-gap" aria-hidden="true" key={`gap-${index}`}>…</span>
              : item === catalog.pagination.page ? <span className="pagination-current" aria-current="page" key={item}>{item}</span>
                : <Link href={pageHref(query, item)} aria-label={`Go to page ${item}`} key={item}>{item}</Link>)}
          {catalog.pagination.page < catalog.pagination.totalPages && <Link href={pageHref(query, catalog.pagination.page + 1)}>Next</Link>}
        </nav>}
      </> : <section className="catalog-message"><h2>No products match these filters</h2><p>Try a different search or clear the current filters.</p><Link href="/">Clear all filters</Link></section>}
    </ListingControls> : null}
    {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
  </main>;
}
