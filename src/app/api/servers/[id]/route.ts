import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/servers/[id] - Get a specific server
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();
  const { id } = params;

  const { data, error } = await supabase
    .from("servers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PATCH /api/servers/[id] - Update a server
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();
  const { id } = params;

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Update server
    const { data, error } = await supabase
      .from("servers")
      .update(body)
      .eq("id", id)
      .eq("author_id", user.id) // Ensure user owns the server
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Server not found or not authorized" },
        { status: 404 },
      );
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE /api/servers/[id] - Delete a server
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();
  const { id } = params;

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete server
  const { error } = await supabase
    .from("servers")
    .delete()
    .eq("id", id)
    .eq("author_id", user.id); // Ensure user owns the server

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
