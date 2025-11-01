import { cookies } from "next/headers";

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  athlete: {
    id: number;
    firstname: string;
    lastname: string;
    profile_medium: string;
    profile: string;
  };
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("strava_session");

  if (!sessionCookie) {
    return null;
  }

  try {
    const session: Session = JSON.parse(sessionCookie.value);

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (session.expiresAt && session.expiresAt < now) {
      // Token expired, try to refresh
      return await refreshSession(session);
    }

    return session;
  } catch (error) {
    console.error("Error parsing session:", error);
    return null;
  }
}

async function refreshSession(session: Session): Promise<Session | null> {
  try {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.STRAVA_CLIENT_ID!,
        client_secret: process.env.STRAVA_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: session.refreshToken,
      }),
    });

    const tokens = await response.json();

    if (!response.ok) {
      console.error("Token refresh failed:", tokens);
      return null;
    }

    const newSession: Session = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expires_at,
      athlete: session.athlete,
    };

    // Update cookie
    const cookieStore = await cookies();
    cookieStore.set("strava_session", JSON.stringify(newSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return newSession;
  } catch (error) {
    console.error("Error refreshing session:", error);
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("strava_session");
}
