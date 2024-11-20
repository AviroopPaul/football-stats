import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const API_BASE_URL = "https://api.football-data.org/v4";
  const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;

  // Extract `teamId` from the URL path
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/');
  const teamId = pathSegments[pathSegments.length - 1];

  if (!teamId) {
    return NextResponse.json(
      { error: "Team ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch team details
    const teamResponse = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
      headers: {
        "X-Auth-Token": API_KEY || "",
      },
    });

    // Fetch team's matches
    const matchesResponse = await fetch(
      `${API_BASE_URL}/teams/${teamId}/matches?limit=5&status=FINISHED`,
      {
        headers: {
          "X-Auth-Token": API_KEY || "",
        },
      }
    );

    if (!teamResponse.ok || !matchesResponse.ok) {
      throw new Error("API Error");
    }

    const teamData = await teamResponse.json();
    const matchesData = await matchesResponse.json();

    return NextResponse.json({
      team: teamData,
      matches: matchesData.matches,
    });
  } catch (error) {
    console.error("Error fetching team details:", error);
    return NextResponse.json(
      { error: "Failed to fetch team details" },
      { status: 500 }
    );
  }
}
