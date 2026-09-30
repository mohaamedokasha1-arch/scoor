'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MatchDetail } from '@/lib/sports-api';
import { useLanguage } from '@/lib/i18n';
import { useFavorites } from '@/components/FavoritesContext';
import { Star, Tv, ChevronLeft, ChevronRight, Activity, Radio } from 'lucide-react';

interface MatchCardProps {
  match: MatchDetail;
}

export function MatchCard({ match }: MatchCardProps) {
  const { t, language } = useLanguage();
  const { isMatchFavorite, toggleFavoriteMatch } = useFavorites();
  const isFav = isMatchFavorite(match.id);

  const homeName = language === 'ar' ? match.homeTeam.name : match.homeTeam.name;
  const awayName = language === 'ar' ? match.awayTeam.name : match.awayTeam.name;

  return (
    <div className={`relative group bg-slate-900/90 hover:bg-slate-850 border rounded-2xl p-3.5 sm:p-4 transition-all duration-200 shadow-md hover:shadow-xl ${
      match.isLive
        ? 'border-red-500/50 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 shadow-red-500/5 ring-1 ring-red-500/20'
        : 'border-slate-800 hover:border-emerald-500/40'
    }`}>
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-3 text-xs">
        <div className="flex items-center gap-2">
          {match.isLive ? (
            <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-400 font-bold px-2.5 py-0.5 rounded-full border border-red-500/30 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{t.liveNow}</span>
              {match.clockDisplay && (
                <span className="font-mono text-white bg-red-600 px-1.5 py-0.2 rounded text-[10px]">
                  {match.clockDisplay}
                </span>
              )}
            </span>
          ) : match.isFinished ? (
            <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-400 font-semibold px-2 py-0.5 rounded text-[11px] border border-slate-700">
              {t.fullTime}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-slate-800/80 text-emerald-400 font-medium px-2 py-0.5 rounded text-[11px]">
              {match.time}
            </span>
          )}
        </div>

        {/* Favorite Star & Broadcast */}
        <div className="flex items-center gap-2">
          {match.broadcasts && match.broadcasts.length > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-800">
              <Tv className="w-3 h-3 text-emerald-400" />
              <span className="truncate max-w-[100px]">{match.broadcasts[0]}</span>
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavoriteMatch(match.id);
            }}
            className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-amber-400 transition-colors"
            title={isFav ? t.favorited : t.favorite}
          >
            <Star className={`w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Teams & Score Layout */}
      <Link href={`/match/${match.id}`} className="block space-y-3">
        {/* Home Team Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-950 p-1 flex items-center justify-center shrink-0 border border-slate-800 group-hover:border-slate-700">
              <img
                src={match.homeTeam.logo}
                alt={homeName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className={`text-sm sm:text-base font-bold truncate ${
              match.homeTeam.winner ? 'text-emerald-400 font-extrabold' : 'text-slate-100'
            }`}>
              {homeName}
            </span>
          </div>

          <div className="font-mono text-base sm:text-lg font-black px-2.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-100 min-w-[36px] text-center">
            {match.homeTeam.score ?? '-'}
          </div>
        </div>

        {/* Away Team Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-950 p-1 flex items-center justify-center shrink-0 border border-slate-800 group-hover:border-slate-700">
              <img
                src={match.awayTeam.logo}
                alt={awayName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className={`text-sm sm:text-base font-bold truncate ${
              match.awayTeam.winner ? 'text-emerald-400 font-extrabold' : 'text-slate-100'
            }`}>
              {awayName}
            </span>
          </div>

          <div className="font-mono text-base sm:text-lg font-black px-2.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-100 min-w-[36px] text-center">
            {match.awayTeam.score ?? '-'}
          </div>
        </div>
      </Link>

      {/* Footer link overlay indicator */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate max-w-[180px] text-slate-400">
          {match.venue || match.league.name}
        </span>

        <Link
          href={`/match/${match.id}`}
          className="flex items-center gap-1 text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform"
        >
          <span>{t.matchDetails}</span>
          {language === 'ar' ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </Link>
      </div>
    </div>
  );
}
