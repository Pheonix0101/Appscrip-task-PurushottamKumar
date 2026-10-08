import assert from "node:assert/strict";
import test from "node:test";
import { HttpError } from "../catalog/query";
import { normalizeSubscriberEmail } from "./validation";

test("normalizes an email so repeat signups share one database row", () => {
  assert.equal(normalizeSubscriberEmail("  Person@Example.COM  "), "person@example.com");
});

test("rejects malformed and oversized subscriber emails", () => {
  for (const value of [undefined, "", "person", "person@localhost", "two words@example.com", `${"a".repeat(245)}@example.com`]) {
    assert.throws(() => normalizeSubscriberEmail(value), HttpError);
  }
});
