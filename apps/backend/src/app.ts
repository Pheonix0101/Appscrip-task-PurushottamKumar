import cors from "cors";
import express from "express";
import { catalogRouter } from "./catalog/routes";
import { HttpError } from "./catalog/query";
import { newsletterRouter } from "./newsletter/routes";

export const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
app.use(cors({
  origin: (process.env.WEB_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim()),
}));

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use(catalogRouter);
app.use(newsletterRouter);

app.use((_request, _response, next) => {
  next(new HttpError(404, "NOT_FOUND", "Route not found"));
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof SyntaxError && "status" in error && error.status === 400) {
    response.status(400).json({ error: { code: "INVALID_JSON", message: "Request body must be valid JSON" } });
    return;
  }
  if (error instanceof HttpError) {
    response.status(error.status).json({ error: { code: error.code, message: error.message } });
    return;
  }
  console.error(error);
  response.status(500).json({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } });
});
