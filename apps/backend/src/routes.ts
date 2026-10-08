import type { Express } from "express";
import {
  getCategoriesHandler,
  getFacetsHandler,
  getProductHandler,
  listProductsHandler,
} from "./catalog/handlers";
import { healthHandler } from "./health";
import { subscribeHandler } from "./newsletter/handler";

export function registerRoutes(app: Express) {
  app.get("/health", healthHandler);
  app.get("/products", listProductsHandler);
  app.get("/products/:id", getProductHandler);
  app.get("/categories", getCategoriesHandler);
  app.get("/facets", getFacetsHandler);
  app.post("/subscriptions", subscribeHandler);
}
