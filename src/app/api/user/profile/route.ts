import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/user/profile - Get user profile
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user profile from public.users table
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get user's deployment stats
  const { data: deployments, error: deploymentsError } = await supabase
    .from("deployments")
    .select("id, status")
    .eq("user_id", user.id);

  if (deploymentsError) {
    return NextResponse.json(
      { error: deploymentsError.message },
      { status: 500 },
    );
  }

  // Get user's saved servers count
  const { count: savedCount, error: savedError } = await supabase
    .from("saved_servers")
    .select("id", { count: "exact" })
    .eq("user_id", user.id);

  if (savedError) {
    return NextResponse.json({ error: savedError.message }, { status: 500 });
  }

  // Calculate deployment stats
  const activeDeployments = deployments.filter(
    (d) => d.status === "active",
  ).length;
  const totalDeployments = deployments.length;

  return NextResponse.json({
    ...data,
    stats: {
      activeDeployments,
      totalDeployments,
      savedServers: savedCount || 0,
    },
    auth: {
      email: user.email,
      created_at: user.created_at,
    },
  });
}

// PATCH /api/user/profile - Update user profile
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Update user profile
    const { data, error } = await supabase
      .from("users")
      .update({
        full_name: body.full_name,
        avatar_url: body.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
