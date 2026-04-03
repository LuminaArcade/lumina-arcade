import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;
let _initialized = false;

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

function getSupabaseAnon() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const anon = getSupabaseAnon();
  return !!(url && anon && url.startsWith("http"));
}

export function getSupabase(): SupabaseClient | null {
  if (_initialized) return _supabase;
  _initialized = true;

  if (!isSupabaseConfigured()) return null;

  _supabase = createClient(getSupabaseUrl(), getSupabaseAnon());
  return _supabase;
}
