import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let browserSupabase: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
  // Never cache browser client on the server side to prevent request/session leakage
  if (typeof window === "undefined") {
    return createBrowserClient(supabaseUrl!, supabaseKey!);
  }

  if (!browserSupabase) {
    browserSupabase = createBrowserClient(supabaseUrl!, supabaseKey!);
  }

  return browserSupabase;
};
