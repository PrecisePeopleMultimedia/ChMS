# Environment Configuration

## Overview
This document outlines the environment configuration for the ChurchAfrica backend, including development, staging, and production environments.

## Environment Types

### Development Environment
- **Purpose**: Local development and testing
- **Database**: SQLite (local) or PostgreSQL (Supabase)
- **URL**: `http://backend.test` (Laravel Herd)
- **Features**: Debug mode, detailed logging, hot reloading

### Staging Environment
- **Purpose**: Pre-production testing and validation
- **Database**: Supabase PostgreSQL (staging)
- **URL**: `https://staging-api.churchafrica.com`
- **Features**: Production-like configuration, limited debugging

### Production Environment
- **Purpose**: Live production system
- **Database**: Supabase PostgreSQL (production)
- **URL**: `https://api.churchafrica.com`
- **Features**: Optimized performance, security hardening, monitoring

## Environment Variables

### Required Variables
```env
# Application
APP_NAME=ChurchAfrica
APP_ENV=local|staging|production
APP_KEY=base64:your-app-key-here
APP_DEBUG=true|false
APP_URL=http://backend.test|https://staging-api.churchafrica.com|https://api.churchafrica.com

# Database
DB_CONNECTION=pgsql
DB_HOST=db.qqaddmalbzzxxtryekaq.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-db-password
DB_SSLMODE=require

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false

# Cache
CACHE_STORE=database
CACHE_PREFIX=churchafrica

# Queue
QUEUE_CONNECTION=database

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@churchafrica.com
MAIL_FROM_NAME="ChurchAfrica"

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://backend.test/api/auth/google/callback

# Supabase
SUPABASE_URL=https://qqaddmalbzzxxtryekaq.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=debug|info|warning|error
```

### Optional Variables
```env
# AWS (for file storage)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=churchafrica-storage

# Redis (for caching)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Pusher (for real-time features)
PUSHER_APP_ID=your-pusher-app-id
PUSHER_APP_KEY=your-pusher-app-key
PUSHER_APP_SECRET=your-pusher-app-secret
PUSHER_APP_CLUSTER=mt1
```

## Environment Setup

### Development Setup
1. **Clone repository**: `git clone https://github.com/your-org/churchafrica.git`
2. **Install dependencies**: `composer install`
3. **Copy environment file**: `cp .env.example .env`
4. **Generate application key**: `php artisan key:generate`
5. **Run migrations**: `php artisan migrate`
6. **Seed database**: `php artisan db:seed`
7. **Start development server**: `php artisan serve` or use Laravel Herd

### Staging Setup
1. **Deploy to staging server**: Via CI/CD pipeline
2. **Configure environment variables**: Set staging-specific values
3. **Run migrations**: `php artisan migrate --force`
4. **Cache configuration**: `php artisan config:cache`
5. **Test functionality**: Verify all features work

### Production Setup
1. **Deploy to production server**: Via CI/CD pipeline
2. **Configure environment variables**: Set production values
3. **Run migrations**: `php artisan migrate --force`
4. **Cache configuration**: `php artisan config:cache`
5. **Optimize performance**: `php artisan optimize`
6. **Monitor system**: Set up monitoring and alerts

## Docker Configuration

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: churchafrica-backend
    restart: unless-stopped
    working_dir: /var/www
    volumes:
      - ./:/var/www
      - ./docker/php/local.ini:/usr/local/etc/php/conf.d/local.ini
    networks:
      - churchafrica
    environment:
      - APP_ENV=local
      - APP_DEBUG=true
      - DB_CONNECTION=pgsql
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_DATABASE=churchafrica
      - DB_USERNAME=postgres
      - DB_PASSWORD=postgres

  postgres:
    image: postgres:15
    container_name: churchafrica-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=churchafrica
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - churchafrica

  redis:
    image: redis:7-alpine
    container_name: churchafrica-redis
    restart: unless-stopped
    networks:
      - churchafrica

volumes:
  postgres_data:

networks:
  churchafrica:
    driver: bridge
```

### Dockerfile
```dockerfile
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    postgresql-client

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory contents
COPY . /var/www

# Copy existing application directory permissions
COPY --chown=www-data:www-data . /var/www

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Change current user to www
USER www-data

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
```

## Security Configuration

### Environment Security
- **Secret Management**: Use environment variables for sensitive data
- **Key Rotation**: Rotate API keys and secrets regularly
- **Access Control**: Limit access to production environment
- **Audit Logging**: Log all environment changes

### Database Security
- **SSL/TLS**: Use encrypted connections
- **Access Control**: Limit database access
- **Backup Encryption**: Encrypt database backups
- **Connection Pooling**: Use connection pooling for performance

### API Security
- **Rate Limiting**: Implement rate limiting
- **CORS Configuration**: Configure CORS properly
- **Authentication**: Use secure authentication methods
- **Input Validation**: Validate all input data

## Monitoring and Logging

### Logging Configuration
```php
// config/logging.php
'channels' => [
    'single' => [
        'driver' => 'single',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'debug'),
    ],
    
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'debug'),
        'days' => 14,
    ],
    
    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'Laravel Log',
        'emoji' => ':boom:',
        'level' => env('LOG_LEVEL', 'critical'),
    ],
],
```

### Monitoring Setup
- **Application Monitoring**: Use Sentry for error tracking
- **Performance Monitoring**: Monitor response times and throughput
- **Database Monitoring**: Monitor database performance
- **Server Monitoring**: Monitor server resources

## Troubleshooting

### Common Issues
- **Database Connection**: Check database credentials and connectivity
- **Environment Variables**: Verify all required variables are set
- **File Permissions**: Check file and directory permissions
- **Cache Issues**: Clear cache and restart services

### Debugging
- **Log Files**: Check Laravel log files for errors
- **Environment Check**: Use `php artisan env` to check environment
- **Configuration Check**: Use `php artisan config:show` to check configuration
- **Database Check**: Use `php artisan migrate:status` to check migrations

### Performance Issues
- **Cache Configuration**: Optimize cache settings
- **Database Optimization**: Optimize database queries
- **File System**: Check disk space and performance
- **Network**: Check network connectivity and latency

## Best Practices

### Development
- **Environment Isolation**: Use separate environments for development
- **Version Control**: Never commit sensitive data to version control
- **Testing**: Test in staging before production
- **Documentation**: Keep environment documentation updated

### Production
- **Security**: Implement security best practices
- **Monitoring**: Set up comprehensive monitoring
- **Backup**: Implement regular backup procedures
- **Updates**: Keep dependencies and system updated

### Maintenance
- **Regular Updates**: Update dependencies regularly
- **Security Patches**: Apply security patches promptly
- **Performance Monitoring**: Monitor and optimize performance
- **Documentation**: Keep documentation current

This environment configuration ensures consistent, secure, and maintainable deployments across all environments.
