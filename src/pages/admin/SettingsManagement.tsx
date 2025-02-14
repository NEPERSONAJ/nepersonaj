import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Image } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { uploadImage } from '../../lib/imgbb';
import type { SiteSettings } from '../../types/database';

interface SettingsForm {
  site_name: string;
  logo_url: string;
  telegram_bot_token: string;
  telegram_chat_id: string;
  telegram_url: string;
  whatsapp_url: string;
  youtube_url: string;
  vk_url: string;
  twitter_url: string;
  instagram_url: string;
  email: string;
  phone: string;
  show_telegram: boolean;
  show_whatsapp: boolean;
  show_youtube: boolean;
  show_vk: boolean;
  show_twitter: boolean;
  show_instagram: boolean;
  show_email: boolean;
  show_phone: boolean;
  text_ai_provider: string;
  text_ai_model: string;
  text_ai_api_key: string;
  text_ai_endpoint_url: string;
  text_ai_temperature: number;
  text_ai_max_tokens: number;
  image_ai_provider: string;
  image_ai_model: string;
  image_ai_api_key: string;
  image_ai_endpoint_url: string;
  image_storage_url: string;
  storage_provider: string;
  storage_api_key: string;
  storage_endpoint_url: string;
}

export function SettingsManagement() {
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  
  const { register, handleSubmit, setValue, watch } = useForm<SettingsForm>();
  const logoUrl = watch('logo_url');
  const imageAiProvider = watch('image_ai_provider');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) throw error;
      
      if (data) {
        setValue('site_name', data.site_name);
        setValue('logo_url', data.logo_url || '');
        setValue('telegram_bot_token', data.telegram_bot_token || '');
        setValue('telegram_chat_id', data.telegram_chat_id || '');
        setValue('telegram_url', data.telegram_url || '');
        setValue('whatsapp_url', data.whatsapp_url || '');
        setValue('youtube_url', data.youtube_url || '');
        setValue('vk_url', data.vk_url || '');
        setValue('twitter_url', data.twitter_url || '');
        setValue('instagram_url', data.instagram_url || '');
        setValue('email', data.email || '');
        setValue('phone', data.phone || '');
        setValue('show_telegram', data.show_telegram || false);
        setValue('show_whatsapp', data.show_whatsapp || false);
        setValue('show_youtube', data.show_youtube || false);
        setValue('show_vk', data.show_vk || false);
        setValue('show_twitter', data.show_twitter || false);
        setValue('show_instagram', data.show_instagram || false);
        setValue('show_email', data.show_email || false);
        setValue('show_phone', data.show_phone || false);
        setValue('text_ai_provider', data.text_ai_provider);
        setValue('text_ai_model', data.text_ai_model);
        setValue('text_ai_api_key', data.text_ai_api_key || '');
        setValue('text_ai_endpoint_url', data.text_ai_endpoint_url || '');
        setValue('text_ai_temperature', data.text_ai_temperature);
        setValue('text_ai_max_tokens', data.text_ai_max_tokens);
        setValue('image_ai_provider', data.image_ai_provider);
        setValue('image_ai_model', data.image_ai_model);
        setValue('image_ai_api_key', data.image_ai_api_key || '');
        setValue('image_ai_endpoint_url', data.image_ai_endpoint_url || '');
        setValue('image_storage_url', data.image_storage_url || '');
        setValue('storage_provider', data.storage_provider);
        setValue('storage_api_key', data.storage_api_key || '');
        setValue('storage_endpoint_url', data.storage_endpoint_url || '');
      }
    } catch (error) {
      toast.error('Ошибка при загрузке настроек');
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setValue('logo_url', imageUrl);
      toast.success('Логотип загружен');
    } catch (error) {
      toast.error('Ошибка при загрузке логотипа');
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = async (data: SettingsForm) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          site_name: data.site_name,
          logo_url: data.logo_url || null,
          telegram_bot_token: data.telegram_bot_token || null,
          telegram_chat_id: data.telegram_chat_id || null,
          telegram_url: data.telegram_url || null,
          whatsapp_url: data.whatsapp_url || null,
          youtube_url: data.youtube_url || null,
          vk_url: data.vk_url || null,
          twitter_url: data.twitter_url || null,
          instagram_url: data.instagram_url || null,
          email: data.email || null,
          phone: data.phone || null,
          show_telegram: data.show_telegram,
          show_whatsapp: data.show_whatsapp,
          show_youtube: data.show_youtube,
          show_vk: data.show_vk,
          show_twitter: data.show_twitter,
          show_instagram: data.show_instagram,
          show_email: data.show_email,
          show_phone: data.show_phone,
          text_ai_provider: data.text_ai_provider,
          text_ai_model: data.text_ai_model,
          text_ai_api_key: data.text_ai_api_key || null,
          text_ai_endpoint_url: data.text_ai_endpoint_url || null,
          text_ai_temperature: data.text_ai_temperature,
          text_ai_max_tokens: data.text_ai_max_tokens,
          image_ai_provider: data.image_ai_provider,
          image_ai_model: data.image_ai_model,
          image_ai_api_key: data.image_ai_api_key || null,
          image_ai_endpoint_url: data.image_ai_endpoint_url || null,
          image_storage_url: data.image_storage_url || null,
          storage_provider: data.storage_provider,
          storage_api_key: data.storage_api_key || null,
          storage_endpoint_url: data.storage_endpoint_url || null,
        })
        .eq('site_name', 'NEPERSONAJ');

      if (error) throw error;
      toast.success('Настройки сохранены');
    } catch (error) {
      toast.error('Ошибка при сохранении настроек');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-[#00ff8c]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-[#12121A] p-6 rounded-lg neon-border">
        <h2 className="text-xl lg:text-2xl font-bold mb-6 gradient-text">Настройки сайта</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Название сайта</label>
              <input
                {...register('site_name')}
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Логотип</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-[#00ff8c]/20 rounded-lg cursor-pointer hover:bg-[#00ff8c]/30 transition-colors">
                  <Image className="w-5 h-5" />
                  {imageUploading ? 'Загрузка...' : 'Загрузить логотип'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    className="w-10 h-10 object-contain rounded-lg"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Telegram бот</label>
              <input
                {...register('telegram_bot_token')}
                type="password"
                placeholder="Токен бота"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none mb-4"
              />
              <input
                {...register('telegram_chat_id')}
                placeholder="ID чата"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Социальные сети</label>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        {...register('show_telegram')}
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-600 text-[#00ff8c] focus:ring-[#00ff8c]"
                      />
                      <span>Telegram</span>
                    </label>
                    <input
                      {...register('telegram_url')}
                      placeholder="URL Telegram"
                      className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        {...register('show_whatsapp')}
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-600 text-[#00ff8c] focus:ring-[#00ff8c]"
                      />
                      <span>WhatsApp</span>
                    </label>
                    <input
                      {...register('whatsapp_url')}
                      placeholder="URL WhatsApp"
                      className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        {...register('show_youtube')}
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-600 text-[#00ff8c] focus:ring-[#00ff8c]"
                      />
                      <span>YouTube</span>
                    </label>
                    <input
                      {...register('youtube_url')}
                      placeholder="URL YouTube"
                      className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        {...register('show_vk')}
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-600 text-[#00ff8c] focus:ring-[#00ff8c]"
                      />
                      <span>ВКонтакте</span>
                    </label>
                    <input
                      {...register('vk_url')}
                      placeholder="URL ВКонтакте"
                      className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        {...register('show_twitter')}
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-600 text-[#00ff8c] focus:ring-[#00ff8c]"
                      />
                      <span>Twitter</span>
                    </label>
                    <input
                      {...register('twitter_url')}
                      placeholder="URL Twitter"
                      className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        {...register('show_instagram')}
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-600 text-[#00ff8c] focus:ring-[#00ff8c]"
                      />
                      <span>Instagram</span>
                    </label>
                    <input
                      {...register('instagram_url')}
                      placeholder="URL Instagram"
                      className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        {...register('show_email')}
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-600 text-[#00ff8c] focus:ring-[#00ff8c]"
                      />
                      <span>Email</span>
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Email адрес"
                      className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        {...register('show_phone')}
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-600 text-[#00ff8c] focus:ring-[#00ff8c]"
                      />
                      <span>Телефон</span>
                    </label>
                    <input
                      {...register('phone')}
                      placeholder="Номер телефона"
                      className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Хранилище изображений</label>
              <select
                {...register('storage_provider')}
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none mb-4"
              >
                <option value="imgbb">ImgBB</option>
                <option value="cloudinary">Cloudinary</option>
                <option value="custom">Свой сервис</option>
              </select>
              <input
                {...register('storage_api_key')}
                type="password"
                placeholder="API ключ"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none mb-4"
              />
              <input
                {...register('storage_endpoint_url')}
                placeholder="URL хранилища изображений"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
              />
              <p className="mt-1 text-sm text-gray-400">
                URL сервиса для хранения изображений. Например: https://cdn.example.com/images
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">AI для генерации текста</label>
              <select
                {...register('text_ai_provider')}
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none mb-4"
              >
                <option value="openai">OpenAI</option>
                <option value="deepseek">DeepSeek AI</option>
                <option value="anthropic">Anthropic Claude</option>
                <option value="custom">Свой сервис</option>
              </select>
              <input
                {...register('text_ai_api_key')}
                type="password"
                placeholder="API ключ"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Модель для текста</label>
              <input
                {...register('text_ai_model')}
                placeholder="Название модели (например, gpt-4-turbo-preview)"
                title="Доступные модели DeepSeek: deepseek-v3, deepseek-r1, deepseek-llm-67b-chat"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none mb-4"
              />
              <input
                {...register('text_ai_endpoint_url')}
                placeholder="URL эндпоинта (для своего сервиса)"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Параметры текстовой модели</label>
              <input
                {...register('text_ai_temperature', { 
                  valueAsNumber: true,
                  min: 0,
                  max: 2
                })}
                type="number"
                step="0.1"
                placeholder="Temperature (0-2)"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none mb-4"
              />
              <input
                {...register('text_ai_max_tokens', { 
                  valueAsNumber: true,
                  min: 1
                })}
                type="number"
                placeholder="Max Tokens"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">AI для генерации изображений</label>
              <select
                {...register('image_ai_provider')}
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none mb-4"
              >
                <option value="openai">OpenAI DALL-E</option>
                <option value="stability">Stability AI</option>
                <option value="custom">Свой сервис</option>
              </select>
              <input
                {...register('image_ai_api_key')}
                type="password"
                placeholder="API ключ"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Настройки генерации изображений</label>
              <input
                {...register('image_ai_model')}
                placeholder="Название модели (например, dall-e-3)"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none mb-4"
              />
              <input
                {...register('image_ai_endpoint_url')}
                placeholder="URL API для генерации"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none mb-4"
              />
              <input
                {...register('image_storage_url')}
                placeholder="URL для готовых изображений"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
              />
              <p className="mt-1 text-sm text-gray-400">
                URL, где будут доступны сгенерированные изображения. Например: https://cdn.snapzion.com/a1aa/image
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-[#00ff8c]/20 rounded-lg flex items-center gap-2 hover:bg-[#00ff8c]/30 transition-colors"
              disabled={imageUploading}
            >
              <Save className="w-5 h-5" />
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}