'use client';

import React, { useState, useEffect, use } from 'react';
import { MatchDetail } from '@/lib/sports-api';
import { MatchDetailsView } from '@/components/MatchDetailsView';
import { RotateCw, AlertCircle } from 'lucide-react';

export default function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMatch() {
      try {
        const res = await fetch(`/api/match/${id}`);
        const json = await res.json();
        if (json.success && json.match) {
          setMatch(json.match);
        } else {
          setError('المباراة غير موجودة أو تعذر تحميل تفاصيلها.');
        }
      } catch {
        setError('حدث خطأ أثناء تحميل بيانات المباراة.');
      } finally {
        setLoading(false);
      }
    }
    loadMatch();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center space-y-4 my-8">
        <RotateCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-300">جاري تحميل تفاصيل و أحداث المباراة...</p>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="bg-red-950/40 border border-red-900/60 rounded-3xl p-12 text-center space-y-3 my-8">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">{error || 'لم يتم العثور على المباراة'}</h3>
      </div>
    );
  }

  return <MatchDetailsView initialMatch={match} />;
}
