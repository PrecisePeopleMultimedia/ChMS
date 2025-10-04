# ChMS - Personal Church Management System

A personal project building an Africa-first, offline-capable church management system using Vue 3, Laravel, and Supabase.

## 🎯 Project Goals

This is my personal exploration of building a minimalist church management system optimized for African contexts:
- **Offline-first**: Works without internet connection
- **Mobile-optimized**: Android-first design
- **Low-bandwidth**: Minimal data usage
- **Simple & reliable**: Focus on core functionality

## 🏗️ Tech Stack

### Backend
- **Laravel 11** - PHP API framework
- **PostgreSQL** - Database via Supabase
- **Laravel Sanctum** - API authentication

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Composition API** - Modern reactive development
- **Pinia** - State management
- **Vite** - Build tool and dev server

### Services
- **Supabase** - Database, auth, and real-time features
- **PWA** - Service workers for offline functionality

## 📋 MVP Features

### Core Functionality
1. **Organization Setup** - Basic church profile
2. **Member Management** - Add, edit, search members
3. **Attendance System** - QR code and manual check-in with offline support

See [pm/mvp-scope.md](pm/mvp-scope.md) for detailed scope.

## 🚀 Development Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL (or Supabase account)

### Backend Setup
```bash
# Create Laravel backend
cd backend/
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend Setup
```bash
# Create Vue frontend
cd frontend/
npm install
npm run dev
```

### Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Update `.env` files with Supabase credentials

## 📁 Project Structure

```
ChMS/
├── .specify/                    # Spec-driven development
├── backend/                     # Laravel API
├── frontend/                    # Vue 3 PWA
├── legacy-backup-original-state/ # Original project backup
├── pm/                          # Project management docs
└── CLAUDE.md                    # AI development guide
```

## 🧪 Development Approach

This project uses **spec-driven development** with Claude AI:

1. `/constitution` - Establish project principles
2. `/specify` - Define feature requirements
3. `/plan` - Create implementation plans
4. `/tasks` - Break down into actionable tasks
5. `/implement` - Execute the plan

See [CLAUDE.md](CLAUDE.md) for detailed AI integration guide.

## 🎯 Africa-First Principles

- **Offline capability**: Core features work without internet
- **Mobile performance**: Optimized for Android devices
- **Low bandwidth**: < 500KB bundle size, < 3s load time
- **Simple UI**: Intuitive for varying technical skills
- **Progressive enhancement**: Works on older devices

## 📊 Success Metrics

- Page load time < 3 seconds on 3G
- All core features work offline
- 95%+ task completion rate
- Works on mid-range Android devices

## 🔒 Security & Privacy

- Laravel Sanctum authentication
- Supabase Row Level Security
- Input validation and sanitization
- HTTPS enforcement
- Data encryption at rest and in transit

## 📝 Personal Notes

This is a learning project exploring:
- Modern PHP/Laravel development
- Vue 3 Composition API
- Offline-first architecture
- Progressive Web Apps
- Africa-focused design principles
- AI-assisted development workflows

## 📄 License

MIT - Personal project for learning and experimentation.
