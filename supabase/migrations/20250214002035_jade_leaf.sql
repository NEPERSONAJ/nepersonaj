/*
  # Add social media fields

  1. New Fields
    - Add social media URLs and visibility flags
    - Add contact form settings

  2. Security
    - Maintain existing RLS policies
*/

-- Add social media URLs and visibility flags
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS telegram_url text,
ADD COLUMN IF NOT EXISTS whatsapp_url text,
ADD COLUMN IF NOT EXISTS vk_url text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS show_telegram boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS show_whatsapp boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS show_vk boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS show_email boolean NOT NULL DEFAULT false;