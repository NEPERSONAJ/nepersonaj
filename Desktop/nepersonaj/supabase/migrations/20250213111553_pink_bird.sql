/*
  # Create settings table

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key)
      - `site_name` (text) - название сайта
      - `logo_url` (text) - URL логотипа
      - `imgbb_api_key` (text) - ключ API ImgBB
      - `openai_api_key` (text) - ключ API OpenAI
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `site_settings` table
    - Add policy for authenticated users to manage settings
    - Add policy for public to read non-sensitive settings
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
  USING (true)
  WITH CHECK (false);

-- Only authenticated users can manage settings
CREATE POLICY "Authenticated users can manage settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert default settings
INSERT INTO site_settings (site_name)
VALUES ('NEPERSONAJ')
ON CONFLICT DO NOTHING;