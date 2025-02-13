import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      toast.success('Успешный вход');
      navigate('/admin');
    } catch (error) {
      toast.error('Ошибка входа. Проверьте данные.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#12121A] p-8 rounded-lg neon-border">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00ff8c]/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#00ff8c]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-8 gradient-text">
            Вход в админ-панель
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <input
                {...register('email', { required: 'Email обязателен' })}
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none transition-colors"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div>
              <input
                {...register('password', { required: 'Пароль обязателен' })}
                type="password"
                placeholder="Пароль"
                className="w-full p-3 rounded-lg bg-black/50 border border-[#00ff8c]/20 focus:border-[#00ff8c] outline-none transition-colors"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#00ff8c]/20 rounded-lg text-white font-medium hover:bg-[#00ff8c]/30 transition-colors neon-border"
            >
              Войти
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}