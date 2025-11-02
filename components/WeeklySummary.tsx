"use client";

import { StravaActivity } from "@/lib/strava";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface WeeklySummaryProps {
  activities: StravaActivity[];
}

export default function WeeklySummary({ activities }: WeeklySummaryProps) {
  // Group activities by week
  interface WeekData {
    week: string;
    distance: number;
    activities: number;
    elevation: number;
    time: number;
  }

  const weeklyData = activities.reduce((acc: Record<string, WeekData>, activity) => {
    const date = new Date(activity.start_date_local);
    
    // Get the start of the week (Sunday)
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekKey = weekStart.toISOString().split('T')[0];
    const weekLabel = weekStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    
    if (!acc[weekKey]) {
      acc[weekKey] = {
        week: weekLabel,
        distance: 0,
        activities: 0,
        elevation: 0,
        time: 0,
      };
    }
    
    acc[weekKey].distance += activity.distance / 1000;
    acc[weekKey].activities += 1;
    acc[weekKey].elevation += activity.total_elevation_gain;
    acc[weekKey].time += activity.moving_time / 60; // Convert to minutes
    
    return acc;
  }, {});

  // Convert to array and sort by date
  interface ChartData extends WeekData {
    dateKey: string;
  }

  const chartData = Object.entries(weeklyData)
    .map(([key, value]: [string, WeekData]) => ({
      week: value.week,
      distance: parseFloat(value.distance.toFixed(1)),
      activities: value.activities,
      elevation: parseFloat(value.elevation.toFixed(0)),
      time: parseFloat(value.time.toFixed(0)),
      dateKey: key,
    }))
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .slice(-8); // Last 8 weeks

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartData; value: number }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm font-semibold mb-2">
            Week of {payload[0].payload.week}
          </p>
          <p className="text-orange-400">
            🏃 {payload[0].payload.activities} runs
          </p>
          <p className="text-blue-400">
            📏 {payload[0].value} km
          </p>
          <p className="text-green-400">
            📈 {payload[0].payload.elevation} m elevation
          </p>
          <p className="text-purple-400">
            ⏱️ {payload[0].payload.time} minutes
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="week"
            stroke="#9CA3AF"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#FB923C"
            style={{ fontSize: "12px" }}
            label={{ value: "Distance (km)", angle: -90, position: "insideLeft", fill: "#FB923C" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }}
          />
          <Bar
            dataKey="distance"
            fill="#FB923C"
            radius={[8, 8, 0, 0]}
            name="Weekly Distance (km)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
