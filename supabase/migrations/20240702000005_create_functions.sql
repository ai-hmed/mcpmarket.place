-- Function to increment server deployments count
CREATE OR REPLACE FUNCTION increment_server_deployments(server_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE servers
  SET deployments = deployments + 1
  WHERE id = server_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement server deployments count
CREATE OR REPLACE FUNCTION decrement_server_deployments(server_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE servers
  SET deployments = GREATEST(0, deployments - 1)
  WHERE id = server_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update server rating based on reviews
CREATE OR REPLACE FUNCTION update_server_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating FLOAT;
BEGIN
  -- Calculate the average rating
  SELECT AVG(rating) INTO avg_rating
  FROM server_reviews
  WHERE server_id = NEW.server_id;
  
  -- Update the server's rating
  UPDATE servers
  SET rating = avg_rating
  WHERE id = NEW.server_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating server rating when a review is added, updated, or deleted
CREATE TRIGGER update_server_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON server_reviews
FOR EACH ROW
EXECUTE FUNCTION update_server_rating();
