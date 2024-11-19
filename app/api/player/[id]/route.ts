import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const API_BASE_URL = 'https://api.football-data.org/v4';
  const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;

  try {
    const response = await fetch(`${API_BASE_URL}/persons/${params.id}`, {
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
    console.error('Error fetching player data:', error);
    return NextResponse.json({ error: 'Failed to fetch player data' }, { status: 500 });
  }
} 