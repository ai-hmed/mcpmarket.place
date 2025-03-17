"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";

export interface DeploymentData {
  id: string;
  server_id: string;
  name: string;
  provider: string;
  region: string;
  status: string;
  ip_address?: string;
  resources?: {
    cpu: number;
    memory: number;
    storage: number;
  };
  configuration?: any;
  cost?: number;
  created_at: string;
  updated_at: string;
  servers?: {
    title: string;
    description: string;
    category: string;
    image_url?: string;
  };
}

export function useDeployments() {
  const [deployments, setDeployments] = useState<DeploymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch deployments
  const fetchDeployments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/deployments");

      if (!response.ok) {
        throw new Error("Failed to fetch deployments");
      }

      const data = await response.json();
      setDeployments(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  // Create a new deployment
  const createDeployment = async (
    deploymentData: Omit<
      DeploymentData,
      "id" | "created_at" | "updated_at" | "status" | "ip_address"
    >,
  ) => {
    try {
      const response = await fetch("/api/deployments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deploymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create deployment");
      }

      const data = await response.json();
      setDeployments((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  };

  // Get a deployment by ID
  const getDeploymentById = async (id: string) => {
    try {
      const response = await fetch(`/api/deployments/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch deployment");
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  };

  // Delete a deployment
  const deleteDeployment = async (id: string) => {
    try {
      const response = await fetch(`/api/deployments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete deployment");
      }

      setDeployments((prev) =>
        prev.filter((deployment) => deployment.id !== id),
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDeployments();
  }, []);

  return {
    deployments,
    loading,
    error,
    refreshDeployments: fetchDeployments,
    createDeployment,
    getDeploymentById,
    deleteDeployment,
  };
}
