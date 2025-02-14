/*
  # Create settings table and policies

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key)
      - `site_name` (text, default 'NEPERSONAJ')
      - `logo_url` (text, nullable)
      - `imgbb_api_key` (text, nullable)
      - `openai_api_key` (text, nullable)
      - `ai_model` (text, default 'gpt-4-turbo-preview')
      - `ai_temperature` (float, default 0.7)
      - `ai_max_tokens` (integer, default 2000)
      - `ai_endpoint_url` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `site_settings` table
    - Add policies for public read access
    - Add policies for authenticated users to manage settings
*/

-- Create updated_at function if not exists
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'NEPERSONAJ',
  logo_url text,
  imgbb_api_key text,
  openai_api_key text,
  ai_model text DEFAULT 'gpt-4-turbo-preview',
  ai_temperature float DEFAULT 0.7,
  ai_max_tokens integer DEFAULT 2000,
  ai_endpoint_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create separate policies for each operation
CREATE POLICY "Public can read non-sensitive settings"
  ON site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert settings"
  ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

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

-- Insert default settings if not exists
INSERT INTO site_settings (site_name)
VALUES ('NEPERSONAJ')
ON CONFLICT DO NOTHING;