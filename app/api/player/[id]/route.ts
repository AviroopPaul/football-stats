import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const API_BASE_URL = "https://api.football-data.org/v4";
  const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;

  // Extract `id` from the request URL path
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/");
  const personId = pathSegments[pathSegments.length - 1];

  if (!personId) {
    return NextResponse.json(
      { error: "Person ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/persons/${personId}`, {
      headers: {
        "X-Auth-Token": API_KEY || "",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching player data:", error);
    return NextResponse.json(
      { error: "Failed to fetch player data" },
      { status: 500 }
    );
  }
}
