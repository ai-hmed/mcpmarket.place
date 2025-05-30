import { ServerData } from "@/hooks/use-servers";

// GitHub API integration for fetching mCP servers
export async function fetchGitHubServers(
  query: string = "topic:mcp-server",
): Promise<ServerData[]> {
  try {
    console.log("Fetching GitHub servers with query:", query);

    // First try to fetch from GitHub API
    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            // Note: For production, use a GitHub token for higher rate limits
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log(
          `Successfully fetched ${data.items?.length || 0} repositories from GitHub`,
        );
        return data.items.map(transformGitHubRepoToServer);
      }

      // Log the specific error for debugging
      console.warn(
        `GitHub API returned status ${response.status}. Using mock data instead.`,
      );
      if (response.status === 403) {
        console.warn(
          "This is likely due to GitHub API rate limiting for unauthenticated requests.",
        );
      }
    } catch (apiError) {
      console.error("Error accessing GitHub API:", apiError);
    }

    // If we reach here, the API request failed - return mock data instead
    console.log("Returning mock GitHub server data as fallback");
    return getMockGitHubServers(query);
  } catch (error) {
    console.error("Error in fetchGitHubServers:", error);
    return getMockGitHubServers(query);
  }
}

// Provides mock GitHub server data when the API is unavailable
function getMockGitHubServers(query: string = ""): ServerData[] {
  // Create some mock repositories that match common MCP server patterns
  const mockRepos = [
    {
      id: "github-mcp-server",
      name: "GitHub MCP Server",
      description: "A Model Content Protocol server for the GitHub API",
      topics: ["mcp-server", "github", "api"],
      owner: { login: "mcpmarket" },
      stargazers_count: 124,
      forks_count: 32,
      updated_at: new Date().toISOString(),
      html_url: "https://github.com/mcpmarket/github-mcp-server",
      full_name: "mcpmarket/github-mcp-server",
    },
    {
      id: "linear-mcp-server",
      name: "Linear MCP Server",
      description: "Connect to Linear issue tracking with this MCP server",
      topics: ["mcp-server", "linear", "issue-tracking"],
      owner: { login: "mcpmarket" },
      stargazers_count: 87,
      forks_count: 15,
      updated_at: new Date().toISOString(),
      html_url: "https://github.com/mcpmarket/linear-mcp-server",
      full_name: "mcpmarket/linear-mcp-server",
    },
    {
      id: "n8n-workflow-server",
      name: "n8n Workflow Server",
      description: "MCP server for n8n workflow automation",
      topics: ["mcp-server", "n8n", "automation"],
      owner: { login: "mcpmarket" },
      stargazers_count: 156,
      forks_count: 41,
      updated_at: new Date().toISOString(),
      html_url: "https://github.com/mcpmarket/n8n-workflow-server",
      full_name: "mcpmarket/n8n-workflow-server",
    },
    {
      id: "postgres-mcp-server",
      name: "PostgreSQL MCP Server",
      description: "Database operations via MCP protocol for PostgreSQL",
      topics: ["mcp-server", "database", "postgresql"],
      owner: { login: "mcpmarket" },
      stargazers_count: 92,
      forks_count: 18,
      updated_at: new Date().toISOString(),
      html_url: "https://github.com/mcpmarket/postgres-mcp-server",
      full_name: "mcpmarket/postgres-mcp-server",
    },
    {
      id: "ai-assistant-server",
      name: "AI Assistant MCP Server",
      description:
        "Connect to various AI models through a unified MCP interface",
      topics: ["mcp-server", "ai", "ml", "llm"],
      owner: { login: "mcpmarket" },
      stargazers_count: 213,
      forks_count: 67,
      updated_at: new Date().toISOString(),
      html_url: "https://github.com/mcpmarket/ai-assistant-server",
      full_name: "mcpmarket/ai-assistant-server",
    },
  ];

  // If there's a search query, filter the mock repos
  if (query && query !== "topic:mcp-server") {
    const searchTerms = query
      .toLowerCase()
      .replace("topic:mcp-server", "")
      .trim()
      .split(/\s+/);
    return mockRepos
      .filter((repo) => {
        // Check if any search term matches the repo name, description or topics
        return searchTerms.some(
          (term) =>
            repo.name.toLowerCase().includes(term) ||
            repo.description.toLowerCase().includes(term) ||
            repo.topics.some((topic) => topic.toLowerCase().includes(term)),
        );
      })
      .map(transformGitHubRepoToServer);
  }

  return mockRepos.map(transformGitHubRepoToServer);
}

// Transform GitHub repository data to our ServerData format
function transformGitHubRepoToServer(repo: any): ServerData {
  // Extract category from topics if available
  const topics = repo.topics || [];
  let category = "Web"; // Default category

  if (topics.includes("database")) category = "Database";
  else if (topics.includes("ai") || topics.includes("ml")) category = "AI/ML";
  else if (topics.includes("container") || topics.includes("kubernetes"))
    category = "Container";
  else if (topics.includes("runtime")) category = "Runtime";
  else if (topics.includes("devops")) category = "DevOps";

  // Generate a unique ID based on the repo name
  const id = repo.name.toLowerCase().replace(/\s+/g, "-");

  return {
    id,
    title: repo.name,
    description: repo.description || "No description available",
    category,
    deployments: Math.floor(Math.random() * 1000), // Mock data
    imageUrl: `https://opengraph.githubassets.com/1/${repo.full_name}`,
    specs: {
      cpu: "4 vCPUs",
      memory: "8 GB RAM",
      storage: "100 GB SSD",
      network: "1 Gbps",
      os: "Ubuntu 22.04 LTS",
    },
    features: ["GitHub Integration", "Automatic Updates", "Version Control"],
    providers: [
      { name: "AWS", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
      { name: "Azure", regions: ["eastus", "westeurope", "southeastasia"] },
      { name: "GCP", regions: ["us-central1", "europe-west1", "asia-east1"] },
    ],
    author: repo.owner.login,
    rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
    icon: repo.owner.avatar_url,
    downloads: repo.stargazers_count.toString(),
    status: "Available",
    lastUpdated: new Date(repo.updated_at).toLocaleDateString(),
    githubUrl: repo.html_url,
    githubStars: repo.stargazers_count,
    githubForks: repo.forks_count,
  };
}

// Fetch details for a specific GitHub repository
export async function fetchGitHubRepoDetails(
  owner: string,
  repo: string,
): Promise<any> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching GitHub repo details:", error);
    return null;
  }
}

// Fetch README content for a repository
export async function fetchGitHubReadme(
  owner: string,
  repo: string,
): Promise<string> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    // Decode base64 content
    return atob(data.content);
  } catch (error) {
    console.error("Error fetching GitHub README:", error);
    return "No README available";
  }
}
