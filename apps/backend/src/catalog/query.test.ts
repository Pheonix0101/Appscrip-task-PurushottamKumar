import assert from "node:assert/strict";
import test from "node:test";
import { HttpError, parseProductQuery } from "./query";

test("accepts shareable filters and repeated facet options", () => {
  const query = parseProductQuery({
    page: "2", limit: "9", category: "bags", minPrice: "25", maxPrice: "150.50",
    sort: "price_asc", idealFor: ["Men", "Women"], customizable: "true", q: "  woven  ",
  });
  assert.equal(query.page, 2);
  assert.equal(query.maxPrice, 150.5);
  assert.deepEqual(query.facets.idealFor, ["Men", "Women"]);
  assert.equal(query.q, "woven");
  assert.equal(query.customizable, true);
});

test("rejects invalid price ranges and unsupported sort values", () => {
  assert.throws(() => parseProductQuery({ minPrice: "100", maxPrice: "20" }), HttpError);
  assert.throws(() => parseProductQuery({ sort: "DROP TABLE products" }), HttpError);
  assert.throws(() => parseProductQuery({ page: "0" }), HttpError);
});

test("rejects unknown and unsupported facet input", () => {
  assert.throws(() => parseProductQuery({ mystery: "yes" }), HttpError);
  assert.throws(() => parseProductQuery({ fabric: "Unlisted material" }), HttpError);
  assert.throws(() => parseProductQuery({ q: ["one", "two"] }), HttpError);
});
