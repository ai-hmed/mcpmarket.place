"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import GitHubImport from "@/components/github-import";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  Cloud,
  InfoIcon,
  Plus,
  Server,
  Settings,
  UserCircle,
  Code,
  Loader2,
  Github,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ServerGrid from "@/components/server-grid";
import SearchFilter from "@/components/search-filter";
import { useEffect, useState } from "react";
import { createClient } from "../../../supabase/client";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeServers, setActiveServers] = useState<any[]>([]);
  const [deploymentHistory, setDeploymentHistory] = useState<any[]>([]);
  const [savedServers, setSavedServers] = useState<any[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();

        // First refresh the session
        const { error: sessionError } = await supabase.auth.refreshSession();
        if (sessionError) {
          console.error("Session refresh error:", sessionError);
        }

        // Then get the user
        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
          console.error("Auth error:", error);
          router.push("/sign-in");
          return;
        }

        console.log("User authenticated:", data.user.id);
        setUser(data.user);

        // Fetch active deployments
        try {
          const deploymentsResponse = await fetch(
            "/api/deployments?status=active",
            {
              headers: {
                "Cache-Control": "no-cache",
              },
            },
          );
          if (deploymentsResponse.ok) {
            const deploymentsData = await deploymentsResponse.json();
            setActiveServers(
              deploymentsData.map((deployment: any) => ({
                id: deployment.server_id,
                title: deployment.servers?.title || deployment.name,
                description: deployment.servers?.description || "",
                provider: deployment.provider,
                region: deployment.region,
                ipAddress: deployment.ip_address || "192.168.1.1",
                uptime: "99.9%", // Mock data
                deployed: new Date(deployment.created_at).toLocaleDateString(),
                status: "Healthy",
                deploymentId: deployment.id,
              })),
            );
          } else {
            console.error(
              "Failed to fetch deployments:",
              await deploymentsResponse.text(),
            );
          }

          // Fetch deployment history
          const historyResponse = await fetch("/api/deployments", {
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            setDeploymentHistory(historyData);
          } else {
            console.error(
              "Failed to fetch deployment history:",
              await historyResponse.text(),
            );
          }

          // Fetch saved servers
          const savedResponse = await fetch("/api/saved-servers", {
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          if (savedResponse.ok) {
            const savedData = await savedResponse.json();
            setSavedServers(savedData);
          } else {
            console.error(
              "Failed to fetch saved servers:",
              await savedResponse.text(),
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleNewServer = () => {
    // Since we're already on a protected route and middleware checks auth,
    // we can directly navigate without additional auth checks
    router.push("/dashboard/deploy");
  };

  const handleBrowseCatalog = () => {
    router.push("/dashboard/deploy");
  };

  const handleDeveloperPortal = () => {
    router.push("/dashboard/developer");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <div className="flex gap-2">
                <SearchFilter
                  onSearch={(query) => console.log("Search:", query)}
                  placeholder="Search servers..."
                  className="w-full sm:w-64"
                />
                <GitHubImport
                  onImportSuccess={() => {
                    // Refresh the servers list after successful import
                    window.location.reload();
                  }}
                />
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleNewServer}
                >
                  <Plus className="mr-2 h-4 w-4" /> New Server
                </Button>
              </div>
            </div>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                Welcome to your dashboard. Deploy and manage your mCP servers
                from here.
              </span>
            </div>
          </header>

          {/* Main Dashboard Content */}
          <Tabs defaultValue="servers" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="servers">My Servers</TabsTrigger>
              <TabsTrigger value="deployments">Deployment History</TabsTrigger>
              <TabsTrigger value="saved">Saved Servers</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Servers Tab */}
            <TabsContent value="servers" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Active Servers */}
                {activeServers.map((server, index) => (
                  <Card
                    key={index}
                    className="border border-border bg-card hover:shadow-md transition-all"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">
                          {server.title}
                        </CardTitle>
                        <div className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-500">
                          Active
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <Cloud className="h-3 w-3" />
                        <span>
                          {server.provider} {server.region}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        <p>{server.description}</p>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">
                              IP Address
                            </span>
                            <span>{server.ipAddress}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">
                              Uptime
                            </span>
                            <span>{server.uptime}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">
                              Deployed
                            </span>
                            <span>{server.deployed}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">
                              Status
                            </span>
                            <span className="text-green-500">
                              {server.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-3 w-3" /> Manage
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-500"
                        onClick={() =>
                          router.push(`/dashboard/servers/${server.id}`)
                        }
                      >
                        Open Dashboard
                        <ArrowUpRight className="ml-2 h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

                {/* Add New Server Card */}
                <Card
                  className="border border-dashed border-border bg-card/50 hover:bg-card/80 transition-all cursor-pointer flex flex-col items-center justify-center py-12"
                  onClick={handleBrowseCatalog}
                >
                  <Server className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Deploy New Server
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-[200px] mb-4">
                    Choose from our catalog of pre-configured servers
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-500">
                    Browse Catalog
                  </Button>
                </Card>

                <Card
                  className="border border-dashed border-border bg-card/50 hover:bg-card/80 transition-all cursor-pointer flex flex-col items-center justify-center py-12"
                  onClick={() => router.push("/dashboard/github")}
                >
                  <Github className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    GitHub Integration
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-[200px] mb-4">
                    Browse and import mCP servers directly from GitHub
                    repositories
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-500">
                    Browse GitHub
                  </Button>
                </Card>

                <Card
                  className="border border-dashed border-border bg-card/50 hover:bg-card/80 transition-all cursor-pointer flex flex-col items-center justify-center py-12"
                  onClick={handleDeveloperPortal}
                >
                  <Code className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Developer Portal</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-[200px] mb-4">
                    Create and publish your own mCP server templates
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-500">
                    Go to Portal
                  </Button>
                </Card>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Server Catalog</h2>
                <ServerGrid limit={4} showSearch={false} />
              </div>
            </TabsContent>

            {/* Deployments Tab */}
            <TabsContent value="deployments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deployment History</CardTitle>
                  <CardDescription>
                    View all your past server deployments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deploymentHistory.length > 0 ? (
                      deploymentHistory.map((deployment, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() =>
                            router.push(
                              `/dashboard/servers/${deployment.name.toLowerCase().replace(/\s+/g, "-")}`,
                            )
                          }
                        >
                          <div className="flex items-center gap-4">
                            <Server className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium">{deployment.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  deployment.created_at,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm">{deployment.provider}</div>
                            <div
                              className={`px-2 py-1 text-xs rounded-full ${deployment.status === "active" ? "bg-green-500/20 text-green-500" : deployment.status === "pending" ? "bg-yellow-500/20 text-yellow-500" : "bg-red-500/20 text-red-500"}`}
                            >
                              {deployment.status === "active"
                                ? "Success"
                                : deployment.status === "pending"
                                  ? "Pending"
                                  : "Failed"}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No deployment history found.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Saved Servers Tab */}
            <TabsContent value="saved" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Servers</CardTitle>
                  <CardDescription>
                    Servers you've saved for later deployment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedServers.length > 0 ? (
                      savedServers.map((server, i) => (
                        <Card
                          key={i}
                          className="border border-border hover:shadow-md transition-all cursor-pointer"
                          onClick={() =>
                            router.push(`/dashboard/servers/${server.id}`)
                          }
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              {server.title}
                            </CardTitle>
                            <CardDescription>{server.category}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{server.description}</p>
                          </CardContent>
                          <CardFooter>
                            <Button
                              className="w-full bg-blue-600 hover:bg-blue-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/dashboard/deploy/configure?server=${server.id}`,
                                );
                              }}
                            >
                              Deploy Now
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No saved servers found.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => router.push("/dashboard/deploy")}
                        >
                          Browse Servers
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>
                    Your account information and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <UserCircle size={64} className="text-primary" />
                    <div>
                      <h2 className="font-semibold text-xl">{user?.email}</h2>
                      <p className="text-sm text-muted-foreground">
                        Member since {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 overflow-hidden">
                    <pre className="text-xs font-mono max-h-48 overflow-auto">
                      {JSON.stringify(user, null, 2)}
                    </pre>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
