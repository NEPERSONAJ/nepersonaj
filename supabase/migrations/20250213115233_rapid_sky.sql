/*
  # Add AI storage settings

  1. Changes
    - Add storage settings for each AI model:
      - `text_ai_storage_url`: URL для хранения текстовых артефактов
      - `image_ai_storage_url`: URL для хранения сгенерированных изображений
      - `image_ai_storage_format`: Формат хранения изображений (url/base64)
    
  2. Notes
    - Каждая модель AI может иметь свой способ хранения сгенерированных данных
    - Для изображений можно указать формат хранения (прямые URL или base64)
*/

-- Add storage settings for AI models
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS text_ai_storage_url text,
ADD COLUMN IF NOT EXISTS image_ai_storage_url text,
ADD COLUMN IF NOT EXISTS image_ai_storage_format text DEFAULT 'url';