import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Project } from '../types/database';
import { Loader2, Star, ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', mouseMove);
    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1
    },
    hover: {
      scale: 1.5,
      x: mousePosition.x - 16,
      y: mousePosition.y - 16
    }
  };

  useEffect(() => {
    async function fetchProject() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            technologies:project_technologies(*),
            images:project_images(*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#00ff8c]" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] pt-32">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-400">Проект не найден</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.title} | NEPERSONAJ</title>
        <meta name="description" content={project.meta_description || project.description} />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.meta_description || project.description} />
        <meta property="og:image" content={project.og_image || project.image_url} />
        {project.canonical_url && <link rel="canonical" href={project.canonical_url} />}
        {project.meta_keywords && (
          <meta name="keywords" content={project.meta_keywords.join(', ')} />
        )}
      </Helmet>

      <motion.div
        className="custom-cursor"
        variants={variants}
        animate={cursorVariant}
      />

      <Header cursorVariant={cursorVariant} setCursorVariant={setCursorVariant} />

      <div className="min-h-screen bg-[#0A0A0F] pt-32">
        <div className="container mx-auto px-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к проектам
          </Link>

          <article className="max-w-4xl mx-auto">
            <img
              src={project.image_url}
              alt={project.title}
              loading="lazy"
              className="w-full h-64 object-cover rounded-lg mb-8"
            />
            <div className="flex items-center gap-2 mb-6">
              <h1 className="text-4xl font-bold gradient-text">{project.title}</h1>
              {project.featured && (
                <Star className="w-6 h-6 text-[#00ff8c]" />
              )}
            </div>
            <div className="prose prose-invert max-w-none mb-8">
              {project.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-300">{paragraph}</p>
              ))}
            </div>
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.technologies.map((tech) => (
                  <span
                    key={tech.id}
                    className="px-3 py-1 text-sm bg-[#00ff8c]/10 rounded-full text-[#00ff8c] flex items-center gap-2"
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.images.map((image) => (
                  <img
                    key={image.id}
                    src={image.image_url}
                    alt={image.alt_text || ''}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </article>
        </div>
      </div>
    </>
  );
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', mouseMove);
    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1
    },
    hover: {
      scale: 1.5,
      x: mousePosition.x - 16,
      y: mousePosition.y - 16
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          technologies:project_technologies(*)
        `)
        .eq('status', 'published')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#00ff8c]" />
      </div>
    );
  }

  const featuredProjects = projects.filter(p => p.featured);
  const regularProjects = projects.filter(p => !p.featured);

  return (
    <>
      <motion.div
        className="custom-cursor"
        variants={variants}
        animate={cursorVariant}
      />

      <Header cursorVariant={cursorVariant} setCursorVariant={setCursorVariant} />

      <div className="min-h-screen bg-[#0A0A0F] py-32">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
          >
            Проекты
          </motion.h1>

          {featuredProjects.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Star className="w-6 h-6 text-[#00ff8c]" />
                Избранные проекты
              </h2>
              <div className="grid lg:grid-cols-2 gap-8">
                {featuredProjects.map((project, index) => (
                  <motion.article
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#12121A] rounded-lg overflow-hidden neon-border group relative"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    <div className="relative">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] to-transparent opacity-60" />
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-4 gradient-text">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 mb-6 line-clamp-3">
                        {project.description.split('\n')[0]}
                      </p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech.id}
                              className="px-3 py-1 text-sm bg-[#00ff8c]/10 rounded-full text-[#00ff8c] flex items-center gap-2"
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
                      <Link
                        to={`/projects/${project.id}`}
                        className="mt-4 inline-block px-4 py-2 bg-[#00ff8c]/20 rounded-lg hover:bg-[#00ff8c]/30 transition-colors"
                      >
                        Подробнее
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#12121A] rounded-lg overflow-hidden neon-border group"
              >
                <div className="relative">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] to-transparent opacity-60" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 gradient-text">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {project.description.split('\n')[0]}
                  </p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech.id}
                          className="px-2 py-1 text-sm bg-[#00ff8c]/10 rounded-full text-[#00ff8c] flex items-center gap-2"
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
                  <Link
                    to={`/projects/${project.id}`}
                    className="mt-4 inline-block px-4 py-2 bg-[#00ff8c]/20 rounded-lg hover:bg-[#00ff8c]/30 transition-colors"
                  > 
                    Подробнее
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export { ProjectDetail };