import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Tag, Clock } from "lucide-react";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found | MCPMarket Blog",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} | MCPMarket Blog`,
    description: post.excerpt || `Read about ${post.title} on MCPMarket Blog.`,
  };
}

async function getBlogPost(slug: string) {
  const supabase = await createClient();

  try {
    // Fetch the blog post with its author, categories, and tags
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select(
        `*, 
        authors:author_id(*), 
        categories:blog_posts_categories!inner(category_id(*))
        `,
      )
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) {
      console.error("Error fetching blog post:", error);
      return null;
    }

    // Fetch tags separately to avoid the relationship error
    const { data: tagData, error: tagError } = await supabase
      .from("blog_posts_tags")
      .select("tag_id(*)")
      .eq("post_id", post.id);

    if (tagError) {
      console.error("Error fetching post tags:", tagError);
    }

    // Format the post with tags
    const formattedPost = {
      ...post,
      tags: tagData || [],
    };

    return formattedPost;
  } catch (error) {
    console.error("Error in getBlogPost:", error);
    return null;
  }
}

async function getRelatedPosts(postId: string, categoryIds: string[]) {
  const supabase = await createClient();

  try {
    // Get posts in the same categories, excluding the current post
    const { data: relatedPosts, error } = await supabase
      .from("blog_posts")
      .select(
        `*, 
        authors:author_id(*), 
        categories:blog_posts_categories!inner(category_id(*))
        `,
      )
      .neq("id", postId)
      .eq("published", true)
      .in(
        "id",
        supabase
          .from("blog_posts_categories")
          .select("post_id")
          .in("category_id", categoryIds),
      )
      .limit(3);

    if (error) {
      console.error("Error fetching related posts:", error);
      return [];
    }

    return relatedPosts || [];
  } catch (error) {
    console.error("Error in getRelatedPosts:", error);
    return [];
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  // Extract category IDs for related posts query
  const categoryIds = post.categories.map(
    (category: any) => category.category_id.id,
  );

  // Get related posts
  const relatedPosts = await getRelatedPosts(post.id, categoryIds);

  // Format date
  const publishDate = new Date(
    post.published_at || post.created_at,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate read time (rough estimate: 200 words per minute)
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

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

            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {publishDate}
              </div>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                {post.authors?.full_name || "Anonymous"}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {readTime} min read
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {post.categories &&
                post.categories.map((category: any, index: number) => (
                  <Link
                    key={index}
                    href={`/blog/category/${category.category_id.slug}`}
                  >
                    <Badge variant="secondary">
                      {category.category_id.name}
                    </Badge>
                  </Link>
                ))}
              {post.tags &&
                post.tags.map((tag: any, index: number) => (
                  <Link key={index} href={`/blog/tag/${tag.tag_id.slug}`}>
                    <Badge variant="outline">{tag.tag_id.name}</Badge>
                  </Link>
                ))}
            </div>

            {post.featured_image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <p className="text-muted-foreground">
                  This post has no content yet.
                </p>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: any, index: number) => (
                    <Link key={index} href={`/blog/tag/${tag.tag_id.slug}`}>
                      <Badge variant="outline">{tag.tag_id.name}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            {post.authors && (
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold mb-4">About the Author</h3>
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
                    {post.authors.full_name
                      ? post.authors.full_name.charAt(0)
                      : "A"}
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {post.authors.full_name || "Anonymous"}
                    </h4>
                    <p className="text-muted-foreground">
                      {post.authors.bio ||
                        "A passionate writer about Model Content Protocol."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Related Posts */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-bold mb-4">Related Posts</h3>
              {relatedPosts.length > 0 ? (
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost: any, index: number) => (
                    <div
                      key={index}
                      className="border border-border rounded-md overflow-hidden hover:shadow-md transition-all"
                    >
                      {relatedPost.featured_image && (
                        <img
                          src={relatedPost.featured_image}
                          alt={relatedPost.title}
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          <h4 className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {relatedPost.title}
                          </h4>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No related posts found.</p>
              )}
              <div className="mt-4">
                <Link href="/blog">
                  <Button variant="outline" className="w-full">
                    View All Posts
                  </Button>
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-bold mb-4">Categories</h3>
              <div className="space-y-2">
                {post.categories &&
                  post.categories.map((category: any, index: number) => (
                    <Link
                      key={index}
                      href={`/blog/category/${category.category_id.slug}`}
                      className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {category.category_id.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
