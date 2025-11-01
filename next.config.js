/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dgalywyr863hv.cloudfront.net',
        pathname: '/pictures/athletes/**',
      },
    ],
  },
  env: {
    STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID,
  },
};

module.exports = nextConfig;
