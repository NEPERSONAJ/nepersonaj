/*
  # Update AI provider defaults

  1. Changes
    - Remove DeepSeek as default text AI provider
    - Set OpenAI as default text AI provider
    - Update default model names
*/

-- Update default values for text AI
ALTER TABLE site_settings
ALTER COLUMN text_ai_provider SET DEFAULT 'openai',
ALTER COLUMN text_ai_model SET DEFAULT 'gpt-4-turbo-preview',
ALTER COLUMN text_ai_endpoint_url DROP DEFAULT;

-- Update existing records to use OpenAI if they were using DeepSeek
UPDATE site_settings
SET 
  text_ai_provider = 'openai',
  text_ai_model = 'gpt-4-turbo-preview',
  text_ai_endpoint_url = NULL
WHERE text_ai_provider = 'deepseek';