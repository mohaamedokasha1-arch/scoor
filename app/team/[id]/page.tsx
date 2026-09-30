'use client';

import React, { useState, useEffect, use } from 'react';
import { MatchDetail } from '@/lib/sports-api';
import { MatchCard } from '@/components/MatchCard';
import { useLanguage } from '@/lib/i18n';
import { Shield, RotateCw, AlertCircle, Calendar, Trophy, Star } from 'lucide-react';
import { useFavorites } from '@/components/FavoritesContext';

interface TeamData {
  id: string;
  name: string;
  logo: string;
  venue?: string;
  recentMatches: MatchDetail[];
  upcomingMatches: MatchDetail[];
}

export default function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, language } = useLanguage();
  const { isTeamFavorite, toggleFavoriteTeam } = useFavorites();
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFav = team ? isTeamFavorite(team.id) : false;

  useEffect(() => {
    async function loadTeam() {
      try {
        const res = await fetch(`/api/team/${id}`);
        const json = await res.json();
        if (json.success && json.team) {
          setTeam(json.team);
        } else {
          setError('لم يتم العثور على معلومات هذا الفريق.');
        }
      } catch {
        setError('حدث خطأ في الاتصال بالشبكة.');
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center space-y-4 my-8">
        <RotateCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-300">جاري تحميل ملف الفريق والمباريات...</p>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="bg-red-950/40 border border-red-900/60 rounded-3xl p-12 text-center space-y-3 my-8">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">{error || 'الفريق غير موجود'}</h3>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Team Header Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950 p-3 border border-slate-800 flex items-center justify-center shadow-xl shrink-0">
            <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
          </div>

          <div className="space-y-1 text-center sm:text-right">
            <h1 className="text-2xl sm:text-3xl font-black text-white">{team.name}</h1>
            {team.venue && (
              <p className="text-xs text-slate-400 font-medium">
                {t.venue}: {team.venue}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => toggleFavoriteTeam(team.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            isFav
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
          }`}
        >
          <Star className={`w-4 h-4 ${isFav ? 'fill-slate-950' : ''}`} />
          <span>{isFav ? t.favorited : t.favorite}</span>
        </button>
      </div>

      {/* Upcoming Matches */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <span>{language === 'ar' ? 'المباريات القادمة' : 'Upcoming Matches'}</span>
        </h2>

        {team.upcomingMatches.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
            لا تتوفر مواعيد مباريات قادمة مسجلة للفريق حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.upcomingMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Match Results */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-emerald-400" />
          <span>{language === 'ar' ? 'آخر النتائج' : 'Recent Results'}</span>
        </h2>

        {team.recentMatches.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
            لا تتوفر نتائج سابقة مسجلة للفريق حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.recentMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
