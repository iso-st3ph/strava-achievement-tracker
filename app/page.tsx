export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">
            🏃‍♂️ Strava Achievement Tracker
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Track your running journey with custom achievements and stats
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-strava-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Connect with Strava
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Learn More
            </button>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-gray-400">
              Visualize your running stats with beautiful charts and graphs
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Unlock Achievements</h3>
            <p className="text-gray-400">
              Earn custom badges based on your running milestones
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Set Goals</h3>
            <p className="text-gray-400">
              Create personal targets and monitor your improvement
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
