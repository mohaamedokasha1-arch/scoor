'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Activity, Trophy, ShieldCheck, Heart, Globe } from 'lucide-react';

export function Footer() {
  const { t, language, setLanguage } = useLanguage();

  const topLeagues = [
    { id: 'eng.1', nameAr: 'الدوري الإنجليزي الممتاز', nameEn: 'Premier League' },
    { id: 'esp.1', nameAr: 'الدوري الإسباني', nameEn: 'La Liga' },
    { id: 'uefa.champions', nameAr: 'دوري أبطال أوروبا', nameEn: 'UEFA Champions League' },
    { id: 'ita.1', nameAr: 'الدوري الإيطالي', nameEn: 'Serie A' },
    { id: 'ger.1', nameAr: 'الدوري الألماني', nameEn: 'Bundesliga' },
    { id: 'sau.1', nameAr: 'الدوري السعودي للمحترفين', nameEn: 'Saudi Pro League' },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Kora<span className="text-emerald-400">Score</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.tagline}. {language === 'ar' ? 'تغطية شاملة وتحديثات مباشرة لنتائج مباريات كرة القدم في مختلف الدوريات والبطولات العالمية والإقليمية.' : 'Comprehensive coverage and real-time live updates for football matches across global and regional leagues.'}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                {language === 'ar' ? 'بيانات رياضية دقيقة 100%' : '100% Real Sports API'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t.quickLinks}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/matches/today" className="hover:text-emerald-400 transition-colors">
                  {t.todayMatches}
                </Link>
              </li>
              <li>
                <Link href="/matches/today?live=true" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>{t.liveMatches}</span>
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                </Link>
              </li>
              <li>
                <Link href="/matches/yesterday" className="hover:text-emerald-400 transition-colors">
                  {t.yesterdayMatches}
                </Link>
              </li>
              <li>
                <Link href="/matches/tomorrow" className="hover:text-emerald-400 transition-colors">
                  {t.tomorrowMatches}
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-emerald-400 transition-colors">
                  {t.news}
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Leagues */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              {t.topLeagues}
            </h3>
            <ul className="space-y-2 text-xs">
              {topLeagues.map((lg) => (
                <li key={lg.id}>
                  <Link href={`/league/${lg.id}`} className="hover:text-emerald-400 transition-colors">
                    {language === 'ar' ? lg.nameAr : lg.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SEO Targeted Keywords & Locale Switcher */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {language === 'ar' ? 'كلمات البحث الشائعة' : 'Popular Search Tags'}
            </h3>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-400">مباريات اليوم</span>
              <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-400">مباريات اليوم مباشر</span>
              <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-400">نتائج المباريات</span>
              <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-400">دوري أبطال أوروبا</span>
              <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-400">live football scores</span>
              <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-400">today's matches</span>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>{t.copyright}. Designed & Powered by KoraScore Platform.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{language === 'ar' ? 'صُنِع بـ' : 'Built with'}</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>{language === 'ar' ? 'لعشاق كرة القدم' : 'for Football Fans'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
