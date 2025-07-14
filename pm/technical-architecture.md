# Technical Architecture - ChMS (MVP)

## Overview
ChMS is a minimalist, offline-first church management system for Africa. The architecture is designed for reliability, speed, and practical core features, with a focus on:
- Organization management
- Member management
- Attendance (QR code, search/autocomplete, offline queue)
- Minimal reporting

## Core Principles
- **Africa-first:** Mobile-first, Android-priority, low-bandwidth optimized
- **Offline-first:** All core flows work offline and sync when online
- **Minimalism:** Only essential features in MVP
- **Test-driven:** TDD/BDD hybrid, all features tracked in GitHub Projects

## System Components

### 1. Frontend
- Next.js 15 (React 18, TypeScript)
- Chakra UI v3 (UI components, theme)
- SWR (data fetching, caching, offline support)
- React Hook Form + Zod (forms, validation)

### 2. Backend/API
- Next.js API routes (serverless functions)
- Prisma ORM (type-safe DB access)
- Supabase (PostgreSQL)
- NextAuth.js (authentication, RBAC)

### 3. Data Flows
- Member and attendance data stored in PostgreSQL
- Attendance can be recorded via QR code or search/autocomplete
- Offline queue for attendance, syncs when online
- Minimal reporting (attendance summaries)

### 4. Security
- Role-based access control (RBAC)
- Data encryption at rest and in transit
- Input validation (Zod)
- Standard web security practices

### 5. Testing
- Vitest (unit/integration)
- React Testing Library (component tests)
- MSW (API mocking)
- Cypress/Playwright (E2E)

## Excluded from MVP (Future)
- AI/agent onboarding and automation
- WhatsApp/USSD fallback
- Payments and financial tracking
- Advanced analytics and dashboards
- Communication (SMS, email, WhatsApp)
- Multi-language support
- Media integration, voice input

## Diagram
```
[User] --(Web/Mobile)--> [Next.js/Chakra UI] --(API)--> [Next.js API Routes] --(Prisma)--> [Supabase/PostgreSQL]
```

## Roadmap
- v0.1: MVP (Org, Members, Attendance, minimal reporting)
- v0.2+: Add dashboards, reminders, sync improvements, then future features
