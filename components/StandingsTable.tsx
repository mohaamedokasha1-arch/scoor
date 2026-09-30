'use client';

import React from 'react';
import Link from 'next/link';
import { StandingRow } from '@/lib/sports-api';
import { useLanguage } from '@/lib/i18n';
import { Trophy } from 'lucide-react';

interface StandingsTableProps {
  title?: string;
  standings: StandingRow[];
}

export function StandingsTable({ title, standings }: StandingsTableProps) {
  const { t, language } = useLanguage();

  if (!standings || standings.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium">جدول الترتيب غير متوفر حالياً لهذه البطولة.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {title && (
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-extrabold text-white">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-right">
          <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-3 text-center w-10">{t.rank}</th>
              <th className="py-3 px-4 text-right">{t.teams}</th>
              <th className="py-3 px-2 text-center">{t.played}</th>
              <th className="py-3 px-2 text-center">{t.won}</th>
              <th className="py-3 px-2 text-center">{t.drawn}</th>
              <th className="py-3 px-2 text-center">{t.lost}</th>
              <th className="py-3 px-2 text-center hidden sm:table-cell">{t.gf}</th>
              <th className="py-3 px-2 text-center hidden sm:table-cell">{t.ga}</th>
              <th className="py-3 px-2 text-center">{t.gd}</th>
              <th className="py-3 px-3 text-center text-emerald-400 font-extrabold">{t.pts}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {standings.map((row) => (
              <tr
                key={row.team.id}
                className="hover:bg-slate-800/50 transition-colors group"
              >
                <td className="py-3 px-3 text-center font-mono font-bold text-slate-400 group-hover:text-emerald-400">
                  {row.rank}
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/team/${row.team.id}`}
                    className="flex items-center gap-2.5 font-bold text-white hover:text-emerald-400 transition-colors"
                  >
                    <img
                      src={row.team.logo}
                      alt={row.team.name}
                      className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="truncate max-w-[140px] sm:max-w-[200px]">{row.team.name}</span>
                  </Link>
                </td>
                <td className="py-3 px-2 text-center font-mono text-slate-300">{row.gamesPlayed}</td>
                <td className="py-3 px-2 text-center font-mono text-emerald-400 font-semibold">{row.wins}</td>
                <td className="py-3 px-2 text-center font-mono text-slate-400">{row.ties}</td>
                <td className="py-3 px-2 text-center font-mono text-red-400">{row.losses}</td>
                <td className="py-3 px-2 text-center font-mono text-slate-400 hidden sm:table-cell">{row.goalsFor}</td>
                <td className="py-3 px-2 text-center font-mono text-slate-400 hidden sm:table-cell">{row.goalsAgainst}</td>
                <td className="py-3 px-2 text-center font-mono font-bold text-slate-200">
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </td>
                <td className="py-3 px-3 text-center font-mono font-black text-sm text-emerald-400 bg-emerald-950/20">
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
