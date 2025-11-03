# ChMS - Claude AI Integration Guide

## Project Overview
ChMS (Church Management System) is an Africa-first, offline-capable church management solution built with Vue 3, Laravel, and PostgreSQL. This project follows spec-driven development principles with a focus on minimalist, reliable functionality.

## Available Slash Commands

### /constitution
Create or update project governing principles and development guidelines.

**Usage:** `/constitution Create principles focused on Africa-first development, code quality, testing standards, and performance requirements`

### /specify
Define what you want to build (requirements and user stories).

**Usage:** `/specify Build a member management system that allows churches to add, edit, and search for members offline, with automatic sync when online`

### /clarify
Clarify underspecified areas (must be run before /plan unless explicitly skipped).

**Usage:** `/clarify` (interactive process to clarify requirements)

### /plan
Create technical implementation plans with your chosen tech stack.

**Usage:** `/plan Implement using Laravel 11 backend with RESTful APIs, Vue 3 frontend with Composition API, and PostgreSQL for database operations`

### /tasks
Generate actionable task lists for implementation.

**Usage:** `/tasks` (generates detailed task breakdown from implementation plan)

### /analyze
Cross-artifact consistency & coverage analysis (run after /tasks, before /implement).

**Usage:** `/analyze` (validates consistency across specifications, plans, and tasks)

### /implement
Execute all tasks to build the feature according to the plan.

**Usage:** `/implement` (executes the implementation plan step by step)

## Project Structure

```
ChMS/
├── .specify/                    # Spec-driven development files
│   ├── memory/
│   │   └── constitution.md      # Project principles and guidelines
│   ├── specs/                   # Feature specifications
│   ├── templates/               # Templates for specs, plans, tasks
│   └── scripts/                 # Automation scripts
├── legacy-backup-original-state/ # Backup of original project state
├── pm/                          # Project management documentation
│   ├── mvp-scope.md            # MVP feature scope
│   └── security-policy.md      # Security guidelines
├── backend/                     # Laravel backend (to be created)
├── frontend/                    # Vue 3 frontend (to be created)
└── README.md                   # Project overview
```

## Tech Stack

### Backend
- **Laravel 11** - PHP framework for robust API development
- **MySQL/PostgreSQL** - Primary database
- **Laravel Sanctum** - API authentication
- **PHPUnit** - Testing framework

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Composition API** - Modern Vue development approach
- **Quasar Framework** - Material Design UI components and PWA features
- **Pinia** - State management
- **Vite** - Build tool and development server
- **Vitest** - Unit testing framework

### Database & Services
- **PostgreSQL** - Primary database via Docker Compose
- **Database migrations** - Laravel migration system
- **Database seeding** - Test data and initial setup
- **Connection pooling** - Efficient database connections

### PWA & Offline
- **Service Workers** - Offline functionality
- **IndexedDB** - Local data storage
- **Background Sync** - Offline action queuing
- **Web App Manifest** - App-like experience

## Africa-First Principles

### Technical Constraints
- **Bundle size**: Keep JavaScript bundles under 500KB
- **Load time**: < 3 seconds on 3G connection
- **Offline-first**: All core features work without internet
- **Mobile-first**: Optimized for Android devices
- **Low bandwidth**: Minimal data usage and smart caching

### Design Principles
- **Simple UI**: Intuitive for users with varying technical skills
- **Touch-friendly**: Large buttons, gesture support
- **Progressive enhancement**: Works on older devices
- **Accessibility**: WCAG AA compliance
- **Multilingual ready**: Prepared for localization

## Development Workflow

### 1. Feature Development Process
1. **Constitution**: Establish or review project principles
2. **Specify**: Define feature requirements and user stories
3. **Clarify**: Address any unclear requirements
4. **Plan**: Create technical implementation plan
5. **Tasks**: Break down into actionable tasks
6. **Analyze**: Validate consistency and coverage
7. **Implement**: Execute the implementation plan

### 2. Code Quality Standards
- **TypeScript/PHP strict mode**: Type safety enforcement
- **ESLint/PHP-CS-Fixer**: Code formatting and style
- **Test-driven development**: Write tests first
- **Code reviews**: All changes require peer review
- **Documentation**: Comprehensive inline and README docs

### 3. Testing Strategy
- **Unit tests**: 80%+ coverage for critical paths
- **Integration tests**: API and component integration
- **E2E tests**: Complete user workflows
- **Mobile testing**: Test on target Android devices
- **Offline testing**: Verify offline functionality

## Current MVP Scope

### Core Features (Need-to-Have)
1. **Organization Setup**
   - Basic church profile setup
   - Essential church information only

2. **Member Management**
   - Add/edit/view member profiles
   - Basic member search
   - Family unit linking

3. **Attendance System**
   - QR code check-in for services
   - Manual search-based check-in
   - Offline attendance recording
   - Basic attendance reports

### Removed Features (Nice-to-Have)
- Advanced reporting and analytics
- Financial management
- Event management beyond basic services
- Communication systems (SMS, email)
- Multi-language support (v2 feature)
- AI/automation features
- Advanced user roles and permissions

## Environment Variables

Create a `.env` file with the following variables:

```env
# Laravel Backend
APP_NAME=ChMS
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=
DB_PORT=5432
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# Frontend
VITE_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Getting Started

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm or yarn
- PostgreSQL (or use Supabase)

### Development Setup
1. Clone the repository
2. Set up Laravel backend in `backend/` directory
3. Set up Vue 3 frontend in `frontend/` directory
4. Configure Supabase project
5. Set up environment variables
6. Run migrations and seeders
7. Start development servers

### Using Spec-Driven Development
1. Start with `/constitution` to establish principles
2. Use `/specify` to define new features
3. Follow with `/clarify`, `/plan`, `/tasks`, `/analyze`
4. Execute with `/implement`

## Performance Targets

### Technical Metrics
- **Page load time**: < 3 seconds on 3G
- **Bundle size**: < 500KB initial load
- **API response time**: < 500ms average
- **Offline capability**: 100% core features
- **Mobile performance**: 60fps on mid-range Android

### User Experience Metrics
- **Task completion rate**: > 95% for core workflows
- **Error rate**: < 1% for critical operations
- **Accessibility score**: WCAG AA compliance
- **Cross-device compatibility**: 95%+ target devices

## Security Considerations

### Authentication & Authorization
- Laravel Sanctum for API authentication
- Role-based access control (RBAC)
- Supabase Row Level Security
- Session management and token security

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Data encryption at rest and in transit

## Deployment Strategy

### Development
- Local Laravel server (php artisan serve)
- Vite development server
- Local Supabase instance or cloud

### Production
- Laravel deployment (shared hosting or VPS)
- Static frontend deployment (Netlify, Vercel)
- Supabase cloud database
- CDN for static assets

## Support and Resources

### Documentation
- Laravel: https://laravel.com/docs
- Vue 3: https://vuejs.org/guide/
- Supabase: https://supabase.com/docs
- Spec-Kit: https://github.com/github/spec-kit

### Community
- Laravel community forums
- Vue.js Discord server
- Supabase Discord community
- GitHub Discussions for this project

## Contributing

1. Follow the spec-driven development process
2. Ensure all tests pass
3. Test on target devices (Android)
4. Verify offline functionality
5. Submit pull requests with clear descriptions
6. Include performance impact assessment

Remember: This is an Africa-first project. Every decision should consider offline capability, mobile performance, and low-bandwidth optimization.
