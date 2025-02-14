import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Code2, Smartphone, Globe, Rocket, Star, Zap, Shield, Clock } from 'lucide-react';

export function About() {
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

  const services = [
    {
      icon: Globe,
      title: 'Веб-разработка',
      description: 'Создаю современные, быстрые и адаптивные веб-сайты с уникальным дизайном и продвинутой функциональностью.',
      features: [
        'React и Next.js для современного фронтенда',
        'Node.js и Python для мощного бэкенда',
        'Оптимизация производительности и SEO',
        'Адаптивный дизайн для всех устройств'
      ]
    },
    {
      icon: Smartphone,
      title: 'Мобильные приложения',
      description: 'Разрабатываю нативные и кроссплатформенные мобильные приложения для iOS и Android.',
      features: [
        'React Native для кроссплатформенной разработки',
        'Нативные возможности устройств',
        'Оффлайн-режим и синхронизация',
        'Push-уведомления и геолокация'
      ]
    },
    {
      icon: Code2,
      title: 'Программные решения',
      description: 'Создаю эффективные программные решения для автоматизации бизнес-процессов.',
      features: [
        'Автоматизация рутинных задач',
        'Интеграция с внешними сервисами',
        'Анализ и обработка данных',
        'Масштабируемая архитектура'
      ]
    }
  ];

  const advantages = [
    {
      icon: Rocket,
      title: 'Быстрый старт',
      description: 'Начинаю работу над проектом сразу после согласования деталей. Чёткое планирование и соблюдение сроков.'
    },
    {
      icon: Star,
      title: 'Качество кода',
      description: 'Пишу чистый, поддерживаемый код с использованием современных практик и инструментов разработки.'
    },
    {
      icon: Shield,
      title: 'Безопасность',
      description: 'Уделяю особое внимание безопасности данных и защите от уязвимостей.'
    },
    {
      icon: Zap,
      title: 'Производительность',
      description: 'Оптимизирую каждый проект для максимальной скорости работы и отзывчивости.'
    },
    {
      icon: Clock,
      title: 'Поддержка 24/7',
      description: 'Обеспечиваю техническую поддержку и быстро реагирую на возникающие вопросы.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Обо мне | NEPERSONAJ</title>
        <meta name="description" content="Профессиональная разработка сайтов, мобильных приложений и программных решений. Индивидуальный подход, современные технологии, высокое качество." />
      </Helmet>

      <motion.div
        className="custom-cursor"
        variants={variants}
        animate={cursorVariant}
      />

      <Header cursorVariant={cursorVariant} setCursorVariant={setCursorVariant} />

      <div className="min-h-screen bg-[#0A0A0F]">
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,140,0.1),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,240,255,0.1),transparent_50%)]" />
          </div>
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
                Превращаю идеи в цифровую реальность
              </h1>
              <p className="text-xl text-gray-300 mb-12">
                Я — опытный разработчик с глубокими знаниями в создании современных веб-сайтов, 
                мобильных приложений и программных решений. Моя цель — помочь вашему бизнесу 
                достичь нового уровня с помощью передовых технологий.
              </p>
              <Link
                to="/contact"
                className="inline-block px-8 py-3 bg-[#00ff8c]/20 rounded-full text-lg hover:bg-[#00ff8c]/30 transition-all neon-border"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                Обсудить проект
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-[#0A0A0F]/80">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 gradient-text">
              Мои услуги
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-[#12121A] p-6 rounded-lg neon-border"
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#00ff8c]/5 flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8 text-[#00ff8c]" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-400 mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#00ff8c] rounded-full" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-20 bg-[#0A0A0F]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 gradient-text">
              Почему выбирают меня
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#12121A] p-6 rounded-lg neon-border"
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#00ff8c]/5 flex items-center justify-center mb-4">
                    <advantage.icon className="w-6 h-6 text-[#00ff8c]" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{advantage.title}</h3>
                  <p className="text-gray-400">{advantage.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-[#0A0A0F] to-[#12121A]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 gradient-text">
              Готовы начать проект?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Давайте обсудим ваши идеи и создадим что-то потрясающее вместе. 
              Я помогу выбрать оптимальные технологии и реализовать проект наилучшим образом.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-3 bg-[#00ff8c]/20 rounded-full text-lg hover:bg-[#00ff8c]/30 transition-all neon-border"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              Связаться со мной
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}