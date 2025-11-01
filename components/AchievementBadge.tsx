import { Achievement } from "@/types";

interface AchievementBadgeProps {
  achievement: Achievement;
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const progress = achievement.progress || 0;
  const isUnlocked = achievement.unlocked;

  return (
    <div
      className={`relative p-4 rounded-lg border transition-all ${
        isUnlocked
          ? "bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-600/50 shadow-lg shadow-orange-900/20"
          : "bg-gray-800 border-gray-700 opacity-60"
      }`}
    >
      {/* Unlock Badge */}
      {isUnlocked && (
        <div className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          ✓ UNLOCKED
        </div>
      )}

      {/* Icon */}
      <div className="flex items-center justify-center mb-3">
        <div
          className={`text-5xl transition-transform ${
            isUnlocked ? "scale-110" : "grayscale"
          }`}
        >
          {achievement.icon}
        </div>
      </div>

      {/* Name and Description */}
      <div className="text-center mb-3">
        <h4 className={`font-bold text-lg mb-1 ${isUnlocked ? "text-orange-400" : "text-gray-400"}`}>
          {achievement.name}
        </h4>
        <p className="text-gray-400 text-sm">{achievement.description}</p>
      </div>

      {/* Progress Bar */}
      {!isUnlocked && (
        <div className="space-y-2">
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-600 to-orange-500 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {achievement.currentValue?.toFixed(0)} {achievement.unit}
            </span>
            <span>
              {achievement.requirement} {achievement.unit}
            </span>
          </div>
          <div className="text-center text-sm text-gray-500">
            {progress.toFixed(0)}% complete
          </div>
        </div>
      )}

      {/* Unlocked State */}
      {isUnlocked && (
        <div className="text-center">
          <div className="inline-block bg-orange-600/20 text-orange-400 text-sm font-semibold px-3 py-1 rounded-full border border-orange-600/30">
            🎉 Achievement Unlocked!
          </div>
        </div>
      )}
    </div>
  );
}
