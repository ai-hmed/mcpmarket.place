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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";
import { useServers } from "@/hooks/use-servers";
import SearchFilter from "@/components/search-filter";

export default function DeployServer() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <Suspense
        fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading...</span>
          </div>
        }
      >
        <DeployPageContent />
      </Suspense>
    </div>
  );
}

function DeployPageContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [providers, setProviders] = useState<any[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    servers,
    loading: serversLoading,
    error: serversError,
    categories,
    handleSearch,
    handleFilterChange,
    refreshServers,
  } = useServers();

  // Initialize user and data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setAuthError(null);

        const supabase = createClient();

        // Get user session
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Auth error:", userError);
          setAuthError("Authentication failed. Please sign in again.");
          return;
        }

        if (!user) {
          console.log("No user found, redirecting to sign in");
          router.push("/sign-in");
          return;
        }

        setUser(user);

        // Fetch cloud providers
        try {
          const response = await fetch("/api/cloud-providers");
          if (response.ok) {
            const data = await response.json();
            setProviders(data);
          } else {
            console.warn("Failed to fetch cloud providers, using defaults");
          }
        } catch (error) {
          console.warn("Error fetching providers:", error);
        }

        // Refresh servers data
        await refreshServers();
      } catch (error) {
        console.error("Error initializing data:", error);
        setAuthError("Failed to load data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [router, refreshServers]);

  const handleSelectServer = (serverId: string) => {
    setSelectedServer(serverId);
  };

  const handleContinue = () => {
    if (selectedServer) {
      router.push(`/dashboard/deploy/configure?server=${selectedServer}`);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  // Sort servers based on the selected sort option
  const sortedServers = [...servers].sort((a, b) => {
    if (sortBy === "newest") {
      return 0; // Mock sorting, would use timestamps in real app
    } else if (sortBy === "popular") {
      return b.deployments - a.deployments;
    } else if (sortBy === "az") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Filter servers by category if a specific category is selected
  const filteredServers =
    categoryFilter === "all"
      ? sortedServers
      : sortedServers.filter(
          (server) =>
            server.category.toLowerCase() === categoryFilter.toLowerCase(),
        );

  // Get recent servers (first 3)
  const recentServers = sortedServers.slice(0, 3);

  // Get popular servers (sorted by deployments)
  const popularServers = [...sortedServers]
    .sort((a, b) => b.deployments - a.deployments)
    .slice(0, 3);

  // Show loading state
  if (loading || serversLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading deploy page...</span>
          </div>
        </div>
      </main>
    );
  }

  // Show auth error
  if (authError) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{authError}</p>
            <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
          </div>
        </div>
      </main>
    );
  }

  // Show servers error
  if (serversError) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">
              Error loading servers: {serversError}
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Deploy New Server</h1>
          <p className="text-muted-foreground">
            Configure and deploy your server in just a few steps
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              1
            </div>
            <span className="font-medium">Select Server</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-medium">
              2
            </div>
            <span className="text-muted-foreground">Configure</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-medium">
              3
            </div>
            <span className="text-muted-foreground">Deploy</span>
          </div>
        </div>

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="all">All Servers</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentServers.map((server, index) => (
                <ServerCard
                  key={server.id}
                  server={server}
                  selectedServer={selectedServer}
                  onSelect={handleSelectServer}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularServers.map((server, index) => (
                <ServerCard
                  key={server.id}
                  server={server}
                  selectedServer={selectedServer}
                  onSelect={handleSelectServer}
                  showDeployments={true}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="w-full md:w-auto">
                <SearchFilter
                  onSearch={handleSearch}
                  placeholder="Search servers..."
                  className="w-full md:w-64"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Select
                  defaultValue="all"
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  defaultValue="newest"
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="az">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServers.map((server, index) => (
                <ServerCard
                  key={server.id}
                  server={server}
                  selectedServer={selectedServer}
                  onSelect={handleSelectServer}
                  showDeployments={true}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-500"
            onClick={handleContinue}
            disabled={!selectedServer}
          >
            Continue to Configuration
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}

// Server card component for the deploy page
interface ServerCardProps {
  server: any;
  selectedServer: string | null;
  onSelect: (serverId: string) => void;
  showDeployments?: boolean;
}

function ServerCard({
  server,
  selectedServer,
  onSelect,
  showDeployments = false,
}: ServerCardProps) {
  const isSelected = selectedServer === server.id;

  return (
    <Card
      className={`border hover:shadow-md cursor-pointer transition-all ${
        isSelected ? "border-primary bg-primary/5" : "border-border"
      }`}
      onClick={() => onSelect(server.id)}
    >
      <div className="relative h-40 w-full overflow-hidden bg-muted">
        <img
          src={
            server.imageUrl ||
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80"
          }
          alt={server.title}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded">
          {server.category}
        </div>
        {isSelected && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{server.title}</CardTitle>
          {showDeployments && (
            <div className="text-xs text-muted-foreground">
              {server.deployments?.toLocaleString() || 0} deployments
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{server.description}</p>
      </CardContent>
      <CardFooter>
        <Button
          className={`w-full ${
            isSelected
              ? "bg-primary hover:bg-primary/90"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(server.id);
          }}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
}
