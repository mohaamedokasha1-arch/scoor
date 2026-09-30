import { NextResponse } from 'next/server';
import { fetchLeagueStandings } from '@/lib/sports-api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ success: false, error: 'League ID is required' }, { status: 400 });
  }

  try {
    const data = await fetchLeagueStandings(id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(`API Error /api/league/${id}:`, error);
    return NextResponse.json({ success: false, error: 'Failed to fetch league standings' }, { status: 500 });
  }
}
