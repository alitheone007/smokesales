import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env vars are missing. Copy web/.env.example to web/.env.local and fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.",
  )
}

// Safe to use in the browser: this is the anon/publishable key, which is
// subject to the Row Level Security policies in supabase/migration.sql.
// Never put the service-role key in frontend code or env vars — it bypasses
// RLS entirely and must stay server-side only.
export const supabase = createClient(url ?? "", anonKey ?? "")
