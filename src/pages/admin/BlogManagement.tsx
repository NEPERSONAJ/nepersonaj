import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Image, Loader2, Wand2, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { uploadImage } from '../../lib/imgbb';
import { generateText, generateImage } from '../../lib/ai';
import type { BlogPost } from '../../types/database';

interface BlogPostForm {
  title: string;
  content: string;
  image_url: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
  canonical_url: string;
  images: { url: string; alt: string }[];
}

export function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPosts, setShowPosts] = useState(true);
  const [additionalImages, setAdditionalImages] = useState<{ url: string; alt: string }[]>([]);
  const [topic, setTopic] = useState('');
  const [generatingField, setGeneratingField] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm<BlogPostForm>();
  const imageUrl = watch('image_url');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          images:blog_post_images(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast.error('Ошибка при загрузке постов');
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImageUploading(true);
    try {
      const uploadPromises = files.map(file => uploadImage(file));
      const urls = await Promise.all(uploadPromises);
      
      if (urls.length > 0) {
        // Первое изображение становится основным
        setValue('image_url', urls[0]);
        
        // Остальные добавляются в дополнительные
        if (urls.length > 1) {
          const newImages = urls.slice(1).map(url => ({ url, alt: '' }));
          setAdditionalImages([...additionalImages, ...newImages]);
        }
      }

      toast.success('Изображение загружено');
    } catch (error) {
      toast.error('Ошибка при загрузке изображения');
    } finally {
      setImageUploading(false);
    }
  };

  const handleGenerate = async (field: string) => {
    if (!topic) {
      toast.error('Сначала введите тему для генерации контента');
      return;
    }

    setGeneratingField(field);
    try {
      const content = await generateText(topic, field);
      
      // Форматируем ключевые слова, если это meta_keywords
      if (field === 'meta_keywords') {
        setValue(field, content.split(',').map(k => k.trim()).join(', '));
      } else {
        setValue(field, content);
      }
      
      toast.success(`${field === 'meta_keywords' ? 'Ключевые слова' : field} сгенерированы`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при генерации контента';
      toast.error(errorMessage);
    } finally {
      setGeneratingField(null);
    }
  };

  const handleGenerateImage = async () => {
    if (!topic) {
      toast.error('Сначала введите тему для генерации изображения');
      return;
    }

    setGeneratingField('image');
    try {
      const imageUrl = await generateImage(topic);
      setValue('image_url', imageUrl);
      
      const newImage = { 
        url: imageUrl, 
        alt: `Изображение для статьи на тему: ${topic}` 
      };
      setAdditionalImages([...additionalImages, newImage]);
      toast.success('Изображение сгенерировано');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при генерации изображения';
      toast.error(errorMessage);
    } finally {
      setGeneratingField(null);
    }
  };

  const onSubmit = async (data: BlogPostForm) => {
    try {
      if (editingPost) {
        // Обновляем основную информацию поста
        const { error: postError } = await supabase
          .from('blog_posts')
          .update({
            title: data.title,
            content: data.content,
            image_url: data.image_url,
            meta_title: data.meta_title || null,
            meta_description: data.meta_description || null,
            meta_keywords: data.meta_keywords ? data.meta_keywords.split(',').map(k => k.trim()) : null,
            og_image: data.og_image || data.image_url,
            canonical_url: data.canonical_url || null
          })
          .eq('id', editingPost.id);

        if (postError) throw postError;

        // Обновляем дополнительные изображения
        if (additionalImages.length > 0) {
          // Удаляем старые изображения
          await supabase
            .from('blog_post_images')
            .delete()
            .eq('post_id', editingPost.id);

          // Добавляем новые
          const { error: imagesError } = await supabase
            .from('blog_post_images')
            .insert(
              additionalImages.map((img, index) => ({
                post_id: editingPost.id,
                image_url: img.url,
                alt_text: img.alt,
                sort_order: index
              }))
            );

          if (imagesError) throw imagesError;
        }

        toast.success('Пост обновлен');
      } else {
        // Создаем новый пост
        const { data: newPost, error: postError } = await supabase
          .from('blog_posts')
          .insert([{
            title: data.title,
            content: data.content,
            image_url: data.image_url,
            meta_title: data.meta_title || null,
            meta_description: data.meta_description || null,
            meta_keywords: data.meta_keywords ? data.meta_keywords.split(',').map(k => k.trim()) : null,
            og_image: data.og_image || data.image_url,
            canonical_url: data.canonical_url || null
          }])
          .select()
          .single();

        if (postError) throw postError;

        // Добавляем дополнительные изображения
        if (additionalImages.length > 0 && newPost) {
          const { error: imagesError } = await supabase
            .from('blog_post_images')
            .insert(
              additionalImages.map((img, index) => ({
                post_id: newPost.id,
                image_url: img.url,
                alt_text: img.alt,
                sort_order: index
              }))
            );

          if (imagesError) throw imagesError;
        }

        toast.success('Пост создан');
      }

      reset();
      setEditingPost(null);
      setAdditionalImages([]);
      setShowForm(false);
      setShowPosts(true);
      fetchPosts();
    } catch (error) {
      toast.error('Ошибка при сохранении поста');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowForm(true);
    setShowPosts(false);
    setValue('title', post.title);
    setValue('content', post.content);
    setValue('image_url', post.image_url);
    setValue('meta_title', post.meta_title || '');
    setValue('meta_description', post.meta_description || '');
    setValue('meta_keywords', post.meta_keywords?.join(', ') || '');
    setValue('og_image', post.og_image || '');
    setValue('canonical_url', post.canonical_url || '');
    setAdditionalImages(
      post.images?.map(img => ({
        url: img.image_url,
        alt: img.alt_text || ''
      })) || []
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот пост?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Пост удален');
      fetchPosts();
    } catch (error) {
      toast.error('Ошибка при удалении поста');
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
      {/* Список постов */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl lg:text-2xl font-bold gradient-text">Блог</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingPost(null);
            setShowPosts(false);
            reset();
            setAdditionalImages([]);
          }}
          className="px-4 py-2 bg-[#00ff8c]/20 rounded-lg flex items-center gap-2 hover:bg-[#00ff8c]/30 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Создать пост
        </button>
      </div>

      {/* Форма создания/редактирования */}
      {showForm && (
        <div className="bg-[#12121A] p-6 rounded-lg neon-border">
        <h2 className="text-xl lg:text-2xl font-bold mb-6 gradient-text">
          {editingPost ? 'Редактировать пост' : 'Создать новый пост'}
        </h2>
        <div className="mb-6">
          <div className="flex gap-4 items-center mb-4">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Тема для генерации контента"
              className="flex-1 p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
            />
            <button
              type="button"
              onClick={() => handleGenerateImage()}
              disabled={!topic || generatingField === 'image'}
              className="px-4 py-2 bg-[#00ff8c]/20 rounded-lg flex items-center gap-2 hover:bg-[#00ff8c]/30 transition-colors disabled:opacity-50"
            >
              {generatingField === 'image' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
              Сгенерировать изображение
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="flex gap-4 mb-4">
            <input
              {...register('title', { required: 'Заголовок обязателен' })}
              placeholder="Заголовок поста"
              className="flex-1 p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
            />
              <button
                type="button"
                onClick={() => handleGenerate('title')}
                disabled={!topic || generatingField === 'title'}
                className="px-4 py-2 bg-[#00ff8c]/20 rounded-lg flex items-center gap-2 hover:bg-[#00ff8c]/30 transition-colors disabled:opacity-50"
              >
                {generatingField === 'title' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex gap-4">
            <input
              {...register('meta_title')}
              placeholder="SEO заголовок"
              title="Оптимизированный заголовок для поисковых систем"
              className="flex-1 p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
            />
              <button
                type="button"
                onClick={() => handleGenerate('meta_title')}
                disabled={!topic || generatingField === 'meta_title'}
                className="px-4 py-2 bg-[#00ff8c]/20 rounded-lg flex items-center gap-2 hover:bg-[#00ff8c]/30 transition-colors disabled:opacity-50"
              >
                {generatingField === 'meta_title' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Рекомендуемая длина: 50-60 символов
            </p>
          </div>

          <div>
            <div className="flex gap-4 mb-4">
            <textarea
              {...register('content', { required: 'Содержание обязательно' })}
              placeholder="Содержание поста"
              rows={6}
              className="flex-1 p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none resize-none"
            />
              <button
                type="button"
                onClick={() => handleGenerate('content')}
                disabled={!topic || generatingField === 'content'}
                className="px-4 py-2 bg-[#00ff8c]/20 rounded-lg flex items-center gap-2 hover:bg-[#00ff8c]/30 transition-colors disabled:opacity-50"
              >
                {generatingField === 'content' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex gap-4">
            <textarea
              {...register('meta_description')}
              placeholder="SEO описание"
              title="Краткое описание страницы для поисковых систем"
              rows={2}
              className="flex-1 p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none resize-none"
            />
              <button
                type="button"
                onClick={() => handleGenerate('meta_description')}
                disabled={!topic || generatingField === 'meta_description'}
                className="px-4 py-2 bg-[#00ff8c]/20 rounded-lg flex items-center gap-2 hover:bg-[#00ff8c]/30 transition-colors disabled:opacity-50"
              >
                {generatingField === 'meta_description' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Рекомендуемая длина: 150-160 символов
            </p>
          </div>

          <div>
            <div className="flex gap-4">
            <input
              {...register('meta_keywords')}
              placeholder="SEO ключевые слова (через запятую)"
              title="Ключевые слова, разделенные запятыми"
              className="flex-1 p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
            />
              <button
                type="button"
                onClick={() => handleGenerate('meta_keywords')}
                disabled={!topic || generatingField === 'meta_keywords'}
                className="px-4 py-2 bg-[#00ff8c]/20 rounded-lg flex items-center gap-2 hover:bg-[#00ff8c]/30 transition-colors disabled:opacity-50"
              >
                {generatingField === 'meta_keywords' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Пример: веб-разработка, React, JavaScript
            </p>
          </div>

          <div>
            <input
              {...register('canonical_url')}
              placeholder="Канонический URL"
              title="URL основной версии страницы"
              className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
            />
            <p className="mt-1 text-sm text-gray-400">
              Пример: https://example.com/blog/my-post
            </p>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-[#00ff8c]/20 rounded-lg cursor-pointer hover:bg-[#00ff8c]/30 transition-colors">
                <Image className="w-5 h-5" />
                {imageUploading ? 'Загрузка...' : 'Загрузить изображения'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
            </div>
            <input
              {...register('image_url')}
              type="hidden"
            />
            {/* Дополнительные изображения */}
            {additionalImages.length > 0 && (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold">Дополнительные изображения</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {additionalImages.map((img, index) => (
                    <div key={index} className="space-y-2">
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <input
                        value={img.alt}
                        onChange={(e) => {
                          const newImages = [...additionalImages];
                          newImages[index].alt = e.target.value;
                          setAdditionalImages(newImages);
                        }}
                        placeholder="Alt текст"
                        className="w-full p-2 text-sm rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setAdditionalImages(additionalImages.filter((_, i) => i !== index));
                        }}
                        className="w-full px-2 py-1 text-sm bg-red-500/20 rounded-lg text-red-500 hover:bg-red-500/30 transition-colors"
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#00ff8c]/20 rounded-lg flex items-center gap-2 hover:bg-[#00ff8c]/30 transition-colors"
              disabled={imageUploading}
            >
              {editingPost ? (
                <>
                  <Pencil className="w-5 h-5" />
                  Обновить
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Создать
                </>
              )}
            </button>
            {editingPost && (
              <button
                type="button"
                onClick={() => {
                  setEditingPost(null);
                  setShowPosts(true);
                  reset();
                  setShowForm(false);
                }}
                className="px-6 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>)}

      {showPosts && <div className="grid gap-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#12121A] p-4 lg:p-6 rounded-lg neon-border"
          >
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full lg:w-48 h-48 lg:h-32 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full lg:w-48 h-48 lg:h-32 bg-[#1A1A1A] rounded-lg flex items-center justify-center">
                  <Image className="w-12 h-12 text-gray-600" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {post.title}
                  {post.meta_title && (
                    <span className="ml-2 text-sm text-gray-400">
                      (SEO: {post.meta_title})
                    </span>
                  )}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{post.content}</p>
                {post.meta_keywords && post.meta_keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.meta_keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-sm bg-[#00ff8c]/10 rounded-full text-[#00ff8c]"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
                {post.images && post.images.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {post.images.map((image) => (
                      <img
                        key={image.id}
                        src={image.image_url}
                        alt={image.alt_text || ''}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 lg:gap-4">
                  <button
                    onClick={() => handleEdit(post)}
                    className="px-4 py-2 bg-[#00ff8c]/20 rounded-lg flex items-center gap-2 hover:bg-[#00ff8c]/30 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-4 py-2 bg-red-500/20 rounded-lg flex items-center gap-2 hover:bg-red-500/30 transition-colors text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>}
    </div>
  );
}