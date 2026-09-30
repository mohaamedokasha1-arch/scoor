'use client';

import React from 'react';
import Link from 'next/link';
import { MatchDetail } from '@/lib/sports-api';
import { useLanguage } from '@/lib/i18n';
import { Flame, Activity, ChevronLeft, ChevronRight } from 'lucide-react';

interface LiveScoreTickerProps {
  liveMatches: MatchDetail[];
}

export function LiveScoreTicker({ liveMatches }: LiveScoreTickerProps) {
  const { t, language } = useLanguage();

  if (!liveMatches || liveMatches.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border border-red-900/50 rounded-2xl p-3 sm:p-4 mb-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-red-500 fill-red-500" />
            <span>{t.liveMatches} ({liveMatches.length})</span>
          </h2>
        </div>
        <Link
          href="/matches/today?live=true"
          className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
        >
          <span>{t.allMatches}</span>
          {language === 'ar' ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-red-900">
        {liveMatches.map((m) => (
          <Link
            key={m.id}
            href={`/match/${m.id}`}
            className="shrink-0 bg-slate-950/90 border border-red-500/30 hover:border-red-500 rounded-xl p-3 min-w-[240px] max-w-[280px] space-y-2 transition-all hover:scale-[1.02] shadow-md"
          >
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
              <span className="truncate max-w-[150px]">{m.league.name}</span>
              <span className="bg-red-600 text-white font-mono font-bold px-1.5 py-0.2 rounded text-[10px]">
                {m.clockDisplay || "Live"}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <img src={m.homeTeam.logo} alt="" className="w-5 h-5 object-contain" />
                  <span className="font-bold text-slate-100 truncate">{m.homeTeam.name}</span>
                </div>
                <span className="font-mono font-black text-red-400 text-sm">{m.homeTeam.score ?? 0}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <img src={m.awayTeam.logo} alt="" className="w-5 h-5 object-contain" />
                  <span className="font-bold text-slate-100 truncate">{m.awayTeam.name}</span>
                </div>
                <span className="font-mono font-black text-red-400 text-sm">{m.awayTeam.score ?? 0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
