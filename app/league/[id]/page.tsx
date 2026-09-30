'use client';

import React, { useState, useEffect, use } from 'react';
import { StandingRow } from '@/lib/sports-api';
import { StandingsTable } from '@/components/StandingsTable';
import { useLanguage } from '@/lib/i18n';
import { Trophy, RotateCw, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LeaguePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, language } = useLanguage();
  const [leagueName, setLeagueName] = useState<string>('جدول الترتيب');
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLeague() {
      try {
        const res = await fetch(`/api/league/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setLeagueName(json.data.leagueName || 'جدول الترتيب');
          setStandings(json.data.standings || []);
        } else {
          setError('تعذر جلب جدول الترتيب لهذه البطولة.');
        }
      } catch {
        setError('خطأ في الاتصال بالشبكة.');
      } finally {
        setLoading(false);
      }
    }
    loadLeague();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 p-2.5 flex items-center justify-center text-emerald-400 border border-emerald-800/40">
              <Trophy className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{leagueName}</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            {language === 'ar' ? 'جدول الترتيب الرسمي والنقاط للفرق في هذه البطولة.' : 'Official league table standings and points breakdown.'}
          </p>
        </div>

        <Link
          href="/"
          className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-emerald-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl"
        >
          <span>{t.home}</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <RotateCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-300">جاري جلب جدول ترتيب الفرق...</p>
        </div>
      ) : error ? (
        <div className="bg-red-950/40 border border-red-900/60 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-sm font-bold text-white">{error}</p>
        </div>
      ) : (
        <StandingsTable title={leagueName} standings={standings} />
      )}
    </div>
  );
}
