import { Metadata } from "next";
import { createClient } from "../../../supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ServersClientWrapper from "@/components/servers-client-wrapper";

export const metadata: Metadata = {
  title:
    "Browse Servers | MCPMarket - The Marketplace for Model Content Protocol",
  description:
    "Discover and deploy Model Content Protocol servers with one-click deployment",
};

async function getServers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("servers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching servers:", error);
    return [];
  }

  return data || [];
}

export default async function ServersPage() {
  // Fetch servers from the database
  const servers = await getServers();

  // Get all available categories from servers
  const categories = Array.from(
    new Set(servers.map((server) => server.category)),
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-background py-16 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">MCP Servers</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover and deploy Model Content Protocol servers with one-click
            deployment
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Client-side search and filter component */}
        <ServersClientWrapper
          initialServers={servers}
          categories={categories}
        />
      </div>

      <Footer />
    </div>
  );
}
