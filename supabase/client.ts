import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  // Check for both sets of environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Supabase environment variables are not set. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are defined.",
    );
    throw new Error(
      "Supabase credentials not found. Please check your environment variables.",
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
