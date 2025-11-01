# Strava Achievement Tracker 🏃‍♂️

Track your running journey with custom achievements, stats visualization, and progress tracking.

## 🎯 Features

- **Strava OAuth Integration** - Secure login with your Strava account
- **Activity Dashboard** - View your recent runs and workouts
- **Achievement System** - Unlock custom badges based on your progress
- **Stats Visualization** - Beautiful charts and graphs of your performance
- **Progress Tracking** - Set goals and monitor your improvement

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Strava OAuth
- **Database**: PostgreSQL (coming soon)
- **Deployment**: Docker + AWS (deployed via Terraform)
- **CI/CD**: GitHub Actions

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
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
strava-achievement-tracker/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utility functions
│   ├── strava.ts        # Strava API client
│   └── utils.ts         # Helper functions
├── types/               # TypeScript type definitions
├── public/              # Static assets
└── docker/              # Docker configuration
```

## 🎨 Screenshots

_Coming soon!_

## 🏗️ Development Roadmap

- [x] Project setup
- [ ] Strava OAuth authentication
- [ ] Activity data fetching
- [ ] Dashboard UI
- [ ] Achievement system
- [ ] Data visualization
- [ ] Database integration
- [ ] Deployment pipeline

## 📝 License

MIT

## 🔗 Related Projects

- [Homelab DevOps](https://github.com/iso-st3ph/homelab-devops) - Infrastructure and deployment automation
