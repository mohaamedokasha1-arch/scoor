import { NextResponse } from 'next/server';
import { fetchMatchesForDate } from '@/lib/sports-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim().toLowerCase();

  if (!query || query.length < 2) {
    return NextResponse.json({ success: true, results: { matches: [], leagues: [], teams: [] } });
  }

  try {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}${mm}${dd}`;

    const matches = await fetchMatchesForDate(todayStr);

    const matchingMatches = matches.filter((m) =>
      m.homeTeam.name.toLowerCase().includes(query) ||
      m.awayTeam.name.toLowerCase().includes(query) ||
      m.league.name.toLowerCase().includes(query)
    );

    const teamsMap = new Map();
    const leaguesMap = new Map();

    matches.forEach((m) => {
      if (m.homeTeam.name.toLowerCase().includes(query)) {
        teamsMap.set(m.homeTeam.id, m.homeTeam);
      }
      if (m.awayTeam.name.toLowerCase().includes(query)) {
        teamsMap.set(m.awayTeam.id, m.awayTeam);
      }
      if (m.league.name.toLowerCase().includes(query)) {
        leaguesMap.set(m.league.id, m.league);
      }
    });

    return NextResponse.json({
      success: true,
      results: {
        matches: matchingMatches,
        teams: Array.from(teamsMap.values()),
        leagues: Array.from(leaguesMap.values()),
      },
    });
  } catch (error) {
    console.error('API Error /api/search:', error);
    return NextResponse.json({ success: false, results: { matches: [], leagues: [], teams: [] } }, { status: 500 });
  }
}
