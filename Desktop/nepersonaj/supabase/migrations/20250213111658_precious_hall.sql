/*
  # Add AI model settings

  1. Changes to site_settings table:
    - Add `ai_model` (text) - название модели AI (например, 'gpt-4-turbo-preview')
    - Add `ai_temperature` (float) - температура для генерации (0.0-2.0)
    - Add `ai_max_tokens` (integer) - максимальное количество токенов
    - Add `ai_endpoint_url` (text) - URL эндпоинта API (для альтернативных провайдеров)

  2. Security
    - Existing RLS policies will automatically apply to new columns
*/

-- Add new columns for AI settings
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS ai_model text DEFAULT 'gpt-4-turbo-preview',
ADD COLUMN IF NOT EXISTS ai_temperature float DEFAULT 0.7,
ADD COLUMN IF NOT EXISTS ai_max_tokens integer DEFAULT 2000,
ADD COLUMN IF NOT EXISTS ai_endpoint_url text;