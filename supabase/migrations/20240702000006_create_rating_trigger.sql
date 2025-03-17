-- Function to update server rating based on reviews
CREATE OR REPLACE FUNCTION update_server_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating FLOAT;
  server_id_val UUID;
BEGIN
  -- Determine which server_id to use based on operation
  IF (TG_OP = 'DELETE') THEN
    server_id_val := OLD.server_id;
  ELSE
    server_id_val := NEW.server_id;
  END IF;
  
  -- Calculate the average rating
  SELECT AVG(rating) INTO avg_rating
  FROM server_reviews
  WHERE server_id = server_id_val;
  
  -- Update the server's rating
  UPDATE servers
  SET rating = COALESCE(avg_rating, 0)
  WHERE id = server_id_val;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating server rating when a review is added, updated, or deleted
DROP TRIGGER IF EXISTS update_server_rating_trigger ON server_reviews;
CREATE TRIGGER update_server_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON server_reviews
FOR EACH ROW
EXECUTE FUNCTION update_server_rating();
