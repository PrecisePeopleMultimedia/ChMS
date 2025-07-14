# ChMS (Church Management System)

A minimalist, offline-first church management system for Africa. Built for reliability, speed, and practical core features.

## MVP Scope
- **Organization Management:** Basic org setup, minimal settings
- **Member Management:** Add/view/update members, family linking, search/autocomplete
- **Attendance:** QR code check-in, manual search/autocomplete, confirmation prompt, animated feedback, offline queue, minimal reporting

## Africa-First & Offline-First
- Designed for low-bandwidth, mobile-first, Android-priority environments
- Works offline and syncs when online
- Simple, intuitive UI for all skill levels

## Tech Stack
- Next.js 15 + Chakra UI (frontend)
- Supabase (PostgreSQL) + Prisma (backend)
- NextAuth.js (auth), SWR, React Hook Form, Zod
- TDD/BDD hybrid, managed via GitHub Projects

## Development Approach
- **TDD/BDD:** All features are test-driven, with user stories and acceptance criteria tracked in GitHub Projects
- **MVP-First:** Only essential features are built first; all else is future
- **Documentation:**
  - [Product Requirements Document (PRD)](pm/prd.md)
  - [Technical Specifications](.cursor/rules/technical-specifications.mdc)
  - [Project Overview](pm/project-overview.md)

## Getting Started
1. Clone the repo
2. Install dependencies: `npm install`
3. Set up your `.env` and database
4. Run: `npm run dev`

## Contributing
- All work is tracked in GitHub Projects (issues, tests, user stories)
- Use feature branches and write tests for all new features
- See [CONTRIBUTING.md] for guidelines (if available)

## License
MIT
