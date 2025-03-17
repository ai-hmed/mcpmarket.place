import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Tag, ArrowLeft, Share2, Bookmark } from "lucide-react";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch the blog post to generate metadata
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found | MCPMarket Blog",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.meta_title || post.title} | MCPMarket Blog`,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.featured_image ? [{ url: post.featured_image }] : [],
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: post.author?.name
        ? [`https://mcpmarket.place/authors/${post.author.id}`]
        : [],
      tags: post.tags?.map((tag: any) => tag.name) || [],
    },
  };
}

async function getBlogPost(slug: string) {
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select(
      `
      *,
      blog_posts_categories!inner(category_id, blog_categories(name, slug)),
      blog_posts_tags!inner(tag_id, blog_tags(name, slug))
    `,
    )
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }

  return post;
}

async function getRelatedPosts(categoryIds: string[], currentPostId: string) {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("blog_posts_categories")
    .select(
      `
      blog_posts!inner(id, title, slug, excerpt, featured_image, published_at)
    `,
    )
    .in("category_id", categoryIds)
    .not("blog_posts.id", "eq", currentPostId)
    .eq("blog_posts.published", true)
    .limit(3);

  if (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }

  return posts?.map((item) => item.blog_posts) || [];
}

export default async function BlogPostPage({ params }: Props) {
  // For now, use mock data until the database is populated
  // const post = await getBlogPost(params.slug);
  //
  // if (!post) {
  //   notFound();
  // }
  //
  // const categoryIds = post.blog_posts_categories.map((item: any) => item.category_id);
  // const relatedPosts = await getRelatedPosts(categoryIds, post.id);

  // Mock data for development
  const post = {
    id: "1",
    title: "Getting Started with Model Content Protocol",
    slug: params.slug,
    excerpt:
      "Learn the basics of Model Content Protocol and how to set up your first server in minutes.",
    content: `
      <h2>Introduction to Model Content Protocol</h2>
      <p>Model Content Protocol (MCP) is a revolutionary approach to content delivery that enables seamless integration between AI models and applications. This guide will walk you through the basics of MCP and help you set up your first server.</p>
      
      <h2>What is MCP?</h2>
      <p>MCP is a standardized protocol for communicating with AI models, allowing developers to create consistent interfaces regardless of the underlying model architecture. It provides a unified way to request and receive content from various AI models.</p>
      
      <h3>Key Benefits of MCP</h3>
      <ul>
        <li>Standardized API across different models</li>
        <li>Simplified integration with applications</li>
        <li>Improved performance through optimized communication</li>
        <li>Enhanced security with built-in authentication</li>
        <li>Scalable architecture for high-demand scenarios</li>
      </ul>
      
      <h2>Setting Up Your First MCP Server</h2>
      <p>Follow these steps to get your MCP server up and running:</p>
      
      <h3>Step 1: Choose a Server Template</h3>
      <p>MCPMarket offers a variety of server templates optimized for different use cases. For beginners, we recommend starting with the "Basic MCP Server" template, which provides a solid foundation with minimal configuration required.</p>
      
      <h3>Step 2: Deploy Your Server</h3>
      <p>Once you've selected a template, you can deploy it to your preferred cloud provider with just a few clicks:</p>
      <ol>
        <li>Log in to your MCPMarket dashboard</li>
        <li>Navigate to the "Deploy" section</li>
        <li>Select your chosen template</li>
        <li>Choose your cloud provider (AWS, Azure, or GCP)</li>
        <li>Configure basic settings like region and instance size</li>
        <li>Click "Deploy Now"</li>
      </ol>
      
      <h3>Step 3: Configure Your Server</h3>
      <p>After deployment, you'll need to configure your server for your specific needs:</p>
      <ol>
        <li>Access your server's control panel using the provided credentials</li>
        <li>Set up authentication keys for secure access</li>
        <li>Configure model endpoints based on your requirements</li>
        <li>Adjust performance settings for optimal operation</li>
      </ol>
      
      <h3>Step 4: Test Your Server</h3>
      <p>Before integrating with your applications, it's important to test your server:</p>
      <pre><code>curl -X POST https://your-server-url.com/v1/generate \\n  -H "Content-Type: application/json" \\n  -H "Authorization: Bearer YOUR_API_KEY" \\n  -d '{"prompt": "Hello, MCP!", "max_tokens": 50}'</code></pre>
      
      <p>If everything is set up correctly, you should receive a response from your MCP server.</p>
      
      <h2>Next Steps</h2>
      <p>Now that you have your MCP server up and running, you can:</p>
      <ul>
        <li>Integrate it with your applications using our client libraries</li>
        <li>Explore advanced configuration options for better performance</li>
        <li>Set up monitoring and analytics to track usage</li>
        <li>Scale your server as your needs grow</li>
      </ul>
      
      <p>For more detailed information, check out our comprehensive <a href="/documentation">documentation</a> or join our <a href="/community">community forum</a> to connect with other MCP users.</p>
    `,
    featured_image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    meta_title:
      "Getting Started with Model Content Protocol - A Beginner's Guide",
    meta_description:
      "Learn how to set up and configure your first Model Content Protocol server in this comprehensive beginner's guide.",
    author: { name: "John Doe", id: "john-doe" },
    categories: [{ name: "Tutorials", slug: "tutorials" }],
    tags: [
      { name: "Beginner", slug: "beginner" },
      { name: "Setup", slug: "setup" },
    ],
  };

  const relatedPosts = [
    {
      id: "2",
      title: "Advanced MCP Server Configuration",
      slug: "advanced-mcp-server-configuration",
      excerpt:
        "Take your MCP server to the next level with these advanced configuration techniques.",
      featured_image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      published_at: new Date(Date.now() - 86400000).toISOString(),
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

  // Schema.org JSON-LD for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: post.author?.name || "MCPMarket Team",
    },
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
      "@id": `https://mcpmarket.place/blog/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Hero Section */}
      <section className="relative">
        <div className="h-96 w-full overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        <div className="container mx-auto px-4">
          <div className="relative -mt-32 mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Blog
            </Link>

            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories?.map((category: any) => (
                <Link
                  href={`/blog/category/${category.slug}`}
                  key={category.slug}
                >
                  <Badge variant="secondary" className="hover:bg-secondary/80">
                    {category.name}
                  </Badge>
                </Link>
              ))}
            </div>

            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center text-sm text-muted-foreground mb-6">
              <User className="h-4 w-4 mr-1" />
              <span className="mr-4">{post.author?.name}</span>
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(post.published_at)}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <article className="lg:w-2/3">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-muted-foreground">Tags:</span>
                {post.tags?.map((tag: any) => (
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

            {/* Share and Bookmark */}
            <div className="mt-6 flex justify-between">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="h-4 w-4" />
                Bookmark
              </Button>
            </div>

            {/* Author Bio */}
            <div className="mt-8 p-6 bg-muted rounded-lg">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.id || "default"}`}
                    alt={post.author?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">
                    About {post.author?.name}
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    John is a senior developer at MCPMarket with over 10 years
                    of experience in cloud infrastructure and AI systems.
                  </p>
                  <Link href={`/authors/${post.author?.id}`}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Related Posts */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-bold mb-4">Related Articles</h3>
              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost.id} className="flex gap-3">
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <h4 className="font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(relatedPost.published_at)}
                      </p>
                    </div>
                  </div>
                ))}
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
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                />
                <Button className="w-full bg-blue-600 hover:bg-blue-500">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-bold mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag: any) => (
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
                <Link href="/blog/tag/deployment">
                  <Badge
                    variant="outline"
                    className="hover:bg-secondary transition-colors"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    Deployment
                  </Badge>
                </Link>
                <Link href="/blog/tag/cloud">
                  <Badge
                    variant="outline"
                    className="hover:bg-secondary transition-colors"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    Cloud
                  </Badge>
                </Link>
                <Link href="/blog/tag/ai">
                  <Badge
                    variant="outline"
                    className="hover:bg-secondary transition-colors"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    AI
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
