import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import { fetchGitHubRepoDetails } from "@/lib/github";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { owner, repo } = body;

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repo are required" },
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

    // Fetch repository details from GitHub
    const repoDetails = await fetchGitHubRepoDetails(owner, repo);

    if (!repoDetails) {
      return NextResponse.json(
        { error: "Failed to fetch repository details" },
        { status: 500 },
      );
    }

    // Extract topics for better category assignment
    const topics = repoDetails.topics || [];
    let category = "Web"; // Default category

    if (topics.includes("database")) category = "Database";
    else if (topics.includes("ai") || topics.includes("ml")) category = "AI/ML";
    else if (topics.includes("container") || topics.includes("kubernetes"))
      category = "Container";
    else if (topics.includes("runtime")) category = "Runtime";
    else if (topics.includes("devops")) category = "DevOps";

    // Transform GitHub data to server format
    const serverData = {
      title: repoDetails.name,
      description: repoDetails.description || "No description available",
      short_description: repoDetails.description
        ? repoDetails.description.length > 100
          ? repoDetails.description.substring(0, 97) + "..."
          : repoDetails.description
        : "No description available",
      category: category,
      image_url: `https://opengraph.githubassets.com/1/${repoDetails.full_name}`,
      github_url: repoDetails.html_url,
      github_owner: owner,
      github_repo: repo,
      github_stars: repoDetails.stargazers_count,
      github_forks: repoDetails.forks_count,
      author_id: user.id,
      author: repoDetails.owner.login,
      deployments: 0,
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Inserting server data:", JSON.stringify(serverData, null, 2));

    // Insert the server into the database with better error handling
    try {
      const { data, error } = await supabase
        .from("servers")
        .insert(serverData)
        .select();

      if (error) {
        console.error(
          "Error inserting server:",
          JSON.stringify(error, null, 2),
        );
        return NextResponse.json(
          {
            error: `Failed to import server: ${error.message || error.code || "Unknown database error"}`,
            details: error,
          },
          { status: 500 },
        );
      }

      if (!data || data.length === 0) {
        console.error("No data returned after server insertion");
        return NextResponse.json(
          { error: "Server was created but no data was returned" },
          { status: 500 },
        );
      }
    } catch (dbError: any) {
      console.error("Exception during server insertion:", dbError);
      return NextResponse.json(
        {
          error: `Database operation failed: ${dbError.message || JSON.stringify(dbError)}`,
          details: dbError,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Server imported successfully",
      server: data[0],
    });
  } catch (error: any) {
    console.error("Error in GitHub import API:", error);
    return NextResponse.json(
      {
        error: `Failed to import GitHub repository: ${error.message || JSON.stringify(error)}`,
      },
      { status: 500 },
    );
  }
}
