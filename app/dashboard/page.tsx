"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StravaActivity } from "@/lib/strava";
import { Achievement } from "@/types";
import { calculateAchievements, getUnlockedCount, sortAchievements } from "@/lib/achievements";
import AchievementBadge from "@/components/AchievementBadge";
import DistanceChart from "@/components/DistanceChart";
import WeeklySummary from "@/components/WeeklySummary";
import PaceDistribution from "@/components/PaceDistribution";

interface StravaStats {
  athlete: {
    id: number;
    firstname: string;
    lastname: string;
  };
  stats: {
    all_run_totals: {
      count: number;
      distance: number;
      moving_time: number;
      elevation_gain: number;
    };
    ytd_run_totals: {
      count: number;
      distance: number;
      moving_time: number;
      elevation_gain: number;
    };
  };
}

interface Session {
  athlete: {
    id: number;
    firstname: string;
    lastname: string;
    profile_medium: string;
    profile: string;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [stats, setStats] = useState<StravaStats | null>(null);
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [recentActivities, setRecentActivities] = useState<StravaActivity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      
      if (!data.session) {
        router.push("/");
        return;
      }
      
      setSession(data.session);
      fetchData();
    } catch (err) {
      console.error("Session check failed:", err);
      router.push("/");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats and activities in parallel (get more activities for charts)
      const [statsRes, activitiesRes, recentActivitiesRes] = await Promise.all([
        fetch("/api/strava/stats"),
        fetch("/api/strava/activities?per_page=50"), // More activities for charts
        fetch("/api/strava/activities?per_page=10"), // Recent for list
      ]);

      if (!statsRes.ok || !activitiesRes.ok || !recentActivitiesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const statsData = await statsRes.json();
      const activitiesData = await activitiesRes.json();
      const recentActivitiesData = await recentActivitiesRes.json();

      setStats(statsData);
      setActivities(activitiesData);
      setRecentActivities(recentActivitiesData);
      
      // Calculate achievements based on stats
      const calculatedAchievements = calculateAchievements(statsData.stats);
      const sortedAchievements = sortAchievements(calculatedAchievements);
      setAchievements(sortedAchievements);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      setSyncMessage(null);

      // Sync activities
      const activitiesRes = await fetch("/api/db/activities", { method: "POST" });
      const activitiesData = await activitiesRes.json();

      // Sync achievements
      const achievementsRes = await fetch("/api/db/achievements", { method: "POST" });
      const achievementsData = await achievementsRes.json();

      setSyncMessage(
        `✅ Synced ${activitiesData.synced} activities. ${achievementsData.message}`
      );

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error("Sync error:", err);
      setSyncMessage("❌ Sync failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  if (loading && !session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">🏃‍♂️ Strava Tracker</h1>
            <div className="flex items-center gap-4">
              {syncMessage && (
                <div className="text-sm px-3 py-1 rounded-lg bg-gray-700 text-gray-300">
                  {syncMessage}
                </div>
              )}
              <button
                onClick={handleSync}
                disabled={syncing}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {syncing ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Syncing...
                  </>
                ) : (
                  <>
                    <span>🔄</span>
                    Sync Data
                  </>
                )}
              </button>
              <div className="flex items-center gap-3">
                {session.athlete.profile_medium && (
                  <img
                    src={session.athlete.profile_medium}
                    alt={`${session.athlete.firstname} ${session.athlete.lastname}`}
                    className="w-10 h-10 rounded-full border-2 border-orange-600"
                  />
                )}
                <span className="text-gray-300">
                  {session.athlete.firstname} {session.athlete.lastname}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Welcome back!</h2>
          <p className="text-gray-400">
            Here's an overview of your running journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-orange-600 text-sm font-semibold mb-1">
              TOTAL DISTANCE
            </div>
            <div className="text-3xl font-bold">
              {loading
                ? "..."
                : stats
                  ? `${(stats.stats.all_run_totals.distance / 1000).toFixed(1)} km`
                  : "-- km"}
            </div>
            <div className="text-gray-400 text-sm mt-1">All time</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-orange-600 text-sm font-semibold mb-1">
              ACTIVITIES
            </div>
            <div className="text-3xl font-bold">
              {loading
                ? "..."
                : stats
                  ? stats.stats.all_run_totals.count
                  : "--"}
            </div>
            <div className="text-gray-400 text-sm mt-1">Total runs</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-orange-600 text-sm font-semibold mb-1">
              ACHIEVEMENTS
            </div>
            <div className="text-3xl font-bold">
              {loading ? "..." : getUnlockedCount(achievements)}
            </div>
            <div className="text-gray-400 text-sm mt-1">Badges earned</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-orange-600 text-sm font-semibold mb-1">
              THIS YEAR
            </div>
            <div className="text-3xl font-bold">
              {loading
                ? "..."
                : stats
                  ? `${(stats.stats.ytd_run_totals.distance / 1000).toFixed(1)} km`
                  : "-- km"}
            </div>
            <div className="text-gray-400 text-sm mt-1">2025</div>
          </div>
        </div>

        {/* Data Visualization Section */}
        <div className="mb-8 space-y-6">
          <h3 className="text-2xl font-bold">Performance Analytics</h3>
          
          {/* Distance & Pace Over Time */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h4 className="text-xl font-semibold mb-4">Distance & Pace Trends</h4>
            {loading ? (
              <div className="text-gray-400 text-center py-20">
                <div className="text-3xl mb-2">📊</div>
                <p>Loading chart...</p>
              </div>
            ) : activities.length > 0 ? (
              <DistanceChart activities={activities} />
            ) : (
              <div className="text-gray-400 text-center py-20">
                <p>Not enough data for visualization</p>
              </div>
            )}
          </div>

          {/* Two Column Layout for Other Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Weekly Summary */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h4 className="text-xl font-semibold mb-4">Weekly Distance</h4>
              {loading ? (
                <div className="text-gray-400 text-center py-20">
                  <div className="text-3xl mb-2">📊</div>
                  <p>Loading...</p>
                </div>
              ) : activities.length > 0 ? (
                <WeeklySummary activities={activities} />
              ) : (
                <div className="text-gray-400 text-center py-20">
                  <p>No data available</p>
                </div>
              )}
            </div>

            {/* Pace Distribution */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h4 className="text-xl font-semibold mb-4">Pace Distribution</h4>
              {loading ? (
                <div className="text-gray-400 text-center py-20">
                  <div className="text-3xl mb-2">📊</div>
                  <p>Loading...</p>
                </div>
              ) : activities.length > 0 ? (
                <PaceDistribution activities={activities} />
              ) : (
                <div className="text-gray-400 text-center py-20">
                  <p>No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-2xl font-bold mb-4">Recent Activities</h3>
          {error && (
            <div className="text-red-400 text-center py-4">
              {error}
              <button
                onClick={fetchData}
                className="ml-4 text-orange-600 hover:text-orange-500 underline"
              >
                Retry
              </button>
            </div>
          )}
          {loading && (
            <div className="text-gray-400 text-center py-8">
              <div className="text-5xl mb-4">⏳</div>
              <p>Loading activities...</p>
            </div>
          )}
          {!loading && !error && recentActivities.length === 0 && (
            <div className="text-gray-400 text-center py-8">
              <div className="text-5xl mb-4">🏃</div>
              <p>No activities found</p>
              <p className="text-sm mt-2">
                Start running and they'll appear here!
              </p>
            </div>
          )}
          {!loading && !error && recentActivities.length > 0 && (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{activity.name}</h4>
                      <p className="text-gray-400 text-sm">
                        {new Date(activity.start_date_local).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-600 font-bold text-lg">
                        {(activity.distance / 1000).toFixed(2)} km
                      </div>
                      <div className="text-gray-400 text-sm">
                        {Math.floor(activity.moving_time / 60)}m{" "}
                        {activity.moving_time % 60}s
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-4 text-sm text-gray-400">
                    <span>
                      ⚡{" "}
                      {activity.distance > 0
                        ? (() => {
                            const paceSeconds =
                              activity.moving_time / (activity.distance / 1000);
                            const minutes = Math.floor(paceSeconds / 60);
                            const seconds = Math.floor(paceSeconds % 60);
                            return `${minutes}:${seconds.toString().padStart(2, "0")} /km`;
                          })()
                        : "N/A"}
                    </span>
                    <span>
                      📈 {activity.total_elevation_gain.toFixed(0)}m elevation
                    </span>
                    {activity.average_heartrate && (
                      <span>❤️ {Math.round(activity.average_heartrate)} bpm</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold">Achievements</h3>
              <p className="text-gray-400 text-sm mt-1">
                {getUnlockedCount(achievements)} of {achievements.length} unlocked
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600">
                {achievements.length > 0
                  ? ((getUnlockedCount(achievements) / achievements.length) * 100).toFixed(0)
                  : 0}%
              </div>
              <div className="text-gray-400 text-sm">Complete</div>
            </div>
          </div>
          
          {loading ? (
            <div className="text-gray-400 text-center py-8">
              <div className="text-5xl mb-4">⏳</div>
              <p>Loading achievements...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
