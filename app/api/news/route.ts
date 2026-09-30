import { NextResponse } from 'next/server';
import { fetchFootballNews } from '@/lib/sports-api/news';

export async function GET() {
  try {
    const articles = await fetchFootballNews();
    return NextResponse.json({ success: true, articles });
  } catch (error) {
    console.error('API Error /api/news:', error);
    return NextResponse.json({ success: false, articles: [] }, { status: 500 });
  }
}
