import { facets, type FacetKey } from "./facets";

export const sortOptions = ["recommended", "newest", "popular", "price_desc", "price_asc"] as const;
export type ProductSort = (typeof sortOptions)[number];

export class HttpError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

export type ProductQuery = {
  page: number;
  limit: number;
  sort: ProductSort;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  customizable?: boolean;
  facets: Partial<Record<FacetKey, string[]>>;
};

function strings(value: unknown, key: string): string[] {
  if (value === undefined) return [];
  const values = Array.isArray(value) ? value : [value];
  if (!values.every((item) => typeof item === "string")) {
    throw new HttpError(400, "INVALID_QUERY", `${key} must be a string`);
  }
  return values as string[];
}

function one(value: unknown, key: string): string | undefined {
  const values = strings(value, key);
  if (values.length > 1) throw new HttpError(400, "INVALID_QUERY", `${key} may appear only once`);
  return values[0];
}

function integer(value: unknown, key: string, fallback: number, max: number): number {
  const raw = one(value, key);
  if (raw === undefined) return fallback;
  if (!/^\d+$/.test(raw) || Number(raw) < 1 || Number(raw) > max) {
    throw new HttpError(400, "INVALID_QUERY", `${key} must be between 1 and ${max}`);
  }
  return Number(raw);
}

function price(value: unknown, key: string): number | undefined {
  const raw = one(value, key);
  if (raw === undefined) return undefined;
  if (!/^\d+(\.\d{1,2})?$/.test(raw) || Number(raw) > 1000000) {
    throw new HttpError(400, "INVALID_QUERY", `${key} must be a nonnegative amount up to 1000000`);
  }
  return Number(raw);
}

export function parseProductQuery(input: Record<string, unknown>): ProductQuery {
  const allowed = new Set(["page", "limit", "sort", "category", "minPrice", "maxPrice", "q", "customizable", ...facets.map((facet) => facet.key)]);
  for (const key of Object.keys(input)) {
    if (!allowed.has(key)) throw new HttpError(400, "INVALID_QUERY", `Unknown query parameter: ${key}`);
  }

  const page = integer(input.page, "page", 1, 10000);
  const limit = integer(input.limit, "limit", 9, 48);
  const sort = one(input.sort, "sort") ?? "recommended";
  if (!sortOptions.includes(sort as ProductSort)) {
    throw new HttpError(400, "INVALID_QUERY", "Unsupported sort value");
  }
  const category = one(input.category, "category");
  if (category && !/^[a-z0-9-]{1,80}$/.test(category)) {
    throw new HttpError(400, "INVALID_QUERY", "Invalid category slug");
  }
  const minPrice = price(input.minPrice, "minPrice");
  const maxPrice = price(input.maxPrice, "maxPrice");
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    throw new HttpError(400, "INVALID_QUERY", "minPrice cannot exceed maxPrice");
  }
  const q = one(input.q, "q")?.trim();
  if (q && q.length > 100) throw new HttpError(400, "INVALID_QUERY", "Search is too long");
  const customizableRaw = one(input.customizable, "customizable");
  if (customizableRaw !== undefined && customizableRaw !== "true") {
    throw new HttpError(400, "INVALID_QUERY", "customizable must be true");
  }

  const selectedFacets: ProductQuery["facets"] = {};
  for (const facet of facets) {
    const values = strings(input[facet.key], facet.key);
    if (values.some((value) => !(facet.options as readonly string[]).includes(value))) {
      throw new HttpError(400, "INVALID_QUERY", `Unsupported ${facet.label} value`);
    }
    if (values.length) selectedFacets[facet.key] = [...new Set(values)];
  }

  return {
    page,
    limit,
    sort: sort as ProductSort,
    category,
    minPrice,
    maxPrice,
    q: q || undefined,
    customizable: customizableRaw === "true" ? true : undefined,
    facets: selectedFacets,
  };
}
