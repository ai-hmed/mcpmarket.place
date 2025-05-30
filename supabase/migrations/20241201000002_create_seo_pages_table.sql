-- Create SEO pages table for dynamic content management
CREATE TABLE IF NOT EXISTS seo_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  schema_markup JSONB,
  published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create SEO keywords table
CREATE TABLE IF NOT EXISTS seo_keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword TEXT NOT NULL UNIQUE,
  search_volume INTEGER DEFAULT 0,
  difficulty INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample SEO keywords
INSERT INTO seo_keywords (keyword, search_volume) VALUES
('mcp server deployment', 1245),
('model content protocol tutorial', 987),
('mcp performance optimization', 876),
('mcp security', 765),
('mcp api development', 654),
('mcp database integration', 543),
('mcp scaling', 432),
('mcp load balancing', 321),
('mcp authentication', 210),
('mcp best practices', 198)
ON CONFLICT (keyword) DO NOTHING;

-- Add indexes
CREATE INDEX IF NOT EXISTS seo_pages_slug_idx ON seo_pages(slug);
CREATE INDEX IF NOT EXISTS seo_pages_published_idx ON seo_pages(published);
CREATE INDEX IF NOT EXISTS seo_keywords_search_volume_idx ON seo_keywords(search_volume DESC);

-- Enable RLS
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DROP POLICY IF EXISTS "Public read access for published SEO pages" ON seo_pages;
CREATE POLICY "Public read access for published SEO pages"
  ON seo_pages FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Public read access for SEO keywords" ON seo_keywords;
CREATE POLICY "Public read access for SEO keywords"
  ON seo_keywords FOR SELECT
  USING (true);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE seo_pages;
ALTER PUBLICATION supabase_realtime ADD TABLE seo_keywords;
