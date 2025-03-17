import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            request.cookies.set(name, value);
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set(name, value, options);
          },
          remove(name, options) {
            request.cookies.set(name, "");
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set(name, "", { ...options, maxAge: 0 });
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    await supabase.auth.getSession();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // Log authentication status for debugging
    console.log(
      `Auth check for ${request.nextUrl.pathname}: User ${user ? "authenticated (ID: " + user.id + ")" : "not authenticated"}`,
    );

    // protected routes
    if (request.nextUrl.pathname.startsWith("/dashboard") && (!user || error)) {
      console.log(
        `Redirecting to sign-in from ${request.nextUrl.pathname} due to auth error:`,
        error || "No user found",
      );

      // Store the URL the user was trying to access
      const redirectUrl = new URL("/sign-in", request.url);
      redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);

      return NextResponse.redirect(redirectUrl);
    }

    return response;
  } catch (e) {
    console.error("Middleware error:", e);
    // If you are here, a Supabase client could not be created!
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
