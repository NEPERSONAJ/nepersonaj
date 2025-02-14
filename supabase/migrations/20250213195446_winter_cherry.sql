/*
  # Add AI settings columns

  1. Changes
    - Add AI model configuration columns to site_settings table
      - ai_model: Text field for the AI model name
      - ai_temperature: Float field for temperature setting
      - ai_max_tokens: Integer field for max tokens limit
      - ai_endpoint_url: Text field for custom endpoint URL
*/

-- Create settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'NEPERSONAJ',
  logo_url text,
  imgbb_api_key text,
  openai_api_key text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add new columns for AI settings
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS ai_model text DEFAULT 'gpt-4-turbo-preview',
ADD COLUMN IF NOT EXISTS ai_temperature float DEFAULT 0.7,
ADD COLUMN IF NOT EXISTS ai_max_tokens integer DEFAULT 2000,
ADD COLUMN IF NOT EXISTS ai_endpoint_url text;

-- Enable RLS if not already enabled
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Ensure policies exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Public can read non-sensitive settings'
  ) THEN
    CREATE POLICY "Public can read non-sensitive settings"
      ON site_settings
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Authenticated users can insert settings'
  ) THEN
    CREATE POLICY "Authenticated users can insert settings"
      ON site_settings
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Authenticated users can update settings'
  ) THEN
    CREATE POLICY "Authenticated users can update settings"
      ON site_settings
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Authenticated users can delete settings'
  ) THEN
    CREATE POLICY "Authenticated users can delete settings"
      ON site_settings
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;