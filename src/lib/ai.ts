import { supabase } from './supabase';

interface AISettings {
  text_ai_provider: string;
  text_ai_model: string;
  text_ai_api_key: string | null;
  text_ai_endpoint_url: string | null;
  text_ai_temperature: number;
  text_ai_max_tokens: number;
  image_ai_provider: string;
  image_ai_model: string;
  image_ai_api_key: string | null;
  image_ai_endpoint_url: string | null
  storage_provider: string;
  storage_api_key: string | null;
  storage_endpoint_url: string | null;
}

async function getAISettings(): Promise<AISettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select(`
      text_ai_provider,
      text_ai_model,
      text_ai_api_key,
      text_ai_endpoint_url,
      text_ai_temperature,
      text_ai_max_tokens,
      image_ai_provider,
      image_ai_model,
      image_ai_api_key,
      image_ai_endpoint_url,
      storage_provider,
      storage_api_key,
      storage_endpoint_url
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function generateText(prompt: string, field: string): Promise<string> {
  const settings = await getAISettings();
  
  if (!settings.text_ai_api_key) {
    throw new Error('API ключ для генерации текста не настроен в настройках');
  }

  let endpoint = '';
  let body = {};
  let headers = {};

  switch (settings.text_ai_provider) {
    case 'openai':
      endpoint = settings.text_ai_endpoint_url || 'https://api.openai.com/v1/chat/completions';
      body = {
        model: settings.text_ai_model,
        messages: [{
          role: 'system',
          content: `Ты опытный копирайтер. Генерируй ${field} для блога.`
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: settings.text_ai_temperature,
        max_tokens: settings.text_ai_max_tokens
      };
      headers = {
        'Authorization': `Bearer ${settings.text_ai_api_key}`,
        'Content-Type': 'application/json'
      };
      break;

    case 'deepseek':
      endpoint = settings.text_ai_endpoint_url || 'https://www.deepseekapp.io/v1/chat/completions';
      body = {
        model: settings.text_ai_model,
        messages: [{
          role: 'system',
          content: `Ты опытный копирайтер. Генерируй ${field} для блога.`
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: settings.text_ai_temperature,
        max_tokens: settings.text_ai_max_tokens
      };
      headers = {
        'Authorization': `Bearer ${settings.text_ai_api_key}`,
        'Content-Type': 'application/json'
      };
      break;

    case 'anthropic':
      endpoint = settings.text_ai_endpoint_url || 'https://api.anthropic.com/v1/messages';
      body = {
        model: settings.text_ai_model,
        messages: [{
          role: 'user',
          content: `Сгенерируй ${field} для блога на тему: ${prompt}`
        }],
        max_tokens: settings.text_ai_max_tokens
      };
      headers = {
        'x-api-key': settings.text_ai_api_key,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      };
      break;

    case 'custom':
      if (!settings.text_ai_endpoint_url) {
        throw new Error('URL для кастомного AI не настроен');
      }
      endpoint = settings.text_ai_endpoint_url;
      body = {
        prompt,
        type: field,
        temperature: settings.text_ai_temperature,
        max_tokens: settings.text_ai_max_tokens
      };
      headers = {
        'Authorization': `Bearer ${settings.text_ai_api_key}`,
        'Content-Type': 'application/json'
      };
      break;

    default:
      throw new Error('Неподдерживаемый провайдер AI');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error('Ошибка при генерации текста');
  }

  const data = await response.json();
  
  // Извлекаем текст из ответа в зависимости от провайдера
  switch (settings.text_ai_provider) {
    case 'openai':
      return data.choices[0].message.content;
    case 'deepseek':
      return data.choices[0].message.content;

    case 'anthropic':
      return data.content[0].text;
    case 'custom':
      return data.text;
    default:
      throw new Error('Неподдерживаемый формат ответа');
  }
}

export async function generateImage(prompt: string): Promise<string> {
  const settings = await getAISettings();
  
  if (!settings.image_ai_api_key) {
    throw new Error('API ключ для генерации изображений не настроен в настройках');
  }

  let endpoint = '';
  let body = {};
  let headers = {};

  switch (settings.image_ai_provider) {
    case 'openai':
      endpoint = settings.image_ai_endpoint_url || 'https://api.openai.com/v1/images/generations';
      body = {
        model: settings.image_ai_model,
        prompt: prompt,
        n: 1,  // Генерируем одно изображение за раз
        size: '1024x1024',
        quality: 'standard',
        style: 'natural'
      };
      headers = {
        'Authorization': `Bearer ${settings.image_ai_api_key}`,
        'Content-Type': 'application/json'
      };
      break;

    case 'stability':
      endpoint = settings.image_ai_endpoint_url || 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';
      body = {
        text_prompts: [{ text: prompt }],
        model: settings.image_ai_model,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1
      };
      headers = {
        'Authorization': `Bearer ${settings.image_ai_api_key}`,
        'Content-Type': 'application/json'
      };
      break;

    case 'custom':
      if (!settings.image_ai_endpoint_url) {
        throw new Error('URL для кастомного AI не настроен');
      }
      endpoint = settings.image_ai_endpoint_url;
      body = {
        prompt,
        model: settings.image_ai_model
      };
      headers = {
        'Authorization': `Bearer ${settings.image_ai_api_key}`,
        'Content-Type': 'application/json'
      };
      break;

    default:
      throw new Error('Неподдерживаемый провайдер AI');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error('Ошибка при генерации изображения');
  }

  const data = await response.json();
  
  // Извлекаем URL изображения из ответа в зависимости от провайдера
  switch (settings.image_ai_provider) {
    case 'openai':
      return data.data[0].url;
    case 'stability':
      return `data:image/png;base64,${data.artifacts[0].base64}`;
    case 'custom':
      return data.image_url;
    default:
      throw new Error('Неподдерживаемый формат ответа');
  }
}