/*
  # Add DeepSeek AI support

  1. Changes
    - Add DeepSeek as a supported AI provider
    - Add default model settings for DeepSeek
*/

-- Add DeepSeek as a default option for text generation
ALTER TABLE site_settings
ALTER COLUMN text_ai_provider SET DEFAULT 'deepseek',
ALTER COLUMN text_ai_model SET DEFAULT 'deepseek-v3',
ALTER COLUMN text_ai_endpoint_url SET DEFAULT 'https://www.deepseekapp.io/v1/chat/completions';