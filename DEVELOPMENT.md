# ChMS Development Guide

This guide covers the complete development setup and workflow for the ChMS (Church Management System) project.

## 🏗️ Project Architecture

### Tech Stack
- **Backend**: Laravel 11 (PHP 8.2+)
- **Frontend**: Vue 3 with Composition API
- **UI Framework**: Quasar Framework (Material Design components)
- **Database**: PostgreSQL via Supabase
- **Authentication**: Laravel Sanctum + Supabase Auth
- **State Management**: Pinia
- **Styling**: Quasar Framework + Custom CSS
- **Testing**: PHPUnit (backend), Vitest (frontend), Playwright (E2E)
- **PWA**: Quasar PWA mode with Service Workers

### Project Structure
```
ChMS/
├── .specify/                    # Spec-driven development files
├── backend/                     # Laravel API backend
├── frontend/                    # Vue 3 PWA frontend
├── scripts/                     # Development scripts
├── tests/                       # Test files
├── docker-compose.yml           # Docker development environment
└── DEVELOPMENT.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18 or higher
- npm or yarn
- PostgreSQL (or Supabase account)

### Automated Setup
Run the setup script for your platform:

**Linux/macOS:**
```bash
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh
```

**Windows (PowerShell):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\scripts\setup-dev.ps1
```

### Manual Setup

#### 1. Backend Setup (Laravel)
```bash
cd backend
composer create-project laravel/laravel . "^11.0"
composer require laravel/sanctum
cp .env.example .env
php artisan key:generate
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

#### 2. Frontend Setup (Vue 3)
```bash
cd frontend
npm create vue@latest . -- --typescript --pwa --router --pinia --vitest --eslint
npm install @supabase/supabase-js @vueuse/core
npm install -D tailwindcss @tailwindcss/forms
```

#### 3. Environment Configuration
Update `.env` files with your database and Supabase credentials:

**Backend (.env):**
```env
DB_CONNECTION=pgsql
DB_HOST=your-supabase-host
DB_PORT=5432
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🔧 Development Workflow

### Starting Development Servers

**Backend (Laravel):**
```bash
cd backend
php artisan serve
# Server runs on http://localhost:8000
```

**Frontend (Vue 3 + Quasar):**
```bash
cd frontend
npm run dev
# Quasar dev server runs on http://localhost:1811
```

**Database (Docker):**
```bash
docker-compose up -d db
# PostgreSQL runs on localhost:5432
```

### Running Tests

**Backend Tests:**
```bash
cd backend
php artisan test
# or
./vendor/bin/phpunit
```

**Frontend Tests:**
```bash
cd frontend
npm run test:unit
# or
npm run test:e2e
```

## 🎨 Quasar Framework Integration

### Why Quasar?
- **Material Design 3**: Modern, consistent UI components
- **PWA Ready**: Built-in service worker and offline capabilities
- **Mobile Optimized**: Touch-friendly components for African mobile users
- **Performance**: Tree-shaking and optimized builds
- **Accessibility**: WCAG AA compliant components out of the box

### Quasar Development Commands

**Development Server:**
```bash
cd frontend
npm run dev
# or
quasar dev
```

**Build for Production:**
```bash
npm run build
# or
quasar build
```

**PWA Mode:**
```bash
quasar mode add pwa
quasar dev -m pwa
```

**Component Usage Examples:**
```vue
<!-- Quasar Button -->
<q-btn color="primary" label="Add Member" @click="addMember" />

<!-- Quasar Form -->
<q-form @submit="onSubmit">
  <q-input v-model="name" label="Member Name" required />
  <q-btn type="submit" color="primary" label="Save" />
</q-form>

<!-- Quasar Table -->
<q-table
  :rows="members"
  :columns="columns"
  row-key="id"
  :pagination="pagination"
/>
```

### Database Operations

**Run Migrations:**
```bash
cd backend
php artisan migrate
```

**Create Migration:**
```bash
php artisan make:migration create_members_table
```

**Seed Database:**
```bash
php artisan db:seed
```

## 📁 Code Organization

### Backend Structure (Laravel)
```
backend/
├── app/
│   ├── Http/Controllers/Api/    # API controllers
│   ├── Models/                  # Eloquent models
│   ├── Services/               # Business logic
│   └── Repositories/           # Data access layer
├── database/
│   ├── migrations/             # Database migrations
│   └── seeders/               # Database seeders
└── tests/                     # PHPUnit tests
```

### Frontend Structure (Vue 3)
```
frontend/
├── src/
│   ├── components/            # Reusable components
│   ├── views/                # Page components
│   ├── composables/          # Vue 3 composables
│   ├── stores/               # Pinia stores
│   ├── services/             # API services
│   └── utils/                # Utility functions
└── tests/                    # Vitest tests
```

## 🎯 Development Standards

### Code Quality
- **PHP**: Follow PSR-12 coding standards
- **JavaScript/TypeScript**: Use ESLint and Prettier
- **Vue**: Follow Vue 3 style guide
- **Testing**: Maintain 80%+ test coverage

### Git Workflow
1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Write/update tests
4. Run all tests locally
5. Create pull request
6. Code review and merge

### Commit Messages
Use conventional commits format:
```
feat: add member management API
fix: resolve QR code scanning issue
docs: update development guide
test: add attendance system tests
```

## 🧪 Testing Strategy

### Backend Testing (PHPUnit)
- **Unit Tests**: Test individual classes and methods
- **Feature Tests**: Test API endpoints and workflows
- **Integration Tests**: Test database interactions

Example test:
```php
public function test_can_create_member()
{
    $memberData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john@example.com'
    ];
    
    $response = $this->postJson('/api/members', $memberData);
    $response->assertStatus(201);
}
```

### Frontend Testing (Vitest)
- **Unit Tests**: Test components and composables
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

Example test:
```javascript
describe('MemberForm', () => {
  it('should submit member data', async () => {
    const wrapper = mount(MemberForm);
    await wrapper.find('input[name="firstName"]').setValue('John');
    await wrapper.find('form').trigger('submit');
    expect(wrapper.emitted('submit')).toBeTruthy();
  });
});
```

## 📱 Mobile Development

### PWA Configuration
- Service worker for offline functionality
- Web app manifest for app-like experience
- IndexedDB for local data storage
- Background sync for offline actions

### Mobile Testing
- Test on actual Android devices
- Use Chrome DevTools device simulation
- Test offline functionality
- Verify touch interactions

## 🔒 Security Considerations

### Authentication
- Laravel Sanctum for API authentication
- Supabase Auth for user management
- JWT tokens for stateless authentication
- Role-based access control

### Data Protection
- Input validation on all endpoints
- SQL injection prevention
- XSS protection
- CSRF protection
- HTTPS enforcement

## 🚀 Deployment

### Development Environment
- Local Laravel server
- Vue development server
- Local PostgreSQL or Supabase

### Production Environment
- Laravel on shared hosting or VPS
- Vue 3 PWA on CDN (Netlify, Vercel)
- Supabase for database and real-time features

## 📊 Performance Optimization

### Backend Optimization
- Database query optimization
- API response caching
- Background job processing
- Pagination for large datasets

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization
- Bundle size monitoring
- Service worker caching

## 🐛 Debugging

### Backend Debugging
- Laravel Telescope for request monitoring
- Laravel Debugbar for development
- Log files in `storage/logs/`
- Xdebug for step debugging

### Frontend Debugging
- Vue DevTools browser extension
- Browser developer tools
- Console logging
- Network tab for API calls

## 📚 Resources

### Documentation
- [Laravel Documentation](https://laravel.com/docs)
- [Vue 3 Documentation](https://vuejs.org/guide/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tools
- [Laravel Artisan Commands](https://laravel.com/docs/artisan)
- [Vue CLI](https://cli.vuejs.org/)
- [Composer](https://getcomposer.org/)
- [npm](https://www.npmjs.com/)

## 🤝 Contributing

1. Follow the development standards
2. Write comprehensive tests
3. Update documentation
4. Test on mobile devices
5. Verify offline functionality

## 📞 Support

For development questions or issues:
1. Check existing documentation
2. Search GitHub issues
3. Create new issue with detailed description
4. Include steps to reproduce problems
