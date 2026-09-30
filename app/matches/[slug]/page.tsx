'use client';

import React, { useState, useEffect, use } from 'react';
import { MatchDetail, CompetitionInfo } from '@/lib/sports-api';
import { DaySelector } from '@/components/DaySelector';
import { LeagueMatchesGroup } from '@/components/LeagueMatchesGroup';
import { LiveScoreTicker } from '@/components/LiveScoreTicker';
import { useLanguage } from '@/lib/i18n';
import { Activity, RotateCw, Calendar, AlertCircle, Flame } from 'lucide-react';

export default function MatchesBySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t, language } = useLanguage();
  const [matches, setMatches] = useState<MatchDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFormatted, setDateFormatted] = useState<string>('');
  const [liveOnly, setLiveOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validSlug = ['today', 'yesterday', 'tomorrow'].includes(slug) ? slug : 'today';

  const loadData = async (slugParam: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/matches?date=${slugParam}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.matches)) {
        setMatches(json.matches);
        setDateFormatted(json.dateFormatted || '');
      } else {
        setError('تعذّر جلب البيانات الرياضية.');
      }
    } catch {
      setError('حدث خطأ في الاتصال بالشبكة.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(validSlug);
  }, [validSlug]);

  const liveMatches = matches.filter((m) => m.isLive);
  const filteredMatches = liveOnly ? liveMatches : matches;

  const leagueGroupsMap = new Map<string, { league: CompetitionInfo; matches: MatchDetail[] }>();
  filteredMatches.forEach((m) => {
    const lgId = m.league.id || 'all';
    if (!leagueGroupsMap.has(lgId)) {
      leagueGroupsMap.set(lgId, { league: m.league, matches: [] });
    }
    leagueGroupsMap.get(lgId)!.matches.push(m);
  });
  const leagueGroups = Array.from(leagueGroupsMap.values());

  const getPageTitle = () => {
    if (validSlug === 'yesterday') return t.yesterdayMatches;
    if (validSlug === 'tomorrow') return t.tomorrowMatches;
    return t.todayMatches;
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
          <Calendar className="w-8 h-8 text-emerald-400" />
          <span>{getPageTitle()}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          {language === 'ar' ? 'عرض نتائج وجدول المباريات المقامة لهذا اليوم مقسّمة حسب البطولة.' : 'List of all matches and scores for this date grouped by tournament.'}
        </p>
      </div>

      {liveMatches.length > 0 && <LiveScoreTicker liveMatches={liveMatches} />}

      <DaySelector
        currentSlug={validSlug}
        selectedDateFormatted={dateFormatted}
        showLiveToggle={true}
        liveOnly={liveOnly}
        onToggleLiveOnly={setLiveOnly}
        liveCount={liveMatches.length}
      />

      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <RotateCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-300">جاري التحميل...</p>
        </div>
      ) : error ? (
        <div className="bg-red-950/40 border border-red-900/60 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-sm font-bold text-white">{error}</p>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">{t.noMatches}</h3>
          <p className="text-xs text-slate-400">{t.noMatchesDesc}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {leagueGroups.map((group) => (
            <LeagueMatchesGroup key={group.league.id} league={group.league} matches={group.matches} />
          ))}
        </div>
      )}
    </div>
  );
}
