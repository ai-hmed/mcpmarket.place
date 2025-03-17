"use client";

import { useState, useEffect } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Github,
  Loader2,
  Search,
  Star,
  GitFork,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGitHubServers } from "@/hooks/use-github-servers";

export default function GitHubServersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { servers, loading, error, fetchGitHubServers, importGitHubRepo } =
    useGitHubServers();
  const [importingId, setImportingId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGitHubServers(
      searchQuery ? `${searchQuery} topic:mcp-server` : undefined,
    );
  };

  const handleImport = async (owner: string, repo: string, id: string) => {
    try {
      setImportingId(id);
      await importGitHubRepo(owner, repo);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error importing repository:", error);
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header with back button */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold">GitHub Servers</h1>
          </div>

          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle>Search GitHub Repositories</CardTitle>
              <CardDescription>
                Find mCP servers on GitHub to import and deploy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search for repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && !servers.length ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="col-span-full bg-red-500/10 text-red-500 p-4 rounded-md">
                {error}
              </div>
            ) : servers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Github className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  No repositories found
                </h2>
                <p className="text-muted-foreground">
                  Try searching for repositories with the mcp-server topic or
                  other relevant keywords.
                </p>
              </div>
            ) : (
              servers.map((server) => {
                // Extract owner and repo from GitHub URL
                const githubUrl = server.githubUrl || "";
                const urlParts = githubUrl.split("/");
                const owner = urlParts[urlParts.length - 2];
                const repo = urlParts[urlParts.length - 1];

                return (
                  <Card key={server.id} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg truncate">
                          {server.title}
                        </CardTitle>
                        <Badge>{server.category}</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {server.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="aspect-video rounded-md overflow-hidden bg-muted mb-4">
                        <img
                          src={server.imageUrl}
                          alt={server.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>
                            {server.githubStars?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="h-4 w-4" />
                          <span>
                            {server.githubForks?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Github className="h-4 w-4" />
                          <span>{server.author}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-0">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.open(server.githubUrl, "_blank")}
                      >
                        <Github className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-500"
                        onClick={() => handleImport(owner, repo, server.id)}
                        disabled={importingId === server.id}
                      >
                        {importingId === server.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Import
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
