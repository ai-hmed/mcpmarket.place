import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

// GET /api/deployments - Get user's deployments
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  // Build query
  let query = supabase
    .from("deployments")
    .select("*, servers(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Filter by status if provided
  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/deployments - Create a new deployment
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
    const formData = await request.formData();

    // Extract form data
    const server_id = formData.get("server_id") as string;
    const name = formData.get("name") as string;
    const provider = formData.get("provider") as string;
    const region = formData.get("region") as string;
    const resources = formData.get("resources") as string;
    const configuration = formData.get("configuration") as string;
    const cost = formData.get("cost") as string;

    // Validate required fields
    if (!server_id || !name || !provider || !region) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Insert new deployment
    const { data, error } = await supabase
      .from("deployments")
      .insert({
        server_id,
        user_id: user.id,
        name,
        provider,
        region,
        resources: resources ? JSON.parse(resources) : null,
        configuration: configuration ? JSON.parse(configuration) : null,
        status: "pending",
        cost: cost ? parseFloat(cost) : null,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Increment the deployments count for the server
    await supabase.rpc("increment_server_deployments", { server_id });

    // In a real application, you would trigger the actual deployment process here
    // For now, we'll simulate it by updating the status after a delay
    setTimeout(async () => {
      // Simulate a successful deployment
      await supabase
        .from("deployments")
        .update({
          status: "active",
          ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data[0].id);
    }, 10000); // 10 seconds delay

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/dashboard/deploy/success?id=${data[0].id}`, request.url),
    );
  } catch (error) {
    console.error("Deployment error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
