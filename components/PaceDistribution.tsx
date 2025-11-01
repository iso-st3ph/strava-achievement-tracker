"use client";

import { StravaActivity } from "@/lib/strava";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PaceDistributionProps {
  activities: StravaActivity[];
}

export default function PaceDistribution({ activities }: PaceDistributionProps) {
  // Calculate pace for each activity and group into buckets
  const paceData = activities
    .map((activity) => {
      if (activity.distance === 0) return null;
      const paceMinPerKm = activity.moving_time / 60 / (activity.distance / 1000);
      return {
        pace: parseFloat(paceMinPerKm.toFixed(1)),
        distance: activity.distance / 1000,
      };
    })
    .filter((item) => item !== null && item.pace > 0 && item.pace < 15) // Filter out unrealistic paces
    .sort((a, b) => a!.pace - b!.pace);

  // Create pace buckets
  const paceBuckets = paceData.reduce((acc: any, item) => {
    if (!item) return acc;
    const bucket = Math.floor(item.pace * 2) / 2; // 0.5 min/km buckets
    const bucketLabel = `${bucket.toFixed(1)}`;
    
    if (!acc[bucketLabel]) {
      acc[bucketLabel] = {
        pace: bucketLabel,
        count: 0,
        totalDistance: 0,
      };
    }
    
    acc[bucketLabel].count += 1;
    acc[bucketLabel].totalDistance += item.distance;
    
    return acc;
  }, {});

  const chartData = Object.values(paceBuckets).sort((a: any, b: any) => 
    parseFloat(a.pace) - parseFloat(b.pace)
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm mb-1">
            Pace: {payload[0].payload.pace} min/km
          </p>
          <p className="text-orange-400 font-semibold">
            {payload[0].value} runs
          </p>
          <p className="text-blue-400 text-sm">
            {payload[0].payload.totalDistance.toFixed(1)} km total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FB923C" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FB923C" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="pace"
            stroke="#9CA3AF"
            style={{ fontSize: "12px" }}
            label={{ value: "Pace (min/km)", position: "insideBottom", offset: -5, fill: "#9CA3AF" }}
          />
          <YAxis
            stroke="#9CA3AF"
            style={{ fontSize: "12px" }}
            label={{ value: "Number of Runs", angle: -90, position: "insideLeft", fill: "#9CA3AF" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#FB923C"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
