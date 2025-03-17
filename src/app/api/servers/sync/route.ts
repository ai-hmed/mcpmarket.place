import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import { fetchGitHubRepoDetails } from "@/lib/github";

// This endpoint syncs server data with GitHub for servers that have GitHub URLs
export async function POST(request: Request) {
  try {
    // Authenticate the user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { serverId } = body;

    if (!serverId) {
      return NextResponse.json(
        { error: "Server ID is required" },
        { status: 400 },
      );
    }

    // Fetch the server from the database
    const { data: serverData, error: serverError } = await supabase
      .from("servers")
      .select("*")
      .eq("id", serverId)
      .single();

    if (serverError || !serverData) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    // Check if the server has GitHub information
    if (!serverData.github_owner || !serverData.github_repo) {
      return NextResponse.json(
        { error: "Server does not have GitHub information" },
        { status: 400 },
      );
    }

    // Fetch the latest data from GitHub
    const repoDetails = await fetchGitHubRepoDetails(
      serverData.github_owner,
      serverData.github_repo,
    );

    if (!repoDetails) {
      return NextResponse.json(
        { error: "Failed to fetch repository details from GitHub" },
        { status: 500 },
      );
    }

    // Update the server with the latest GitHub data
    const { data: updatedServer, error: updateError } = await supabase
      .from("servers")
      .update({
        title: repoDetails.name,
        description: repoDetails.description || serverData.description,
        github_stars: repoDetails.stargazers_count,
        github_forks: repoDetails.forks_count,
        updated_at: new Date().toISOString(),
      })
      .eq("id", serverId)
      .select();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update server" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Server synced successfully with GitHub",
      server: updatedServer[0],
    });
  } catch (error) {
    console.error("Error in server sync API:", error);
    return NextResponse.json(
      { error: "Failed to sync server with GitHub" },
      { status: 500 },
    );
  }
}
