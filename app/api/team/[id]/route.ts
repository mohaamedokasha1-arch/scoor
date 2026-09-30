import { NextResponse } from 'next/server';
import { fetchTeamData } from '@/lib/sports-api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ success: false, error: 'Team ID is required' }, { status: 400 });
  }

  try {
    const data = await fetchTeamData(id);
    if (!data) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, team: data });
  } catch (error) {
    console.error(`API Error /api/team/${id}:`, error);
    return NextResponse.json({ success: false, error: 'Failed to fetch team data' }, { status: 500 });
  }
}
