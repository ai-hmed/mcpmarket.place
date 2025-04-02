-- Create blog_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id),
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  view_count INTEGER DEFAULT 0
);

-- Create blog_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_tags table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_posts_categories junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_posts_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, category_id)
);

-- Create blog_posts_tags junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_posts_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

-- Create seo_pages table if it doesn't exist
CREATE TABLE IF NOT EXISTS seo_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  schema_markup JSONB,
  published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Create seo_keywords table if it doesn't exist
CREATE TABLE IF NOT EXISTS seo_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL UNIQUE,
  search_volume INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public read access for published blog posts
DROP POLICY IF EXISTS "Public read access for published blog posts" ON blog_posts;
CREATE POLICY "Public read access for published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

-- Admin full access to blog posts
DROP POLICY IF EXISTS "Admin full access to blog posts" ON blog_posts;
CREATE POLICY "Admin full access to blog posts"
  ON blog_posts FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true));

-- Public read access for blog categories
DROP POLICY IF EXISTS "Public read access for blog categories" ON blog_categories;
CREATE POLICY "Public read access for blog categories"
  ON blog_categories FOR SELECT
  USING (true);

-- Admin full access to blog categories
DROP POLICY IF EXISTS "Admin full access to blog categories" ON blog_categories;
CREATE POLICY "Admin full access to blog categories"
  ON blog_categories FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true));

-- Public read access for blog tags
DROP POLICY IF EXISTS "Public read access for blog tags" ON blog_tags;
CREATE POLICY "Public read access for blog tags"
  ON blog_tags FOR SELECT
  USING (true);

-- Admin full access to blog tags
DROP POLICY IF EXISTS "Admin full access to blog tags" ON blog_tags;
CREATE POLICY "Admin full access to blog tags"
  ON blog_tags FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true));

-- Public read access for blog posts categories
DROP POLICY IF EXISTS "Public read access for blog posts categories" ON blog_posts_categories;
CREATE POLICY "Public read access for blog posts categories"
  ON blog_posts_categories FOR SELECT
  USING (true);

-- Admin full access to blog posts categories
DROP POLICY IF EXISTS "Admin full access to blog posts categories" ON blog_posts_categories;
CREATE POLICY "Admin full access to blog posts categories"
  ON blog_posts_categories FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true));

-- Public read access for blog posts tags
DROP POLICY IF EXISTS "Public read access for blog posts tags" ON blog_posts_tags;
CREATE POLICY "Public read access for blog posts tags"
  ON blog_posts_tags FOR SELECT
  USING (true);

-- Admin full access to blog posts tags
DROP POLICY IF EXISTS "Admin full access to blog posts tags" ON blog_posts_tags;
CREATE POLICY "Admin full access to blog posts tags"
  ON blog_posts_tags FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true));

-- Public read access for published SEO pages
DROP POLICY IF EXISTS "Public read access for published SEO pages" ON seo_pages;
CREATE POLICY "Public read access for published SEO pages"
  ON seo_pages FOR SELECT
  USING (published = true);

-- Admin full access to SEO pages
DROP POLICY IF EXISTS "Admin full access to SEO pages" ON seo_pages;
CREATE POLICY "Admin full access to SEO pages"
  ON seo_pages FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true));

-- Public read access for SEO keywords
DROP POLICY IF EXISTS "Public read access for SEO keywords" ON seo_keywords;
CREATE POLICY "Public read access for SEO keywords"
  ON seo_keywords FOR SELECT
  USING (true);

-- Admin full access to SEO keywords
DROP POLICY IF EXISTS "Admin full access to SEO keywords" ON seo_keywords;
CREATE POLICY "Admin full access to SEO keywords"
  ON seo_keywords FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true));

-- Enable realtime for blog tables
alter publication supabase_realtime add table blog_posts;
alter publication supabase_realtime add table blog_categories;
alter publication supabase_realtime add table blog_tags;
alter publication supabase_realtime add table blog_posts_categories;
alter publication supabase_realtime add table blog_posts_tags;
alter publication supabase_realtime add table seo_pages;
alter publication supabase_realtime add table seo_keywords;
