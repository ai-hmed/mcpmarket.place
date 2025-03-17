import { Button } from "@/components/ui/button";
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
  ArrowLeft,
  ArrowUpRight,
  Cloud,
  Code,
  Database,
  Github,
  HardDrive,
  Server,
  Settings,
  Shield,
  Star,
  GitFork,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Badge } from "@/components/ui/badge";

export default async function ServerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch server details from the database
  const serverId = params.id;

  // Try to fetch from the API
  let serverData;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/servers?id=eq.${serverId}`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        serverData = data[0];
      }
    }
  } catch (error) {
    console.error("Error fetching server details:", error);
  }

  // If no data from API, use mock data
  if (!serverData) {
    // Import the useServers hook's mock data
    const { useServers } = await import("@/hooks/use-servers");
    const { getServerById } = useServers();

    // Try to find the server in the mock data
    const mockServer = getServerById(serverId);

    if (mockServer) {
      serverData = mockServer;
    } else {
      // Fallback to default mock data
      serverData = {
        id: serverId,
        title: "Web Server Pro",
        description: "High-performance web server with nginx and PHP support",
        category: "Web",
        deployments: 1245,
        imageUrl:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
        specs: {
          cpu: "4 vCPUs",
          memory: "8 GB RAM",
          storage: "100 GB SSD",
          network: "1 Gbps",
          os: "Ubuntu 22.04 LTS",
        },
        features: [
          "Pre-configured Nginx web server",
          "PHP 8.2 with common extensions",
          "MariaDB database",
          "Let's Encrypt SSL integration",
          "Automatic security updates",
          "Web-based control panel",
        ],
        providers: [
          { name: "AWS", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
          { name: "Azure", regions: ["eastus", "westeurope", "southeastasia"] },
          {
            name: "GCP",
            regions: ["us-central1", "europe-west1", "asia-east1"],
          },
        ],
        author: "TempoLabs",
        githubUrl: "https://github.com/tempolabs/web-server-pro",
        githubStars: 245,
        githubForks: 57,
      };
    }
  }

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
            <h1 className="text-2xl font-bold">Server Details</h1>
          </div>

          {/* Server Hero Section */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="h-64 w-full overflow-hidden bg-gray-800">
              <img
                src={serverData.imageUrl}
                alt={serverData.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 p-6">
              <Badge className="mb-2 bg-blue-600 hover:bg-blue-500">
                {serverData.category}
              </Badge>
              <h1 className="text-3xl font-bold text-white mb-2">
                {serverData.title}
              </h1>
              <p className="text-gray-200 max-w-2xl">
                {serverData.description}
              </p>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-300">
                <Cloud className="h-4 w-4" />
                <span>
                  {serverData.deployments.toLocaleString()} deployments
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Server Info */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="specs">Specifications</TabsTrigger>
                  <TabsTrigger value="docs">Documentation</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Features</CardTitle>
                      <CardDescription>
                        Key capabilities of this server
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {serverData.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-1 rounded-full bg-green-500/20 p-1">
                              <svg
                                className="h-3 w-3 text-green-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Supported Cloud Providers</CardTitle>
                      <CardDescription>
                        Deploy this server to any of these providers
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {serverData.providers.map((provider, index) => (
                          <Card key={index} className="border border-border">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                {provider.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-sm">
                                <p className="text-muted-foreground mb-1">
                                  Available regions:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {provider.regions.map((region, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {region}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Specs Tab */}
                <TabsContent value="specs" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Technical Specifications</CardTitle>
                      <CardDescription>
                        Detailed hardware and software specifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <HardDrive className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">CPU</p>
                              <p className="text-sm text-muted-foreground">
                                {serverData.specs.cpu}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Database className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">Memory</p>
                              <p className="text-sm text-muted-foreground">
                                {serverData.specs.memory}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Server className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">Storage</p>
                              <p className="text-sm text-muted-foreground">
                                {serverData.specs.storage}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Cloud className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">Network</p>
                              <p className="text-sm text-muted-foreground">
                                {serverData.specs.network}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">Operating System</p>
                              <p className="text-sm text-muted-foreground">
                                {serverData.specs.os}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Code className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">Software Stack</p>
                              <p className="text-sm text-muted-foreground">
                                Nginx, PHP 8.2, MariaDB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Benchmarks</CardTitle>
                      <CardDescription>
                        Measured performance metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              HTTP Request Handling
                            </span>
                            <span className="text-sm text-muted-foreground">
                              10,000 req/sec
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: "85%" }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              Database Transactions
                            </span>
                            <span className="text-sm text-muted-foreground">
                              5,000 tx/sec
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: "70%" }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              File System I/O
                            </span>
                            <span className="text-sm text-muted-foreground">
                              500 MB/s
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: "90%" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Documentation Tab */}
                <TabsContent value="docs" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Getting Started</CardTitle>
                      <CardDescription>
                        Quick start guide for this server
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                      <h3>Deploying Your {serverData.title}</h3>
                      <p>
                        This guide will help you deploy and configure your{" "}
                        {serverData.title}
                        instance on your preferred cloud provider.
                      </p>

                      <h4>Step 1: Choose a Cloud Provider</h4>
                      <p>
                        Select from AWS, Azure, or GCP based on your
                        requirements and regional preferences. Each provider
                        offers different pricing and performance
                        characteristics.
                      </p>

                      <h4>Step 2: Configure Server Options</h4>
                      <p>
                        Select your desired configuration options including CPU,
                        memory, and storage. The default configuration is
                        optimized for most web applications.
                      </p>

                      <h4>Step 3: Deploy</h4>
                      <p>
                        Click the "Deploy Now" button and wait for the
                        deployment to complete. This typically takes 3-5 minutes
                        depending on the provider.
                      </p>

                      <h4>Step 4: Access Your Server</h4>
                      <p>
                        Once deployment is complete, you'll receive access
                        credentials and connection details. Use these to log in
                        to your server's control panel.
                      </p>

                      {serverData.githubUrl && (
                        <div className="mt-6 p-4 bg-secondary/30 rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <Github className="h-5 w-5 text-blue-500" />
                            <h4 className="m-0">GitHub Repository</h4>
                          </div>
                          <p className="mb-2">
                            This server is based on a GitHub repository. You can
                            view the source code, contribute, or fork the
                            repository to make your own version.
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <a
                              href={serverData.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-500 hover:underline"
                            >
                              <Github className="h-4 w-4" />
                              View Repository
                            </a>
                            {serverData.githubStars && (
                              <span className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                {serverData.githubStars.toLocaleString()}
                              </span>
                            )}
                            {serverData.githubForks && (
                              <span className="flex items-center gap-1">
                                <GitFork className="h-4 w-4 text-blue-500" />
                                {serverData.githubForks.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Deployment Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deploy This Server</CardTitle>
                  <CardDescription>
                    One-click deployment to your preferred cloud
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Select Provider
                    </label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="aws">AWS</option>
                      <option value="azure">Azure</option>
                      <option value="gcp">Google Cloud</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Region</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="us-east-1">US East (N. Virginia)</option>
                      <option value="us-west-2">US West (Oregon)</option>
                      <option value="eu-west-1">EU (Ireland)</option>
                      <option value="ap-southeast-1">
                        Asia Pacific (Singapore)
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Server Name</label>
                    <input
                      type="text"
                      placeholder="my-web-server"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-medium mb-2">Estimated Cost</p>
                    <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
                      <span className="text-sm">$20.00 / month</span>
                      <span className="text-xs text-muted-foreground">
                        ~$0.028 / hour
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-500">
                    Deploy Now
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full">
                    Save for Later
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 text-blue-500 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        Check our{" "}
                        <a href="#" className="text-blue-500 hover:underline">
                          documentation
                        </a>{" "}
                        for detailed setup instructions.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 text-blue-500 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        Contact{" "}
                        <a href="#" className="text-blue-500 hover:underline">
                          support@mcpide.com
                        </a>{" "}
                        for assistance.
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
