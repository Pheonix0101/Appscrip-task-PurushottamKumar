import { HttpError } from "../catalog/query";
import { supabase } from "../db/client";

export async function saveSubscriber(email: string) {
  const { error } = await supabase.from("Client")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

  if (error) {
    console.error("Newsletter storage failed:", error.code);
    throw new HttpError(503, "SUBSCRIPTION_UNAVAILABLE", "Subscriptions are temporarily unavailable. Please try again.");
  }
}
