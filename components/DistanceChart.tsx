"use client";

import { StravaActivity } from "@/lib/strava";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DistanceChartProps {
  activities: StravaActivity[];
}

export default function DistanceChart({ activities }: DistanceChartProps) {
  // Prepare data for the chart - aggregate by date
  const chartData = activities
    .slice()
    .reverse() // Show oldest to newest
    .map((activity) => {
      const date = new Date(activity.start_date_local);
      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        distance: parseFloat((activity.distance / 1000).toFixed(2)),
        pace: activity.distance > 0
          ? parseFloat((activity.moving_time / 60 / (activity.distance / 1000)).toFixed(2))
          : 0,
        elevation: parseFloat(activity.total_elevation_gain.toFixed(0)),
        fullDate: activity.start_date_local,
      };
    });

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm mb-2">
            {new Date(payload[0].payload.fullDate).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="text-orange-400 font-semibold">
            Distance: {payload[0].value} km
          </p>
          {payload[1] && (
            <p className="text-blue-400">
              Pace: {payload[1].value} min/km
            </p>
          )}
          {payload[2] && (
            <p className="text-green-400">
              Elevation: {payload[2].value} m
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            yAxisId="left"
            stroke="#FB923C"
            style={{ fontSize: "12px" }}
            label={{ value: "Distance (km)", angle: -90, position: "insideLeft", fill: "#FB923C" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#60A5FA"
            style={{ fontSize: "12px" }}
            label={{ value: "Pace (min/km)", angle: 90, position: "insideRight", fill: "#60A5FA" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }}
            iconType="line"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="distance"
            stroke="#FB923C"
            strokeWidth={2}
            dot={{ fill: "#FB923C", r: 4 }}
            activeDot={{ r: 6 }}
            name="Distance (km)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="pace"
            stroke="#60A5FA"
            strokeWidth={2}
            dot={{ fill: "#60A5FA", r: 4 }}
            activeDot={{ r: 6 }}
            name="Pace (min/km)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
