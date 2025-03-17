-- Create server_reviews table
CREATE TABLE IF NOT EXISTS server_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, server_id)
);

-- Enable RLS
ALTER TABLE server_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone";
CREATE POLICY "Reviews are viewable by everyone"
  ON server_reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create reviews";
CREATE POLICY "Users can create reviews"
  ON server_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reviews";
CREATE POLICY "Users can update their own reviews"
  ON server_reviews FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reviews";
CREATE POLICY "Users can delete their own reviews"
  ON server_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table server_reviews;
