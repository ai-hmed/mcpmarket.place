"use client";

import { Suspense } from "react";
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
import { CheckCircle, ArrowRight, Server, Terminal } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DeploymentSuccess() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <Suspense fallback={
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center gap-4 max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <h1 className="text-2xl font-bold">Loading deployment details...</h1>
          </div>
        </main>
      }>
        <DeploymentSuccessContent />
      </Suspense>
    </div>
  );
}

function DeploymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deploymentId = searchParams.get("id");

  const [deployment, setDeployment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeployment = async () => {
      if (!deploymentId) {
        setError("No deployment ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/deployments/${deploymentId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch deployment details");
        }

        const data = await response.json();
        setDeployment(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchDeployment();
  }, [deploymentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center gap-4 max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <h1 className="text-2xl font-bold">
              Loading deployment details...
            </h1>
          </div>
        </main>
      </div>
    );
  }

  if (error || !deployment) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center gap-4 max-w-md mx-auto text-center">
            <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Error Loading Deployment</h1>
            <p className="text-muted-foreground">
              {error || "Failed to load deployment details"}
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="rounded-full h-16 w-16 bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">Deployment Successful!</h1>
            <p className="text-muted-foreground max-w-md">
              Your server has been successfully deployed and is now being
              provisioned. It will be ready in a few minutes.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Deployment Details</CardTitle>
              <CardDescription>
                Information about your deployed server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Server Name
                  </h3>
                  <p className="font-medium">{deployment.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Status
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    <p className="font-medium">
                      {deployment.status === "active"
                        ? "Running"
                        : "Provisioning"}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Provider
                  </h3>
                  <p className="font-medium">{deployment.provider}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Region
                  </h3>
                  <p className="font-medium">{deployment.region}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    IP Address
                  </h3>
                  <p className="font-medium">
                    {deployment.ip_address || "Assigning..."}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Deployed On
                  </h3>
                  <p className="font-medium">
                    {new Date(deployment.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="rounded-md bg-muted p-4 mt-4">
                <div className="flex items-start gap-2">
                  <Terminal className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Connection Information</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Use the following command to connect to your server:
                    </p>
                    <div className="bg-background p-2 rounded font-mono text-sm overflow-x-auto">
                      ssh admin@{deployment.ip_address || "192.168.x.x"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-500" asChild>
                <Link href={`/dashboard/servers/${deployment.server_id}`}>
                  Manage Server
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Next Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <Server className="h-5 w-5 text-blue-500 mb-2" />
                  <CardTitle className="text-lg">Configure Server</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Set up your server with custom configurations and
                    applications.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="w-full text-blue-500 hover:text-blue-600 hover:bg-blue-50/10"
                  >
                    View Documentation
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <svg
                    className="h-5 w-5 text-blue-500 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <CardTitle className="text-lg">Secure Your Server</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Follow best practices to secure your server and data.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="w-full text-blue-500 hover:text-blue-600 hover:bg-blue-50/10"
                  >
                    Security Guide
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <svg
                    className="h-5 w-5 text-blue-500 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                  <CardTitle className="text-lg">Deploy Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Deploy your applications to your new server environment.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="w-full text-blue-500 hover:text-blue-600 hover:bg-blue-50/10"
                  >
                    Deployment Guide
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
}
