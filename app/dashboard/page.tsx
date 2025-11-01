"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
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
              <div className="flex items-center gap-3">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-10 h-10 rounded-full border-2 border-orange-600"
                  />
                )}
                <span className="text-gray-300">{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
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
            <div className="text-3xl font-bold">-- km</div>
            <div className="text-gray-400 text-sm mt-1">All time</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-orange-600 text-sm font-semibold mb-1">
              ACTIVITIES
            </div>
            <div className="text-3xl font-bold">--</div>
            <div className="text-gray-400 text-sm mt-1">Total runs</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-orange-600 text-sm font-semibold mb-1">
              ACHIEVEMENTS
            </div>
            <div className="text-3xl font-bold">0</div>
            <div className="text-gray-400 text-sm mt-1">Badges earned</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-orange-600 text-sm font-semibold mb-1">
              THIS MONTH
            </div>
            <div className="text-3xl font-bold">-- km</div>
            <div className="text-gray-400 text-sm mt-1">November 2025</div>
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-2xl font-bold mb-4">Recent Activities</h3>
          <div className="text-gray-400 text-center py-8">
            <div className="text-5xl mb-4">🏃</div>
            <p>No activities loaded yet</p>
            <p className="text-sm mt-2">
              We'll fetch your Strava activities in the next step
            </p>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-2xl font-bold mb-4">Achievements</h3>
          <div className="text-gray-400 text-center py-8">
            <div className="text-5xl mb-4">🏆</div>
            <p>Achievement system coming soon</p>
            <p className="text-sm mt-2">
              Track your milestones and unlock badges
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
