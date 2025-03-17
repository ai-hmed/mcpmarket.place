-- Fix for notifications table already being a member of supabase_realtime publication
DO $$
BEGIN
  -- Check if the notifications table exists and is already in the publication
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications'
  ) AND EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'notifications'
  ) THEN
    -- If it's already a member, we don't need to add it again
    RAISE NOTICE 'Table notifications is already a member of publication supabase_realtime';
  ELSE
    -- Only add to publication if it exists and is not already a member
    IF EXISTS (
      SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications';
    END IF;
  END IF;
END;
$$;