import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SocialLinks } from './components/SocialLinks';
import { Code2, Smartphone, Globe, Menu, X, Newspaper, User, Briefcase } from 'lucide-react';
import { About } from './pages/About';
import { supabase } from './lib/supabase';
import type { Project, BlogPost } from './types/database';
import { Login } from './pages/admin/Login';
import { Blog, BlogPostDetail } from './pages/Blog';
import { Projects, ProjectDetail } from './pages/Projects';
import { SettingsManagement } from './pages/admin/SettingsManagement';
import { BlogManagement } from './pages/admin/BlogManagement';
import { ProjectManagement } from './pages/admin/ProjectManagement';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';

function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [latestProjects, setLatestProjects] = useState<Project[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { icon: Globe, text: 'Главная', href: '#' },
    { icon: Briefcase, text: 'Проекты', href: '/projects' },
    { icon: Newspaper, text: 'Блог', href: '/blog' },
    { icon: User, text: 'Обо мне', href: '/about' },
    { icon: User, text: 'Контакты', href: '/contact' },
  ];

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
    async function fetchLatestContent() {
      try {
        // Получаем последние 2 опубликованных проекта
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select(`
            *,
            technologies:project_technologies(*)
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(2);

        if (projectsError) throw projectsError;
        setLatestProjects(projects || []);

        // Получаем последние 2 поста блога
        const { data: posts, error: postsError } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(2);

        if (postsError) throw postsError;
        setLatestPosts(posts || []);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestContent();
  }, []);

  return (
    <>
      <Helmet>
        <title>NEPERSONAJ | Разработка сайтов и приложений</title>
        <meta name="description" content="Профессиональная разработка сайтов, мобильных приложений и программного обеспечения. Индивидуальный подход, современные технологии, высокое качество." />
        <meta name="keywords" content="разработка сайтов, веб-разработка, создание сайтов, мобильные приложения, программирование, React, Node.js" />
      </Helmet>

      <motion.div
        className="custom-cursor"
        variants={variants}
        animate={cursorVariant}
      />

      <div className="min-h-screen bg-black text-white">
        <nav className="fixed top-0 w-full bg-[#0A0A0F]/80 backdrop-blur-lg z-40 border-b border-[#00ff8c]/10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.h1
              className="heading text-2xl gradient-text"
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              NEPERSONAJ
            </motion.h1>
            <motion.div
              className="relative z-50"
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-12 h-12 flex items-center justify-center"
              >
                {isMenuOpen ? (
                  <X className="w-8 h-8 text-[#00ff8c]" />
                ) : (
                  <Menu className="w-8 h-8 text-[#00ff8c]" />
                )}
              </button>
            </motion.div>
          </div>
        </nav>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed inset-0 bg-[#0A0A0F]/95 backdrop-blur-xl z-30 flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-8"
              >
                {menuItems.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    className="flex items-center gap-4 text-2xl group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    onClick={() => setIsMenuOpen(false)}
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    <span className="w-12 h-12 rounded-xl bg-[#00ff8c]/5 flex items-center justify-center group-hover:bg-[#00ff8c]/20 transition-colors neon-border">
                      <item.icon className="w-6 h-6 text-[#00ff8c] group-hover:text-white" />
                    </span>
                    <span className="gradient-text">{item.text}</span>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <main>
          <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,140,0.1),transparent_70%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,240,255,0.1),transparent_50%)]" />
            </div>
            <div className="container mx-auto px-4 pt-20 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h2 className="heading text-5xl md:text-7xl mb-6 gradient-text">
                  Создаю цифровые<br />шедевры
                </h2>
                <div className="text-xl md:text-2xl text-gray-300 mb-8">
                  <p>
                    Разработка сайтов, приложений и программных решений<br />
                    с уникальным дизайном и продвинутой функциональностью
                  </p>
                </div>
                <div className="flex justify-center gap-8">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center group"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    <div className="w-20 h-20 rounded-2xl bg-[#00ff8c]/5 flex items-center justify-center mb-4 group-hover:bg-[#00ff8c]/20 transition-colors neon-border">
                      <Globe className="w-10 h-10 text-[#00ff8c] group-hover:text-white transition-colors" />
                    </div>
                    <span>Веб-сайты</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center group"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    <div className="w-20 h-20 rounded-2xl bg-[#00f0ff]/5 flex items-center justify-center mb-4 group-hover:bg-[#00f0ff]/20 transition-colors neon-border">
                      <Smartphone className="w-10 h-10 text-[#00f0ff] group-hover:text-white transition-colors" />
                    </div>
                    <span>Приложения</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center group"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    <div className="w-20 h-20 rounded-2xl bg-[#00ff8c]/5 flex items-center justify-center mb-4 group-hover:bg-[#00ff8c]/20 transition-colors neon-border">
                      <Code2 className="w-10 h-10 text-[#00ff8c] group-hover:text-white transition-colors" />
                    </div>
                    <span>Программы</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          <section id="projects" className="py-20 bg-[#0A0A0F]/80">
            <div className="container mx-auto px-4">
              <h3 className="heading text-4xl mb-12 text-center gradient-text">Мои проекты</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {latestProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-[#12121A] rounded-lg overflow-hidden neon-border"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-6">
                      <h4 className="heading text-xl mb-2">{project.title}</h4>
                      <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.map((tech) => (
                          <span
                            key={tech.id}
                            className="px-3 py-1 bg-[#00ff8c]/10 rounded-full text-sm text-[#00ff8c]"
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                      <Link
                        to={`/projects/${project.id}`}
                        className="mt-4 inline-block px-4 py-2 bg-[#00ff8c]/20 rounded-lg hover:bg-[#00ff8c]/30 transition-colors"
                      >
                        Подробнее
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  to="/projects"
                  className="inline-block px-6 py-3 bg-[#00ff8c]/20 rounded-lg hover:bg-[#00ff8c]/30 transition-colors"
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  Все проекты
                </Link>
              </div>
            </div>
          </section>

          <section className="py-20 bg-[#0A0A0F]">
            <div className="container mx-auto px-4">
              <h3 className="heading text-4xl mb-12 text-center gradient-text">Последние статьи</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {latestPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-[#12121A] rounded-lg overflow-hidden neon-border group"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-6">
                      <h4 className="heading text-xl mb-2">{post.title}</h4>
                      <p className="text-gray-400 mb-4 line-clamp-2">{post.content}</p>
                      {post.meta_keywords && (
                        <div className="flex flex-wrap gap-2">
                          {post.meta_keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-[#00ff8c]/10 rounded-full text-sm text-[#00ff8c]"
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
              <div className="text-center mt-8">
                <Link
                  to="/blog"
                  className="inline-block px-6 py-3 bg-[#00ff8c]/20 rounded-lg hover:bg-[#00ff8c]/30 transition-colors"
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  Все статьи
                </Link>
              </div>
            </div>
          </section>

          <section id="contact" className="py-20 bg-gradient-to-b from-[#0A0A0F] to-[#12121A]">
            <div className="container mx-auto px-4 text-center">
              <h3 className="heading text-4xl mb-8 gradient-text">Готовы обсудить проект?</h3>
              <p className="text-xl text-gray-300 mb-8">
                Свяжитесь со мной, чтобы обсудить ваши идеи и получить индивидуальное предложение
              </p>
              <Link
                to="/contact"
                className="inline-block px-8 py-3 bg-[#00ff8c]/20 rounded-full text-lg hover:bg-[#00ff8c]/30 transition-all neon-border"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                Написать мне
              </Link>
            </div>
          </section>
        </main>

        <footer className="bg-[#0A0A0F] py-8 border-t border-[#00ff8c]/10">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <SocialLinks className="mb-4" iconClassName="text-xl" showInstagramDisclaimer={true} />
            <p>© 2024 NEPERSONAJ. Все права защищены.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPostDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  
                  <Route path="/blog" element={<BlogManagement />} />
                  <Route path="/projects" element={<ProjectManagement />} />
                  <Route path="/settings" element={<SettingsManagement />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;