import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getActivities } from "@/lib/strava";
import { prisma } from "@/lib/prisma";
import type { Activity as PrismaActivity } from "@prisma/client";

/**
 * Sync activities from Strava to database
 * This endpoint fetches recent activities and stores them
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch activities from Strava (up to 200)
    const activities = await getActivities(session.accessToken, 1, 200);
    
    if (!activities || activities.length === 0) {
      return NextResponse.json({ synced: 0, message: "No activities to sync" });
    }

    // First, ensure athlete exists in database
    await prisma.athlete.upsert({
      where: { id: session.athlete.id },
      update: {
        username: null,
        firstname: session.athlete.firstname,
        lastname: session.athlete.lastname,
        profileMedium: session.athlete.profile_medium || null,
        profile: session.athlete.profile || null,
        updatedAt: new Date(),
      },
      create: {
        id: session.athlete.id,
        username: null,
        firstname: session.athlete.firstname,
        lastname: session.athlete.lastname,
        profileMedium: session.athlete.profile_medium || null,
        profile: session.athlete.profile || null,
      },
    });

    // Upsert each activity
    let syncedCount = 0;
    for (const activity of activities) {
      await prisma.activity.upsert({
        where: { id: activity.id },
        update: {
          name: activity.name,
          distance: activity.distance,
          movingTime: activity.moving_time,
          elapsedTime: activity.elapsed_time,
          totalElevationGain: activity.total_elevation_gain,
          type: activity.type,
          startDate: new Date(activity.start_date),
          startDateLocal: new Date(activity.start_date_local),
          averageSpeed: activity.average_speed,
          maxSpeed: activity.max_speed,
          averageHeartrate: activity.average_heartrate || null,
          maxHeartrate: activity.max_heartrate || null,
          updatedAt: new Date(),
        },
        create: {
          id: activity.id,
          athleteId: session.athlete.id,
          name: activity.name,
          distance: activity.distance,
          movingTime: activity.moving_time,
          elapsedTime: activity.elapsed_time,
          totalElevationGain: activity.total_elevation_gain,
          type: activity.type,
          startDate: new Date(activity.start_date),
          startDateLocal: new Date(activity.start_date_local),
          averageSpeed: activity.average_speed,
          maxSpeed: activity.max_speed,
          averageHeartrate: activity.average_heartrate || null,
          maxHeartrate: activity.max_heartrate || null,
        },
      });
      syncedCount++;
    }

    return NextResponse.json({ 
      synced: syncedCount,
      message: `Successfully synced ${syncedCount} activities`
    });

  } catch (error) {
    console.error("Activity sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync activities" },
      { status: 500 }
    );
  }
}

/**
 * Get activities from database
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "30");
    const skip = (page - 1) * perPage;

    // Get activities from database
    const activities = await prisma.activity.findMany({
      where: { athleteId: session.athlete.id },
      orderBy: { startDateLocal: "desc" },
      skip,
      take: perPage,
    });

    // Transform to match Strava API format
    const formattedActivities = activities.map((activity: PrismaActivity) => ({
      id: activity.id,
      name: activity.name,
      distance: activity.distance,
      moving_time: activity.movingTime,
      elapsed_time: activity.elapsedTime,
      total_elevation_gain: activity.totalElevationGain,
      type: activity.type,
      start_date: activity.startDate.toISOString(),
      start_date_local: activity.startDateLocal.toISOString(),
      average_speed: activity.averageSpeed,
      max_speed: activity.maxSpeed,
      average_heartrate: activity.averageHeartrate,
      max_heartrate: activity.maxHeartrate,
    }));

    return NextResponse.json(formattedActivities);

  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities from database" },
      { status: 500 }
    );
  }
}
