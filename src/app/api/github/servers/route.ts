import { NextResponse } from "next/server";
import { fetchGitHubServers } from "@/lib/github";
import { createClient } from "@/supabase/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const query = searchParams.get("query") || "topic:mcp-server";

    // Authenticate the user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch servers from GitHub
    const servers = await fetchGitHubServers(query);

    return NextResponse.json(servers);
  } catch (error) {
    console.error("Error in GitHub servers API:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub servers" },
      { status: 500 },
    );
  }
}
