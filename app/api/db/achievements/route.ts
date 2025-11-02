import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { calculateAchievements, ACHIEVEMENTS } from "@/lib/achievements";
import { getAthleteStats } from "@/lib/strava";

/**
 * Sync achievements - check for newly unlocked achievements and save them
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get athlete stats from Strava
    const stats = await getAthleteStats(session.accessToken, session.athlete.id);
    
    // Calculate which achievements should be unlocked
    const achievements = calculateAchievements(stats);
    const unlockedAchievements = achievements.filter(a => a.unlocked);

    // Get already unlocked achievements from database
    const existingAchievements = await prisma.achievement.findMany({
      where: { athleteId: session.athlete.id },
    });

    const existingIds = new Set(existingAchievements.map((a) => a.achievementId));
    
    // Find newly unlocked achievements
    const newAchievements = unlockedAchievements.filter(
      (a) => !existingIds.has(a.id)
    );

    // Save new achievements to database
    let savedCount = 0;
    for (const achievement of newAchievements) {
      await prisma.achievement.create({
        data: {
          athleteId: session.athlete.id,
          achievementId: achievement.id,
          name: achievement.name,
          description: achievement.description,
        },
      });
      savedCount++;
    }

    return NextResponse.json({
      total: unlockedAchievements.length,
      newlyUnlocked: savedCount,
      message: savedCount > 0 
        ? `🎉 ${savedCount} new achievement(s) unlocked!`
        : "No new achievements"
    });

  } catch (error) {
    console.error("Achievement sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync achievements" },
      { status: 500 }
    );
  }
}

/**
 * Get all achievements with unlock status from database
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get unlocked achievements from database
    const unlockedAchievements = await prisma.achievement.findMany({
      where: { athleteId: session.athlete.id },
      orderBy: { unlockedAt: "desc" },
    });

    // Get current stats to calculate progress
    const stats = await getAthleteStats(session.accessToken, session.athlete.id);
    const allAchievements = calculateAchievements(stats);

    // Add unlock dates from database
    const achievementsWithDates = allAchievements.map((achievement) => {
      const dbAchievement = unlockedAchievements.find(
        (a) => a.achievementId === achievement.id
      );
      
      return {
        ...achievement,
        unlockedAt: dbAchievement?.unlockedAt.toISOString(),
      };
    });

    return NextResponse.json(achievementsWithDates);

  } catch (error) {
    console.error("Achievement fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}
