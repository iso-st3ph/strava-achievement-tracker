# Strava Achievement Tracker 🏃‍♂️

A modern web application that tracks your running journey with custom achievements, real-time stats, and progress tracking. Built as a DevOps portfolio project showcasing full-stack development and deployment practices.

## 🎯 Features

- **Custom OAuth2 Authentication** - Secure login with Strava using HTTP-only cookies and automatic token refresh
- **Real-Time Activity Dashboard** - View your recent runs with distance, pace, elevation, and heart rate data
- **Achievement System** - 18 custom badges across 3 categories (Distance, Activities, Elevation) with progress tracking
- **Athlete Statistics** - All-time and year-to-date totals for distance, activity count, and elevation gain
- **Session Management** - Persistent sessions with automatic token refresh handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Authentication**: Custom OAuth2 implementation (no third-party auth libraries)
- **Session Management**: HTTP-only cookies with server-side validation
- **API Integration**: Strava API v3 with automatic token refresh
- **Deployment**: Docker + Docker Compose (PostgreSQL ready)
- **CI/CD**: GitHub Actions (planned)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Strava API credentials ([Get them here](https://www.strava.com/settings/api))

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/iso-st3ph/strava-achievement-tracker.git
   cd strava-achievement-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Strava API credentials:

   ```env
   STRAVA_CLIENT_ID=your_client_id
   STRAVA_CLIENT_SECRET=your_client_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser and authenticate with Strava

## 📁 Project Structure

```
strava-achievement-tracker/
├── app/                          # Next.js 14 app directory
│   ├── api/
│   │   ├── oauth/               # OAuth flow (initiate, callback)
│   │   ├── session/             # Session management endpoint
│   │   ├── strava/              # Strava API proxy routes
│   │   └── logout/              # Sign out endpoint
│   ├── dashboard/               # Protected dashboard page
│   └── page.tsx                 # Landing/login page
├── components/
│   └── AchievementBadge.tsx     # Achievement badge UI component
├── lib/
│   ├── achievements.ts          # Achievement definitions and logic
│   ├── session.ts               # Session management utilities
│   ├── strava.ts                # Strava API client
│   └── utils.ts                 # Helper functions
├── types/
│   └── index.ts                 # TypeScript type definitions
├── docker-compose.yml           # Docker Compose configuration
└── Dockerfile                   # Application containerization
```

## 🔑 Key Implementation Details

### Custom OAuth2 Flow
- No third-party authentication libraries - built from scratch
- Secure token storage using HTTP-only cookies
- Automatic token refresh handling
- PKCE-ready architecture

### Session Management
- Server-side session validation
- Automatic refresh on expiration
- Secure cookie configuration
- Stateless architecture (no session storage)

### Achievement System
- Dynamic calculation based on real-time Strava data
- Progress tracking for locked achievements
- Sortable by status and progress
- Extensible badge system

## � Achievement Categories

The app tracks 18 unique achievements across three categories:

### 🏃 Distance Achievements (7 badges)
- First Step (1 km) → Distance Legend (1000 km)

### 💪 Activity Achievements (5 badges)
- First Run (1 activity) → Century Club (100 activities)

### ⛰️ Elevation Achievements (4 badges)
- Hill Seeker (100m) → Everest Climber (8849m)

Each locked achievement displays a progress bar showing how close you are to unlocking it!

## �🏗️ Development Roadmap

- [x] Project setup with Next.js 14 + TypeScript
- [x] Custom OAuth2 authentication flow
- [x] Session management with HTTP-only cookies
- [x] Strava API integration with token refresh
- [x] Activity data fetching and display
- [x] Dashboard UI with athlete stats
- [x] Achievement system (18 badges)
- [ ] Data visualization with charts
- [ ] PostgreSQL database integration
- [ ] Docker deployment
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Infrastructure as Code (Terraform)

## 📝 License

MIT

## 🔗 Related Projects

- [Homelab DevOps](https://github.com/iso-st3ph/homelab-devops) - Infrastructure and deployment automation
