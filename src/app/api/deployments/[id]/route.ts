import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/deployments/[id] - Get a specific deployment
export async function GET(
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

  const { data, error } = await supabase
    .from("deployments")
    .select("*, servers(*)")
    .eq("id", id)
    .eq("user_id", user.id) // Ensure user owns the deployment
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PATCH /api/deployments/[id] - Update a deployment
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

    // Update deployment
    const { data, error } = await supabase
      .from("deployments")
      .update(body)
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user owns the deployment
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Deployment not found or not authorized" },
        { status: 404 },
      );
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE /api/deployments/[id] - Delete a deployment
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

  // Get the deployment to check server_id before deletion
  const { data: deployment } = await supabase
    .from("deployments")
    .select("server_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  // Delete deployment
  const { error } = await supabase
    .from("deployments")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // Ensure user owns the deployment

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Decrement the deployments count for the server
  if (deployment) {
    await supabase.rpc("decrement_server_deployments", {
      server_id: deployment.server_id,
    });
  }

  return NextResponse.json({ success: true });
}
