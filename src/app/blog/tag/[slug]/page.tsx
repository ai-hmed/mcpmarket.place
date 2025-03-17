import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../../../supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  User,
  Tag as TagIcon,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch the tag to generate metadata
  const tag = await getTag(params.slug);

  if (!tag) {
    return {
      title: "Tag Not Found | MCPMarket Blog",
      description: "The requested blog tag could not be found.",
    };
  }

  return {
    title: `${tag.name} | MCPMarket Blog`,
    description: `Browse all articles tagged with ${tag.name}.`,
  };
}

async function getTag(slug: string) {
  const supabase = await createClient();

  const { data: tag, error } = await supabase
    .from("blog_tags")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching tag:", error);
    return null;
  }

  return tag;
}

async function getTagPosts(tagId: string) {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("blog_posts_tags")
    .select(
      `
      blog_posts!inner(id, title, slug, excerpt, featured_image, published_at, author_id,
        blog_posts_categories!inner(category_id, blog_categories(name, slug)))
    `,
    )
    .eq("tag_id", tagId)
    .eq("blog_posts.published", true)
    .order("blog_posts.published_at", { ascending: false });

  if (error) {
    console.error("Error fetching tag posts:", error);
    return [];
  }

  return posts?.map((item) => item.blog_posts) || [];
}

export default async function TagPage({ params }: Props) {
  // For now, use mock data until the database is populated
  // const tag = await getTag(params.slug);
  //
  // if (!tag) {
  //   notFound();
  // }
  //
  // const posts = await getTagPosts(tag.id);

  // Mock data for development
  const tag = {
    id: "1",
    name:
      params.slug === "beginner"
        ? "Beginner"
        : params.slug === "setup"
          ? "Setup"
          : params.slug === "security"
            ? "Security"
            : params.slug === "api"
              ? "API"
              : params.slug === "performance"
                ? "Performance"
                : "Tag",
    slug: params.slug,
  };

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
    },
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
        <div className="container mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <TagIcon className="h-5 w-5 text-blue-500" />
            <h1 className="text-4xl font-bold">{tag.name}</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            Browse all articles tagged with {tag.name}.
          </p>

          {/* Search Bar */}
          <div className="max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={`Search in ${tag.name}...`}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
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
                    <Badge className="bg-blue-600 hover:bg-blue-500">
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag.name}
                    </Badge>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>

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
              Next
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
