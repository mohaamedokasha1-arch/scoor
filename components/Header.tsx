'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import {
  Trophy,
  Calendar,
  Globe,
  Search,
  Menu,
  X,
  Activity,
  Newspaper,
  ChevronDown,
  Clock,
  Sparkles,
  Flame
} from 'lucide-react';

export function Header() {
  const { t, language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { href: '/', label: t.home, icon: Calendar },
    { href: '/matches/today', label: t.todayMatches, icon: Calendar },
    { href: '/matches/yesterday', label: t.yesterdayMatches, icon: Clock },
    { href: '/matches/tomorrow', label: t.tomorrowMatches, icon: Calendar },
    { href: '/matches/today?live=true', label: t.liveMatches, icon: Flame, isLive: true },
    { href: '/league/eng.1', label: t.leagues, icon: Trophy },
    { href: '/news', label: t.news, icon: Newspaper },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-emerald-900/30 text-white shadow-xl">
      {/* Top Announcement Ticker / Live Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 px-4 py-1.5 border-b border-emerald-800/20 text-xs flex justify-between items-center text-slate-300">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full text-[11px] border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            KoraScore Live
          </span>
          <span className="truncate text-slate-300">
            {language === 'ar' ? 'تغطية حية ومباشرة لجميع مباريات الدوريات العربية والعالمية' : 'Live coverage for all top world and regional football matches'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1 hover:text-emerald-400 transition-colors text-slate-300 font-medium px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-800"
            title="تغيير اللغة / Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-emerald-400 font-sans">
                Kora<span className="text-emerald-400">Score</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase -mt-1">
                {language === 'ar' ? 'كورا سكور' : 'Live Football'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.isLive ? 'text-red-500 animate-pulse' : isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.isLive && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Bar (Search & Mobile Toggle) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {searchOpen && (
          <div className="py-3 border-t border-slate-800 animate-in slide-in-from-top duration-200">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                autoFocus
                className="w-full bg-slate-900/90 border border-emerald-500/40 rounded-xl py-2.5 px-4 pr-10 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-emerald-900/40 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${link.isLive ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
