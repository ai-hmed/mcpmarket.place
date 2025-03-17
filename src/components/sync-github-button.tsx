"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SyncGitHubButtonProps {
  serverId: string;
  hasGitHub: boolean;
  onSyncComplete?: () => void;
}

export default function SyncGitHubButton({
  serverId,
  hasGitHub,
  onSyncComplete,
}: SyncGitHubButtonProps) {
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    if (!hasGitHub) {
      toast({
        title: "No GitHub repository",
        description: "This server is not linked to a GitHub repository.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSyncing(true);

      const response = await fetch("/api/servers/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serverId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to sync with GitHub");
      }

      const data = await response.json();

      toast({
        title: "Sync successful",
        description: "Server data has been updated from GitHub.",
      });

      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error: any) {
      toast({
        title: "Sync failed",
        description:
          error.message || "An error occurred while syncing with GitHub.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  if (!hasGitHub) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleSync}
      disabled={syncing}
    >
      {syncing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
      {syncing ? "Syncing..." : "Sync with GitHub"}
    </Button>
  );
}
