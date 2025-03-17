-- Fix any potential issues with the servers table constraints
ALTER TABLE IF EXISTS servers
ALTER COLUMN author_id DROP NOT NULL;

-- Make sure the servers table has proper RLS policies
ALTER TABLE IF EXISTS servers ENABLE ROW LEVEL SECURITY;

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
