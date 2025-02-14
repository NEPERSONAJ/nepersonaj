import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Image, Loader2, Wand2, Sparkles, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { uploadImage } from '../../lib/imgbb';
import { generateText } from '../../lib/ai';
import { GenerationProgress } from '../../components/GenerationProgress';
import type { Project, GenerationStatus } from '../../types/database';

interface ProjectForm {
  title: string;
  description: string;
  image_url: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
  og_description: string;
  canonical_url: string;
  status: 'draft' | 'published';
  slug: string;
  featured: boolean;
  sort_order: number;
  technologies: { name: string; icon_url?: string; color?: string }[];
}

export function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
  const [additionalImages, setAdditionalImages] = useState<{ url: string; alt: string }[]>([]);
  const [topic, setTopic] = useState('');
  const [generatingField, setGeneratingField] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus | null>(null);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm<ProjectForm>({
    defaultValues: {
      technologies: [],
      status: 'draft',
      featured: false,
      sort_order: 0
    }
  });
  
  const imageUrl = watch('image_url');
  const featured = watch('featured');

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          images:project_images(*),
          technologies:project_technologies(*)
        `)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      toast.error('Ошибка при загрузке проектов');
    } finally {
      setLoading(false);
    }
  }

  const handleGenerateAll = async () => {
    if (!topic) {
      toast.error('Сначала введите тему для генерации контента');
      return;
    }

    const fields = ['title', 'description', 'meta_title', 'meta_description', 'meta_keywords'] as const;
    
    for (const field of fields) {
      try {
        setGenerationStatus({
          field,
          progress: 0,
          status: 'generating'
        });

        const content = await generateText(topic, field, (status) => {
          setGenerationStatus(status);
        });

        setValue(field, content);
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ошибка при генерации контента';
        toast.error(`Ошибка при генерации ${field}: ${errorMessage}`);
        setGenerationStatus(null);
        break;
      }
    }

    setGenerationStatus(null);
    toast.success('Все поля успешно сгенерированы');
  };

  const handleGenerate = async (field: string) => {
    if (!topic) {
      toast.error('Сначала введите тему для генерации контента');
      return;
    }

    setGeneratingField(field);
    try {
      setGenerationStatus({
        field,
        progress: 0,
        status: 'generating'
      });

      const content = await generateText(topic, field, (status) => {
        setGenerationStatus(status);
      });

      setValue(field, content);
      toast.success(`${field === 'meta_keywords' ? 'Ключевые слова' : field} сгенерированы`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при генерации контента';
      toast.error(errorMessage);
    } finally {
      setGeneratingField(null);
      setGenerationStatus(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImageUploading(true);
    try {
      const uploadPromises = files.map(file => uploadImage(file));
      const urls = await Promise.all(uploadPromises);
      
      if (urls.length > 0) {
        setValue('image_url', urls[0]);
        
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

  const onSubmit = async (data: ProjectForm) => {
    try {
      if (editingProject) {
        const { error: projectError } = await supabase
          .from('projects')
          .update({
            title: data.title,
            description: data.description,
            image_url: data.image_url,
            meta_title: data.meta_title || null,
            meta_description: data.meta_description || null,
            meta_keywords: data.meta_keywords ? data.meta_keywords.split(',').map(k => k.trim()) : null,
            og_image: data.og_image || data.image_url,
            og_description: data.og_description || null,
            canonical_url: data.canonical_url || null,
            status: data.status,
            slug: data.slug || null,
            featured: data.featured,
            sort_order: data.sort_order
          })
          .eq('id', editingProject.id);

        if (projectError) throw projectError;

        if (additionalImages.length > 0) {
          await supabase
            .from('project_images')
            .delete()
            .eq('project_id', editingProject.id);

          const { error: imagesError } = await supabase
            .from('project_images')
            .insert(
              additionalImages.map((img, index) => ({
                project_id: editingProject.id,
                image_url: img.url,
                alt_text: img.alt,
                sort_order: index
              }))
            );

          if (imagesError) throw imagesError;
        }

        if (data.technologies.length > 0) {
          await supabase
            .from('project_technologies')
            .delete()
            .eq('project_id', editingProject.id);

          const { error: techError } = await supabase
            .from('project_technologies')
            .insert(
              data.technologies.map((tech, index) => ({
                project_id: editingProject.id,
                name: tech.name,
                icon_url: tech.icon_url || null,
                color: tech.color || null,
                sort_order: index
              }))
            );

          if (techError) throw techError;
        }

        toast.success('Проект обновлен');
      } else {
        const { data: newProject, error: projectError } = await supabase
          .from('projects')
          .insert([{
            title: data.title,
            description: data.description,
            image_url: data.image_url,
            meta_title: data.meta_title || null,
            meta_description: data.meta_description || null,
            meta_keywords: data.meta_keywords ? data.meta_keywords.split(',').map(k => k.trim()) : null,
            og_image: data.og_image || data.image_url,
            og_description: data.og_description || null,
            canonical_url: data.canonical_url || null,
            status: data.status,
            slug: data.slug || null,
            featured: data.featured,
            sort_order: data.sort_order
          }])
          .select()
          .single();

        if (projectError) throw projectError;

        if (additionalImages.length > 0 && newProject) {
          const { error: imagesError } = await supabase
            .from('project_images')
            .insert(
              additionalImages.map((img, index) => ({
                project_id: newProject.id,
                image_url: img.url,
                alt_text: img.alt,
                sort_order: index
              }))
            );

          if (imagesError) throw imagesError;
        }

        if (data.technologies.length > 0 && newProject) {
          const { error: techError } = await supabase
            .from('project_technologies')
            .insert(
              data.technologies.map((tech, index) => ({
                project_id: newProject.id,
                name: tech.name,
                icon_url: tech.icon_url || null,
                color: tech.color || null,
                sort_order: index
              }))
            );

          if (techError) throw techError;
        }

        toast.success('Проект создан');
      }

      reset();
      setEditingProject(null);
      setAdditionalImages([]);
      setShowForm(false);
      setShowProjects(true);
      fetchProjects();
    } catch (error) {
      toast.error('Ошибка при сохранении проекта');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
    setShowProjects(false);
    setValue('title', project.title);
    setValue('description', project.description);
    setValue('image_url', project.image_url);
    setValue('meta_title', project.meta_title || '');
    setValue('meta_description', project.meta_description || '');
    setValue('meta_keywords', project.meta_keywords?.join(', ') || '');
    setValue('og_image', project.og_image || '');
    setValue('og_description', project.og_description || '');
    setValue('canonical_url', project.canonical_url || '');
    setValue('status', project.status);
    setValue('slug', project.slug || '');
    setValue('featured', project.featured);
    setValue('sort_order', project.sort_order);
    setAdditionalImages(
      project.images?.map(img => ({
        url: img.image_url,
        alt: img.alt_text || ''
      })) || []
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот проект?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Проект удален');
      fetchProjects();
    } catch (error) {
      toast.error('Ошибка при удалении проекта');
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
      <GenerationProgress status={generationStatus} />
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl lg:text-2xl font-bold gradient-text">Проекты</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingProject(null);
            setShowProjects(false);
            reset();
            setAdditionalImages([]);
          }}
          className="px-4 py-2 bg-[#00ff8c]/20 rounded-lg flex items-center gap-2 hover:bg-[#00ff8c]/30 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Создать проект
        </button>
      </div>

      {showForm && (
        <div className="bg-[#12121A] p-6 rounded-lg neon-border">
          <h2 className="text-xl lg:text-2xl font-bold mb-6 gradient-text">
            {editingProject ? 'Редактировать проект' : 'Создать новый проект'}
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
                onClick={handleGenerateAll}
                disabled={!topic || generationStatus !== null}
                className="px-4 py-2 bg-[#00ff8c]/20 rounded-lg flex items-center gap-2 hover:bg-[#00ff8c]/30 transition-colors disabled:opacity-50"
              >
                {generationStatus ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Wand2 className="w-5 h-5" />
                )}
                Сгенерировать описание
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <div className="flex gap-4 mb-4">
                <input
                  {...register('title', { required: 'Заголовок обязателен' })}
                  placeholder="Название проекта"
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
            </div>

            <div>
              <div className="flex gap-4 mb-4">
                <textarea
                  {...register('description', { required: 'Описание обязательно' })}
                  placeholder="Описание проекта"
                  rows={6}
                  className="flex-1 p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none resize-none"
                />
                <button
                  type="button"
                  onClick={() => handleGenerate('description')}
                  disabled={!topic || generatingField === 'description'}
                  className="px-4 py-2 bg-[#00ff8c]/20 rounded-lg flex items-center gap-2 hover:bg-[#00ff8c]/30 transition-colors disabled:opacity-50"
                >
                  {generatingField === 'description' ? (
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
                  title="Краткое описание для поисковых систем"
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
            </div>

            <div>
              <input
                {...register('canonical_url')}
                placeholder="Канонический URL"
                title="URL основной версии страницы"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
              />
            </div>

            <div>
              <input
                {...register('slug')}
                placeholder="URL-slug (например: my-awesome-project)"
                title="URL-friendly название проекта"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <select
                  {...register('status')}
                  className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
                >
                  <option value="draft">Черновик</option>
                  <option value="published">Опубликован</option>
                </select>
              </div>
              <div>
                <input
                  {...register('sort_order', { valueAsNumber: true })}
                  type="number"
                  placeholder="Порядок сортировки"
                  className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('featured')}
                  type="checkbox"
                  className="hidden"
                />
                <div className={`w-6 h-6 rounded border ${featured ? 'bg-[#00ff8c]/20 border-[#00ff8c]' : 'border-gray-600'} flex items-center justify-center transition-colors`}>
                  {featured && <Star className="w-4 h-4 text-[#00ff8c]" />}
                </div>
                <span>Избранный проект</span>
              </label>
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
                {editingProject ? (
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
              {editingProject && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(null);
                    setShowProjects(true);
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
        </div>
      )}

      {showProjects && (
        <div className="grid gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#12121A] p-4 lg:p-6 rounded-lg neon-border"
            >
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full lg:w-48 h-48 lg:h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full lg:w-48 h-48 lg:h-32 bg-[#1A1A1A] rounded-lg flex items-center justify-center">
                    <Image className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">
                      {project.title}
                      {project.meta_title && (
                        <span className="ml-2 text-sm text-gray-400">
                          (SEO: {project.meta_title})
                        </span>
                      )}
                    </h3>
                    {project.featured && (
                      <Star className="w-5 h-5 text-[#00ff8c]" />
                    )}
                  </div>
                  <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                  {project.meta_keywords && project.meta_keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.meta_keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-sm bg-[#00ff8c]/10 rounded-full text-[#00ff8c]"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech.id}
                          className="px-2 py-1 text-sm bg-[#00ff8c]/10 rounded-full text-[#00ff8c] flex items-center gap-1"
                        >
                          {tech.icon_url && (
                            <img
                              src={tech.icon_url}
                              alt={tech.name}
                              className="w-4 h-4"
                            />
                          )}
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.images && project.images.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                      {project.images.map((image) => (
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
                      onClick={() => handleEdit(project)}
                      className="px-4 py-2 bg-[#00ff8c]/20 rounded-lg flex items-center gap-2 hover:bg-[#00ff8c]/30 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
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
        </div>
      )}
    </div>
  );
}