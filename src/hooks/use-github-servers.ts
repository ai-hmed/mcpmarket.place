"use client";

import { useState, useEffect } from "react";
import { ServerData } from "./use-servers";
import { createClient } from "../../supabase/client";

export function useGitHubServers() {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch GitHub servers
  const fetchGitHubServers = async (query?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (query) {
        params.append("query", query);
      }

      const response = await fetch(`/api/github/servers?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch GitHub servers");
      }

      const data = await response.json();
      setServers(data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching GitHub servers:", err);
      setError(err.message || "Failed to fetch GitHub servers");
      setLoading(false);
    }
  };

  // Import a GitHub repository
  const importGitHubRepo = async (owner: string, repo: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Importing GitHub repo in hook: ${owner}/${repo}`);

      // First verify authentication
      const supabase = createClient();
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        throw new Error("Authentication required. Please sign in again.");
      }

      const response = await fetch("/api/github/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ owner, repo }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to import repository");
      }

      setLoading(false);
      return data.server;
    } catch (err: any) {
      console.error("Error importing GitHub repository:", err);
      setError(err.message || "Failed to import GitHub repository");
      setLoading(false);
      throw err;
    }
  };

  // Fetch README content for a repository
  const fetchReadme = async (owner: string, repo: string) => {
    try {
      const response = await fetch(
        `/api/github/readme?owner=${owner}&repo=${repo}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch README content");
      }

      const data = await response.json();
      return data.content;
    } catch (err: any) {
      console.error("Error fetching README content:", err);
      return "No README content available";
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchGitHubServers();
  }, []);

  return {
    servers,
    loading,
    error,
    fetchGitHubServers,
    importGitHubRepo,
    fetchReadme,
  };
}
