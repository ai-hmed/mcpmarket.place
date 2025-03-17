"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, Github, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

interface GitHubImportProps {
  onImportSuccess?: (server: any) => void;
}

export default function GitHubImport({ onImportSuccess }: GitHubImportProps) {
  const [open, setOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    // Reset states
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Parse GitHub URL
      let url;
      try {
        url = new URL(repoUrl);
      } catch (e) {
        throw new Error("Please enter a valid URL");
      }

      if (url.hostname !== "github.com") {
        throw new Error("Please enter a valid GitHub repository URL");
      }

      // Extract owner and repo from URL
      const pathParts = url.pathname.split("/").filter(Boolean);
      if (pathParts.length < 2) {
        throw new Error("Invalid GitHub repository URL format");
      }

      const owner = pathParts[0];
      const repo = pathParts[1];

      console.log(`Importing GitHub repo: ${owner}/${repo}`);

      // Call the import API
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

      setSuccess(true);
      toast({
        title: "Success",
        description: "Repository imported successfully!",
      });

      // Call the success callback if provided
      if (onImportSuccess) {
        onImportSuccess(data.server);
      }

      // Close the dialog after a short delay
      setTimeout(() => {
        setOpen(false);
        setRepoUrl("");
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("GitHub import error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Github className="h-4 w-4" />
          Import from GitHub
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import GitHub Repository</DialogTitle>
          <DialogDescription>
            Import an existing mCP server from GitHub to deploy it on your
            account.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-500/20 text-green-700 dark:text-green-300">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Repository imported successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="repoUrl" className="col-span-4">
              GitHub Repository URL
            </Label>
            <Input
              id="repoUrl"
              placeholder="https://github.com/username/repo"
              className="col-span-4"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleImport}
            disabled={!repoUrl || loading}
            className="gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Importing..." : "Import Repository"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
