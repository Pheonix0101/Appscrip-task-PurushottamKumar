import { Router } from "express";
import { HttpError } from "../catalog/query";
import { supabase } from "../db/client";
import { normalizeSubscriberEmail } from "./validation";

export const newsletterRouter = Router();

newsletterRouter.post("/subscriptions", async (request, response) => {
  const body = request.body;
  if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).some((key) => key !== "email")) {
    throw new HttpError(400, "INVALID_EMAIL", "Enter a valid email address.");
  }

  const email = normalizeSubscriberEmail(body.email);
  const { error } = await supabase.from("Client")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

  if (error) {
    console.error("Newsletter storage failed:", error.code);
    throw new HttpError(503, "SUBSCRIPTION_UNAVAILABLE", "Subscriptions are temporarily unavailable. Please try again.");
  }

  response.set("Cache-Control", "no-store").json({ message: "You're on the list! Look out for updates from mettā muse." });
});
