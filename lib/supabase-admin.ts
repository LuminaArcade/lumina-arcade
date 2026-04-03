import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _admin: SupabaseClient | null = null;
let _initialized = false;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (_initialized) return _admin;
  _initialized = true;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!url || !serviceKey || !url.startsWith("http")) return null;

  _admin = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
  return _admin;
}
