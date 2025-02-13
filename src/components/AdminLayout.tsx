import React, { useState } from 'react';
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Вы успешно вышли из системы');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#12121A] border-b border-[#00ff8c]/10 z-50">
        <div className="flex items-center justify-between p-4">
          <Link to="/admin" className="text-xl font-bold gradient-text">
            Админ-панель
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-[#00ff8c]/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#00ff8c]" />
            ) : (
              <Menu className="w-6 h-6 text-[#00ff8c]" />
            )}
          </button>
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
          >
            Дашборд
          </NavLink>
          <NavLink
            to="/admin/blog"
            icon={FileText}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Блог
          </NavLink>
          <NavLink
            to="/admin/projects"
            icon={Briefcase}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Проекты
          </NavLink>
          <NavLink
            to="/admin/settings"
            icon={Settings}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Настройки
          </NavLink>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-auto flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Выйти
        </button>
      </motion.nav>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex w-64 bg-[#12121A] p-6 flex-col border-r border-[#00ff8c]/10 fixed h-full">
        <Link to="/admin" className="text-2xl font-bold gradient-text mb-8 hidden lg:block">
          Админ-панель
        </Link>
        <div className="flex flex-col gap-4">
          <NavLink to="/admin" icon={LayoutDashboard}>
            Дашборд
          </NavLink>
          <NavLink to="/admin/blog" icon={FileText}>
            Блог
          </NavLink>
          <NavLink to="/admin/projects" icon={Briefcase}>
            Проекты
          </NavLink>
          <NavLink to="/admin/settings" icon={Settings}>
            Настройки
          </NavLink>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-auto flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Выйти
        </button>
      </nav>
      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0 lg:ml-64">{children}</main>
    </div>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  onClick?: () => void;
  children: React.ReactNode;
}

function NavLink({ to, icon: Icon, onClick, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
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