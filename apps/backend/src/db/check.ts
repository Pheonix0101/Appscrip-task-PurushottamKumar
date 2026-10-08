import "dotenv/config";
import { supabase } from "./client";

async function check() {
  const checks = [
    { table: "categories", columns: "id,slug", count: true },
    { table: "products", columns: "id,slug,ideal_for,occasion,work,fabric,segment,suitable_for,raw_materials,pattern,search_vector", count: false },
    { table: "product_images", columns: "id,product_id,position", count: false },
  ] as const;
  let categories = 0;
  for (const item of checks) {
    const { count, error } = await supabase.from(item.table)
      .select(item.columns, { count: item.count ? "exact" : undefined })
      .limit(1);
    if (error) {
      const hint = ["PGRST205", "PGRST204", "42P01", "42703"].includes(error.code)
        ? "Run apps/backend/supabase/schema.sql in the Supabase SQL Editor."
        : "Check SUPABASE_URL, SUPABASE_SECRET_KEY, and project access.";
      throw new Error(`Supabase ${item.table} check failed: ${error.message}. ${hint}`);
    }
    if (item.table === "categories") categories = count ?? 0;
  }
  console.log(`Supabase catalog is reachable (${categories} categories).`);
}

check().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
