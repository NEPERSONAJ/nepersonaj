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
  storage_provider: string;
  storage_api_key: string;
  storage_endpoint_url: string;
}

export function SettingsManagement() {
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  
  const { register, handleSubmit, setValue, watch } = useForm<SettingsForm>();
  const logoUrl = watch('logo_url');

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
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
              />
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

            {/* Image AI Settings */}
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
              <label className="block text-sm font-medium mb-2">Модель для изображений</label>
              <input
                {...register('image_ai_model')}
                placeholder="Название модели (например, dall-e-3)"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL для генерации изображений</label>
              <input
                {...register('image_ai_endpoint_url')}
                placeholder="URL эндпоинта (для своего сервиса)"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
              />
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