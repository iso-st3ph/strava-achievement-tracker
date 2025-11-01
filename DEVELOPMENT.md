# Strava Achievement Tracker - Development Guide

## Project Overview
This is a Next.js 14 application that integrates with Strava's API to track running achievements and visualize stats.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Strava OAuth
- **Charts**: Recharts
- **Database**: PostgreSQL (to be implemented)
- **Deployment**: Docker + AWS

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Strava API
1. Go to https://www.strava.com/settings/api
2. Create a new application
3. Copy your Client ID and Client Secret
4. Set Authorization Callback Domain to `localhost`

### 3. Environment Variables
Create a `.env.local` file:
```env
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=run: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
strava-achievement-tracker/
├── app/                  # Next.js 14 App Router
│   ├── api/             # API routes
│   │   └── auth/        # NextAuth.js routes
│   ├── dashboard/       # Dashboard pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── dashboard/      # Dashboard components
├── lib/                # Utility functions
│   ├── strava.ts       # Strava API client
│   └── utils.ts        # Helper functions
├── types/              # TypeScript definitions
└── public/             # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Docker Deployment

### Build Image
```bash
docker build -t strava-tracker .
```

### Run with Docker Compose
```bash
docker-compose up -d
```

This starts both the Next.js app and PostgreSQL database.

## Strava API Integration

### OAuth Flow
1. User clicks "Connect with Strava"
2. Redirects to Strava OAuth page
3. User authorizes the app
4. Strava redirects back with authorization code
5. Exchange code for access token
6. Store token in session/database

### Available Endpoints
- `/athlete` - Get athlete profile
- `/athlete/activities` - Get activities list
- `/activities/{id}` - Get activity details
- `/activities/{id}/streams` - Get activity streams (detailed data)

## Achievement System (Planned)

Achievements will be based on:
- Total distance milestones (100km, 500km, 1000km, etc.)
- Consecutive days of running
- Personal records (longest run, fastest pace, etc.)
- Monthly/yearly challenges
- Elevation gained

## Next Steps

1. ✅ Project setup
2. ✅ Basic landing page
3. [ ] Implement NextAuth.js with Strava OAuth
4. [ ] Create dashboard layout
5. [ ] Fetch and display activities
6. [ ] Build achievement tracking system
7. [ ] Add data visualization charts
8. [ ] Implement database for persistence
9. [ ] Deploy to AWS using Terraform

## Contributing

This is a portfolio project, but suggestions are welcome!

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Strava API Documentation](https://developers.strava.com/docs/reference/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
