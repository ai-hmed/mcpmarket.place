import { NextResponse } from "next/server";
import { fetchGitHubReadme } from "@/lib/github";
import { createClient } from "@/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repo parameters are required" },
        { status: 400 },
      );
    }

    // Authenticate the user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch README content from GitHub
    const readmeContent = await fetchGitHubReadme(owner, repo);

    return NextResponse.json({ content: readmeContent });
  } catch (error) {
    console.error("Error in GitHub README API:", error);
    return NextResponse.json(
      { error: "Failed to fetch README content" },
      { status: 500 },
    );
  }
}
