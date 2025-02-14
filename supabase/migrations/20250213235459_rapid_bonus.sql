/*
  # Add Telegram bot and social media settings

  1. New Fields
    - Telegram bot settings:
      - telegram_bot_token
      - telegram_chat_id
    - Social media links:
      - telegram_url
      - whatsapp_url
      - youtube_url
      - vk_url
      - twitter_url
      - instagram_url
      - email
      - phone
    - Social media visibility flags:
      - show_telegram
      - show_whatsapp
      - show_youtube
      - show_vk
      - show_twitter
      - show_instagram
      - show_email
      - show_phone

  2. Changes
    - Add new columns to site_settings table
    - Set default values for visibility flags to false
*/

-- Add Telegram bot settings
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS telegram_bot_token text,
ADD COLUMN IF NOT EXISTS telegram_chat_id text;

-- Add social media URLs
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS telegram_url text,
ADD COLUMN IF NOT EXISTS whatsapp_url text,
ADD COLUMN IF NOT EXISTS youtube_url text,
ADD COLUMN IF NOT EXISTS vk_url text,
ADD COLUMN IF NOT EXISTS twitter_url text,
ADD COLUMN IF NOT EXISTS instagram_url text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS phone text;

-- Add visibility flags
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS show_telegram boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS show_whatsapp boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS show_youtube boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS show_vk boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS show_twitter boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS show_instagram boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS show_email boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS show_phone boolean NOT NULL DEFAULT false;