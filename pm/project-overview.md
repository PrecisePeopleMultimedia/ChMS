# Church Management System (ChMS)

A minimalist, offline-first web solution for church administration, designed for African churches with a focus on performance, reliability, and practical core features.

## Core Architecture Principles

### 1. Africa-First Minimalism
- Only essential features for church management
- Intuitive, clean UI for all skill levels
- Mobile-first, Android-priority
- Offline-first, low-bandwidth optimized
- Minimal dependencies, easy to maintain

### 2. Performance & Reliability
- Fast load times, minimal JS
- Works offline and syncs when online
- Efficient member lookup and attendance
- Simple, robust data structures

## MVP Features

### Organization Management
- Basic org setup and settings
- Department/class management (minimal)

### Member Management
- Add/view/update member profiles
- Family unit linking (minimal)
- Search/autocomplete for member lookup

### Attendance System
- QR code check-in
- Manual search/autocomplete check-in
- Confirmation prompt for sign-in
- Animated feedback (e.g., checkbox on success)
- Offline queue for attendance, syncs when online
- Minimal attendance reporting (summary only)

## Technical Approach
- Next.js 15 + Chakra UI (frontend)
- Supabase (PostgreSQL) + Prisma (backend)
- NextAuth.js for authentication
- SWR, React Hook Form, Zod for state/data/validation
- TDD/BDD hybrid, managed via GitHub Projects

## Success Criteria
- Churches can add members and record attendance offline
- QR and search-based check-in flows work on mobile
- Data syncs reliably when online
- Minimal reporting is available

## Future Enhancements
- AI/agent onboarding and automation
- WhatsApp/USSD fallback
- Advanced analytics and dashboards
- Payments and financial tracking
- Communication (SMS, email, WhatsApp)
- Multi-language support
- Media integration, voice input
- Full event/visitor management

## Standards & Testing
- Clean code, accessibility, security by default
- Comprehensive unit/integration/E2E tests
- All features tracked and tested via GitHub Projects

## Roadmap (Summary)
- **v0.1:** MVP (Org, Members, Attendance, minimal reporting)
- **v0.2+:** Add dashboards, reminders, sync improvements, then future features as above
