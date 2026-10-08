import { supabase } from "../db/client";
import type { FacetKey } from "./facets";
import type { ProductQuery } from "./query";

type Category = { id: number; name: string; slug: string };
type RawProduct = {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number | string;
  popularity: number;
  customizable: boolean;
  created_at: string;
  category: Category;
  ideal_for: string[];
  occasion: string[];
  work: string[];
  fabric: string[];
  segment: string[];
  suitable_for: string[];
  raw_materials: string[];
  pattern: string[];
};

const columns = "id,slug,title,description,price,popularity,customizable,created_at,ideal_for,occasion,work,fabric,segment,suitable_for,raw_materials,pattern,category:categories(id,name,slug)";
const facetColumns: Record<FacetKey, string> = {
  idealFor: "ideal_for",
  occasion: "occasion",
  work: "work",
  fabric: "fabric",
  segment: "segment",
  suitableFor: "suitable_for",
  rawMaterials: "raw_materials",
  pattern: "pattern",
};

function mapProduct(row: RawProduct) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    price: Number(row.price).toFixed(2),
    customizable: row.customizable,
    createdAt: row.created_at,
    category: row.category,
    attributes: {
      idealFor: row.ideal_for,
      occasion: row.occasion,
      work: row.work,
      fabric: row.fabric,
      segment: row.segment,
      suitableFor: row.suitable_for,
      rawMaterials: row.raw_materials,
      pattern: row.pattern,
    },
  };
}

async function attachImages(rows: RawProduct[]) {
  if (!rows.length) return [];
  const { data, error } = await supabase.from("product_images")
    .select("product_id,url,alt,position")
    .in("product_id", rows.map((row) => row.id))
    .order("position", { ascending: true });
  if (error) throw new Error(`Product images query failed: ${error.message}`);

  const imagesByProduct = new Map<number, { url: string; alt: string }[]>();
  for (const image of data ?? []) {
    const images = imagesByProduct.get(image.product_id) ?? [];
    images.push({ url: image.url, alt: image.alt });
    imagesByProduct.set(image.product_id, images);
  }
  return rows.map((row) => ({ ...mapProduct(row), images: imagesByProduct.get(row.id) ?? [] }));
}

export async function listProducts(query: ProductQuery) {
  let categoryId: number | undefined;
  if (query.category) {
    const { data, error } = await supabase.from("categories")
      .select("id").eq("slug", query.category).maybeSingle();
    if (error) throw new Error(`Category query failed: ${error.message}`);
    if (!data) return { data: [], pagination: { page: query.page, limit: query.limit, total: 0, totalPages: 0 } };
    categoryId = data.id;
  }

  const ascending = query.sort === "price_asc";
  const sortColumn = query.sort.startsWith("price") ? "price"
    : query.sort === "newest" ? "created_at" : "popularity";
  const start = (query.page - 1) * query.limit;
  const { data, count, error } = await productRequest(query, categoryId, columns)
    .order(sortColumn, { ascending })
    .range(start, start + query.limit - 1);
  if (error?.code === "PGRST103") {
    const result = await productRequest(query, categoryId, "id").limit(1);
    if (result.error) throw new Error(`Products count query failed: ${result.error.message}`);
    const total = result.count ?? 0;
    if (start >= total) {
      return { data: [], pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } };
    }
  }
  if (error) throw new Error(`Products query failed: ${error.message}`);
  const total = count ?? 0;
  return {
    data: await attachImages((data ?? []) as unknown as RawProduct[]),
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  };
}

function productRequest(query: ProductQuery, categoryId: number | undefined, projection: string) {
  let request = supabase.from("products").select(projection, { count: "exact" });
  if (categoryId !== undefined) request = request.eq("category_id", categoryId);
  if (query.minPrice !== undefined) request = request.gte("price", query.minPrice);
  if (query.maxPrice !== undefined) request = request.lte("price", query.maxPrice);
  if (query.customizable) request = request.eq("customizable", true);
  if (query.q) request = request.textSearch("search_vector", query.q, { type: "plain", config: "english" });
  for (const [key, values] of Object.entries(query.facets)) {
    if (values?.length) request = request.overlaps(facetColumns[key as FacetKey], values);
  }
  return request;
}

export async function getProduct(id: number) {
  const { data, error } = await supabase.from("products").select(columns).eq("id", id).maybeSingle();
  if (error) throw new Error(`Product query failed: ${error.message}`);
  if (!data) return null;
  const withImages = await attachImages([data as unknown as RawProduct]);
  return withImages[0] ?? null;
}

export async function listCategories() {
  const { data, error } = await supabase.from("categories").select("id,name,slug").order("name");
  if (error) throw new Error(`Categories query failed: ${error.message}`);
  return (data ?? []) as Category[];
}
