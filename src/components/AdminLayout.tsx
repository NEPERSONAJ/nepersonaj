import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, FileText, Briefcase, Settings, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Вы успешно вышли из системы');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex">
      <motion.div
        className="custom-cursor fixed pointer-events-none z-[100]"
        variants={variants}
        animate={cursorVariant}
      />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#12121A] border-b border-[#00ff8c]/10 z-50">
        <div className="flex items-center justify-between p-4">
          <Link 
            to="/admin" 
            className="text-xl font-bold gradient-text"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            Админ-панель
          </Link>
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-[#00ff8c]/10 rounded-lg transition-colors"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#00ff8c]" />
            ) : (
              <Menu className="w-6 h-6 text-[#00ff8c]" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.nav
        className={`lg:hidden fixed inset-0 bg-[#12121A] z-30 pt-16 ${
          isMobileMenuOpen ? 'flex' : 'hidden'
        } flex-col p-6`}
        initial={{ x: '-100%' }}
        animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="flex flex-col gap-4">
          <NavLink
            to="/admin"
            icon={LayoutDashboard}
            onClick={() => setIsMobileMenuOpen(false)}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            Дашборд
          </NavLink>
          <NavLink
            to="/admin/blog"
            icon={FileText}
            onClick={() => setIsMobileMenuOpen(false)}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            Блог
          </NavLink>
          <NavLink
            to="/admin/projects"
            icon={Briefcase}
            onClick={() => setIsMobileMenuOpen(false)}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            Проекты
          </NavLink>
          <NavLink
            to="/admin/settings"
            icon={Settings}
            onClick={() => setIsMobileMenuOpen(false)}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            Настройки
          </NavLink>
        </div>
        <motion.button
          onClick={handleSignOut}
          className="mt-auto flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          <LogOut className="w-5 h-5" />
          Выйти
        </motion.button>
      </motion.nav>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex w-64 bg-[#12121A] p-6 flex-col border-r border-[#00ff8c]/10 fixed h-full">
        <Link 
          to="/admin" 
          className="text-2xl font-bold gradient-text mb-8 hidden lg:block"
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          Админ-панель
        </Link>
        <div className="flex flex-col gap-4">
          <NavLink 
            to="/admin" 
            icon={LayoutDashboard}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            Дашборд
          </NavLink>
          <NavLink 
            to="/admin/blog" 
            icon={FileText}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            Блог
          </NavLink>
          <NavLink 
            to="/admin/projects" 
            icon={Briefcase}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            Проекты
          </NavLink>
          <NavLink 
            to="/admin/settings" 
            icon={Settings}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            Настройки
          </NavLink>
        </div>
        <motion.button
          onClick={handleSignOut}
          className="mt-auto flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          <LogOut className="w-5 h-5" />
          Выйти
        </motion.button>
      </nav>
      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0 lg:ml-64">{children}</main>
    </div>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: React.ReactNode;
}

function NavLink({ to, icon: Icon, onClick, onMouseEnter, onMouseLeave, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#00ff8c]/10 text-gray-300 hover:text-white transition-colors group"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="w-8 h-8 rounded-lg bg-[#00ff8c]/5 flex items-center justify-center group-hover:bg-[#00ff8c]/20"
      >
        <Icon className="w-5 h-5 text-[#00ff8c]" />
      </motion.div>
      {children}
    </Link>
  );
}