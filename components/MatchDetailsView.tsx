'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MatchDetail } from '@/lib/sports-api';
import { useLanguage } from '@/lib/i18n';
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Tv,
  Activity,
  Flame,
  Shield,
  BarChart3,
  Users,
  History,
  RotateCw,
  Award
} from 'lucide-react';

interface MatchDetailsViewProps {
  initialMatch: MatchDetail;
}

export function MatchDetailsView({ initialMatch }: MatchDetailsViewProps) {
  const { t, language } = useLanguage();
  const [match, setMatch] = useState<MatchDetail>(initialMatch);
  const [activeTab, setActiveTab] = useState<'events' | 'stats' | 'lineups' | 'h2h'>('events');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/match/${match.id}`);
      const json = await res.json();
      if (json.success && json.match) {
        setMatch(json.match);
      }
    } catch {
      // ignore
    } finally {
      setRefreshing(false);
    }
  };

  const homeName = language === 'ar' ? match.homeTeam.name : match.homeTeam.name;
  const awayName = language === 'ar' ? match.awayTeam.name : match.awayTeam.name;

  return (
    <div className="space-y-6">
      {/* Top Banner & League Breadcrumb */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <Link
          href={`/league/${match.league.id}`}
          className="flex items-center gap-2 text-sm font-bold text-white hover:text-emerald-400 transition-colors"
        >
          {match.league.logo && (
            <img src={match.league.logo} alt="" className="w-6 h-6 object-contain" />
          )}
          <span>{match.league.name}</span>
        </Link>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-400 bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
        >
          <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{t.refresh}</span>
        </button>
      </div>

      {/* Main Scoreboard Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-3 items-center gap-4 text-center">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-3">
            <Link href={`/team/${match.homeTeam.id}`} className="group flex flex-col items-center gap-3">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-slate-950/80 p-3 sm:p-4 border border-slate-800 group-hover:border-emerald-500/50 shadow-xl flex items-center justify-center transition-all group-hover:scale-105">
                <img src={match.homeTeam.logo} alt={homeName} className="w-full h-full object-contain" />
              </div>
              <span className="text-sm sm:text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                {homeName}
              </span>
            </Link>
          </div>

          {/* Score & Status */}
          <div className="flex flex-col items-center justify-center gap-2">
            {match.isLive ? (
              <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-400 font-bold px-3 py-1 rounded-full text-xs border border-red-500/40">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>{match.statusText}</span>
                {match.clockDisplay && <span className="font-mono text-white bg-red-600 px-1.5 py-0.2 rounded">{match.clockDisplay}</span>}
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-800/80 px-3 py-1 rounded-full">
                {match.statusText}
              </span>
            )}

            <div className="flex items-center gap-3 font-mono text-3xl sm:text-5xl font-black text-white tracking-wider my-1">
              <span>{match.homeTeam.score ?? '-'}</span>
              <span className="text-emerald-500 text-2xl sm:text-3xl">:</span>
              <span>{match.awayTeam.score ?? '-'}</span>
            </div>

            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{match.time}</span>
            </div>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-3">
            <Link href={`/team/${match.awayTeam.id}`} className="group flex flex-col items-center gap-3">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-slate-950/80 p-3 sm:p-4 border border-slate-800 group-hover:border-emerald-500/50 shadow-xl flex items-center justify-center transition-all group-hover:scale-105">
                <img src={match.awayTeam.logo} alt={awayName} className="w-full h-full object-contain" />
              </div>
              <span className="text-sm sm:text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                {awayName}
              </span>
            </Link>
          </div>
        </div>

        {/* Stadium, Referee, Channel Meta */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-400">
          {match.venue && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{match.venue}</span>
            </span>
          )}
          {match.referee && (
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{match.referee}</span>
            </span>
          )}
          {match.broadcasts && match.broadcasts.length > 0 && (
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <Tv className="w-4 h-4" />
              <span>{match.broadcasts.join(', ')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'events'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{t.events}</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'stats'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{t.matchStats}</span>
        </button>

        <button
          onClick={() => setActiveTab('lineups')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'lineups'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.lineups}</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 min-h-[250px]">
        {/* Events Timeline */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>{t.events}</span>
            </h3>

            {(!match.events || match.events.length === 0) ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                {match.isFinished
                  ? 'تمت المباراة بنجاح. لا تتوفر أحداث مسجلة بالتفصيل لهذا اللقاء.'
                  : 'لم تسجل أحداث رئيسية في المباراة بعد.'}
              </div>
            ) : (
              <div className="relative border-l-2 border-emerald-500/30 space-y-6 ml-4 pl-6">
                {match.events.map((evt) => (
                  <div key={evt.id} className="relative flex items-start justify-between gap-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-800/40 px-2 py-0.5 rounded">
                        {evt.minute}
                      </span>
                      <p className="text-sm font-bold text-white mt-1">{evt.player}</p>
                      {evt.detail && <p className="text-xs text-slate-400">{evt.detail}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Match Statistics */}
        {activeTab === 'stats' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>{t.matchStats}</span>
            </h3>

            {(!match.stats || match.stats.length === 0) ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                إحصائيات التفاصيل غير متوفرة لهذه المباراة حالياً.
              </div>
            ) : (
              <div className="space-y-4 max-w-2xl mx-auto">
                {match.stats.map((s) => {
                  const hVal = parseFloat(String(s.homeValue).replace('%', '')) || 0;
                  const aVal = parseFloat(String(s.awayValue).replace('%', '')) || 0;
                  const total = hVal + aVal || 1;
                  const hPct = Math.round((hVal / total) * 100);
                  const aPct = 100 - hPct;

                  return (
                    <div key={s.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span className="text-emerald-400">{s.homeValue}</span>
                        <span className="text-slate-400 font-semibold">{s.displayName}</span>
                        <span className="text-emerald-400">{s.awayValue}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-950 flex overflow-hidden border border-slate-800">
                        <div style={{ width: `${hPct}%` }} className="bg-emerald-500 h-full transition-all duration-500" />
                        <div style={{ width: `${aPct}%` }} className="bg-slate-700 h-full transition-all duration-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Lineups */}
        {activeTab === 'lineups' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Home Team Squad */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <img src={match.homeTeam.logo} alt="" className="w-6 h-6 object-contain" />
                  <h4 className="font-bold text-white text-sm">{match.homeTeam.name}</h4>
                  {match.lineups?.home.formation && (
                    <span className="text-xs text-emerald-400 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded">
                      {match.lineups.home.formation}
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  {match.lineups?.home.starters.length === 0 ? (
                    <p className="text-slate-400 py-4 text-center">التشكيلة الأساسية غير متوفرة بعد</p>
                  ) : (
                    match.lineups?.home.starters.map((p) => (
                      <div key={p.id} className="flex items-center justify-between py-1 border-b border-slate-900 text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-center font-mono font-bold text-emerald-400">{p.jersey || '-'}</span>
                          <span className="font-semibold text-white">{p.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{p.position}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Away Team Squad */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <img src={match.awayTeam.logo} alt="" className="w-6 h-6 object-contain" />
                  <h4 className="font-bold text-white text-sm">{match.awayTeam.name}</h4>
                  {match.lineups?.away.formation && (
                    <span className="text-xs text-emerald-400 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded">
                      {match.lineups.away.formation}
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  {match.lineups?.away.starters.length === 0 ? (
                    <p className="text-slate-400 py-4 text-center">التشكيلة الأساسية غير متوفرة بعد</p>
                  ) : (
                    match.lineups?.away.starters.map((p) => (
                      <div key={p.id} className="flex items-center justify-between py-1 border-b border-slate-900 text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-center font-mono font-bold text-emerald-400">{p.jersey || '-'}</span>
                          <span className="font-semibold text-white">{p.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{p.position}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
