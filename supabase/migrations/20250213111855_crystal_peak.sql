/*
  # Fix RLS policies for settings table

  1. Changes
    - Remove WITH CHECK from SELECT policy
    - Split policies by operation type
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public can read non-sensitive settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can manage settings" ON site_settings;

-- Create new policies
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