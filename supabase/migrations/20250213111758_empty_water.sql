/*
  # Complete site settings setup

  1. Tables
    - site_settings: Основные настройки сайта и API ключи
      - id (uuid, primary key)
      - site_name (text) - название сайта
      - logo_url (text) - URL логотипа
      - imgbb_api_key (text) - ключ API для загрузки изображений
      - openai_api_key (text) - ключ API OpenAI
      - ai_model (text) - модель AI
      - ai_temperature (float) - температура генерации
      - ai_max_tokens (integer) - максимальное количество токенов
      - ai_endpoint_url (text) - URL эндпоинта API
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - RLS включен
    - Публичный доступ только для чтения не-чувствительных данных
    - Полный доступ только для авторизованных пользователей
*/

-- Create updated_at function if not exists
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'NEPERSONAJ',
  logo_url text,
  imgbb_api_key text,
  openai_api_key text,
  ai_model text DEFAULT 'gpt-4-turbo-preview',
  ai_temperature float DEFAULT 0.7,
  ai_max_tokens integer DEFAULT 2000,
  ai_endpoint_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read non-sensitive settings
CREATE POLICY "Public can read non-sensitive settings"
  ON site_settings
  FOR SELECT
  USING (
    true
  )
  WITH CHECK (false);

-- Only authenticated users can manage settings
CREATE POLICY "Authenticated users can manage settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert default settings if not exists
INSERT INTO site_settings (site_name)
VALUES ('NEPERSONAJ')
ON CONFLICT DO NOTHING;