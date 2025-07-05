# Technical Architecture - ChMS

> **Related Documents:**
>
> - [Product Requirements Document](./prd.md)
> - [User Stories](./user-stories.md)
> - [Security Policy](./security-policy.md)
> - [Deployment Manual](./deployment-manual.md)
> - [Development Standards](../docs/standards/development-standards.md)

## 1. Overview

This document outlines the high-level technical architecture for the ChMS application, now updated to reflect the AI-native, Africa-first, and MVP-focused direction. It details the technology stack, system components, data flow, and key architectural decisions.

**Goals:** Scalability, maintainability, offline-first capability, low-bandwidth optimization, security, testability, and AI-native automation.

## 2. Technology Stack

- **Frontend Framework:** Next.js 15 (React 19+)
- **Language:** TypeScript 5+
- **UI Library:** Chakra UI (v3+)
- **State Management / Data Fetching:** SWR
- **Form Handling:** React Hook Form
- **Schema Validation:** Zod
- **Backend:** Next.js API Routes / Server Components / Server Actions
- **Database ORM:** Prisma
- **Database:** Supabase (PostgreSQL)
- **Authentication:** NextAuth.js
- **AI Integration:** Flowise (visual LLM orchestration), n8n (automation), Ollama/OpenAI/Claude (LLMs)
- **Testing:** Vitest, React Testing Library, MSW, Cypress / Playwright
- **CI/CD:** GitHub Actions
- **Containerization:** Docker

## 3. System Components

- **Web Application (Next.js):** Handles UI rendering (SSR, SSG, Client Components), routing, API requests, and serves static assets.
- **API Layer (Next.js API Routes/Actions):** Provides backend logic, interacts with the database via Prisma, handles authentication/authorization, and integrates with AI agents.
- **Database (Supabase/PostgreSQL):** Stores application data (members, attendance, configuration, etc.). Managed via Prisma migrations.
- **Authentication Service (NextAuth.js):** Manages user sessions, login flows, and security tokens.
- **Data Caching Layer (SWR):** Manages client-side data fetching, caching, revalidation, and supports offline access patterns.
- **AI Agent Layer (Flowise/n8n):** Orchestrates onboarding, automation, and smart engagement via LLMs and workflow automation.
- **(Potentially) Background Job Processor:** For tasks like sending notifications or data processing (future phase).

## 4. Data Flow

- **Read Operations:** Client requests data via SWR → SWR checks cache/revalidates → Hits Next.js API Route/Server Action → Prisma queries Supabase/PostgreSQL → Data returned → SWR updates UI.
- **Write Operations:** User interaction triggers form submission → React Hook Form validates → Data sent to Next.js API Route/Server Action → Prisma performs mutation on Supabase/PostgreSQL → Response returned → SWR potentially revalidates related data / optimistic update.
- **Offline Sync:** SWR cache provides data offline. Mutations queued locally. Background sync when online (strategy to be finalized).
- **AI Agent Flows:** User triggers onboarding or engagement flow → Flowise agent orchestrates LLMs and n8n automations → Results/actions returned to user or system.

## 5. Key Architectural Decisions

- **Monorepo:** Single repository structure for all code and docs.
- **Serverless Approach:** Leveraging Next.js API Routes/Server Actions for backend logic.
- **Offline Strategy:** Utilizing SWR's caching and local queue for offline-first experience. (Detailed design in progress.)
- **AI-Native:** Flowise and n8n are core to onboarding, automation, and engagement from MVP.
- **UI Library:** Chakra UI for accessibility and theming.
- **ORM:** Prisma for type safety and migrations.

## 6. Scalability & Performance Considerations

- Database indexing and query optimization.
- Efficient data fetching patterns with SWR.
- Code splitting via Next.js.
- Use of Server Components for reduced client-side JS.
- CDN for static assets.
- Load testing strategy (via Cypress/Playwright).

## 7. Security Considerations

- Authentication via NextAuth.js.
- Role-Based Access Control (RBAC) in API layer.
- Input validation using Zod.
- Standard security headers, CSRF protection.
- Data encryption at rest and in transit.

## 8. Deployment Strategy

- CI/CD via GitHub Actions.
- Deployment target (Vercel, Docker container on cloud provider, etc. - TBD).
- Environment management (dev, staging, prod).
- Database migration strategy.

## 9. Open Questions

- Finalize offline sync mechanism (Service Workers, SWR + local queue, etc.)
- How to best embed Flowise/n8n agents in the UI for onboarding and engagement?
- What is the best approach for AI agent security and privacy?
- How to handle facial recognition ethically and legally (if implemented)?

---

### Version History

#### 2.0.0 - [Current Date]
- Updated for AI-native, Africa-first, and MVP focus
- Clarified stack, AI integration, and offline-first strategy
- Marked open questions for future work
