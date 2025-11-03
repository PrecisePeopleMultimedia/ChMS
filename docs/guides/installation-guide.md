# ChMS Installation Guide

Complete installation instructions for ChMS (Church Management System) across development, staging, and production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Installation](#development-installation)
3. [Staging Installation](#staging-installation)
4. [Production Installation](#production-installation)
5. [Post-Installation Configuration](#post-installation-configuration)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

#### Minimum Requirements (Development)
- **Operating System**: macOS, Linux, or Windows 10+
- **Node.js**: 18.x or higher
- **PHP**: 8.2 or higher
- **Composer**: 2.x
- **Database**: PostgreSQL 16+ or SQLite (development only)
- **Git**: Latest version

#### Recommended Requirements (Production)
- **Operating System**: Ubuntu 22.04 LTS or similar Linux distribution
- **Node.js**: 20.x LTS
- **PHP**: 8.3 with OPcache enabled
- **PostgreSQL**: 16.x
- **Redis**: 7.x (for caching and sessions)
- **Web Server**: Apache 2.4+ or Nginx 1.24+
- **SSL Certificate**: Let's Encrypt or commercial certificate

### Software Installation

#### Install Node.js
```bash
# macOS (using Homebrew)
brew install node@20

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

#### Install PHP and Composer
```bash
# macOS (using Homebrew)
brew install php@8.3
brew install composer

# Ubuntu/Debian
sudo apt update
sudo apt install php8.3 php8.3-cli php8.3-common php8.3-mbstring \
  php8.3-xml php8.3-curl php8.3-zip php8.3-pgsql php8.3-opcache

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Verify installation
php --version  # Should show PHP 8.3.x
composer --version
```

#### Install PostgreSQL
```bash
# macOS (using Homebrew)
brew install postgresql@16

# Ubuntu/Debian
sudo apt install postgresql-16 postgresql-contrib-16

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

#### Install Docker (Optional, for containerised deployment)
```bash
# Follow Docker installation guide for your OS:
# https://docs.docker.com/get-docker/

# Verify installation
docker --version
docker compose version
```

---

## Development Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/PrecisePeopleMultimedia/ChMS.git
cd ChMS
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### Configure Environment Variables

Edit `backend/.env`:

```env
APP_NAME=ChMS
APP_ENV=local
APP_DEBUG=true
APP_URL=http://backend.test

# Database Configuration (SQLite for development)
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# Or use PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=chms_dev
DB_USERNAME=postgres
DB_PASSWORD=your_password

# Cache & Sessions
CACHE_STORE=array
SESSION_DRIVER=array
QUEUE_CONNECTION=sync
```

#### Create SQLite Database (if using SQLite)

```bash
touch database/database.sqlite
```

#### Run Migrations

```bash
php artisan migrate

# Seed with test data (optional)
php artisan db:seed
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install Node dependencies
npm install

# Copy environment file
cp .env.example .env
```

#### Configure Frontend Environment

Edit `frontend/.env`:

```env
VITE_API_URL=http://backend.test/api
VITE_APP_URL=http://localhost:1811
```

### Step 4: Start Development Servers

#### Option A: Using Laravel Herd (macOS, Recommended)

```bash
# Install Laravel Herd
# Download from: https://herd.laravel.com

# Link backend project
cd backend
herd link backend

# Backend will be available at: http://backend.test

# Start frontend
cd ../frontend
npm run dev

# Frontend will be available at: http://localhost:1811
```

#### Option B: Using PHP Built-in Server

```bash
# Backend (in backend directory)
php artisan serve --host=127.0.0.1 --port=8000

# Frontend (in frontend directory)
npm run dev

# Access:
# Backend: http://localhost:8000
# Frontend: http://localhost:1811
```

#### Option C: Using Docker Compose

```bash
# From project root
docker compose up -d

# Backend: http://localhost:8000
# Frontend: http://localhost:1811
```

### Step 5: Verify Installation

1. **Check Backend Health**:
   ```bash
   curl http://backend.test/api/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

2. **Check Frontend**:
   - Open http://localhost:1811 in your browser
   - You should see the login page

3. **Create Test User**:
   ```bash
   cd backend
   php artisan tinker
   ```
   ```php
   User::create([
       'name' => 'Admin User',
       'email' => 'admin@example.com',
       'password' => Hash::make('password'),
       'role' => 'admin'
   ]);
   ```

---

## Staging Installation

### Step 1: Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install nginx postgresql-16 redis-server \
  php8.3-fpm php8.3-cli php8.3-pgsql php8.3-mbstring \
  php8.3-xml php8.3-curl php8.3-zip php8.3-opcache \
  git nodejs npm
```

### Step 2: Database Setup

```bash
# Create PostgreSQL database and user
sudo -u postgres psql

CREATE DATABASE chms_staging;
CREATE USER chms_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE chms_staging TO chms_user;
\q
```

### Step 3: Clone and Configure

```bash
# Clone repository
git clone https://github.com/PrecisePeopleMultimedia/ChMS.git
cd ChMS

# Checkout staging branch
git checkout staging

# Backend configuration
cd backend
composer install --optimize-autoloader --no-dev
cp .env.example .env
php artisan key:generate
```

#### Configure Staging Environment

Edit `backend/.env`:

```env
APP_ENV=staging
APP_DEBUG=false
APP_URL=https://staging.your-domain.com

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=chms_staging
DB_USERNAME=chms_user
DB_PASSWORD=secure_password

CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.your-mail-provider.com
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
```

#### Run Migrations

```bash
php artisan migrate --force
php artisan db:seed --class=StagingSeeder  # If available
```

### Step 4: Frontend Build

```bash
cd ../frontend
npm ci
npm run build

# Frontend build will be in dist/ directory
```

### Step 5: Web Server Configuration

#### Nginx Configuration

Create `/etc/nginx/sites-available/chms-staging`:

```nginx
server {
    listen 80;
    server_name staging.your-domain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name staging.your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/staging.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging.your-domain.com/privkey.pem;
    
    # Frontend
    root /var/www/chms-staging/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        alias /var/www/chms-staging/backend/public;
        try_files $uri $uri/ /index.php?$query_string;
        
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $request_filename;
        include fastcgi_params;
    }
    
    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/chms-staging /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/chms-staging
sudo chmod -R 755 /var/www/chms-staging
sudo chmod -R 775 /var/www/chms-staging/backend/storage
sudo chmod -R 775 /var/www/chms-staging/backend/bootstrap/cache
```

### Step 7: Setup SSL Certificate

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d staging.your-domain.com
```

---

## Production Installation

### Step 1: Infrastructure Setup

Production deployment requires:
- **VPS or Cloud Server**: Minimum 2 CPU cores, 4GB RAM
- **Domain Name**: Configured with DNS
- **SSL Certificate**: Let's Encrypt (free) or commercial
- **Backup Storage**: Automated daily backups

### Step 2: Server Hardening

```bash
# Configure firewall
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (for Let's Encrypt)
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Disable root login
sudo passwd -l root
```

### Step 3: Database Setup

```bash
# Create production database
sudo -u postgres psql

CREATE DATABASE chms_production;
CREATE USER chms_prod_user WITH ENCRYPTED PASSWORD 'very_secure_password';
GRANT ALL PRIVILEGES ON DATABASE chms_production TO chms_prod_user;
\q
```

### Step 4: Application Deployment

#### Using Git (Recommended)

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/PrecisePeopleMultimedia/ChMS.git chms-production
cd chms-production
sudo git checkout main

# Backend setup
cd backend
sudo composer install --optimize-autoloader --no-dev
sudo cp .env.example .env
sudo php artisan key:generate --force
```

#### Configure Production Environment

Edit `backend/.env`:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=chms_production
DB_USERNAME=chms_prod_user
DB_PASSWORD=very_secure_password

CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=redis_secure_password

# Production optimizations
OPCACHE_ENABLED=true
OPCACHE_MEMORY_SIZE=256
```

#### Optimise Laravel for Production

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
php artisan migrate --force
```

#### Build Frontend

```bash
cd ../frontend
npm ci
npm run build -- --mode production
```

### Step 5: Production Web Server Configuration

See [Production Deployment Tutorial](../tutorials/production-deployment-tutorial.md) for detailed Nginx/Apache configuration.

### Step 6: Queue Worker Setup

```bash
# Install Supervisor
sudo apt install supervisor

# Create supervisor config: /etc/supervisor/conf.d/chms-worker.conf
sudo nano /etc/supervisor/conf.d/chms-worker.conf
```

```ini
[program:chms-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/chms-production/backend/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/chms-production/backend/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start chms-worker:*
```

### Step 7: Scheduled Tasks (Cron)

```bash
# Edit crontab
sudo crontab -e -u www-data

# Add Laravel scheduler
* * * * * cd /var/www/chms-production/backend && php artisan schedule:run >> /dev/null 2>&1
```

### Step 8: Automated Backups

See [Maintenance Procedures](./maintenance-procedures.md#automated-backups) for backup setup.

---

## Post-Installation Configuration

### 1. Initial Admin User

```bash
cd backend
php artisan tinker
```

```php
$org = App\Models\Organization::create([
    'name' => 'Your Church Name',
    'slug' => 'your-church-slug',
]);

$user = App\Models\User::create([
    'name' => 'Admin User',
    'email' => 'admin@yourchurch.com',
    'password' => Hash::make('secure_password'),
    'organization_id' => $org->id,
    'role' => 'admin',
]);
```

### 2. Organization Setup

1. Log in as admin
2. Navigate to Organization Settings
3. Complete organization profile
4. Configure email settings
5. Set up service schedules
6. Configure member fields

### 3. Email Configuration

Verify email sending works:

```bash
cd backend
php artisan tinker
```

```php
Mail::raw('Test email', function ($message) {
    $message->to('admin@yourchurch.com')
            ->subject('ChMS Test Email');
});
```

### 4. Performance Optimisation

```bash
# Enable OPcache
sudo nano /etc/php/8.3/fpm/php.ini
```

```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=10000
opcache.revalidate_freq=2
opcache.fast_shutdown=1
```

```bash
sudo systemctl restart php8.3-fpm
```

---

## Verification

### Health Check

```bash
# API Health
curl https://your-domain.com/api/health

# Expected response:
# {"status":"ok","timestamp":"...","version":"1.0.0"}
```

### Functional Tests

1. **Authentication**: Log in with admin credentials
2. **Database**: Verify data persists across requests
3. **File Uploads**: Test member photo uploads
4. **Email**: Send test email
5. **API**: Test API endpoints with Postman/curl

### Performance Checks

```bash
# Response times
curl -o /dev/null -s -w "Time: %{time_total}s\n" https://your-domain.com/api/health

# Database connections
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity WHERE datname='chms_production';"
```

---

## Troubleshooting

### Common Issues

#### Backend Not Responding

```bash
# Check PHP-FPM status
sudo systemctl status php8.3-fpm

# Check Laravel logs
tail -f backend/storage/logs/laravel.log

# Restart services
sudo systemctl restart php8.3-fpm
sudo systemctl restart nginx
```

#### Database Connection Errors

```bash
# Test PostgreSQL connection
sudo -u postgres psql -d chms_production

# Check .env database credentials
cat backend/.env | grep DB_

# Verify PostgreSQL is running
sudo systemctl status postgresql
```

#### Frontend Build Errors

```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf .quasar dist
npm run build
```

#### Permission Issues

```bash
# Fix storage permissions
sudo chown -R www-data:www-data backend/storage backend/bootstrap/cache
sudo chmod -R 775 backend/storage backend/bootstrap/cache
```

### Getting Help

- Check [Troubleshooting Guide](../operations/troubleshooting.md)
- Review Laravel logs: `backend/storage/logs/laravel.log`
- Check web server error logs: `/var/log/nginx/error.log`
- Review system logs: `journalctl -u php8.3-fpm -f`

---

## Next Steps

After installation:

1. **Security**: Review [Security Hardening Guide](../deployment/apache-security-hardening.md)
2. **Monitoring**: Set up [Monitoring](../operations/monitoring-setup.md)
3. **Backups**: Configure [Automated Backups](./maintenance-procedures.md#automated-backups)
4. **Documentation**: Read [User Manual](./user-manual.md) and [Admin Guide](./admin-guide.md)

---

**Last Updated**: {{ date }}
**Version**: 1.0.0

