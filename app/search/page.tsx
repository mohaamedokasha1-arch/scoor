'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MatchDetail, CompetitionInfo } from '@/lib/sports-api';
import { MatchCard } from '@/components/MatchCard';
import { useLanguage } from '@/lib/i18n';
import { Search, RotateCw, Trophy, Users, Calendar } from 'lucide-react';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { t } = useLanguage();

  const [inputQuery, setInputQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    matches: MatchDetail[];
    teams: Array<{ id: string; name: string; logo: string }>;
    leagues: CompetitionInfo[];
  }>({ matches: [], teams: [], leagues: [] });

  const performSearch = async (q: string) => {
    if (!q || q.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json.success && json.results) {
        setResults(json.results);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      window.history.pushState(null, '', `/search?q=${encodeURIComponent(inputQuery.trim())}`);
      performSearch(inputQuery.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
          <Search className="w-8 h-8 text-emerald-400" />
          <span>{t.search}</span>
        </h1>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl py-3.5 px-5 pr-12 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <button
            type="submit"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-1.5 rounded-xl font-bold text-xs shadow"
          >
            {t.search}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <RotateCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-300">جاري البحث في البيانات الرياضية...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Teams Results */}
          {results.teams.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>{t.teams} ({results.teams.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {results.teams.map((tm) => (
                  <Link
                    key={tm.id}
                    href={`/team/${tm.id}`}
                    className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-3 rounded-2xl flex items-center gap-3 transition-colors group"
                  >
                    <img src={tm.logo} alt="" className="w-8 h-8 object-contain shrink-0" />
                    <span className="font-bold text-white text-xs truncate group-hover:text-emerald-400">
                      {tm.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Matches Results */}
          {results.matches.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>المباريات ({results.matches.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.matches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </div>
          )}

          {query && results.matches.length === 0 && results.teams.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
              لم نجد نتائج تطابق بحثك عن "{query}". حاول إدخال اسم فريق أو بطولة آخر.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
        <RotateCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-300">جاري تحميل صفحة البحث...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
