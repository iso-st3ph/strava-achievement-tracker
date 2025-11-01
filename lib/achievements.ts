import { Achievement } from "@/types";

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "distance" | "activities" | "elevation" | "speed" | "consistency";
  requirement: number;
  unit: string;
}

// Achievement definitions
export const ACHIEVEMENTS: AchievementDefinition[] = [
  // Distance Achievements
  {
    id: "first_step",
    name: "First Step",
    description: "Complete your first run",
    icon: "👟",
    category: "distance",
    requirement: 1,
    unit: "km",
  },
  {
    id: "getting_started",
    name: "Getting Started",
    description: "Run a total of 10 km",
    icon: "🏃",
    category: "distance",
    requirement: 10,
    unit: "km",
  },
  {
    id: "half_century",
    name: "Half Century",
    description: "Run a total of 50 km",
    icon: "🎯",
    category: "distance",
    requirement: 50,
    unit: "km",
  },
  {
    id: "century",
    name: "Century",
    description: "Run a total of 100 km",
    icon: "💯",
    category: "distance",
    requirement: 100,
    unit: "km",
  },
  {
    id: "marathon_master",
    name: "Marathon Master",
    description: "Run a total of 200 km",
    icon: "🏅",
    category: "distance",
    requirement: 200,
    unit: "km",
  },
  {
    id: "ultra_runner",
    name: "Ultra Runner",
    description: "Run a total of 500 km",
    icon: "⭐",
    category: "distance",
    requirement: 500,
    unit: "km",
  },
  {
    id: "distance_legend",
    name: "Distance Legend",
    description: "Run a total of 1000 km",
    icon: "👑",
    category: "distance",
    requirement: 1000,
    unit: "km",
  },

  // Activity Count Achievements
  {
    id: "first_run",
    name: "First Run",
    description: "Log your first activity",
    icon: "🌟",
    category: "activities",
    requirement: 1,
    unit: "runs",
  },
  {
    id: "committed",
    name: "Committed",
    description: "Complete 10 runs",
    icon: "💪",
    category: "activities",
    requirement: 10,
    unit: "runs",
  },
  {
    id: "dedicated",
    name: "Dedicated",
    description: "Complete 25 runs",
    icon: "🔥",
    category: "activities",
    requirement: 25,
    unit: "runs",
  },
  {
    id: "fifty_club",
    name: "Fifty Club",
    description: "Complete 50 runs",
    icon: "🎖️",
    category: "activities",
    requirement: 50,
    unit: "runs",
  },
  {
    id: "century_club",
    name: "Century Club",
    description: "Complete 100 runs",
    icon: "🏆",
    category: "activities",
    requirement: 100,
    unit: "runs",
  },

  // Elevation Achievements
  {
    id: "hill_seeker",
    name: "Hill Seeker",
    description: "Gain 100m total elevation",
    icon: "⛰️",
    category: "elevation",
    requirement: 100,
    unit: "m",
  },
  {
    id: "mountain_climber",
    name: "Mountain Climber",
    description: "Gain 500m total elevation",
    icon: "🏔️",
    category: "elevation",
    requirement: 500,
    unit: "m",
  },
  {
    id: "peak_performer",
    name: "Peak Performer",
    description: "Gain 1000m total elevation",
    icon: "🗻",
    category: "elevation",
    requirement: 1000,
    unit: "m",
  },
  {
    id: "everest_climber",
    name: "Everest Climber",
    description: "Gain 8849m total elevation (Mount Everest height)",
    icon: "🏔️",
    category: "elevation",
    requirement: 8849,
    unit: "m",
  },
];

interface StravaStats {
  all_run_totals: {
    count: number;
    distance: number;
    elevation_gain: number;
  };
  ytd_run_totals: {
    count: number;
    distance: number;
    elevation_gain: number;
  };
}

/**
 * Calculate which achievements have been unlocked based on user stats
 */
export function calculateAchievements(stats: StravaStats): Achievement[] {
  const totalDistance = stats.all_run_totals.distance / 1000; // Convert to km
  const totalActivities = stats.all_run_totals.count;
  const totalElevation = stats.all_run_totals.elevation_gain;

  return ACHIEVEMENTS.map((achievement) => {
    let currentValue = 0;
    let unlocked = false;

    switch (achievement.category) {
      case "distance":
        currentValue = totalDistance;
        unlocked = totalDistance >= achievement.requirement;
        break;
      case "activities":
        currentValue = totalActivities;
        unlocked = totalActivities >= achievement.requirement;
        break;
      case "elevation":
        currentValue = totalElevation;
        unlocked = totalElevation >= achievement.requirement;
        break;
    }

    return {
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      requirement: achievement.requirement,
      unlocked,
      progress: Math.min((currentValue / achievement.requirement) * 100, 100),
      currentValue,
      unit: achievement.unit,
      category: achievement.category,
    };
  });
}

/**
 * Get the count of unlocked achievements
 */
export function getUnlockedCount(achievements: Achievement[]): number {
  return achievements.filter((a) => a.unlocked).length;
}

/**
 * Get achievements sorted by category and progress
 */
export function sortAchievements(achievements: Achievement[]): Achievement[] {
  return [...achievements].sort((a, b) => {
    // Unlocked achievements first
    if (a.unlocked !== b.unlocked) {
      return a.unlocked ? -1 : 1;
    }
    // Then by progress (highest first)
    if (a.progress !== b.progress) {
      return (b.progress || 0) - (a.progress || 0);
    }
    // Then by requirement (lowest first)
    return a.requirement - b.requirement;
  });
}
