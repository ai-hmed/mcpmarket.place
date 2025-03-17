import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "../../../supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, Server, Cloud, Database, FileText, Code } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources | MCPMarket - The Marketplace for Model Content Protocol",
  description: "Explore comprehensive guides, tutorials, and resources about Model Content Protocol servers and deployment strategies",
};

async function getSeoPages() {
  const supabase = await createClient();
  
  const { data: pages, error } = await supabase
    .from('seo_pages')
    .select('*')
    .eq('published', true)
    .order('view_count', { ascending: false });

  if (error) {
    console.error("Error fetching SEO pages:", error);
    return [];
  }

  return pages || [];
}

async function getPopularKeywords() {
  const supabase = await createClient();
  
  const { data: keywords, error } = await supabase
    .from('seo_keywords')
    .select('*')
    .order('search_volume', { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching popular keywords:", error);
    return [];
  }

  return keywords || [];
}

export default async function ResourcesPage() {
  // For now, use mock data until the database is populated
  // const seoPages = await getSeoPages();
  // const popularKeywords = await getPopularKeywords();
  
  // Mock data for development
  const resourceCategories = [
    {
      title: 'Server Deployment',
      slug: 'server-deployment',
      description: 'Learn how to deploy and manage MCP servers across different cloud providers.',
      icon: <Server className="h-8 w-8 text-blue-500" />,
      resources: [
        { title: 'Server Deployment Guide', slug: 'server-deployment-guide' },
        { title: 'Multi-Cloud Deployment', slug: 'multi-cloud-deployment' },
        { title: 'Deployment Automation', slug: 'deployment-automation' },
        { title: 'Deployment Best Practices', slug: 'deployment-best-practices' }
      ]
    },
    {
      title: 'Performance Optimization',
      slug: 'performance-optimization',
      description: 'Optimize your MCP servers for maximum performance and efficiency.',
      icon: <Cloud className="h-8 w-8 text-purple-500" />,
      resources: [
        { title: 'Performance Tuning Guide', slug: 'performance-tuning-guide' },
        { title: 'Scaling Strategies', slug: 'scaling-strategies' },
        { title: 'Load Balancing', slug: 'load-balancing' },
        { title: 'Caching Techniques', slug: 'caching-techniques' }
      ]
    },
    {
      title: 'Database Integration',
      slug: 'database-integration',
      description: 'Connect your MCP servers to various database systems for data persistence.',
      icon: <Database className="h-8 w-8 text-green-500" />,
      resources: [
        { title: 'Database Connection Guide', slug: 'database-connection-guide' },
        { title: 'SQL vs NoSQL for MCP', slug: 'sql-vs-nosql-for-mcp' },
        { title: 'Data Modeling Best Practices', slug: 'data-modeling-best-practices' },
        { title: 'Database Performance Optimization', slug: 'database-performance-optimization' }
      ]
    },
    {
      title: 'Security',
      slug: 'security',
      description: 'Secure your MCP servers and protect your data with industry best practices.',
      icon: <FileText className="h-8 w-8 text-red-500" />,
      resources: [
        { title: 'Security Best Practices', slug: 'security-best-practices' },
        { title: 'Authentication & Authorization', slug: 'authentication-and-authorization' },
        { title: 'Encryption Guide', slug: 'encryption-guide' },
        { title: 'Security Compliance', slug: 'security-compliance' }
      ]
    },
    {
      title: 'API Development',
      slug: 'api-development',
      description: 'Design and implement robust APIs for your MCP servers.',
      icon: <Code className="h-8 w-8 text-yellow-500" />,
      resources: [
        { title: 'API Design Guide', slug: 'api-design-guide' },
        { title: 'RESTful API Best Practices', slug: 'restful-api-best-practices' },
        { title: 'GraphQL Integration', slug: 'graphql-integration' },
        { title: 'API Documentation', slug: 'api-documentation' }
      ]
    }
  ];
  
  const popularKeywords = [
    { keyword: 'mcp server deployment', search_volume: 1245 },
    { keyword: 'model content protocol tutorial', search_volume: 987 },
    { keyword: 'mcp performance optimization', search_volume: 876 },
    { keyword: 'mcp security', search_volume: 765 },
    { keyword: 'mcp api development', search_volume: 654 },
    { keyword: 'mcp database integration', search_volume: 543 },
    { keyword: 'mcp scaling', search_volume: 432 },
    { keyword: 'mcp load balancing', search_volume: 321 },
    { keyword: 'mcp authentication', search_volume: 210 },
    { keyword: 'mcp best practices', search_volume: 198 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-background py-16 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">MCP Resources</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Comprehensive guides, tutorials, and resources for Model Content Protocol servers and deployment
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search resources..." 
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-12">
        {/* Popular Keywords */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Popular Topics</h2>
