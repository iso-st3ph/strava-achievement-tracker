import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAthlete, getAthleteStats } from "@/lib/strava";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch athlete profile to get the athlete ID
    const athlete = await getAthlete(session.accessToken);
    
    // Fetch athlete stats
    const stats = await getAthleteStats(session.accessToken, athlete.id);

    return NextResponse.json({
      athlete,
      stats,
    });
  } catch (error) {
    console.error("Error fetching Strava stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
