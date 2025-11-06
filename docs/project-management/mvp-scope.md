# ChMS MVP Scope - Personal Project

## Core MVP Features (Need-to-Have Only)

### 1. Organization Setup
- Basic church profile setup
- Single organization per installation
- Essential church information only

### 2. Member Management
- Add/edit/view member profiles
- Basic member information (name, contact, family)
- Simple member search
- Family unit linking (basic)

### 3. Attendance System
- QR code check-in for services
- Manual search-based check-in
- Offline attendance recording
- Basic attendance reports

## Tech Stack (Africa-First)

### Backend
- **Laravel 11** - PHP framework, widely supported in Africa
- **MySQL/PostgreSQL** - Reliable database options
- **API-first architecture** - RESTful APIs for frontend consumption

### Frontend
- **Vue 3** - Lightweight, progressive framework
- **Composition API** - Modern Vue development
- **PWA capabilities** - Offline-first functionality
- **Mobile-first design** - Android priority

### Database & Services
- **Supabase** - Backend-as-a-Service with offline sync
- **Real-time subscriptions** - Live attendance updates
- **Row Level Security** - Built-in authorization

### Africa-First Optimizations
- **Offline-first** - Works without internet connection
- **Low bandwidth** - Minimal data usage
- **Mobile optimized** - Touch-friendly interface
- **Progressive Web App** - App-like experience
- **WhatsApp integration** - Future enhancement for notifications

## Removed Features (Nice-to-Have)
- Advanced reporting and analytics
- Financial management
- Event management beyond basic services
- Communication systems (SMS, email)
- Multi-language support (v2 feature)
- AI/automation features
- Advanced user roles and permissions
- Media integration
- Voice input
- Complex workflow management

## Success Criteria
- Church can add members offline
- Attendance can be recorded via QR code or search
- Data syncs when internet is available
- Works reliably on Android devices
- Fast loading on slow connections

## Development Approach
- Start with Laravel API backend
- Build Vue 3 frontend as PWA
- Integrate Supabase for real-time features
- Focus on core functionality first
- Test on low-end Android devices
