import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/developer/submit - Submit a server for review
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

    // Check if server exists and belongs to the user
    const { data: server, error: serverError } = await supabase
      .from("servers")
      .select("*")
      .eq("id", body.server_id)
      .eq("author_id", user.id)
      .single();

    if (serverError || !server) {
      return NextResponse.json(
        { error: "Server not found or not authorized" },
        { status: 404 },
      );
    }

    // Update server status to 'under_review'
    const { data, error } = await supabase
      .from("servers")
      .update({ status: "under_review" })
      .eq("id", body.server_id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // In a real application, you would trigger a notification to admins for review

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
