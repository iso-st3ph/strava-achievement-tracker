import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Strava Achievement Tracker",
  description: "Track your running journey with custom achievements",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
