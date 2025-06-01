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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Check,
  Cloud,
  CreditCard,
  HardDrive,
  Server,
  Settings,
  Shield,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";
import { useServers, ServerData } from "@/hooks/use-servers";
import SearchFilter from "@/components/search-filter";

export default function DeployServer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const {
    servers,
    loading: serversLoading,
    error,
    categories,
    handleSearch,
    handleFilterChange,
    refreshServers,
  } = useServers();

  // Fetch cloud providers
  const [providers, setProviders] = useState<any[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  // Function to fetch providers
  const fetchProviders = async () => {
    try {
      setLoadingProviders(true);
      const response = await fetch("/api/cloud-providers");
      if (response.ok) {
        const data = await response.json();
        setProviders(data);
      }
      setLoadingProviders(false);
    } catch (error) {
      console.error("Error fetching providers:", error);
      setLoadingProviders(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // First refresh the session
        await supabase.auth.refreshSession();

        // Then get the user
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Auth error in deploy page:", error);
          return;
        }

        if (!data.user) {
          console.log("No user found in deploy page");
          return;
        }

        console.log("User authenticated in deploy page:", data.user.id);
        setUser(data.user);
      } catch (error) {
        console.error("Authentication error in deploy page:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data regardless of auth state - middleware will handle redirects if needed
    const loadData = async () => {
      try {
        await checkUser();
        await fetchProviders();
        await refreshServers();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [refreshServers]);

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

  // Add a useEffect to handle the case when user data is loaded after initial render
  useEffect(() => {
    if (user && !loading) {
      fetchProviders();
      refreshServers();
    }
  }, [user, loading]);

  if (loading || serversLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

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
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const {
    servers,
    loading: serversLoading,
    error,
    categories,
    handleSearch,
    handleFilterChange,
    refreshServers,
  } = useServers();

  // Fetch cloud providers
  const [providers, setProviders] = useState<any[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  // Function to fetch providers
  const fetchProviders = async () => {
    try {
      setLoadingProviders(true);
      const response = await fetch("/api/cloud-providers");
      if (response.ok) {
        const data = await response.json();
        setProviders(data);
      }
      setLoadingProviders(false);
    } catch (error) {
      console.error("Error fetching providers:", error);
      setLoadingProviders(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // First refresh the session
        await supabase.auth.refreshSession();

        // Then get the user
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Auth error in deploy page:", error);
          return;
        }

        if (!data.user) {
          console.log("No user found in deploy page");
          return;
        }

        console.log("User authenticated in deploy page:", data.user.id);
        setUser(data.user);
      } catch (error) {
        console.error("Authentication error in deploy page:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data regardless of auth state - middleware will handle redirects if needed
    const loadData = async () => {
      try {
        await checkUser();
        await fetchProviders();
        await refreshServers();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [refreshServers]);

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

  // Add a useEffect to handle the case when user data is loaded after initial render
  useEffect(() => {
    if (user && !loading) {
      fetchProviders();
      refreshServers();
    }
  }, [user, loading]);

  if (loading || serversLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
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
                <Card
                  key={index}
                  className={`border hover:shadow-md cursor-pointer transition-all ${selectedServer === server.id ? "border-primary bg-primary/5" : "border-border"}`}
                  onClick={() => handleSelectServer(server.id)}
                >
                  <div className="relative h-40 w-full overflow-hidden bg-muted">
                    <img
                      src={server.imageUrl}
                      alt={server.title}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                      {server.category}
                    </div>
                    {selectedServer === server.id && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{server.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {server.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${selectedServer === server.id ? "bg-primary hover:bg-primary/90" : "bg-blue-600 hover:bg-blue-500"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectServer(server.id);
                      }}
                    >
                      {selectedServer === server.id ? "Selected" : "Select"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularServers.map((server, index) => (
                <Card
                  key={index}
                  className={`border hover:shadow-md cursor-pointer transition-all ${selectedServer === server.id ? "border-primary bg-primary/5" : "border-border"}`}
                  onClick={() => handleSelectServer(server.id)}
                >
                  <div className="relative h-40 w-full overflow-hidden bg-muted">
                    <img
                      src={server.imageUrl}
                      alt={server.title}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                      {server.category}
                    </div>
                    {selectedServer === server.id && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{server.title}</CardTitle>
                      <div className="text-xs text-muted-foreground">
                        {server.deployments.toLocaleString()} deployments
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {server.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${selectedServer === server.id ? "bg-primary hover:bg-primary/90" : "bg-blue-600 hover:bg-blue-500"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectServer(server.id);
                      }}
                    >
                      {selectedServer === server.id ? "Selected" : "Select"}
                    </Button>
                  </CardFooter>
                </Card>
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
                <Card
                  key={index}
                  className={`border hover:shadow-md cursor-pointer transition-all ${selectedServer === server.id ? "border-primary bg-primary/5" : "border-border"}`}
                  onClick={() => handleSelectServer(server.id)}
                >
                  <div className="relative h-40 w-full overflow-hidden bg-muted">
                    <img
                      src={server.imageUrl}
                      alt={server.title}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                      {server.category}
                    </div>
                    {selectedServer === server.id && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{server.title}</CardTitle>
                      <div className="text-xs text-muted-foreground">
                        {server.deployments.toLocaleString()} deployments
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {server.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${selectedServer === server.id ? "bg-primary hover:bg-primary/90" : "bg-blue-600 hover:bg-blue-500"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectServer(server.id);
                      }}
                    >
                      {selectedServer === server.id ? "Selected" : "Select"}
                    </Button>
                  </CardFooter>
                </Card>
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
