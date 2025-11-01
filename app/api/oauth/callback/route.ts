import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/?error=oauth_failed`
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.STRAVA_CLIENT_ID!,
        client_secret: process.env.STRAVA_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokens);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/?error=token_exchange_failed`
      );
    }

    // Store tokens in HTTP-only cookie
    const sessionData = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expires_at,
      athlete: tokens.athlete,
    };

    const cookieStore = await cookies();
    cookieStore.set("strava_session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Redirect to dashboard
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/?error=server_error`
    );
  }
}
