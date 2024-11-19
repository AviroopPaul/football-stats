import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const API_BASE_URL = 'https://api.football-data.org/v4';
  const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;
  const matchId = params.id;

  try {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}`, {
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
    console.error('Error fetching match details:', error);
    return NextResponse.json({ error: 'Failed to fetch match details' }, { status: 500 });
  }
}