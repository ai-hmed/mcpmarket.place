import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/developer/analytics - Get analytics for developer's servers
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all servers by the developer
    const { data: servers, error: serversError } = await supabase
      .from("servers")
      .select("id, title, deployments, created_at")
      .eq("author_id", user.id);

    if (serversError) {
      return NextResponse.json(
        { error: serversError.message },
        { status: 500 },
      );
    }

    // Get total deployments
    const totalDeployments = servers.reduce(
      (sum, server) => sum + (server.deployments || 0),
      0,
    );

    // Get active deployments
    const { data: activeDeployments, error: deploymentsError } = await supabase
      .from("deployments")
      .select("id")
      .in(
        "server_id",
        servers.map((s) => s.id),
      )
      .eq("status", "active");

    if (deploymentsError) {
      return NextResponse.json(
        { error: deploymentsError.message },
        { status: 500 },
      );
    }

    // Get average rating
    const { data: reviews, error: reviewsError } = await supabase
      .from("server_reviews")
      .select("rating")
      .in(
        "server_id",
        servers.map((s) => s.id),
      );

    if (reviewsError) {
      return NextResponse.json(
        { error: reviewsError.message },
        { status: 500 },
      );
    }

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    // Get deployment trends (mock data for now)
    const deploymentTrends = [
      { month: "Jan", value: 45 },
      { month: "Feb", value: 60 },
      { month: "Mar", value: 75 },
      { month: "Apr", value: 85 },
      { month: "May", value: 110 },
      { month: "Jun", value: 130 },
      { month: "Jul", value: 145 },
      { month: "Aug", value: 160 },
      { month: "Sep", value: 175 },
      { month: "Oct", value: 200 },
      { month: "Nov", value: 220 },
      { month: "Dec", value: 250 },
    ];

    // Get deployment by region (mock data for now)
    const deploymentsByRegion = [
      { region: "North America", percentage: 45 },
      { region: "Europe", percentage: 30 },
      { region: "Asia Pacific", percentage: 15 },
      { region: "South America", percentage: 7 },
      { region: "Africa", percentage: 3 },
    ];

    // Get deployment by provider (mock data for now)
    const deploymentsByProvider = [
      { provider: "AWS", percentage: 50 },
      { provider: "Azure", percentage: 25 },
      { provider: "Google Cloud", percentage: 20 },
      { provider: "DigitalOcean", percentage: 5 },
    ];

    return NextResponse.json({
      totalDeployments,
      activeDeployments: activeDeployments.length,
      averageRating,
      reviewCount: reviews.length,
      deploymentTrends,
      deploymentsByRegion,
      deploymentsByProvider,
      servers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
