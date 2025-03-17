-- Create a table to store GitHub server information
CREATE TABLE IF NOT EXISTS github_servers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  github_owner TEXT NOT NULL,
  github_repo TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  github_url TEXT NOT NULL,
  github_stars INTEGER DEFAULT 0,
  github_forks INTEGER DEFAULT 0,
  readme_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(github_owner, github_repo)
);

-- Enable RLS
ALTER TABLE github_servers ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view all github servers" ON github_servers;
CREATE POLICY "Users can view all github servers"
  ON github_servers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own github servers" ON github_servers;
CREATE POLICY "Users can insert their own github servers"
  ON github_servers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own github servers" ON github_servers;
CREATE POLICY "Users can update their own github servers"
  ON github_servers FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own github servers" ON github_servers;
CREATE POLICY "Users can delete their own github servers"
  ON github_servers FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table github_servers;
