-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  meta_title TEXT,
  meta_description TEXT,
  view_count INTEGER DEFAULT 0
);

-- Create blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog tags table
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction table for posts and categories
CREATE TABLE IF NOT EXISTS blog_posts_categories (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Create junction table for posts and tags
CREATE TABLE IF NOT EXISTS blog_posts_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create table for SEO page templates
CREATE TABLE IF NOT EXISTS seo_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  template_structure JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create table for generated SEO pages
CREATE TABLE IF NOT EXISTS seo_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  template_id UUID REFERENCES seo_templates(id) ON DELETE SET NULL,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  schema_markup JSONB,
  published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create table for tracking popular search keywords
CREATE TABLE IF NOT EXISTS seo_keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword TEXT NOT NULL UNIQUE,
  search_volume INTEGER DEFAULT 0,
  has_seo_page BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts
DROP POLICY IF EXISTS "Public users can read published blog posts" ON blog_posts;
CREATE POLICY "Public users can read published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Authenticated users can read all blog posts" ON blog_posts;
CREATE POLICY "Authenticated users can read all blog posts"
  ON blog_posts FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authors can update their own posts" ON blog_posts;
CREATE POLICY "Authors can update their own posts"
  ON blog_posts FOR UPDATE
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can insert their own posts" ON blog_posts;
CREATE POLICY "Authors can insert their own posts"
  ON blog_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can delete their own posts" ON blog_posts;
CREATE POLICY "Authors can delete their own posts"
  ON blog_posts FOR DELETE
  USING (auth.uid() = author_id);

-- Create policies for other tables (similar pattern)
-- For categories and tags, we'll allow public read but only authenticated users can modify

DROP POLICY IF EXISTS "Public users can read categories" ON blog_categories;
CREATE POLICY "Public users can read categories"
  ON blog_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public users can read tags" ON blog_tags;
CREATE POLICY "Public users can read tags"
  ON blog_tags FOR SELECT
  USING (true);

-- Enable realtime for blog tables
alter publication supabase_realtime add table blog_posts;
alter publication supabase_realtime add table blog_categories;
alter publication supabase_realtime add table blog_tags;
alter publication supabase_realtime add table seo_pages;
