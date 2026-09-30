'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MatchDetail, CompetitionInfo } from '@/lib/sports-api';
import { MatchCard } from './MatchCard';
import { useLanguage } from '@/lib/i18n';
import { useFavorites } from '@/components/FavoritesContext';
import { Trophy, ChevronDown, ChevronUp, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface LeagueMatchesGroupProps {
  league: CompetitionInfo;
  matches: MatchDetail[];
}

export function LeagueMatchesGroup({ league, matches }: LeagueMatchesGroupProps) {
  const { t, language } = useLanguage();
  const { isLeagueFavorite, toggleFavoriteLeague } = useFavorites();
  const [expanded, setExpanded] = useState(true);
  const isFav = isLeagueFavorite(league.id);

  const leagueName = language === 'ar' ? league.name : league.name;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden mb-6 shadow-lg">
      {/* League Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {league.logo ? (
            <div className="w-8 h-8 rounded-lg bg-slate-900 p-1 flex items-center justify-center shrink-0 border border-slate-800">
              <img
                src={league.logo}
                alt={leagueName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-emerald-950 p-1 flex items-center justify-center text-emerald-400 border border-emerald-800/40">
              <Trophy className="w-4 h-4" />
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <Link
              href={`/league/${league.id}`}
              className="text-sm sm:text-base font-extrabold text-white hover:text-emerald-400 transition-colors truncate"
            >
              {leagueName}
            </Link>
            {league.country && (
              <span className="text-[11px] text-slate-400 font-medium">
                {league.country}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* League Standings Shortcut */}
          <Link
            href={`/league/${league.id}`}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/40 px-3 py-1 rounded-lg transition-colors"
          >
            <span>{t.standings}</span>
            {language === 'ar' ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </Link>

          {/* Favorite League Star */}
          <button
            onClick={() => toggleFavoriteLeague(league.id)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
            title={isFav ? t.favorited : t.favorite}
          >
            <Star className={`w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : ''}`} />
          </button>

          {/* Toggle Expand */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle matches list"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      {expanded && (
        <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
