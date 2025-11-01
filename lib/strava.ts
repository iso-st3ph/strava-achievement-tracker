/**
 * Strava API Client
 * Handles API requests to Strava with proper authentication
 */

const STRAVA_API_BASE = "https://www.strava.com/api/v3";

export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  elev_high?: number;
  elev_low?: number;
}

export interface StravaAthlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  state: string;
  country: string;
  sex: string;
  weight: number;
  profile_medium: string;
  profile: string;
}

export interface StravaStats {
  recent_run_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  all_run_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  ytd_run_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
}

/**
 * Fetch the authenticated athlete's profile
 */
export async function getAthlete(accessToken: string): Promise<StravaAthlete> {
  const response = await fetch(`${STRAVA_API_BASE}/athlete`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch athlete data");
  }

  return response.json();
}

/**
 * Fetch the authenticated athlete's statistics
 */
export async function getAthleteStats(
  accessToken: string,
  athleteId: number
): Promise<StravaStats> {
  const response = await fetch(
    `${STRAVA_API_BASE}/athletes/${athleteId}/stats`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch athlete stats");
  }

  return response.json();
}

/**
 * Fetch the authenticated athlete's activities
 */
export async function getActivities(
  accessToken: string,
  page: number = 1,
  perPage: number = 30
): Promise<StravaActivity[]> {
  const response = await fetch(
    `${STRAVA_API_BASE}/athlete/activities?page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }

  return response.json();
}

/**
 * Fetch a specific activity by ID
 */
export async function getActivity(
  accessToken: string,
  activityId: number
): Promise<StravaActivity> {
  const response = await fetch(
    `${STRAVA_API_BASE}/activities/${activityId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch activity");
  }

  return response.json();
}

/**
 * Helper to convert meters to kilometers
 */
export function metersToKm(meters: number): number {
  return meters / 1000;
}

/**
 * Helper to convert seconds to hours:minutes:seconds
 */
export function secondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Helper to calculate pace (min/km)
 */
export function calculatePace(distanceMeters: number, timeSeconds: number): string {
  const km = metersToKm(distanceMeters);
  const paceSeconds = timeSeconds / km;
  const minutes = Math.floor(paceSeconds / 60);
  const seconds = Math.floor(paceSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
