/*
  # Fix storage settings for AI models

  1. Changes
    - Remove unused storage columns
    - Add proper storage settings
  
  2. Details
    - Removes text_ai_storage_url and image_ai_storage_url
    - Removes image_ai_storage_format
    - Adds proper storage configuration columns
*/

-- Remove unused columns
ALTER TABLE site_settings
DROP COLUMN IF EXISTS text_ai_storage_url,
DROP COLUMN IF EXISTS image_ai_storage_url,
DROP COLUMN IF EXISTS image_ai_storage_format;