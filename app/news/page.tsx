'use client';

import React, { useState, useEffect } from 'react';
import { NewsArticle } from '@/lib/sports-api/news';
import { NewsSection } from '@/components/NewsSection';
import { useLanguage } from '@/lib/i18n';
import { Newspaper, RotateCw, AlertCircle } from 'lucide-react';

export default function NewsPage() {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch('/api/news');
        const json = await res.json();
        if (json.success && Array.isArray(json.articles)) {
          setArticles(json.articles);
        } else {
          setError('تعذر جلب الأخبار الرياضية.');
        }
      } catch {
        setError('حدث خطأ في الاتصال بالشبكة.');
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 p-2.5 flex items-center justify-center text-emerald-400 border border-emerald-800/40">
            <Newspaper className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{t.news}</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-300">
          {language === 'ar' ? 'تغطية حيّة وأخبار الملاعب والانتقالات العالمية والمحلية موثقة ومحدثة باستمرار.' : 'Latest football news, headlines, transfers, and updates.'}
        </p>
      </div>

      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <RotateCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-300">جاري تحميل الأخبار الرياضية المباشرة...</p>
        </div>
      ) : error ? (
        <div className="bg-red-950/40 border border-red-900/60 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-sm font-bold text-white">{error}</p>
        </div>
      ) : (
        <NewsSection articles={articles} />
      )}
    </div>
  );
}
