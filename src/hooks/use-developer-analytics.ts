"use client";

import { useState, useEffect } from "react";

export interface DeveloperAnalytics {
  totalDeployments: number;
  activeDeployments: number;
  averageRating: number;
  reviewCount: number;
  deploymentTrends: { month: string; value: number }[];
  deploymentsByRegion: { region: string; percentage: number }[];
  deploymentsByProvider: { provider: string; percentage: number }[];
  servers: {
    id: string;
    title: string;
    deployments: number;
    created_at: string;
  }[];
}

export function useDeveloperAnalytics() {
  const [analytics, setAnalytics] = useState<DeveloperAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/developer/analytics");

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalytics(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    refreshAnalytics: fetchAnalytics,
  };
}
