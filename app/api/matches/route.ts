import { NextResponse } from 'next/server';

export async function GET() {
  const API_BASE_URL = 'https://api.football-data.org/v4';
  const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;

  // Calculate the date range for the past week
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 10);
  
  const dateFrom = lastWeek.toISOString().split('T')[0];
  const dateTo = today.toISOString().split('T')[0];

  try {
    const response = await fetch(`${API_BASE_URL}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`, {
      headers: {
        'X-Auth-Token': API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
