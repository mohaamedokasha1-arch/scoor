'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Activity, Flame } from 'lucide-react';

interface DaySelectorProps {
  currentSlug: 'yesterday' | 'today' | 'tomorrow' | string;
  selectedDateFormatted?: string;
  onDateChange?: (dateStr: string) => void;
  showLiveToggle?: boolean;
  liveOnly?: boolean;
  onToggleLiveOnly?: (live: boolean) => void;
  liveCount?: number;
}

export function DaySelector({
  currentSlug,
  selectedDateFormatted,
  onDateChange,
  showLiveToggle = true,
  liveOnly = false,
  onToggleLiveOnly,
  liveCount = 0,
}: DaySelectorProps) {
  const { t, language } = useLanguage();

  const isToday = currentSlug === 'today' || currentSlug === '';
  const isYesterday = currentSlug === 'yesterday';
  const isTomorrow = currentSlug === 'tomorrow';

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // YYYY-MM-DD
    if (val && onDateChange) {
      onDateChange(val);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-6 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Date Slugs Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Link
            href="/matches/yesterday"
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              isYesterday
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t.yesterdayMatches}</span>
          </Link>

          <Link
            href="/matches/today"
            className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all ${
              isToday
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{t.todayMatches}</span>
          </Link>

          <Link
            href="/matches/tomorrow"
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              isTomorrow
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{t.tomorrowMatches}</span>
          </Link>
        </div>

        {/* Date Picker & Live Filter Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          {showLiveToggle && onToggleLiveOnly && (
            <button
              onClick={() => onToggleLiveOnly(!liveOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                liveOnly
                  ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/20'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${liveOnly ? 'text-white' : 'text-red-500 animate-pulse'}`} />
              <span>{t.liveOnly}</span>
              {liveCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {liveCount}
                </span>
              )}
            </button>
          )}

          <div className="relative flex items-center">
            <input
              type="date"
              onChange={handleDateInput}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
            />
            <div className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer">
              <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.selectDate}</span>
            </div>
          </div>
        </div>
      </div>

      {selectedDateFormatted && (
        <div className="mt-2 text-xs text-slate-400 font-medium text-center sm:text-right">
          {selectedDateFormatted}
        </div>
      )}
    </div>
  );
}
