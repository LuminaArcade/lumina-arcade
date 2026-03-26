import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Usado no browser — acesso limitado
export const supabaseClient = createClient(supabaseUrl, supabaseAnon);

// Usado no servidor (API routes) — acesso total
export const supabaseAdmin = createClient(supabaseUrl, supabaseService, {
  auth: { persistSession: false },
});
