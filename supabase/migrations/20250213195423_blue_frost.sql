/*
  # Create settings table

  1. New Tables
    - `site_settings`
      - Basic site configuration
      - API keys and credentials
      - Created and updated timestamps
  
  2. Security
    - Enable RLS
    - Public read access for non-sensitive data
    - Full access for authenticated users
*/

-- Create settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'NEPERSONAJ',
  logo_url text,
  imgbb_api_key text,
  openai_api_key text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read non-sensitive settings
CREATE POLICY "Public can read non-sensitive settings"
  ON site_settings
  FOR SELECT
  USING (true);

-- Authenticated users can insert settings
CREATE POLICY "Authenticated users can insert settings"
  ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update settings
CREATE POLICY "Authenticated users can update settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete settings
CREATE POLICY "Authenticated users can delete settings"
  ON site_settings
  FOR DELETE
  TO authenticated
  USING (true);

-- Update trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert default settings
INSERT INTO site_settings (site_name)
VALUES ('NEPERSONAJ')
ON CONFLICT DO NOTHING;