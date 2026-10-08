import { apiBase } from "./site-config";

export type Category = { id: number; name: string; slug: string };
export type Facet = { key: string; label: string; options: string[] };
export type Product = {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: string;
  customizable: boolean;
  attributes: Record<string, string[]>;
  createdAt: string;
  category: Category;
  images: { url: string; alt: string }[];
};
export type ProductList = {
  data: Product[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export class CatalogApiError extends Error {
  constructor(public status: number) {
    super(`Catalog API returned ${status}`);
  }
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new CatalogApiError(response.status);
  return response.json() as Promise<T>;
}

export function queryFromSearchParams(input: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
    else if (value !== undefined) query.set(key, value);
  }
  return query;
}

export async function getListing(query: URLSearchParams) {
  const suffix = query.toString();
  const result = await getJson<ProductList>(`/products${suffix ? `?${suffix}` : ""}`);
  if (!Array.isArray(result.data) || typeof result.pagination?.total !== "number") throw new Error("Invalid catalog response");
  return result;
}

export async function getCategories() {
  const result = await getJson<{ data: Category[] }>("/categories");
  return result.data;
}

export async function getFacets() {
  const result = await getJson<{ data: Facet[] }>("/facets");
  return result.data;
}

export async function getProduct(id: string) {
  const result = await getJson<{ data: Product }>(`/products/${encodeURIComponent(id)}`);
  return result.data;
}
