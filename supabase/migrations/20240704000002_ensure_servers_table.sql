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

-- Enable realtime
alter publication supabase_realtime add table servers;
