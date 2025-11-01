import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getActivities } from "@/lib/strava";

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "30");

    // Fetch activities from Strava
    const activities = await getActivities(session.accessToken, page, perPage);

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching Strava activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
