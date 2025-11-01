#!/bin/bash

# Strava Achievement Tracker - Deployment Script
# This script builds and deploys the application using Docker Compose

set -e

echo "🚀 Starting Strava Achievement Tracker Deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.production template..."
    cp .env.production .env
    echo "⚠️  Please edit .env with your production credentials before continuing."
    exit 1
fi

# Load environment variables
source .env

# Validate required environment variables
if [ -z "$STRAVA_CLIENT_ID" ] || [ "$STRAVA_CLIENT_ID" = "your_production_client_id" ]; then
    echo "❌ STRAVA_CLIENT_ID not set in .env"
    exit 1
fi

if [ -z "$STRAVA_CLIENT_SECRET" ] || [ "$STRAVA_CLIENT_SECRET" = "your_production_client_secret" ]; then
    echo "❌ STRAVA_CLIENT_SECRET not set in .env"
    exit 1
fi

echo "✅ Environment variables validated"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build the application
echo "🔨 Building Docker image..."
docker-compose build --no-cache

# Start the services
echo "🚀 Starting services..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec -T app npx prisma migrate deploy || docker-compose exec -T app npx prisma db push

echo ""
echo "✅ Deployment complete!"
echo "🌐 Application is running at: ${NEXTAUTH_URL:-http://localhost:3000}"
echo ""
echo "📊 View logs with: docker-compose logs -f"
echo "🛑 Stop with: docker-compose down"
echo ""
