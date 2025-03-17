"use client";

import { useState, useEffect } from "react";
import { ServerData } from "./use-servers";

export interface SavedServerData extends ServerData {
  saved_at: string;
}

export function useSavedServers() {
  const [savedServers, setSavedServers] = useState<SavedServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch saved servers
  const fetchSavedServers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/saved-servers");

      if (!response.ok) {
        throw new Error("Failed to fetch saved servers");
      }

      const data = await response.json();
      setSavedServers(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  // Save a server
  const saveServer = async (serverId: string) => {
    try {
      const response = await fetch("/api/saved-servers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ server_id: serverId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save server");
      }

      const data = await response.json();
      setSavedServers((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  };

  // Unsave a server
  const unsaveServer = async (serverId: string) => {
    try {
      const response = await fetch(`/api/saved-servers?server_id=${serverId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to unsave server");
      }

      setSavedServers((prev) =>
        prev.filter((server) => server.id !== serverId),
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  };

  // Check if a server is saved
  const isServerSaved = (serverId: string) => {
    return savedServers.some((server) => server.id === serverId);
  };

  // Initial fetch
  useEffect(() => {
    fetchSavedServers();
  }, []);

  return {
    savedServers,
    loading,
    error,
    refreshSavedServers: fetchSavedServers,
    saveServer,
    unsaveServer,
    isServerSaved,
  };
}
