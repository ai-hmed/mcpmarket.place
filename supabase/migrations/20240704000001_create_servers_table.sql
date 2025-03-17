-- Create the servers table if it doesn't exist
CREATE TABLE IF NOT EXISTS servers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  category TEXT,
  image_url TEXT,
  deployments INTEGER DEFAULT 0,
  author_id UUID,
  author TEXT,
  status TEXT DEFAULT 'draft',
  github_url TEXT,
  github_owner TEXT,
  github_repo TEXT,
  github_stars INTEGER DEFAULT 0,
  github_forks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow authenticated users to insert servers" ON servers;
CREATE POLICY "Allow authenticated users to insert servers"
ON servers FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access" ON servers;
CREATE POLICY "Allow public read access"
ON servers FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow authors to update their servers" ON servers;
CREATE POLICY "Allow authors to update their servers"
ON servers FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Allow authors to delete their servers" ON servers;
CREATE POLICY "Allow authors to delete their servers"
ON servers FOR DELETE
TO authenticated
USING (auth.uid() = author_id);

-- Enable realtime
alter publication supabase_realtime add table servers;
