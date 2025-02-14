import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2, Send } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTelegram, 
  faWhatsapp, 
  faInstagram 
} from '@fortawesome/free-brands-svg-icons';
import toast from 'react-hot-toast';
import { Header } from '../components/Header';
import { supabase } from '../lib/supabase';
import { sendTelegramMessage } from '../lib/telegram';
import type { SiteSettings } from '../types/database';

interface ContactForm {
  name: string;
  contact: string;
  message: string;
  contactMethod: 'telegram' | 'whatsapp' | 'instagram' | 'other';
  otherMethod?: string;
  privacyAccepted: boolean;
}

export function Contact() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [sending, setSending] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ContactForm>({
    defaultValues: {
      contactMethod: 'telegram'
    }
  });

  const contactMethod = watch('contactMethod');

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

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      setSettings(data);
    }
    fetchSettings();
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

  const onSubmit = async (data: ContactForm) => {
    if (!data.privacyAccepted) {
      toast.error('Необходимо принять политику конфиденциальности');
      return;
    }

    setSending(true);
    try {
      const message = `
<b>Новое сообщение с сайта</b>

<b>Имя:</b> ${data.name}
<b>Способ связи:</b> ${data.contactMethod === 'other' ? data.otherMethod : data.contactMethod}
<b>Контакт:</b> ${data.contact}
<b>Сообщение:</b>
${data.message}
`;

      const sent = await sendTelegramMessage(message);
      
      if (sent) {
        toast.success('Сообщение отправлено');
        reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Ошибка при отправке сообщения');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Контакты | NEPERSONAJ</title>
        <meta name="description" content="Свяжитесь со мной для обсуждения вашего проекта" />
      </Helmet>

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
            Связаться со мной
          </motion.h1>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <input
                  {...register('name', { required: 'Введите ваше имя' })}
                  placeholder="Ваше имя"
                  className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium">Предпочитаемый способ связи</label>
                <select
                  {...register('contactMethod', { required: 'Выберите способ связи' })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  {settings?.show_telegram && (
                    <option value="telegram">Telegram</option>
                  )}
                  {settings?.show_whatsapp && (
                    <option value="whatsapp">WhatsApp</option>
                  )}
                  {settings?.show_instagram && (
                    <option value="instagram">Instagram*</option>
                  )}
                  {settings?.show_vk && (
                    <option value="vk">ВКонтакте</option>
                  )}
                  {settings?.show_email && (
                    <option value="email">Email</option>
                  )}
                  <option value="other">Другое</option>
                </select>
              </div>

              {contactMethod === 'other' && (
                <div>
                  <input
                    {...register('otherMethod', { required: 'Укажите способ связи' })}
                    placeholder="Укажите способ связи"
                    className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  />
                  {errors.otherMethod && (
                    <p className="mt-1 text-sm text-red-500">{errors.otherMethod.message}</p>
                  )}
                </div>
              )}

              <div>
                <input
                  {...register('contact', { required: 'Укажите контактные данные' })}
                  placeholder={
                    contactMethod === 'telegram' ? '@username или номер телефона' :
                    contactMethod === 'whatsapp' ? 'Номер телефона' :
                    contactMethod === 'instagram' ? '@username' :
                    'Контактные данные'
                  }
                  className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                />
                {errors.contact && (
                  <p className="mt-1 text-sm text-red-500">{errors.contact.message}</p>
                )}
              </div>

              <div>
                <textarea
                  {...register('message', { required: 'Введите ваше сообщение' })}
                  placeholder="Ваше сообщение"
                  rows={4}
                  className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none resize-none"
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  {...register('privacyAccepted')}
                  id="privacy"
                  className="mt-1.5"
                />
                <label htmlFor="privacy" className="text-sm text-gray-400">
                  Нажимая кнопку «Отправить сообщение», вы соглашаетесь с{' '}
                  <Link
                    to="/privacy"
                    className="text-[#00ff8c] hover:underline"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    политикой конфиденциальности
                  </Link>{' '}
                  в соответствии с Федеральным законом № 152‑ФЗ «О персональных данных» от 27.07.2006.
                </label>
              </div>

              <motion.button
                type="submit"
                className="px-8 py-3 bg-[#00ff8c]/20 rounded-full text-lg flex items-center gap-2 mx-auto hover:bg-[#00ff8c]/30 transition-all neon-border"
                whileHover={{ scale: 1.05 }}
                disabled={sending}
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {sending ? 'Отправка...' : 'Отправить сообщение'}
              </motion.button>

              {settings?.show_instagram && (
                <p className="mt-4 text-sm text-gray-500 text-center">
                  *Meta Platforms Inc. (соцсети Facebook*, Instagram*) признана экстремистской, ее деятельность запрещена на территории России.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}