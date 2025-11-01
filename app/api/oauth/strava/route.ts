import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/oauth/callback`;
  const scope = "read,activity:read_all,profile:read_all";

  const authUrl = new URL("https://www.strava.com/oauth/authorize");
  authUrl.searchParams.append("client_id", clientId!);
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", scope);
  authUrl.searchParams.append("approval_prompt", "auto");

  return NextResponse.redirect(authUrl.toString());
}
