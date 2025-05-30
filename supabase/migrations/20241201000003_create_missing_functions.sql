-- Create function to increment server deployment count
CREATE OR REPLACE FUNCTION increment_server_deployments(server_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE servers 
  SET deployments = COALESCE(deployments, 0) + 1,
      updated_at = NOW()
  WHERE id = server_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update server rating
CREATE OR REPLACE FUNCTION update_server_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE servers
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM server_reviews
    WHERE server_id = COALESCE(NEW.server_id, OLD.server_id)
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.server_id, OLD.server_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for server rating updates
DROP TRIGGER IF EXISTS update_server_rating_trigger ON server_reviews;
CREATE TRIGGER update_server_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON server_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_server_rating();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_server_deployments(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_server_rating() TO authenticated;
