import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../../../supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search } from "lucide-react";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory(params.slug);

  if (!category) {
    return {
      title: "Category Not Found | MCPMarket Blog",
      description: "The requested blog category could not be found.",
    };
  }

  return {
    title: `${category.name} | MCPMarket Blog`,
    description: `Browse all articles in the ${category.name} category on MCPMarket Blog.`,
  };
}

async function getCategory(slug: string) {
  const supabase = await createClient();

  try {
    const { data: category, error } = await supabase
      .from("blog_categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching category:", error);
      return null;
    }

    return category;
  } catch (error) {
    console.error("Error in getCategory:", error);
    return null;
  }
}

async function getCategoryPosts(categoryId: string) {
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
      .eq("blog_posts_categories.category_id", categoryId)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching category posts:", error);
      return [];
    }

    return posts || [];
  } catch (error) {
    console.error("Error in getCategoryPosts:", error);
    return [];
  }
}

async function getAllCategories() {
  const supabase = await createClient();

  try {
    const { data: categories, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching all categories:", error);
      return [];
    }

    return categories || [];
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return [];
  }
}

export default async function CategoryPage({ params }: Props) {
  const category = await getCategory(params.slug);

  if (!category) {
    notFound();
  }

  const posts = await getCategoryPosts(category.id);
  const allCategories = await getAllCategories();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-background py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all posts
            </Link>

            <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl text-muted-foreground mb-8">
              {category.description ||
                `Browse all articles in the ${category.name} category.`}
            </p>

            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder={`Search in ${category.name}...`}
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
            {posts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {posts.map((post, index) => (
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
                          post.categories.map((cat, idx) => (
                            <Link
                              key={idx}
                              href={`/blog/category/${cat.category_id.slug}`}
                            >
                              <Badge
                                variant={
                                  cat.category_id.id === category.id
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {cat.category_id.name}
                              </Badge>
                            </Link>
                          ))}
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
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground">
                  There are no posts in this category yet. Check back later or
                  browse other categories.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Categories */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-bold mb-4">Categories</h3>
              <div className="space-y-2">
                {allCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/blog/category/${cat.slug}`}
                    className={`block hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${cat.id === category.id ? "font-medium text-primary" : ""}`}
                  >
                    {cat.name}
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
