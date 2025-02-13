import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Показываем загрузку пока проверяем сессию
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00ff8c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Если нет сессии, редиректим на страницу входа
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  // Если есть сессия, показываем защищенный контент
  return <>{children}</>;
}