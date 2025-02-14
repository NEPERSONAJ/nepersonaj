/*
  # Add image storage URL column

  1. Changes
    - Add `image_storage_url` column to `site_settings` table for storing pre-generated images URL

  2. Notes
    - This column is optional and will be used only with custom image AI providers
    - The URL will be used to fetch pre-generated images before attempting to generate new ones
*/

-- Add image storage URL column
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS image_storage_url text;