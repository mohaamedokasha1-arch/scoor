'use client';

import React, { useState, useEffect } from 'react';
import { MatchDetail, CompetitionInfo } from '@/lib/sports-api';
import { NewsArticle } from '@/lib/sports-api/news';
import { DaySelector } from '@/components/DaySelector';
import { LiveScoreTicker } from '@/components/LiveScoreTicker';
import { LeagueMatchesGroup } from '@/components/LeagueMatchesGroup';
import { NewsSection } from '@/components/NewsSection';
import { useLanguage } from '@/lib/i18n';
import {
  Activity,
  Flame,
  RotateCw,
  Trophy,
  Calendar,
  AlertCircle,
  Radio,
  Search,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const { t, language } = useLanguage();
  const [matches, setMatches] = useState<MatchDetail[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [liveOnly, setLiveOnly] = useState(false);
  const [dateFormatted, setDateFormatted] = useState<string>('');
  const [selectedDateSlug, setSelectedDateSlug] = useState<string>('today');
  const [customDate, setCustomDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const loadData = async (dateParam = 'today', isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const res = await fetch(`/api/matches?date=${dateParam}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.matches)) {
        setMatches(json.matches);
        setDateFormatted(json.dateFormatted || '');
      } else {
        setError('تعذّر جلب المباريات من مصدر البيانات الرياضية.');
      }

      // Also load news if empty
      if (news.length === 0) {
        const newsRes = await fetch('/api/news');
        const newsJson = await newsRes.json();
        if (newsJson.success && Array.isArray(newsJson.articles)) {
          setNews(newsJson.articles);
        }
      }
    } catch (err) {
      console.error('Failed to load homepage data:', err);
      setError('حدث خطأ في الاتصال بالشبكة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData('today');

    // Auto update live scores every 20 seconds
    const interval = setInterval(() => {
      loadData(selectedDateSlug === 'today' ? 'today' : selectedDateSlug, true);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const handleCustomDateChange = (dateStr: string) => {
    setSelectedDateSlug(dateStr);
    setCustomDate(dateStr);
    loadData(dateStr);
  };

  const liveMatches = matches.filter((m) => m.isLive);
  const filteredMatches = liveOnly ? liveMatches : matches;

  // Group matches by league
  const leagueGroupsMap = new Map<string, { league: CompetitionInfo; matches: MatchDetail[] }>();

  filteredMatches.forEach((match) => {
    const lgId = match.league.id || 'all';
    if (!leagueGroupsMap.has(lgId)) {
      leagueGroupsMap.set(lgId, {
        league: match.league,
        matches: [],
      });
    }
    leagueGroupsMap.get(lgId)!.matches.push(match);
  });

  const leagueGroups = Array.from(leagueGroupsMap.values());

  return (
    <div className="space-y-6">
      {/* Dynamic SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SportsOrganization',
            name: 'KoraScore',
            url: 'https://korascore.com',
            logo: 'https://korascore.com/logo.png',
            description: t.tagline,
          }),
        }}
      />

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-full text-xs border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.autoUpdating}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Kora<span className="text-emerald-400">Score</span> - {t.todayMatches}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t.tagline}. {language === 'ar' ? 'نتائج حيّة ومباشرة لجميع المباريات لحظة بـ لحظة، الإحصائيات، والتشكيلات بدون أي بيانات وهمية.' : 'Live match results, statistics, and lineups updated automatically.'}
            </p>
          </div>

          <button
            onClick={() => loadData(selectedDateSlug, true)}
            disabled={refreshing}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{t.refresh}</span>
          </button>
        </div>
      </div>

      {/* Live Match Ticker if matches are live */}
      {liveMatches.length > 0 && <LiveScoreTicker liveMatches={liveMatches} />}

      {/* Day Selector Tabs */}
      <DaySelector
        currentSlug={selectedDateSlug}
        selectedDateFormatted={dateFormatted}
        onDateChange={handleCustomDateChange}
        showLiveToggle={true}
        liveOnly={liveOnly}
        onToggleLiveOnly={setLiveOnly}
        liveCount={liveMatches.length}
      />

      {/* Matches List Section */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
          <RotateCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-300">
            {language === 'ar' ? 'جاري جلب المباريات من مصدر البيانات الرياضية المباشر...' : 'Loading live match scores...'}
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-950/40 border border-red-900/60 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <h3 className="text-base font-bold text-white">{error}</h3>
          <button
            onClick={() => loadData(selectedDateSlug)}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs"
          >
            إعادة المحاولة
          </button>
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

      {/* Football News Section */}
      {news.length > 0 && (
        <div className="pt-6">
          <NewsSection articles={news} limit={6} />
        </div>
      )}
    </div>
  );
}
