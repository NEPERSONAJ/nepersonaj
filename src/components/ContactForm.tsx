import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendTelegramMessage } from '../lib/telegram';

interface ContactFormProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

export function ContactForm({ onMouseEnter, onMouseLeave }: ContactFormProps) {
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSending(true);
    try {
      const message = `
<b>Новое сообщение с сайта</b>

<b>Имя:</b> ${data.name}
<b>Email:</b> ${data.email}
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('name', { required: 'Введите ваше имя' })}
          placeholder="Ваше имя"
          className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <input
          {...register('email', { 
            required: 'Введите ваш email',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Некорректный email адрес'
            }
          })}
          type="email"
          placeholder="Ваш email"
          className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register('message', { required: 'Введите ваше сообщение' })}
          placeholder="Ваше сообщение"
          rows={4}
          className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none resize-none"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      <motion.button
        type="submit"
        className="px-8 py-3 bg-[#00ff8c]/20 rounded-full text-lg flex items-center gap-2 mx-auto hover:bg-[#00ff8c]/30 transition-all neon-border"
        whileHover={{ scale: 1.05 }}
        disabled={sending}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {sending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
        {sending ? 'Отправка...' : 'Отправить'}
      </motion.button>
    </form>
  );
}