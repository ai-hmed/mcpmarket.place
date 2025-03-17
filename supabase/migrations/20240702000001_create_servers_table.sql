-- Create servers table
CREATE TABLE IF NOT EXISTS servers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  specs JSONB,
  features TEXT[],
  providers JSONB,
  status TEXT DEFAULT 'draft',
  pricing JSONB,
  deployments INTEGER DEFAULT 0,
  rating FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Public servers are viewable by everyone";
CREATE POLICY "Public servers are viewable by everyone"
  ON servers FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Users can create servers";
CREATE POLICY "Users can create servers"
  ON servers FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update their own servers";
CREATE POLICY "Users can update their own servers"
  ON servers FOR UPDATE
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own servers";
CREATE POLICY "Users can delete their own servers"
  ON servers FOR DELETE
  USING (auth.uid() = author_id);

-- Enable realtime
alter publication supabase_realtime add table servers;
