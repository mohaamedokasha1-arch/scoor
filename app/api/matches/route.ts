import { NextResponse } from 'next/server';
import { fetchMatchesForDate } from '@/lib/sports-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let dateParam = searchParams.get('date') || 'today';

  const today = new Date();
  let targetDate = new Date();

  if (dateParam === 'yesterday') {
    targetDate.setDate(today.getDate() - 1);
  } else if (dateParam === 'tomorrow') {
    targetDate.setDate(today.getDate() + 1);
  } else if (dateParam !== 'today') {
    // Check if YYYYMMDD or YYYY-MM-DD
    const cleaned = dateParam.replace(/-/g, '');
    if (cleaned.length === 8 && !isNaN(Number(cleaned))) {
      const year = parseInt(cleaned.substring(0, 4));
      const month = parseInt(cleaned.substring(4, 6)) - 1;
      const day = parseInt(cleaned.substring(6, 8));
      targetDate = new Date(year, month, day);
    }
  }

  const yyyy = targetDate.getFullYear();
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  const dd = String(targetDate.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;

  try {
    const matches = await fetchMatchesForDate(dateStr);
    return NextResponse.json({
      success: true,
      date: `${yyyy}-${mm}-${dd}`,
      dateFormatted: targetDate.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      matches,
    });
  } catch (error) {
    console.error('API Error /api/matches:', error);
    return NextResponse.json({ success: false, matches: [], error: 'Failed to fetch matches' }, { status: 500 });
  }
}
