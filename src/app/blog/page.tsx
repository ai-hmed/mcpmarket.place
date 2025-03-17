import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "../../../supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, Tag, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | MCPMarket - The Marketplace for Model Content Protocol",
  description:
    "Explore articles, tutorials, and insights about Model Content Protocol servers and deployment strategies",
};

async function getBlogPosts() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      featured_image,
      published_at,
      author_id,
      blog_posts_categories!inner(category_id, blog_categories(name, slug)),
      blog_posts_tags!inner(tag_id, blog_tags(name, slug))
    `,
    )
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }

  return posts || [];
}

async function getCategories() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("blog_categories")
    .select("*");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return categories || [];
}

async function getTags() {
  const supabase = await createClient();

  const { data: tags, error } = await supabase.from("blog_tags").select("*");

  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  return tags || [];
}

export default async function BlogPage() {
  // For now, use mock data until the database is populated
  // const posts = await getBlogPosts();
  // const categories = await getCategories();
  // const tags = await getTags();

  const posts = [
    {
      id: "1",
      title: "Getting Started with Model Content Protocol",
      slug: "getting-started-with-mcp",
      excerpt:
        "Learn the basics of Model Content Protocol and how to set up your first server in minutes.",
      featured_image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
      published_at: new Date().toISOString(),
      author: { name: "John Doe" },
      categories: [{ name: "Tutorials", slug: "tutorials" }],
      tags: [
        { name: "Beginner", slug: "beginner" },
        { name: "Setup", slug: "setup" },
      ],
    },
    {
      id: "2",
      title: "Advanced MCP Server Configuration",
      slug: "advanced-mcp-server-configuration",
      excerpt:
        "Take your MCP server to the next level with these advanced configuration techniques.",
      featured_image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      published_at: new Date(Date.now() - 86400000).toISOString(),
      author: { name: "Jane Smith" },
      categories: [{ name: "Advanced", slug: "advanced" }],
      tags: [
        { name: "Configuration", slug: "configuration" },
        { name: "Performance", slug: "performance" },
      ],
    },
    {
      id: "3",
      title: "MCP Security Best Practices",
      slug: "mcp-security-best-practices",
      excerpt:
        "Ensure your MCP servers are secure with these industry-standard security practices.",
      featured_image:
        "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80",
      published_at: new Date(Date.now() - 172800000).toISOString(),
      author: { name: "Alex Johnson" },
      categories: [{ name: "Security", slug: "security" }],
      tags: [
        { name: "Security", slug: "security" },
        { name: "Best Practices", slug: "best-practices" },
      ],
    },
    {
      id: "4",
      title: "Integrating MCP with Third-Party Services",
      slug: "integrating-mcp-with-third-party-services",
      excerpt:
        "Learn how to connect your MCP server with popular third-party services and APIs.",
      featured_image:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80",
      published_at: new Date(Date.now() - 259200000).toISOString(),
      author: { name: "Sarah Williams" },
      categories: [{ name: "Integration", slug: "integration" }],
      tags: [
        { name: "API", slug: "api" },
        { name: "Integration", slug: "integration" },
      ],
    },
    {
      id: "5",
      title: "Scaling MCP for Enterprise",
      slug: "scaling-mcp-for-enterprise",
      excerpt:
        "Strategies for scaling your MCP infrastructure to meet enterprise demands.",
      featured_image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      published_at: new Date(Date.now() - 345600000).toISOString(),
      author: { name: "Michael Brown" },
      categories: [{ name: "Enterprise", slug: "enterprise" }],
      tags: [
        { name: "Scaling", slug: "scaling" },
        { name: "Enterprise", slug: "enterprise" },
      ],
    },
  ];

  const categories = [
    { name: "Tutorials", slug: "tutorials", count: 12 },
    { name: "Advanced", slug: "advanced", count: 8 },
    { name: "Security", slug: "security", count: 5 },
    { name: "Integration", slug: "integration", count: 7 },
    { name: "Enterprise", slug: "enterprise", count: 4 },
    { name: "Case Studies", slug: "case-studies", count: 6 },
  ];

  const tags = [
    { name: "Beginner", slug: "beginner" },
    { name: "Setup", slug: "setup" },
    { name: "Configuration", slug: "configuration" },
    { name: "Performance", slug: "performance" },
    { name: "Security", slug: "security" },
    { name: "Best Practices", slug: "best-practices" },
    { name: "API", slug: "api" },
    { name: "Integration", slug: "integration" },
    { name: "Scaling", slug: "scaling" },
    { name: "Enterprise", slug: "enterprise" },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-background py-16 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">MCP Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Insights, tutorials, and best practices for Model Content Protocol
            servers and deployment
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search articles..."
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>

            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-all"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="h-48 md:h-full w-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories?.map((category: any) => (
                          <Link
                            href={`/blog/category/${category.slug}`}
                            key={category.slug}
                          >
                            <Badge
                              variant="secondary"
                              className="hover:bg-secondary/80"
                            >
                              {category.name}
                            </Badge>
                          </Link>
                        ))}
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-muted-foreground mb-4">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-4 w-4 mr-1" />
                          <span className="mr-4">{post.author?.name}</span>
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>

                        <Link href={`/blog/${post.slug}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            Read More
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Categories */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li
                    key={category.slug}
                    className="flex justify-between items-center"
                  >
                    <Link
                      href={`/blog/category/${category.slug}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {category.name}
                    </Link>
                    <Badge variant="secondary">{category.count}</Badge>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-bold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link key={tag.slug} href={`/blog/tag/${tag.slug}`}>
                    <Badge
                      variant="outline"
                      className="hover:bg-secondary transition-colors"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Post */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
                alt="Featured post"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <Badge className="mb-2 bg-blue-600 hover:bg-blue-500">
                  Featured
                </Badge>
                <h3 className="text-xl font-bold mb-2">
                  The Future of Model Content Protocol
                </h3>
                <p className="text-muted-foreground mb-4">
                  Explore the upcoming features and innovations in the MCP
                  ecosystem.
                </p>
                <Link href="/blog/future-of-model-content-protocol">
                  <Button className="w-full bg-blue-600 hover:bg-blue-500">
                    Read Article
                  </Button>
                </Link>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-bold mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-muted-foreground mb-4">
                Get the latest MCP news and updates delivered to your inbox.
              </p>
              <div className="space-y-2">
                <Input type="email" placeholder="Your email address" />
                <Button className="w-full bg-blue-600 hover:bg-blue-500">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
