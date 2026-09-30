'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

export interface Translations {
  siteName: string;
  tagline: string;
  home: string;
  todayMatches: string;
  yesterdayMatches: string;
  tomorrowMatches: string;
  liveMatches: string;
  leagues: string;
  teams: string;
  news: string;
  search: string;
  searchPlaceholder: string;
  allMatches: string;
  noMatches: string;
  noMatchesDesc: string;
  liveNow: string;
  fullTime: string;
  halfTime: string;
  scheduled: string;
  postponed: string;
  matchDetails: string;
  standings: string;
  matchStats: string;
  lineups: string;
  events: string;
  headToHead: string;
  favorite: string;
  favorited: string;
  viewLeague: string;
  viewTeam: string;
  refresh: string;
  autoUpdating: string;
  lastUpdated: string;
  possession: string;
  shotsOnTarget: string;
  totalShots: string;
  corners: string;
  fouls: string;
  yellowCards: string;
  redCards: string;
  substitutions: string;
  goals: string;
  channel: string;
  venue: string;
  referee: string;
  readMore: string;
  quickLinks: string;
  topLeagues: string;
  copyright: string;
  selectDate: string;
  liveOnly: string;
  played: string;
  won: string;
  drawn: string;
  lost: string;
  gf: string;
  ga: string;
  gd: string;
  pts: string;
  rank: string;
}

const translations: Record<Language, Translations> = {
  ar: {
    siteName: 'KoraScore',
    tagline: 'موقعك المفضل لمتابعة نتائج ومباريات كرة القدم مباشرة',
    home: 'الرئيسية',
    todayMatches: 'مباريات اليوم',
    yesterdayMatches: 'مباريات الأمس',
    tomorrowMatches: 'مباريات الغد',
    liveMatches: 'مباشر Live',
    leagues: 'البطولات',
    teams: 'الفرق',
    news: 'الأخبار',
    search: 'بحث',
    searchPlaceholder: 'ابحث عن فريق، بطولة، أو مباراة...',
    allMatches: 'جميع المباريات',
    noMatches: 'لا توجد مباريات لهذا اليوم',
    noMatchesDesc: 'اختر تاريخاً آخر من التقويم أو تفقّد جدول البطولات الأخرى.',
    liveNow: 'جارية الآن',
    fullTime: 'انتهت',
    halfTime: 'استراحة',
    scheduled: 'لم تبدأ',
    postponed: 'مؤجلة',
    matchDetails: 'تفاصيل المباراة',
    standings: 'جدول الترتيب',
    matchStats: 'الإحصائيات',
    lineups: 'التشكيلة',
    events: 'أحداث المباراة',
    headToHead: 'المواجهات المباشرة',
    favorite: 'إضافة للمفضلة',
    favorited: 'في المفضلة',
    viewLeague: 'صفحة البطولة',
    viewTeam: 'صفحة الفريق',
    refresh: 'تحديث',
    autoUpdating: 'تحديث تلقائي مفعّل',
    lastUpdated: 'آخر تحديث',
    possession: 'الاستحواذ %',
    shotsOnTarget: 'التسديدات على المرمى',
    totalShots: 'إجمالي التسديدات',
    corners: 'الضربات الركنية',
    fouls: 'الأخطاء',
    yellowCards: 'البطاقات الصفراء',
    redCards: 'البطاقات الحمراء',
    substitutions: 'التبديلات',
    goals: 'الأهداف',
    channel: 'القناة الناقلة',
    venue: 'الملعب',
    referee: 'الحكم',
    readMore: 'اقرأ الخبر كاملاً',
    quickLinks: 'روابط سريعة',
    topLeagues: 'أبرز البطولات',
    copyright: 'جميع الحقوق محفوظة © KoraScore',
    selectDate: 'تحديد تاريخ',
    liveOnly: 'المباشر فقط',
    played: 'لعب',
    won: 'فاز',
    drawn: 'تعادل',
    lost: 'خسر',
    gf: 'له',
    ga: 'عليه',
    gd: 'الفارق',
    pts: 'نقاط',
    rank: '#',
  },
  en: {
    siteName: 'KoraScore',
    tagline: 'Your Premier Football Scores & Live Matches Portal',
    home: 'Home',
    todayMatches: "Today's Matches",
    yesterdayMatches: "Yesterday's Matches",
    tomorrowMatches: "Tomorrow's Matches",
    liveMatches: 'Live',
    leagues: 'Leagues',
    teams: 'Teams',
    news: 'News',
    search: 'Search',
    searchPlaceholder: 'Search for teams, leagues, or matches...',
    allMatches: 'All Matches',
    noMatches: 'No matches found for this date',
    noMatchesDesc: 'Choose another date from the calendar or check other competitions.',
    liveNow: 'LIVE',
    fullTime: 'FT',
    halfTime: 'HT',
    scheduled: 'Scheduled',
    postponed: 'Postponed',
    matchDetails: 'Match Details',
    standings: 'Standings',
    matchStats: 'Statistics',
    lineups: 'Lineups',
    events: 'Events',
    headToHead: 'Head to Head',
    favorite: 'Favorite',
    favorited: 'Favorited',
    viewLeague: 'View League',
    viewTeam: 'View Team',
    refresh: 'Refresh',
    autoUpdating: 'Live Auto Update Active',
    lastUpdated: 'Last updated',
    possession: 'Possession %',
    shotsOnTarget: 'Shots on Target',
    totalShots: 'Total Shots',
    corners: 'Corners',
    fouls: 'Fouls',
    yellowCards: 'Yellow Cards',
    redCards: 'Red Cards',
    substitutions: 'Substitutions',
    goals: 'Goals',
    channel: 'Broadcast Channel',
    venue: 'Stadium',
    referee: 'Referee',
    readMore: 'Read Full Story',
    quickLinks: 'Quick Links',
    topLeagues: 'Top Competitions',
    copyright: 'All rights reserved © KoraScore',
    selectDate: 'Select Date',
    liveOnly: 'Live Only',
    played: 'P',
    won: 'W',
    drawn: 'D',
    lost: 'L',
    gf: 'GF',
    ga: 'GA',
    gd: 'GD',
    pts: 'PTS',
    rank: '#',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    const saved = localStorage.getItem('korascore_lang') as Language;
    if (saved && (saved === 'ar' || saved === 'en')) {
      setLanguageState(saved);
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    } else {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('korascore_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
