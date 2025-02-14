import { supabase } from './supabase';
import { rateLimiter } from './utils/rateLimit';

interface AISettings {
  text_ai_provider: string;
  text_ai_model: string;
  text_ai_api_key: string | null;
  text_ai_endpoint_url: string | null;
  text_ai_temperature: number;
  text_ai_max_tokens: number;
}

export interface GenerationStatus {
  field: string;
  progress: number;
  status: 'pending' | 'generating' | 'completed' | 'error';
  error?: string;
}

export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const fieldPrompts = {
  title: {
    prompt: (topic: string) => `Создай краткий, привлекательный заголовок для статьи о ${topic}. Только заголовок, без кавычек и пояснений.`,
    maxTokens: 60
  },
  description: {
    prompt: (topic: string) => `Напиши подробное описание проекта о ${topic}. Используй профессиональный стиль, опиши ключевые особенности и преимущества. Только текст описания, без пояснений.`,
    maxTokens: 500
  },
  content: {
    prompt: (topic: string) => `Напиши подробную статью о ${topic}. Используй подзаголовки, списки и примеры. Только текст статьи, без пояснений.`,
    maxTokens: 2000
  },
  meta_title: {
    prompt: (topic: string) => `Создай SEO-заголовок для статьи о ${topic}. Только заголовок, без кавычек и пояснений.`,
    maxTokens: 60
  },
  meta_description: {
    prompt: (topic: string) => `Напиши краткое SEO-описание для статьи о ${topic}. Только описание, без кавычек и пояснений.`,
    maxTokens: 160
  },
  meta_keywords: {
    prompt: (topic: string) => `Создай список из 5-7 ключевых слов через запятую для статьи о ${topic}. Верните в виде значений, разделенных запятыми.`,
    maxTokens: 100
  }
};

export function cleanAiResponse(text: string): string {
  return text
    .replace(/[""]/g, '')
    .replace(/[*#]/g, '')
    .replace(/^\s+|\s+$/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\$~~~\$.*?\$~~~\$/g, '')
    .replace(/^["'\s]+|["'\s]+$/g, '');
}

async function getAISettings(): Promise<AISettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (error) throw new Error('Ошибка при загрузке настроек AI');
  if (!data) throw new Error('Настройки AI не найдены');
  return data;
}

async function makeApiRequest<T>(endpoint: string, data: any, apiKey: string): Promise<T> {
  return rateLimiter.enqueue(async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error?.message || `Ошибка API (${response.status})`,
        response.status
      );
    }

    return response.json();
  });
}

export async function generateText(
  topic: string,
  field: keyof typeof fieldPrompts,
  onProgress?: (status: GenerationStatus) => void
): Promise<string> {
  try {
    onProgress?.({
      field,
      progress: 0,
      status: 'generating'
    });

    const settings = await getAISettings();
    
    if (!settings.text_ai_api_key) {
      throw new Error('API ключ для генерации текста не настроен');
    }

    onProgress?.({
      field,
      progress: 25,
      status: 'generating'
    });

    const endpoint = settings.text_ai_endpoint_url;
    if (!endpoint) {
      throw new Error('URL эндпоинта для генерации текста не настроен');
    }

    const prompt = fieldPrompts[field].prompt(topic);
    
    let requestBody: any = {};
    
    if (settings.text_ai_provider === 'openai') {
      requestBody = {
        model: settings.text_ai_model,
        messages: [
          {
            role: 'system',
            content: 'Ты SEO-копирайтер. Создавай только чистый текст без форматирования и пояснений.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: settings.text_ai_temperature,
        max_tokens: fieldPrompts[field].maxTokens,
        stream: false
      };
    } else {
      requestBody = {
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: settings.text_ai_model,
        stream: false
      };
    }

    onProgress?.({
      field,
      progress: 50,
      status: 'generating'
    });

    const data = await makeApiRequest(endpoint, requestBody, settings.text_ai_api_key);

    onProgress?.({
      field,
      progress: 75,
      status: 'generating'
    });

    let content: string;
    
    if (data.choices?.[0]?.message?.content) {
      content = data.choices[0].message.content;
    } else if (data.choices?.[0]?.text) {
      content = data.choices[0].text;
    } else if (typeof data.choices?.[0] === 'string') {
      content = data.choices[0];
    } else if (typeof data.response === 'string') {
      content = data.response;
    } else {
      throw new Error('Неподдерживаемый формат ответа от API');
    }

    const cleanedContent = cleanAiResponse(content);

    onProgress?.({
      field,
      progress: 100,
      status: 'completed'
    });

    return cleanedContent;
  } catch (error) {
    onProgress?.({
      field,
      progress: 100,
      status: 'error',
      error: error instanceof Error ? error.message : 'Ошибка генерации'
    });
    throw error;
  }
}