-- This migration safely checks if the servers table is already in the publication
-- before attempting to add it, avoiding the "already a member" error

DO $$
BEGIN
  -- Check if the servers table exists and is NOT already in the publication
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'servers'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'servers'
  ) THEN
    -- Only add to publication if it's not already a member
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.servers';
  END IF;
END;
$$;