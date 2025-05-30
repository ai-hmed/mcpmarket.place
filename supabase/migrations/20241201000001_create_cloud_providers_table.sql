-- Create cloud_providers table for dynamic provider management
CREATE TABLE IF NOT EXISTS cloud_providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  regions JSONB NOT NULL DEFAULT '[]',
  logo TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default cloud providers
INSERT INTO cloud_providers (id, name, regions, logo, active) VALUES
(
  'aws',
  'Amazon Web Services',
  '[
    {"id": "us-east-1", "name": "US East (N. Virginia)"},
    {"id": "us-west-2", "name": "US West (Oregon)"},
    {"id": "eu-west-1", "name": "EU (Ireland)"},
    {"id": "ap-southeast-1", "name": "Asia Pacific (Singapore)"},
    {"id": "ap-northeast-1", "name": "Asia Pacific (Tokyo)"}
  ]',
  'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
  true
),
(
  'azure',
  'Microsoft Azure',
  '[
    {"id": "eastus", "name": "East US"},
    {"id": "westeurope", "name": "West Europe"},
    {"id": "southeastasia", "name": "Southeast Asia"},
    {"id": "westus2", "name": "West US 2"},
    {"id": "centralus", "name": "Central US"}
  ]',
  'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg',
  true
),
(
  'gcp',
  'Google Cloud Platform',
  '[
    {"id": "us-central1", "name": "US Central (Iowa)"},
    {"id": "europe-west1", "name": "Europe West (Belgium)"},
    {"id": "asia-east1", "name": "Asia East (Taiwan)"},
    {"id": "us-east4", "name": "US East (N. Virginia)"},
    {"id": "australia-southeast1", "name": "Australia Southeast (Sydney)"}
  ]',
  'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE cloud_providers ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DROP POLICY IF EXISTS "Public read access for cloud providers" ON cloud_providers;
CREATE POLICY "Public read access for cloud providers"
  ON cloud_providers FOR SELECT
  USING (active = true);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE cloud_providers;
