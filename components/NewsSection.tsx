'use client';

import React from 'react';
import Link from 'next/link';
import { NewsArticle } from '@/lib/sports-api/news';
import { useLanguage } from '@/lib/i18n';
import { Newspaper, ExternalLink, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsSectionProps {
  articles: NewsArticle[];
  limit?: number;
}

export function NewsSection({ articles, limit }: NewsSectionProps) {
  const { t, language } = useLanguage();
  const displayArticles = limit ? articles.slice(0, limit) : articles;

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 p-1.5 flex items-center justify-center text-emerald-400 border border-emerald-800/40">
            <Newspaper className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-black text-white">{t.news}</h2>
        </div>

        {limit && (
          <Link
            href="/news"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>{language === 'ar' ? 'عرض جميع الأخبار' : 'View All News'}</span>
            {language === 'ar' ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayArticles.map((art) => (
          <div
            key={art.id}
            className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl overflow-hidden shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            {art.imageUrl && (
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img
                  src={art.imageUrl}
                  alt={art.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {art.category && (
                  <span className="absolute top-3 right-3 bg-emerald-600 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase shadow">
                    {art.category}
                  </span>
                )}
              </div>
            )}

            <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{new Date(art.published).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  <span>•</span>
                  <span>{art.source}</span>
                </div>

                <h3 className="font-extrabold text-white text-sm sm:text-base line-clamp-2 group-hover:text-emerald-400 transition-colors leading-snug">
                  {art.headline}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {art.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <a
                  href={art.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>{t.readMore}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
