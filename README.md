# ChurchAfrica - Church Management System

## Overview
ChurchAfrica is a modern, mobile-first church management system designed specifically for African churches. Built with Vue 3, Quasar Framework, Laravel 11, and Supabase, it provides comprehensive tools for member management, attendance tracking, and church administration.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   Vue 3 +       │◄──►│   Laravel 11 +   │◄──►│   SQLite/       │
│   Quasar        │    │   Sanctum       │    │   Supabase      │
│   Framework     │    │   API           │    │   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Hybrid Database Approach**
- **Development**: SQLite for fast local development
- **Production**: Supabase PostgreSQL for scalability
- **Migration Compatibility**: Same Laravel migrations work across both environments
- **Network Resilience**: Automatic fallback to SQLite when Supabase is unreachable

## 🚀 **Quick Start**

### Prerequisites
- **Node.js** 18+ and npm
- **PHP** 8.2+ and Composer
- **Laravel Herd** (recommended) or XAMPP/WAMP
- **Git** for version control

### 1. Clone the Repository
```bash
git clone https://github.com/PrecisePeopleMultimedia/ChMS.git
cd ChMS
```

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed
```

### 3. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### 4. Start Development
```bash
# Backend (Laravel Herd)
# Herd will automatically serve the backend at http://backend.test

# Frontend
cd frontend
npm run dev
# Frontend will be available at http://localhost:1811
```

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Vue 3, Quasar Framework, TypeScript, Tailwind CSS
- **Backend**: Laravel 11, PHP 8.2, Laravel Sanctum
- **Database**: Supabase PostgreSQL (production), SQLite (development)
- **Testing**: Vitest, Playwright, PHPUnit
- **Deployment**: Vercel (frontend), Laravel Forge (backend)

### **Authentication System**
- **Laravel Sanctum**: JWT token-based authentication
- **Google OAuth**: Social login integration
- **Role-based Access**: Admin, Member, Guest roles
- **Session Management**: Secure token handling with refresh
- **Password Security**: Bcrypt hashing with strength validation

### Project Structure
```
churchafrica/
├── .github/                 # GitHub Actions CI/CD
├── .specify/               # Speckit specifications
├── backend/                # Laravel backend
│   ├── app/                # Application code
│   ├── config/             # Configuration files
│   ├── database/           # Migrations and seeds
│   └── doc/                # Backend documentation
├── frontend/               # Vue.js frontend
│   ├── src/                # Source code
│   ├── public/             # Static assets
│   └── tests/              # Frontend tests
└── README.md               # This file
```

## 📋 Development Workflow

### Branch Strategy
```
main → feature/feature-name → dev → main
```

### Workflow Steps
1. **Create feature branch**: `git checkout -b feature/feature-name`
2. **Develop feature**: Make changes and commits
3. **Push to feature branch**: `git push origin feature/feature-name`
4. **Create pull request**: Feature → Dev
5. **Code review**: At least 1 reviewer
6. **Merge to dev**: After approval and CI/CD passes
7. **Create pull request**: Dev → Main
8. **Code review**: At least 2 reviewers
9. **Merge to main**: After approval and CI/CD passes

### Development Commands
```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run test:unit    # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Backend
php artisan serve    # Start development server
php artisan test     # Run tests
php artisan migrate  # Run migrations
php artisan seed     # Seed database
composer test        # Run all tests
```

## 🧪 Testing

### Frontend Testing
- **Unit Tests**: Vitest with Vue Test Utils
- **E2E Tests**: Playwright for end-to-end testing
- **Coverage**: > 90% code coverage target

### Backend Testing
- **Unit Tests**: PHPUnit for unit testing
- **Feature Tests**: Laravel feature tests
- **Coverage**: > 80% code coverage target

### Running Tests
```bash
# Frontend tests
cd frontend
npm run test:unit    # Unit tests
npm run test:e2e     # E2E tests
npm run test:coverage # Coverage report

# Backend tests
cd backend
php artisan test     # All tests
php artisan test --coverage # Coverage report
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://backend.test/api
VITE_SENTRY_DSN=your-sentry-dsn
```

#### Backend (.env)
```env
APP_NAME=ChurchAfrica
APP_ENV=local
APP_DEBUG=true
APP_URL=http://backend.test

DB_CONNECTION=pgsql
DB_HOST=db.qqaddmalbzzxxtryekaq.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-db-password

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://backend.test/api/auth/google/callback
```

### Database Configuration
- **Development**: SQLite (local) or Supabase PostgreSQL
- **Staging**: Supabase PostgreSQL (staging)
- **Production**: Supabase PostgreSQL (production)

### **Hybrid Development Workflow**
- **Local Development**: SQLite for fast iteration
- **Production Ready**: Supabase PostgreSQL for scalability
- **Migration Compatibility**: Same Laravel migrations work across environments
- **Network Resilience**: Automatic fallback when Supabase is unreachable
- **Data Sync**: Seamless data migration between environments

## 📚 Documentation

### Specifications
- **Authentication System**: `.specify/specs/000-authentication-system/`
- **Organization Setup**: `.specify/specs/001-organization-setup/`
- **Member Management**: `.specify/specs/002-member-management/`
- **Attendance System**: `.specify/specs/003-attendance-system/`
- **UI/UX System**: `.specify/specs/004-ui-ux-system/`
- **Dashboard System**: `.specify/specs/005-dashboard-system/`
- **Integration System**: `.specify/specs/008-integration-system/`

### API Documentation
- **API Reference**: `docs/API.md`
- **Backend Documentation**: `backend/doc/`
- **Environment Configuration**: `backend/doc/environments.md`
- **Monitoring Setup**: `backend/doc/monitoring.md`

### Development Guides
- **Branch Protection**: `.github/BRANCH_PROTECTION.md`
- **CI/CD Pipeline**: `.github/workflows/ci-cd.yml`
- **Roadmap**: `.specify/roadmap.md`

## 🚀 Deployment

### Development
- **Frontend**: `npm run dev` (http://localhost:1811)
- **Backend**: Laravel Herd (http://backend.test)

### Staging
- **Frontend**: Vercel (staging)
- **Backend**: Laravel Forge (staging)

### Production
- **Frontend**: Vercel (production)
- **Backend**: Laravel Forge (production)

## 🔒 Security

### Security Features
- **Authentication**: Laravel Sanctum with JWT tokens
- **Authorization**: Role-based access control
- **Data Protection**: Row Level Security (RLS) on Supabase
- **CSRF Protection**: Laravel CSRF middleware
- **Input Validation**: Comprehensive input validation
- **Rate Limiting**: API rate limiting

### Security Best Practices
- **Environment Variables**: Never commit sensitive data
- **Database Security**: Use SSL/TLS connections
- **API Security**: Implement proper authentication
- **Input Sanitization**: Sanitize all user input
- **Regular Updates**: Keep dependencies updated

## 📊 Monitoring

### Application Monitoring
- **Error Tracking**: Sentry for error tracking
- **Performance**: Laravel Telescope for debugging
- **Queue Monitoring**: Laravel Horizon for queue management
- **Health Checks**: Custom health check endpoints

### Infrastructure Monitoring
- **Server Monitoring**: CPU, memory, disk, network
- **Database Monitoring**: PostgreSQL performance
- **Cache Monitoring**: Redis performance
- **CDN Monitoring**: Static asset delivery

## 🤝 Contributing

### Development Process
1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Write tests**
5. **Run tests and linting**
6. **Create a pull request**

### Code Standards
- **Frontend**: ESLint + Prettier
- **Backend**: PHP CS Fixer + PHPStan
- **Testing**: Comprehensive test coverage
- **Documentation**: Update documentation as needed

### Pull Request Process
1. **Create pull request**: Feature → Dev
2. **Code review**: At least 1 reviewer
3. **CI/CD checks**: All checks must pass
4. **Merge**: After approval

## 📞 Support

### Getting Help
- **Documentation**: Check the documentation first
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Email**: Contact the development team

### Common Issues
- **Database Connection**: Check database credentials
- **Environment Variables**: Verify all required variables
- **File Permissions**: Check file and directory permissions
- **Cache Issues**: Clear cache and restart services

## 📈 Roadmap

### Phase 1: Foundation (Weeks 1-4) ✅
- Authentication System
- UI/UX System
- Basic Infrastructure

### Phase 2: Core Management (Weeks 5-8) 🔄
- Organization Setup
- Member Management
- Dashboard System

### Phase 3: Attendance & Events (Weeks 9-12) 📋
- Attendance System
- Event Management
- Reporting System

### Phase 4: Integration & Optimization (Weeks 13-16) 📋
- Integration System
- Performance Optimization
- Enterprise Features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Laravel Community**: For the excellent Laravel framework
- **Vue.js Community**: For the amazing Vue.js framework
- **Quasar Framework**: For the comprehensive UI components
- **Supabase**: For the powerful backend-as-a-service platform

---

**Built with ❤️ for African Churches**