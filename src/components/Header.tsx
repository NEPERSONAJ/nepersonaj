import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SocialLinks } from './SocialLinks';

interface HeaderProps {
  cursorVariant: string;
  setCursorVariant: (variant: string) => void;
}

export function Header({ cursorVariant, setCursorVariant }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { text: 'Главная', href: '/' },
    { text: 'Проекты', href: '/projects' },
    { text: 'Блог', href: '/blog' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-[#0A0A0F]/80 backdrop-blur-lg z-40 border-b border-[#00ff8c]/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/">
          <motion.h1
            className="heading text-2xl gradient-text"
            whileHover={{ scale: 1.05 }}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            NEPERSONAJ
          </motion.h1>
        </Link>
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

      <motion.div
        initial={false}
        animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="overflow-hidden bg-[#0A0A0F]/95 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="text-lg hover:text-[#00ff8c] transition-colors"
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                {item.text}
              </Link>
            ))}
            <div className="pt-4 border-t border-[#00ff8c]/10 flex justify-center">
              <SocialLinks iconClassName="text-2xl" />
            </div>
          </div>
        </div>
      </motion.div>
    </nav>
  );
}