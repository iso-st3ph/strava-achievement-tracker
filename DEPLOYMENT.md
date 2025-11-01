# Deployment Guide

This guide covers deploying the Strava Achievement Tracker in various environments.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Strava API credentials ([Get them here](https://www.strava.com/settings/api))
- Domain name (for production) with SSL certificate

## 🚀 Quick Deployment

### Local Development with Docker

```bash
# 1. Clone the repository
git clone https://github.com/iso-st3ph/strava-achievement-tracker.git
cd strava-achievement-tracker

# 2. Create environment file
cp .env.production .env

# 3. Edit .env with your credentials
nano .env

# 4. Deploy
./deploy.sh
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `STRAVA_CLIENT_ID` | Strava OAuth client ID | `123456` |
| `STRAVA_CLIENT_SECRET` | Strava OAuth client secret | `abc123...` |
| `NEXTAUTH_URL` | Application URL | `https://yourdomain.com` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |

### Strava OAuth Callback

Update your Strava OAuth settings:

1. Go to https://www.strava.com/settings/api
2. Set **Authorization Callback Domain** to your domain
3. Add callback URL: `https://yourdomain.com/api/oauth/callback`

## 🐳 Docker Deployment Options

### Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Standalone Docker

```bash
# Build image
docker build -t strava-tracker:latest .

# Run PostgreSQL
docker run -d \
  --name strava-postgres \
  -e POSTGRES_USER=strava \
  -e POSTGRES_PASSWORD=strava \
  -e POSTGRES_DB=strava_tracker \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

# Run application
docker run -d \
  --name strava-app \
  --link strava-postgres:postgres \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://strava:strava@postgres:5432/strava_tracker \
  -e STRAVA_CLIENT_ID=your_client_id \
  -e STRAVA_CLIENT_SECRET=your_secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  strava-tracker:latest
```

## ☁️ Cloud Deployment

### AWS EC2

1. **Launch EC2 instance** (t3.small or larger)
2. **Install Docker:**
   ```bash
   sudo yum update -y
   sudo yum install -y docker
   sudo service docker start
   sudo usermod -a -G docker ec2-user
   ```

3. **Install Docker Compose:**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Clone and deploy:**
   ```bash
   git clone https://github.com/iso-st3ph/strava-achievement-tracker.git
   cd strava-achievement-tracker
   cp .env.production .env
   # Edit .env with your credentials
   ./deploy.sh
   ```

5. **Configure security group:**
   - Allow inbound traffic on port 3000
   - Or set up nginx reverse proxy on port 80/443

### DigitalOcean Droplet

1. **Create Droplet** (Docker on Ubuntu)
2. **SSH into droplet:**
   ```bash
   ssh root@your-droplet-ip
   ```

3. **Deploy:**
   ```bash
   git clone https://github.com/iso-st3ph/strava-achievement-tracker.git
   cd strava-achievement-tracker
   cp .env.production .env
   nano .env  # Add your credentials
   ./deploy.sh
   ```

4. **Set up nginx reverse proxy:**
   ```bash
   sudo apt install nginx certbot python3-certbot-nginx
   ```

   Create `/etc/nginx/sites-available/strava`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable and get SSL:
   ```bash
   sudo ln -s /etc/nginx/sites-available/strava /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## 🔄 Database Migrations

### Run migrations in Docker

```bash
# Using docker-compose
docker-compose exec app npx prisma migrate deploy

# Or manually
docker-compose exec app npx prisma db push
```

### Backup database

```bash
# Create backup
docker-compose exec postgres pg_dump -U strava strava_tracker > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U strava strava_tracker < backup.sql
```

## 📊 Monitoring

### View application logs

```bash
docker-compose logs -f app
```

### View database logs

```bash
docker-compose logs -f postgres
```

### Check container health

```bash
docker-compose ps
```

## 🔒 Security Best Practices

1. **Use environment variables** - Never commit secrets to git
2. **Enable HTTPS** - Always use SSL in production
3. **Regular updates** - Keep dependencies up to date
4. **Database backups** - Schedule regular backups
5. **Firewall rules** - Only expose necessary ports
6. **Strong passwords** - Use strong database passwords in production

## 🐛 Troubleshooting

### Application won't start

```bash
# Check logs
docker-compose logs app

# Verify environment variables
docker-compose exec app env | grep STRAVA

# Rebuild image
docker-compose up -d --build
```

### Database connection issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres psql -U strava -d strava_tracker

# Check DATABASE_URL format
echo $DATABASE_URL
```

### Port already in use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# Or use different port
# Edit docker-compose.yml: "3001:3000"
```

## 📝 Maintenance

### Update application

```bash
git pull origin main
docker-compose up -d --build
```

### Clean up Docker

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes (⚠️  this deletes data)
docker volume prune
```

## 🎯 Performance Optimization

1. **Enable caching** - Use Redis for session storage
2. **CDN** - Serve static assets via CDN
3. **Database indexing** - Ensure proper indexes exist
4. **Connection pooling** - Configure Prisma connection pool

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review application logs
