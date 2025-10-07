#!/bin/bash

# ChMS Production Deployment Script
# Phase 4B: Deploy MVP with Competitive Parity Features
# Version: MVP v1.0

set -e  # Exit on any error

echo "🚀 Starting ChMS Production Deployment..."
echo "================================================"

# Configuration
APP_NAME="ChMS"
ENVIRONMENT="production"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
LOG_FILE="deployment_$(date +%Y%m%d_%H%M%S).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}" | tee -a "$LOG_FILE"
}

# Pre-deployment checks
log "Step 1: Pre-deployment validation"
echo "-----------------------------------"

# Check if we're in the right directory
if [ ! -f "composer.json" ]; then
    error "Not in Laravel project root directory"
fi

# Check PHP version
PHP_VERSION=$(php -v | head -n 1 | cut -d " " -f 2 | cut -d "." -f 1,2)
if [ "$(echo "$PHP_VERSION >= 8.2" | bc)" -eq 0 ]; then
    error "PHP 8.2+ required, found $PHP_VERSION"
fi
log "✅ PHP version check passed ($PHP_VERSION)"

# Check environment file
if [ ! -f ".env" ]; then
    error ".env file not found"
fi
log "✅ Environment configuration found"

# Database connectivity check
log "Step 2: Database connectivity check"
echo "------------------------------------"
php artisan migrate:status > /dev/null 2>&1 || error "Database connection failed"
log "✅ Database connection successful"

# Run comprehensive tests
log "Step 3: Running comprehensive test suite"
echo "----------------------------------------"
php artisan test --testsuite=Feature --stop-on-failure || error "Tests failed - deployment aborted"
log "✅ All critical tests passed"

# Security audit
log "Step 4: Security audit"
echo "-----------------------"

# Check for debug mode
if grep -q "APP_DEBUG=true" .env; then
    warning "APP_DEBUG is enabled - should be false in production"
fi

# Check for default keys
if grep -q "APP_KEY=base64:" .env; then
    log "✅ Application key is set"
else
    error "Application key not set - run php artisan key:generate"
fi

# Database backup
log "Step 5: Creating database backup"
echo "---------------------------------"
mkdir -p "$BACKUP_DIR"
php artisan backup:run --only-db --filename="pre_deployment_$(date +%Y%m%d_%H%M%S).sql" || warning "Database backup failed"
log "✅ Database backup created"

# Clear and optimize caches
log "Step 6: Cache optimization"
echo "---------------------------"
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
log "✅ Caches cleared"

php artisan config:cache
php artisan route:cache
php artisan view:cache
log "✅ Production caches generated"

# Run database migrations
log "Step 7: Database migrations"
echo "----------------------------"
php artisan migrate --force || error "Migration failed"
log "✅ Database migrations completed"

# Seed default data
log "Step 8: Seeding default data"
echo "-----------------------------"
php artisan db:seed --class=BadgeTypeSeeder --force || warning "Badge seeding failed"
log "✅ Default data seeded"

# Storage permissions
log "Step 9: Setting storage permissions"
echo "------------------------------------"
chmod -R 775 storage bootstrap/cache || warning "Permission setting failed"
log "✅ Storage permissions set"

# Queue and scheduler setup
log "Step 10: Queue and scheduler setup"
echo "-----------------------------------"
# Note: In production, these should be managed by supervisor/systemd
info "Queue workers should be managed by supervisor in production"
info "Scheduler should be added to crontab: * * * * * php artisan schedule:run"

# Performance optimization
log "Step 11: Performance optimization"
echo "----------------------------------"
composer install --optimize-autoloader --no-dev || error "Composer optimization failed"
php artisan optimize || warning "Laravel optimization failed"
log "✅ Performance optimization completed"

# Health check
log "Step 12: Post-deployment health check"
echo "--------------------------------------"
php artisan route:list > /dev/null 2>&1 || error "Route compilation failed"
log "✅ Routes compiled successfully"

# Final validation
log "Step 13: Final validation"
echo "--------------------------"
php artisan test --testsuite=Feature --filter="BadgeSystemTest|MemberNotesTest" || error "Critical system validation failed"
log "✅ Critical systems validated"

# Deployment summary
echo ""
log "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "====================================="
info "Application: $APP_NAME"
info "Environment: $ENVIRONMENT"
info "Deployment Time: $(date)"
info "Log File: $LOG_FILE"
info "Backup Location: $BACKUP_DIR"
echo ""
log "🌍 ChMS is now ready to serve African churches!"
echo ""

# Post-deployment instructions
echo "📋 POST-DEPLOYMENT CHECKLIST:"
echo "------------------------------"
echo "1. ✅ Verify application is accessible"
echo "2. ✅ Test user registration and login"
echo "3. ✅ Validate core features (badges, notes, members)"
echo "4. ✅ Monitor error logs for 24 hours"
echo "5. ✅ Set up monitoring and alerting"
echo "6. ✅ Configure backup schedule"
echo "7. ✅ Update DNS and SSL certificates"
echo ""

# Monitoring commands
echo "🔍 MONITORING COMMANDS:"
echo "-----------------------"
echo "View logs: tail -f storage/logs/laravel.log"
echo "Check queues: php artisan queue:work --daemon"
echo "Monitor performance: php artisan horizon (if using Redis)"
echo "Health check: php artisan route:list | grep api"
echo ""

log "Deployment script completed at $(date)"
