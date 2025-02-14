/*
  # Add image storage URL column

  1. Changes
    - Add `image_storage_url` column to `site_settings` table
    
  2. Purpose
    - Store URL for pre-generated images service
    - Used with custom image AI providers to fetch existing images before generation
*/

-- Add image storage URL column
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS image_storage_url text;