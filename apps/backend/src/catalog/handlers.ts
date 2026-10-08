import type { RequestHandler } from "express";
import { facets } from "./facets";
import { HttpError, parseProductQuery } from "./query";
import { getProduct, listCategories, listProducts } from "./service";

export const listProductsHandler: RequestHandler = async (request, response) => {
  const query = parseProductQuery(request.query as Record<string, unknown>);
  response.set("Cache-Control", "no-store").json(await listProducts(query));
};

export const getProductHandler: RequestHandler = async (request, response) => {
  const raw = request.params.id;
  if (typeof raw !== "string" || !/^\d+$/.test(raw) || Number(raw) < 1 || !Number.isSafeInteger(Number(raw))) {
    throw new HttpError(400, "INVALID_ID", "Product ID must be a positive integer");
  }
  const product = await getProduct(Number(raw));
  if (!product) throw new HttpError(404, "NOT_FOUND", "Product not found");
  response.set("Cache-Control", "no-store").json({ data: product });
};

export const getCategoriesHandler: RequestHandler = async (_request, response) => {
  response.set("Cache-Control", "no-store").json({ data: await listCategories() });
};

export const getFacetsHandler: RequestHandler = (_request, response) => {
  response.json({ data: facets });
};
