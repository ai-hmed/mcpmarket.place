-- Fix relationships between blog tables

-- First, check if blog_posts table exists and create it if not
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog tags table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction table for posts and categories if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_posts_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, category_id)
);

-- Create junction table for posts and tags if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_posts_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

-- Enable row-level security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts
DROP POLICY IF EXISTS "Public read access for published blog posts" ON blog_posts;
CREATE POLICY "Public read access for published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Authors have full access to their own posts" ON blog_posts;
CREATE POLICY "Authors have full access to their own posts"
  ON blog_posts FOR ALL
  USING (author_id = auth.uid());

-- Create policies for blog_categories
DROP POLICY IF EXISTS "Public read access for blog categories" ON blog_categories;
CREATE POLICY "Public read access for blog categories"
  ON blog_categories FOR SELECT
  USING (true);

-- Create policies for blog_tags
DROP POLICY IF EXISTS "Public read access for blog tags" ON blog_tags;
CREATE POLICY "Public read access for blog tags"
  ON blog_tags FOR SELECT
  USING (true);

-- Create policies for blog_posts_categories
DROP POLICY IF EXISTS "Public read access for blog posts categories" ON blog_posts_categories;
CREATE POLICY "Public read access for blog posts categories"
  ON blog_posts_categories FOR SELECT
  USING (true);

-- Create policies for blog_posts_tags
DROP POLICY IF EXISTS "Public read access for blog posts tags" ON blog_posts_tags;
CREATE POLICY "Public read access for blog posts tags"
  ON blog_posts_tags FOR SELECT
  USING (true);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE blog_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE blog_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE blog_tags;
ALTER PUBLICATION supabase_realtime ADD TABLE blog_posts_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE blog_posts_tags;
