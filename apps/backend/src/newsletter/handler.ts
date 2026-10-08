import type { RequestHandler } from "express";
import { HttpError } from "../catalog/query";
import { saveSubscriber } from "./service";
import { normalizeSubscriberEmail } from "./validation";

export const subscribeHandler: RequestHandler = async (request, response) => {
  const body = request.body;
  if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).some((key) => key !== "email")) {
    throw new HttpError(400, "INVALID_EMAIL", "Enter a valid email address.");
  }

  await saveSubscriber(normalizeSubscriberEmail(body.email));
  response.set("Cache-Control", "no-store").json({ message: "You're on the list! Look out for updates from mettā muse." });
};
