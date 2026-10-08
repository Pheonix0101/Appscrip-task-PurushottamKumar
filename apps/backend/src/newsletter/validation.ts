import { HttpError } from "../catalog/query";

export function normalizeSubscriberEmail(value: unknown): string {
  if (typeof value !== "string") {
    throw new HttpError(400, "INVALID_EMAIL", "Enter a valid email address.");
  }

  const email = value.trim().toLowerCase();
  if (email.length < 3 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "INVALID_EMAIL", "Enter a valid email address.");
  }

  return email;
}
