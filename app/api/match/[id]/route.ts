import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const API_BASE_URL = "https://api.football-data.org/v4";
  const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;

  // Extract ID from the URL path instead of search params
  const pathParts = request.url.split('/');
  const matchId = pathParts[pathParts.length - 1];

  if (!matchId) {
    return NextResponse.json(
      { error: "Match ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}`, {
      headers: {
        "X-Auth-Token": API_KEY || "",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching match details:", error);
    return NextResponse.json(
      { error: "Failed to fetch match details" },
      { status: 500 }
    );
  }
}
