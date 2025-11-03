#!/bin/bash

# ChMS Development Environment Setup Script
# This script sets up the complete development environment for ChMS

set -e  # Exit on any error

echo "🚀 Setting up ChMS Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check PHP
    if ! command -v php &> /dev/null; then
        print_error "PHP is not installed. Please install PHP 8.2 or higher."
        exit 1
    fi
    
    # Check Composer
    if ! command -v composer &> /dev/null; then
        print_error "Composer is not installed. Please install Composer."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_success "All requirements are met!"
}

# Setup Laravel Backend
setup_backend() {
    print_status "Setting up Laravel backend..."
    
    if [ ! -d "backend/vendor" ]; then
        cd backend
        
        # Create Laravel project if it doesn't exist
        if [ ! -f "composer.json" ]; then
            print_status "Creating new Laravel project..."
            composer create-project laravel/laravel . "^11.0"
        else
            print_status "Installing Laravel dependencies..."
            composer install
        fi
        
        # Install additional packages
        print_status "Installing Laravel Sanctum..."
        composer require laravel/sanctum
        
        # Copy environment file
        if [ ! -f ".env" ]; then
            cp .env.example .env
            print_status "Created .env file from .env.example"
        fi
        
        # Generate application key
        php artisan key:generate
        
        # Publish Sanctum configuration
        php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
        
        cd ..
        print_success "Laravel backend setup complete!"
    else
        print_warning "Laravel backend already exists, skipping setup."
    fi
}

# Setup Vue 3 Frontend
setup_frontend() {
    print_status "Setting up Vue 3 frontend..."
    
    if [ ! -d "frontend/node_modules" ]; then
        cd frontend
        
        # Create Vue project if it doesn't exist
        if [ ! -f "package.json" ]; then
            print_status "Creating new Vue 3 project..."
            npm create vue@latest . -- --typescript --pwa --router --pinia --vitest --eslint
        else
            print_status "Installing frontend dependencies..."
            npm install
        fi
        
        # Install additional dependencies
        print_status "Installing additional packages..."
        npm install @vueuse/core
        npm install -D tailwindcss @tailwindcss/forms autoprefixer postcss
        
        # Copy environment file
        if [ ! -f ".env.local" ]; then
            cp .env.example .env.local 2>/dev/null || echo "VITE_API_URL=http://localhost:8000/api" > .env.local
            print_status "Created .env.local file"
        fi
        
        cd ..
        print_success "Vue 3 frontend setup complete!"
    else
        print_warning "Vue 3 frontend already exists, skipping setup."
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if using Docker
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        print_status "Docker detected. You can use 'docker-compose up -d db' to start PostgreSQL."
    else
        print_warning "Docker not found. Please set up PostgreSQL manually."
    fi
    
    print_status "Database setup instructions:"
    echo "1. Install PostgreSQL locally"
    echo "2. Create a database named 'chms_db'"
    echo "3. Update .env files with your PostgreSQL credentials"
    echo "4. Run 'php artisan migrate' in the backend directory"
}

# Create initial project structure
create_structure() {
    print_status "Creating project structure..."
    
    # Create directories if they don't exist
    mkdir -p backend/app/Http/Controllers/Api
    mkdir -p backend/app/Models
    mkdir -p backend/app/Services
    mkdir -p backend/database/migrations
    mkdir -p frontend/src/components
    mkdir -p frontend/src/views
    mkdir -p frontend/src/composables
    mkdir -p frontend/src/stores
    mkdir -p frontend/src/services
    mkdir -p tests/backend
    mkdir -p tests/frontend
    
    print_success "Project structure created!"
}

# Main setup function
main() {
    echo "================================================"
    echo "🏗️  ChMS Development Environment Setup"
    echo "================================================"
    echo ""
    
    check_requirements
    create_structure
    setup_backend
    setup_frontend
    setup_database
    
    echo ""
    echo "================================================"
    print_success "🎉 ChMS Development Environment Setup Complete!"
    echo "================================================"
    echo ""
    echo "Next steps:"
    echo "1. Configure your .env files with database credentials"
    echo "2. Run migrations: cd backend && php artisan migrate"
    echo "3. Start backend: cd backend && php artisan serve"
    echo "4. Start frontend: cd frontend && npm run dev"
    echo ""
    echo "Happy coding! 🚀"
}

# Run main function
main
