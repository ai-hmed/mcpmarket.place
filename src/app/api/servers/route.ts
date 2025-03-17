import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/servers - Get all published servers
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  // Get query parameters
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest";
  const limit = parseInt(searchParams.get("limit") || "50");

  // Build query
  let query = supabase
    .from("servers")
    .select("*")
    .eq("status", "published")
    .limit(limit);

  // Apply filters
  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Apply sorting
  if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else if (sort === "popular") {
    query = query.order("deployments", { ascending: false });
  } else if (sort === "az") {
    query = query.order("title", { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/servers - Create a new server
export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!body.title || !body.description || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Insert new server
    const { data, error } = await supabase
      .from("servers")
      .insert({
        title: body.title,
        description: body.description,
        short_description: body.shortDescription,
        category: body.category,
        image_url: body.imageUrl,
        author_id: user.id,
        specs: body.specs,
        features: body.features,
        providers: body.providers,
        status: body.status || "draft",
        pricing: body.pricing,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
