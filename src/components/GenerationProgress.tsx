import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { GenerationStatus } from '../types/database';

interface GenerationProgressProps {
  status: GenerationStatus | null;
}

const fieldNames: Record<string, string> = {
  title: 'Заголовок',
  content: 'Содержание',
  meta_title: 'SEO заголовок',
  meta_description: 'SEO описание',
  meta_keywords: 'Ключевые слова'
};

export function GenerationProgress({ status }: GenerationProgressProps) {
  if (!status) return null;

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#12121A] border-b border-[#00ff8c]/10 p-4"
    >
      <div className="container mx-auto">
        <div className="flex items-center gap-4">
          <Loader2 className="w-5 h-5 text-[#00ff8c] animate-spin" />
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-sm">
                Генерация: {fieldNames[status.field] || status.field}
              </span>
              <span className="text-sm text-[#00ff8c]">{status.progress}%</span>
            </div>
            <div className="h-1 bg-black/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#00ff8c]"
                initial={{ width: 0 }}
                animate={{ width: `${status.progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
        {status.error && (
          <p className="mt-2 text-sm text-red-500">{status.error}</p>
        )}
      </div>
    </motion.div>
  );
}