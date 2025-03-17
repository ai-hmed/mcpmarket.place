-- Add GitHub-related fields to the servers table
ALTER TABLE servers
  ADD COLUMN IF NOT EXISTS github_url TEXT,
  ADD COLUMN IF NOT EXISTS github_stars INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS github_forks INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS github_owner TEXT,
  ADD COLUMN IF NOT EXISTS github_repo TEXT;

-- Add a unique constraint for GitHub repositories
ALTER TABLE servers
  ADD CONSTRAINT IF NOT EXISTS unique_github_repo UNIQUE (github_owner, github_repo);

-- Enable realtime for servers table if not already enabled
alter publication supabase_realtime add table servers;
