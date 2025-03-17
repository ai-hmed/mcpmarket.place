import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/saved-servers - Get user's saved servers
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("saved_servers")
    .select("*, servers(*)")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Extract just the server data
  const savedServers = data.map((item) => ({
    id: item.id,
    saved_at: item.created_at,
    ...item.servers,
  }));

  return NextResponse.json(savedServers);
}

// POST /api/saved-servers - Save a server
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
    if (!body.server_id) {
      return NextResponse.json({ error: "Missing server_id" }, { status: 400 });
    }

    // Check if server exists
    const { data: serverExists, error: serverError } = await supabase
      .from("servers")
      .select("id")
      .eq("id", body.server_id)
      .single();

    if (serverError || !serverExists) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    // Insert saved server
    const { data, error } = await supabase
      .from("saved_servers")
      .insert({
        user_id: user.id,
        server_id: body.server_id,
      })
      .select("*, servers(*)");

    if (error) {
      // If the error is a unique violation, the server is already saved
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Server already saved" },
          { status: 409 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      id: data[0].id,
      saved_at: data[0].created_at,
      ...data[0].servers,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE /api/saved-servers - Unsave a server
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const serverId = searchParams.get("server_id");

  if (!serverId) {
    return NextResponse.json(
      { error: "Missing server_id parameter" },
      { status: 400 },
    );
  }

  // Delete saved server
  const { error } = await supabase
    .from("saved_servers")
    .delete()
    .eq("user_id", user.id)
    .eq("server_id", serverId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
