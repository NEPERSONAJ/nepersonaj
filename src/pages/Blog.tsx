import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types/database';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';

function BlogPostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
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
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#00ff8c]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] pt-32">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-400">Пост не найден</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | NEPERSONAJ</title>
        <meta name="description" content={post.meta_description || post.content.slice(0, 160)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta_description || post.content.slice(0, 160)} />
        <meta property="og:image" content={post.og_image || post.image_url} />
        {post.canonical_url && <link rel="canonical" href={post.canonical_url} />}
        {post.meta_keywords && (
          <meta name="keywords" content={post.meta_keywords.join(', ')} />
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
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к блогу
          </Link>

          <article className="max-w-4xl mx-auto">
            <img
              src={post.image_url}
              alt={post.title}
              loading="lazy"
              className="w-full h-64 object-cover rounded-lg mb-8"
            />
            <h1 className="text-4xl font-bold mb-6 gradient-text">{post.title}</h1>
            <div className="prose prose-invert max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-300">{paragraph}</p>
              ))}
            </div>
            {post.meta_keywords && post.meta_keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
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
          </article>
        </div>
      </div>
    </>
  );
}

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
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
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
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
            Блог
          </motion.h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#12121A] rounded-lg overflow-hidden neon-border group relative"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <div className="relative">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] to-transparent opacity-60" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 gradient-text">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {post.content}
                  </p>
                  {post.meta_keywords && post.meta_keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
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
                  <Link
                    to={`/blog/${post.id}`}
                    className="mt-4 inline-block px-4 py-2 bg-[#00ff8c]/20 rounded-lg hover:bg-[#00ff8c]/30 transition-colors"
                  >
                    Читать далее
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

export { BlogPostDetail };