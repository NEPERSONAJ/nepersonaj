/*
  # Extend settings for AI and storage capabilities

  1. Changes
    - Add columns for text generation AI:
      - text_ai_provider (e.g., OpenAI, Claude, Custom)
      - text_ai_model (custom model name)
      - text_ai_api_key
      - text_ai_endpoint_url
      - text_ai_temperature
      - text_ai_max_tokens
    - Add columns for image generation AI:
      - image_ai_provider
      - image_ai_model
      - image_ai_api_key
      - image_ai_endpoint_url
    - Add columns for image storage:
      - storage_provider (e.g., ImgBB, Cloudinary, Custom)
      - storage_api_key
      - storage_endpoint_url

  2. Security
    - All new columns are protected by existing RLS policies
*/

-- Add text generation AI columns
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS text_ai_provider text DEFAULT 'openai',
ADD COLUMN IF NOT EXISTS text_ai_model text DEFAULT 'gpt-4-turbo-preview',
ADD COLUMN IF NOT EXISTS text_ai_api_key text,
ADD COLUMN IF NOT EXISTS text_ai_endpoint_url text,
ADD COLUMN IF NOT EXISTS text_ai_temperature float DEFAULT 0.7,
ADD COLUMN IF NOT EXISTS text_ai_max_tokens integer DEFAULT 2000;

-- Add image generation AI columns
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS image_ai_provider text DEFAULT 'openai',
ADD COLUMN IF NOT EXISTS image_ai_model text DEFAULT 'dall-e-3',
ADD COLUMN IF NOT EXISTS image_ai_api_key text,
ADD COLUMN IF NOT EXISTS image_ai_endpoint_url text;

-- Add storage provider columns
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS storage_provider text DEFAULT 'imgbb',
ADD COLUMN IF NOT EXISTS storage_api_key text,
ADD COLUMN IF NOT EXISTS storage_endpoint_url text;