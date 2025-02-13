/*
  # Fix AI settings schema

  1. Changes
    - Remove references to storage URLs in AI settings
    - Update default values for text AI provider
*/

-- Remove any lingering references to storage URLs
ALTER TABLE site_settings
DROP COLUMN IF EXISTS text_ai_storage_url,
DROP COLUMN IF EXISTS image_ai_storage_url,
DROP COLUMN IF EXISTS image_ai_storage_format;

-- Update default values for text AI
ALTER TABLE site_settings
ALTER COLUMN text_ai_provider SET DEFAULT 'deepseek',
ALTER COLUMN text_ai_model SET DEFAULT 'deepseek-v3',
ALTER COLUMN text_ai_endpoint_url SET DEFAULT 'https://www.deepseekapp.io/v1/chat/completions';