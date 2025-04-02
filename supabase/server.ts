import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = cookies();

  // Check for both sets of environment variables
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Supabase environment variables are not set. Please ensure SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL and SUPABASE_ANON_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY are defined.",
    );
    throw new Error(
      "Supabase credentials not found. Please check your environment variables.",
    );
  }

  try {
    return createServerClient(
      supabaseUrl,
      supabaseServiceKey || supabaseAnonKey, // Prefer service key for server operations if available
      {
        cookies: {
          getAll() {
            return cookieStore.getAll().map(({ name, value }) => ({
              name,
              value,
            }));
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      },
    );
  } catch (error) {
    console.error("Error creating Supabase server client:", error);
    throw error;
  }
};
