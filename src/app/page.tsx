"use client";

import NavbarClient from "@/components/navbar-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import Footer from "@/components/footer";
import { AppCard, AnimatedAppIcons } from "./page-client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "../../supabase/client";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [allApps, setAllApps] = useState<any[]>([]);
  const [filteredApps, setFilteredApps] = useState<any[]>([]);

  // Sample app data
  const appData = [
    {
      title: "GitHub MCP Server",
      author: "Model Content Protocol",
      description:
        "MCP Server for the GitHub API, enabling Git operations, repository management, search, and more.",
      rating: 4.5,
      category: "Development",
      type: "Server",
      icon: "github",
      downloads: "1.1k+",
    },
    {
      title: "n8n Workflow Builder",
      author: "Yurii Rashkovskii",
      description:
        "MCP server for programmatically creating and managing n8n workflows with comprehensive API access.",
      rating: 4.7,
      category: "Development",
      type: "Server",
      icon: "n8n",
      downloads: "1.6k+",
    },
    {
      title: "Linear MCP Server",
      author: "Jeremy Hartfield",
      description:
        "A Model Content Protocol server for the Linear API, enabling AI-powered issue tracking and project management.",
      rating: 4.8,
      category: "Development",
      type: "Server",
      icon: "linear",
      downloads: "783+",
    },
    {
      title: "MCP Enterprise",
      author: "Enterprise Team",
      description: "Enterprise-grade MCP server with support.",
      rating: 4.3,
      category: "Server",
      type: "Server",
      icon: "enterprise",
      downloads: "1.2k+",
    },
    {
      title: "Secure Client",
      author: "Privacy Shield",
      description: "Privacy-focused MCP client with encryption.",
      rating: 4.6,
      category: "Client",
      type: "Client",
      icon: "secure",
      downloads: "5k+",
    },
    {
      title: "Node Manager",
      author: "Node Solutions",
      description: "Manage multiple MCP nodes from a single interface.",
      rating: 4.4,
      category: "Utility",
      type: "Utility",
      icon: "node",
      downloads: "6k+",
    },
    {
      title: "MCP Lite",
      author: "Dev Tools Inc",
      description: "Lightweight MCP server for testing and development.",
      rating: 4.2,
      category: "Server",
      type: "Server",
      icon: "lite",
      downloads: "9k+",
    },
    {
      title: "Mobile Client",
      author: "Mobile Solutions",
      description: "Access MCP networks from your mobile device.",
      rating: 4.3,
      category: "Client",
      type: "Client",
      icon: "mobile",
      downloads: "8k+",
    },
  ];

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    checkUser();
    setAllApps(appData);
    setFilteredApps(appData);
  }, []);

  // Filter apps based on activeFilter and searchQuery
  useEffect(() => {
    let filtered = [...allApps];

    // Apply type filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(
        (app) => app.type.toLowerCase() === activeFilter.toLowerCase(),
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.title.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query) ||
          app.author.toLowerCase().includes(query),
      );
    }

    setFilteredApps(filtered);
  }, [activeFilter, searchQuery, allApps]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Get featured apps (first 3)
  const featuredApps = allApps.slice(0, 3);

  // Get trending apps (sorted by downloads, first 4)
  const trendingApps = [...allApps]
    .sort((a, b) => parseFloat(b.downloads) - parseFloat(a.downloads))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <NavbarClient />

      {/* Hero Section with Search */}
      <section className="py-16 border-b border-border bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            <span className="text-primary">MCP</span>Market
            <span className="text-blue-500">.place</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Your premier marketplace for Model Content Protocol servers and
            clients.
          </p>

          <div className="max-w-md mx-auto flex">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search apps..."
                className="pl-10 pr-4 py-2 w-full rounded-l-md border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <Link href="/dashboard/developer/submit">
              <Button className="rounded-l-none bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-md shadow-blue-500/20">
                Submit App
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* App Icons Animation */}
          <AnimatedAppIcons />
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                className={`font-medium hover:bg-muted hover:text-foreground ${activeFilter === "all" ? "text-foreground bg-muted/50" : "text-muted-foreground"}`}
                onClick={() => setActiveFilter("all")}
              >
                All Apps
              </Button>
              <Button
                variant="ghost"
                className={`font-medium hover:bg-muted hover:text-foreground ${activeFilter === "server" ? "text-foreground bg-muted/50" : "text-muted-foreground"}`}
                onClick={() => setActiveFilter("server")}
              >
                Servers
              </Button>
              <Button
                variant="ghost"
                className={`font-medium hover:bg-muted hover:text-foreground ${activeFilter === "client" ? "text-foreground bg-muted/50" : "text-muted-foreground"}`}
                onClick={() => setActiveFilter("client")}
              >
                Clients
              </Button>
              <Button
                variant="ghost"
                className={`font-medium hover:bg-muted hover:text-foreground ${activeFilter === "utility" ? "text-foreground bg-muted/50" : "text-muted-foreground"}`}
                onClick={() => setActiveFilter("utility")}
              >
                Utilities
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Apps Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center">
              <span className="mr-2 h-6 w-1 bg-blue-500 rounded-full"></span>
              Featured Apps
            </h2>
            <Link
              href="/servers"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center"
              aria-label="View all featured apps"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredApps.map((app, index) => (
              <Link
                href={`/dashboard/servers/${app.title.toLowerCase().replace(/\s+/g, "-")}`}
                key={index}
              >
                <AppCard
                  title={app.title}
                  author={app.author}
                  description={app.description}
                  rating={app.rating}
                  category={app.category}
                  icon={app.icon}
                  downloads={app.downloads}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="py-12 bg-gradient-to-r from-blue-50/10 via-muted/50 to-purple-50/10 dark:from-blue-950/10 dark:via-muted/50 dark:to-purple-950/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-red-500 mr-2" />
              <h2 className="text-2xl font-bold text-foreground">
                Trending Now
              </h2>
            </div>
            <Link
              href="/servers?sort=trending"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center"
              aria-label="View all trending apps"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingApps.map((app, index) => (
              <Link
                href={`/dashboard/servers/${app.title.toLowerCase().replace(/\s+/g, "-")}`}
                key={index}
              >
                <AppCard
                  title={app.title}
                  author={app.author}
                  description={app.description}
                  rating={app.rating}
                  category={app.category}
                  icon={app.icon}
                  downloads={app.downloads}
                  compact={true}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Apps Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <span className="mr-2 h-6 w-1 bg-blue-500 rounded-full"></span>
            All Apps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredApps.map((app, index) => (
              <Link
                href={`/dashboard/servers/${app.title.toLowerCase().replace(/\s+/g, "-")}`}
                key={index}
              >
                <AppCard
                  title={app.title}
                  author={app.author}
                  description={app.description}
                  rating={app.rating}
                  category={app.category}
                  icon={app.icon}
                  downloads={app.downloads}
                  compact={true}
                />
              </Link>
            ))}
          </div>

          {filteredApps.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No apps found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setActiveFilter("all");
                  setSearchQuery("");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
