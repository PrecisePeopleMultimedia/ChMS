#!/bin/bash

# ChMS Production Deployment Script
# Usage: ./scripts/deploy.sh [environment] [version]
# Example: ./scripts/deploy.sh production v1.0.0

set -e  # Exit on any error

# Configuration
ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}
PROJECT_NAME="chms"
DOCKER_REGISTRY="your-registry.com"
BACKUP_DIR="/backups"
LOG_FILE="/var/log/chms-deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Check if running as root
check_permissions() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root for security reasons"
    fi
}

# Validate environment
validate_environment() {
    case $ENVIRONMENT in
        staging|production)
            log "Deploying to $ENVIRONMENT environment"
            ;;
        *)
            error "Invalid environment: $ENVIRONMENT. Use 'staging' or 'production'"
            ;;
    esac
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed and running
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker daemon is not running"
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
    fi
    
    # Check if required files exist
    if [[ ! -f "docker-compose.prod.yml" ]]; then
        error "docker-compose.prod.yml not found"
    fi
    
    if [[ ! -f ".env.${ENVIRONMENT}" ]]; then
        error ".env.${ENVIRONMENT} file not found"
    fi
    
    success "Prerequisites check passed"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    BACKUP_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_PATH="${BACKUP_DIR}/${PROJECT_NAME}_${ENVIRONMENT}_${BACKUP_TIMESTAMP}"
    
    mkdir -p "$BACKUP_PATH"
    
    # Backup database
    if docker-compose -f docker-compose.prod.yml ps postgres | grep -q "Up"; then
        log "Backing up database..."
        docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U chms_user chms > "${BACKUP_PATH}/database.sql"
        success "Database backup created"
    else
        warning "Database container not running, skipping database backup"
    fi
    
    # Backup uploaded files
    if [[ -d "backend/storage/app/public" ]]; then
        log "Backing up uploaded files..."
        cp -r backend/storage/app/public "${BACKUP_PATH}/uploads"
        success "Files backup created"
    fi
    
    # Backup environment file
    cp ".env.${ENVIRONMENT}" "${BACKUP_PATH}/.env"
    
    success "Backup created at $BACKUP_PATH"
}

# Pull latest images
pull_images() {
    log "Pulling latest Docker images..."
    
    if [[ "$VERSION" != "latest" ]]; then
        # Pull specific version
        docker pull "${DOCKER_REGISTRY}/${PROJECT_NAME}/backend:${VERSION}"
        docker pull "${DOCKER_REGISTRY}/${PROJECT_NAME}/frontend:${VERSION}"
    else
        # Pull latest images
        docker-compose -f docker-compose.prod.yml pull
    fi
    
    success "Images pulled successfully"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Wait for database to be ready
    docker-compose -f docker-compose.prod.yml exec -T backend php artisan migrate --force
    
    success "Database migrations completed"
}

# Clear application cache
clear_cache() {
    log "Clearing application cache..."
    
    docker-compose -f docker-compose.prod.yml exec -T backend php artisan config:clear
    docker-compose -f docker-compose.prod.yml exec -T backend php artisan route:clear
    docker-compose -f docker-compose.prod.yml exec -T backend php artisan view:clear
    docker-compose -f docker-compose.prod.yml exec -T backend php artisan cache:clear
    
    success "Application cache cleared"
}

# Optimize application
optimize_application() {
    log "Optimizing application..."
    
    docker-compose -f docker-compose.prod.yml exec -T backend php artisan config:cache
    docker-compose -f docker-compose.prod.yml exec -T backend php artisan route:cache
    docker-compose -f docker-compose.prod.yml exec -T backend php artisan view:cache
    
    success "Application optimized"
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Wait for services to start
    sleep 30
    
    # Check backend health
    if curl -f http://localhost:8000/api/health &> /dev/null; then
        success "Backend health check passed"
    else
        error "Backend health check failed"
    fi
    
    # Check frontend health
    if curl -f http://localhost:1811/health &> /dev/null; then
        success "Frontend health check passed"
    else
        error "Frontend health check failed"
    fi
    
    # Check database connectivity
    if docker-compose -f docker-compose.prod.yml exec -T backend php artisan migrate:status &> /dev/null; then
        success "Database connectivity check passed"
    else
        error "Database connectivity check failed"
    fi
    
    success "All health checks passed"
}

# Deploy application
deploy() {
    log "Starting deployment of ChMS $VERSION to $ENVIRONMENT..."
    
    # Copy environment file
    cp ".env.${ENVIRONMENT}" .env
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down
    
    # Start new containers
    log "Starting new containers..."
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for containers to start
    log "Waiting for containers to start..."
    sleep 10
    
    # Run post-deployment tasks
    run_migrations
    clear_cache
    optimize_application
    
    # Perform health check
    health_check
    
    success "Deployment completed successfully!"
}

# Rollback function
rollback() {
    log "Rolling back deployment..."
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t ${BACKUP_DIR}/${PROJECT_NAME}_${ENVIRONMENT}_* | head -n1)
    
    if [[ -z "$LATEST_BACKUP" ]]; then
        error "No backup found for rollback"
    fi
    
    log "Rolling back to backup: $LATEST_BACKUP"
    
    # Stop current containers
    docker-compose -f docker-compose.prod.yml down
    
    # Restore database
    if [[ -f "${LATEST_BACKUP}/database.sql" ]]; then
        log "Restoring database..."
        docker-compose -f docker-compose.prod.yml up -d postgres
        sleep 10
        docker-compose -f docker-compose.prod.yml exec -T postgres psql -U chms_user -d chms < "${LATEST_BACKUP}/database.sql"
    fi
    
    # Restore environment file
    cp "${LATEST_BACKUP}/.env" .env
    
    # Start containers with previous version
    docker-compose -f docker-compose.prod.yml up -d
    
    success "Rollback completed"
}

# Cleanup old backups (keep last 10)
cleanup_backups() {
    log "Cleaning up old backups..."
    
    cd "$BACKUP_DIR"
    ls -t ${PROJECT_NAME}_${ENVIRONMENT}_* | tail -n +11 | xargs -r rm -rf
    
    success "Backup cleanup completed"
}

# Main execution
main() {
    log "ChMS Deployment Script Started"
    log "Environment: $ENVIRONMENT"
    log "Version: $VERSION"
    
    check_permissions
    validate_environment
    check_prerequisites
    
    # Handle rollback command
    if [[ "$3" == "rollback" ]]; then
        rollback
        exit 0
    fi
    
    create_backup
    pull_images
    deploy
    cleanup_backups
    
    success "Deployment process completed successfully!"
    log "Application is now running at:"
    log "  Frontend: http://localhost:1811"
    log "  Backend API: http://localhost:8000/api"
    log "  Health Check: http://localhost:8000/api/health"
}

# Handle script interruption
trap 'error "Deployment interrupted"' INT TERM

# Run main function
main "$@"
