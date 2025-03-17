import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ExternalLink,
  FileText,
  Server,
  Cloud,
  Database,
} from "lucide-react";

type Props = {
  params: { topic: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch the SEO page to generate metadata
  const seoPage = await getSeoPage(params.topic);

  if (!seoPage) {
    return {
      title: "Resource Not Found | MCPMarket",
      description: "The requested resource could not be found.",
    };
  }

  return {
    title: seoPage.meta_title || seoPage.title,
    description:
      seoPage.meta_description || `Learn about ${seoPage.title} on MCPMarket.`,
    keywords: seoPage.keywords?.join(", "),
  };
}

async function getSeoPage(slug: string) {
  const supabase = await createClient();

  const { data: page, error } = await supabase
    .from("seo_pages")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) {
    console.error("Error fetching SEO page:", error);
    return null;
  }

  return page;
}

async function getRelatedBlogPosts(keywords: string[]) {
  const supabase = await createClient();

  // This is a simplified query - in a real implementation, you would use full-text search
  // or a more sophisticated matching algorithm
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, featured_image")
    .eq("published", true)
    .limit(3);

  if (error) {
    console.error("Error fetching related blog posts:", error);
    return [];
  }

  return posts || [];
}

export default async function ResourcePage({ params }: Props) {
  // For now, use mock data until the database is populated
  // const seoPage = await getSeoPage(params.topic);
  //
  // if (!seoPage) {
  //   notFound();
  // }
  //
  // const relatedPosts = await getRelatedBlogPosts(seoPage.keywords || []);

  // Mock data for development
  const topicFormatted = params.topic
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const seoPage = {
    id: "1",
    title: `${topicFormatted} for Model Content Protocol`,
    slug: params.topic,
    content: {
      introduction: `${topicFormatted} is a critical aspect of Model Content Protocol (MCP) that enables developers to build more efficient and scalable applications. This comprehensive guide covers everything you need to know about ${topicFormatted.toLowerCase()} in the context of MCP.`,
      sections: [
        {
          title: `What is ${topicFormatted}?`,
          content: `${topicFormatted} refers to the process of optimizing how MCP servers handle data and requests. It's essential for ensuring high performance and reliability in production environments.`,
        },
        {
          title: `Benefits of ${topicFormatted}`,
          content: `Implementing proper ${topicFormatted.toLowerCase()} techniques offers numerous advantages:
          
          - Improved response times
          - Reduced server load
          - Better resource utilization
          - Enhanced user experience
          - Lower operational costs`,
        },
        {
          title: `${topicFormatted} Best Practices`,
          content: `Follow these industry-standard best practices for ${topicFormatted.toLowerCase()}:
          
          1. Regularly monitor performance metrics
          2. Implement caching strategies
          3. Optimize database queries
          4. Use load balancing for high-traffic scenarios
          5. Configure proper timeout and retry mechanisms`,
        },
        {
          title: `${topicFormatted} Tools and Resources`,
          content: `Several tools can help you implement effective ${topicFormatted.toLowerCase()}:
          
          - MCPMarket's monitoring dashboard
          - Performance analysis utilities
          - Load testing frameworks
          - Documentation and community resources`,
        },
      ],
      conclusion: `${topicFormatted} is an essential consideration for any MCP deployment. By following the guidelines and best practices outlined in this resource, you can ensure your MCP servers operate at peak efficiency and deliver the best possible experience to your users.`,
    },
    meta_title: `${topicFormatted} Guide for Model Content Protocol | MCPMarket`,
    meta_description: `Learn everything about ${topicFormatted.toLowerCase()} for Model Content Protocol (MCP). Best practices, tools, and implementation strategies.`,
    keywords: [
      params.topic,
      "mcp",
      "model content protocol",
      "guide",
      "best practices",
    ],
    schema_markup: {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: `${topicFormatted} for Model Content Protocol`,
      description: `Learn everything about ${topicFormatted.toLowerCase()} for Model Content Protocol (MCP). Best practices, tools, and implementation strategies.`,
      keywords: [
        params.topic,
        "mcp",
        "model content protocol",
        "guide",
        "best practices",
      ],
      publisher: {
        "@type": "Organization",
        name: "MCPMarket",
        logo: {
          "@type": "ImageObject",
          url: "https://mcpmarket.place/logo.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://mcpmarket.place/resources/${params.topic}`,
      },
    },
  };

  const relatedPosts = [
    {
      id: "1",
      title: `${topicFormatted} Strategies for MCP Servers`,
      slug: `${params.topic}-strategies`,
      excerpt: `Discover effective ${topicFormatted.toLowerCase()} strategies to optimize your MCP server performance.`,
      featured_image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    },
    {
      id: "2",
      title: `Implementing ${topicFormatted} in Production`,
      slug: `implementing-${params.topic}-in-production`,
      excerpt: `Learn how to implement ${topicFormatted.toLowerCase()} techniques in production environments.`,
      featured_image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    },
    {
      id: "3",
      title: `${topicFormatted} Case Study: Enterprise Deployment`,
      slug: `${params.topic}-case-study`,
      excerpt: `See how a major enterprise implemented ${topicFormatted.toLowerCase()} to scale their MCP infrastructure.`,
      featured_image:
        "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80",
    },
  ];

  // Get icon based on topic
  const getTopicIcon = () => {
    const topic = params.topic.toLowerCase();
    if (topic.includes("server") || topic.includes("deployment")) {
      return <Server className="h-8 w-8 text-blue-500" />;
    } else if (topic.includes("cloud") || topic.includes("scaling")) {
      return <Cloud className="h-8 w-8 text-blue-500" />;
    } else if (topic.includes("database") || topic.includes("storage")) {
      return <Database className="h-8 w-8 text-blue-500" />;
    } else {
      return <FileText className="h-8 w-8 text-blue-500" />;
    }
  };

  // Get recommended servers based on topic
  const getRecommendedServers = () => {
    const topic = params.topic.toLowerCase();
    if (topic.includes("server") || topic.includes("deployment")) {
      return [
        { name: "Web Server Pro", id: "web-server-pro" },
        {
          name: "High-Performance MCP Server",
          id: "high-performance-mcp-server",
        },
      ];
    } else if (topic.includes("cloud") || topic.includes("scaling")) {
      return [
        {
          name: "Cloud-Optimized MCP Server",
          id: "cloud-optimized-mcp-server",
        },
        { name: "Auto-Scaling MCP Solution", id: "auto-scaling-mcp-solution" },
      ];
    } else if (topic.includes("database") || topic.includes("storage")) {
      return [
        { name: "Database MCP Server", id: "database-mcp-server" },
        {
          name: "Storage-Optimized MCP Server",
          id: "storage-optimized-mcp-server",
        },
      ];
    } else {
      return [
        {
          name: "General Purpose MCP Server",
          id: "general-purpose-mcp-server",
        },
        { name: "MCP Enterprise Server", id: "mcp-enterprise-server" },
      ];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seoPage.schema_markup),
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-background py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            {getTopicIcon()}
            <h1 className="text-4xl font-bold">{seoPage.title}</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mb-6">
            {seoPage.content.introduction}
          </p>
          <div className="flex flex-wrap gap-2">
            {seoPage.keywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="bg-secondary/50">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {seoPage.content.sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h2 id={section.title.toLowerCase().replace(/\s+/g, "-")}>
                    {section.title}
                  </h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: section.content.replace(/\n\s+/g, "<br><br>"),
                    }}
                  />
                </div>
              ))}

              <h2 id="conclusion">Conclusion</h2>
              <p>{seoPage.content.conclusion}</p>
            </div>

            {/* Related Blog Posts */}
            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-all"
                  >
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-4">
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-4">
                        {post.excerpt}
                      </p>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Read Article
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Table of Contents */}
            <div className="border border-border rounded-lg p-6 bg-card sticky top-4">
              <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
              <ul className="space-y-2">
                {seoPage.content.sections.map((section, index) => (
                  <li key={index}>
                    <a
                      href={`#${section.title.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#conclusion"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Conclusion
                  </a>
                </li>
              </ul>
            </div>

            {/* Recommended Servers */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-bold mb-4">Recommended Servers</h3>
              <div className="space-y-4">
                {getRecommendedServers().map((server, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border border-border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <Server className="h-8 w-8 text-blue-500" />
                    <div className="flex-grow">
                      <h4 className="font-medium">{server.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        Optimized for {topicFormatted.toLowerCase()}
                      </p>
                    </div>
                    <Link href={`/dashboard/servers/${server.id}`}>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
                <Link href="/dashboard/deploy">
                  <Button className="w-full bg-blue-600 hover:bg-blue-500">
                    Browse All Servers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-bold mb-4">Additional Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/documentation"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    MCP Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    MCP Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Community Forums
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/resources/${params.topic}-tutorial`}
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {topicFormatted} Tutorial
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
