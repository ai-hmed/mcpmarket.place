import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "../../../supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | MCPMarket",
  description:
    "Latest news, updates, and insights about Model Content Protocol and the MCPMarket ecosystem.",
};

async function getBlogPosts() {
  const supabase = await createClient();

  try {
    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select(
        `*, 
        authors:author_id(*), 
        categories:blog_posts_categories!inner(category_id(*))
        `,
      )
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }

    return posts || [];
  } catch (error) {
    console.error("Error in getBlogPosts:", error);
    return [];
  }
}

async function getCategories() {
  const supabase = await createClient();

  try {
    const { data: categories, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching blog categories:", error);
      return [];
    }

    return categories || [];
  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const categories = await getCategories();

  // Get featured post (most recent)
  const featuredPost = posts.length > 0 ? posts[0] : null;
  // Get remaining posts
  const remainingPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-background py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">MCPMarket Blog</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Latest news, updates, and insights about Model Content Protocol
              and the MCPMarket ecosystem.
            </p>
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Featured Post</h2>
                <div className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-all">
                  {featuredPost.featured_image && (
                    <img
                      src={featuredPost.featured_image}
                      alt={featuredPost.title}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {featuredPost.categories &&
                        featuredPost.categories.map(
                          (category: any, index: number) => (
                            <Link
                              key={index}
                              href={`/blog/category/${category.category_id.slug}`}
                            >
                              <Badge variant="secondary">
                                {category.category_id.name}
                              </Badge>
                            </Link>
                          ),
                        )}
                    </div>
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <h3 className="text-2xl font-bold mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {featuredPost.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground mb-4">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-lg font-bold mr-3">
                          {featuredPost.authors?.full_name
                            ? featuredPost.authors.full_name.charAt(0)
                            : "A"}
                        </div>
                        <div>
                          <p className="font-medium">
                            {featuredPost.authors?.full_name || "Anonymous"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              featuredPost.published_at ||
                                featuredPost.created_at,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <Link href={`/blog/${featuredPost.slug}`}>
                        <Button>Read More</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* All Posts */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {remainingPosts.map((post: any, index: number) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-all"
                  >
                    {post.featured_image && (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories &&
                          post.categories.map(
                            (category: any, index: number) => (
                              <Link
                                key={index}
                                href={`/blog/category/${category.category_id.slug}`}
                              >
                                <Badge variant="secondary">
                                  {category.category_id.name}
                                </Badge>
                              </Link>
                            ),
                          )}
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-xl font-bold mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            post.published_at || post.created_at,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="outline" size="sm">
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Categories */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-bold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category: any) => (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-bold mb-4">About Our Blog</h3>
              <p className="text-muted-foreground mb-4">
                Stay up to date with the latest developments in the Model
                Content Protocol ecosystem, tutorials, best practices, and
                community highlights.
              </p>
              <p className="text-muted-foreground">
                Have a topic you'd like us to cover? Reach out to our team with
                your suggestions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
