import { supabase } from './supabase';

interface TelegramSettings {
  bot_token: string | null;
  chat_id: string | null;
}

export async function sendTelegramMessage(message: string): Promise<boolean> {
  try {
    // Get Telegram settings from Supabase
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('telegram_bot_token, telegram_chat_id')
      .single();

    if (settingsError) {
      console.error('Error fetching Telegram settings:', settingsError);
      return false;
    }

    if (!settings?.telegram_bot_token || !settings?.telegram_chat_id) {
      console.error('Telegram settings not configured');
      return false;
    }

    // Send message to Telegram
    const response = await fetch(`https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: settings.telegram_chat_id,
        text: message,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Failed to send Telegram message');
    }

    const data = await response.json();
    return data.ok === true;

  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw error; // Re-throw to handle in the component
  }
}