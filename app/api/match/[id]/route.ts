import { NextResponse } from 'next/server';
import { fetchMatchDetails } from '@/lib/sports-api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ success: false, error: 'Match ID is required' }, { status: 400 });
  }

  try {
    const match = await fetchMatchDetails(id);
    if (!match) {
      return NextResponse.json({ success: false, error: 'Match not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, match });
  } catch (error) {
    console.error(`API Error /api/match/${id}:`, error);
    return NextResponse.json({ success: false, error: 'Failed to fetch match details' }, { status: 500 });
  }
}
