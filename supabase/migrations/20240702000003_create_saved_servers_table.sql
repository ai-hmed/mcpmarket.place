-- Create saved_servers table
CREATE TABLE IF NOT EXISTS saved_servers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, server_id)
);

-- Enable RLS
ALTER TABLE saved_servers ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their saved servers";
CREATE POLICY "Users can view their saved servers"
  ON saved_servers FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save servers";
CREATE POLICY "Users can save servers"
  ON saved_servers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unsave servers";
CREATE POLICY "Users can unsave servers"
  ON saved_servers FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table saved_servers;
