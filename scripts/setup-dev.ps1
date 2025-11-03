# ChMS Development Environment Setup Script (PowerShell)
# This script sets up the complete development environment for ChMS on Windows

param(
    [switch]$SkipChecks = $false
)

# Colors for output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    White = "White"
}

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Colors.Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Colors.Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Colors.Red
}

# Check if required tools are installed
function Test-Requirements {
    Write-Status "Checking system requirements..."
    
    $errors = @()
    
    # Check PHP
    try {
        $phpVersion = php -v 2>$null
        if (-not $phpVersion) {
            $errors += "PHP is not installed or not in PATH. Please install PHP 8.2 or higher."
        }
    } catch {
        $errors += "PHP is not installed or not in PATH. Please install PHP 8.2 or higher."
    }
    
    # Check Composer
    try {
        $composerVersion = composer --version 2>$null
        if (-not $composerVersion) {
            $errors += "Composer is not installed or not in PATH. Please install Composer."
        }
    } catch {
        $errors += "Composer is not installed or not in PATH. Please install Composer."
    }
    
    # Check Node.js
    try {
        $nodeVersion = node --version 2>$null
        if (-not $nodeVersion) {
            $errors += "Node.js is not installed or not in PATH. Please install Node.js 18 or higher."
        }
    } catch {
        $errors += "Node.js is not installed or not in PATH. Please install Node.js 18 or higher."
    }
    
    # Check npm
    try {
        $npmVersion = npm --version 2>$null
        if (-not $npmVersion) {
            $errors += "npm is not installed or not in PATH. Please install npm."
        }
    } catch {
        $errors += "npm is not installed or not in PATH. Please install npm."
    }
    
    if ($errors.Count -gt 0) {
        foreach ($error in $errors) {
            Write-Error $error
        }
        exit 1
    }
    
    Write-Success "All requirements are met!"
}

# Setup Laravel Backend
function Setup-Backend {
    Write-Status "Setting up Laravel backend..."
    
    if (-not (Test-Path "backend/vendor")) {
        Set-Location backend
        
        # Create Laravel project if it doesn't exist
        if (-not (Test-Path "composer.json")) {
            Write-Status "Creating new Laravel project..."
            composer create-project laravel/laravel . "^11.0"
        } else {
            Write-Status "Installing Laravel dependencies..."
            composer install
        }
        
        # Install additional packages
        Write-Status "Installing Laravel Sanctum..."
        composer require laravel/sanctum
        
        # Copy environment file
        if (-not (Test-Path ".env")) {
            Copy-Item ".env.example" ".env"
            Write-Status "Created .env file from .env.example"
        }
        
        # Generate application key
        php artisan key:generate
        
        # Publish Sanctum configuration
        php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
        
        Set-Location ..
        Write-Success "Laravel backend setup complete!"
    } else {
        Write-Warning "Laravel backend already exists, skipping setup."
    }
}

# Setup Vue 3 Frontend
function Setup-Frontend {
    Write-Status "Setting up Vue 3 frontend..."
    
    if (-not (Test-Path "frontend/node_modules")) {
        Set-Location frontend
        
        # Create Vue project if it doesn't exist
        if (-not (Test-Path "package.json")) {
            Write-Status "Creating new Vue 3 project..."
            npm create vue@latest . -- --typescript --pwa --router --pinia --vitest --eslint
        } else {
            Write-Status "Installing frontend dependencies..."
            npm install
        }
        
        # Install additional dependencies
        Write-Status "Installing additional packages..."
        npm install @vueuse/core
        npm install -D tailwindcss @tailwindcss/forms autoprefixer postcss
        
        # Copy environment file
        if (-not (Test-Path ".env.local")) {
            if (Test-Path ".env.example") {
                Copy-Item ".env.example" ".env.local"
            } else {
                "VITE_API_URL=http://localhost:8000/api" | Out-File -FilePath ".env.local" -Encoding UTF8
            }
            Write-Status "Created .env.local file"
        }
        
        Set-Location ..
        Write-Success "Vue 3 frontend setup complete!"
    } else {
        Write-Warning "Vue 3 frontend already exists, skipping setup."
    }
}

# Setup database
function Setup-Database {
    Write-Status "Setting up database..."
    
    # Check if using Docker
    $dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
    $dockerComposeInstalled = Get-Command docker-compose -ErrorAction SilentlyContinue
    
    if ($dockerInstalled -and $dockerComposeInstalled) {
        Write-Status "Docker detected. You can use 'docker-compose up -d db' to start PostgreSQL."
    } else {
        Write-Warning "Docker not found. Please set up PostgreSQL manually."
    }
    
    Write-Status "Database setup instructions:"
    Write-Host "1. Install PostgreSQL locally"
    Write-Host "2. Create a database named 'chms_db'"
    Write-Host "3. Update .env files with your PostgreSQL credentials"
    Write-Host "4. Run 'php artisan migrate' in the backend directory"
}

# Create initial project structure
function New-ProjectStructure {
    Write-Status "Creating project structure..."
    
    # Create directories if they don't exist
    $directories = @(
        "backend/app/Http/Controllers/Api",
        "backend/app/Models",
        "backend/app/Services",
        "backend/database/migrations",
        "frontend/src/components",
        "frontend/src/views",
        "frontend/src/composables",
        "frontend/src/stores",
        "frontend/src/services",
        "tests/backend",
        "tests/frontend"
    )
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
    }
    
    Write-Success "Project structure created!"
}

# Main setup function
function Main {
    Write-Host "================================================" -ForegroundColor $Colors.White
    Write-Host "🏗️  ChMS Development Environment Setup" -ForegroundColor $Colors.White
    Write-Host "================================================" -ForegroundColor $Colors.White
    Write-Host ""
    
    if (-not $SkipChecks) {
        Test-Requirements
    }
    
    New-ProjectStructure
    Setup-Backend
    Setup-Frontend
    Setup-Database
    
    Write-Host ""
    Write-Host "================================================" -ForegroundColor $Colors.White
    Write-Success "🎉 ChMS Development Environment Setup Complete!"
    Write-Host "================================================" -ForegroundColor $Colors.White
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Configure your .env files with database credentials"
    Write-Host "2. Run migrations: cd backend && php artisan migrate"
    Write-Host "3. Start backend: cd backend && php artisan serve"
    Write-Host "4. Start frontend: cd frontend && npm run dev"
    Write-Host ""
    Write-Host "Happy coding! 🚀"
}

# Run main function
Main
