# Product Requirements Document (PRD) - ChMS

---

## ✅ TL;DR

ChMS is an AI-native, low-resource church management system (ChMS) built for Africa. It starts with attendance and member tracking and grows into a full platform for church operations.

- 🌍 Built for low-connectivity environments in West Africa
- 🧠 AI-native using Flowise agents + LLMs
- 📱 Mobile-first, offline-capable
- 🆓 Free core, with optional donations/ads/premium features

---

## 1. Introduction & Purpose

ChMS (Church Management System) is a comprehensive solution designed specifically for the needs of African churches. The primary purpose is to provide an easy-to-use, reliable, and accessible system for managing church operations, focusing on scalability, offline-first functionality, and optimization for low-bandwidth environments.

**Target Audience:** Churches in Africa, potentially with limited or intermittent internet connectivity.

**Vision:**
To empower every church in Africa — rural or urban — to manage their members, attendance, and growth using accessible technology. No cost. No complexity. No compromise.

**Goals:**

- **Scalable and Maintainable:** Built with modern best practices to support growth.
- **Offline-First & Low-Bandwidth Optimized:** Core functionality should work reliably with poor connectivity.
- **Accessible and User-Friendly:** Intuitive interface for users with varying technical skills.
- **Well-documented and Testable:** Ensure ease of maintenance and future development.
- **AI-Native from Day One:** Leverage Flowise, n8n, and LLMs for onboarding, automation, and insights.
- **Africa-First:** Prioritize local context, languages, and connectivity realities.

---

## 2. Features Overview

- **Foundation:**
  - Project Setup & Core Components
  - Authentication & Authorization (Role-Based Access Control)
  - Basic Routing
  - Database Setup
- **Core Features:**
  - Organization Management
  - Member Management (including Family Units)
  - Attendance System (QR/Face check-in, tagging, summaries)
  - Basic Reporting
- **AI-Native Features:**
  - Flowise-powered onboarding and conversational flows
  - n8n event automation (e.g., alerts, reminders)
  - AI-generated attendance summaries and insights
  - Natural language queries ("Show me all absentees in March")
- **Advanced Features (Future):**
  - Communication System (Email, SMS)
  - Advanced Reporting & Analytics
  - Event Management
  - Visitor Management
  - Mobile Optimization / PWA features
  - Voice input, WhatsApp bot

---

## 3. User Needs & User Stories

_(Link to or summarize key user stories from `pm/user-stories.md`)_

| User            | Description |
|-----------------|-------------|
| Church Admin    | Manages church data, attendance, people |
| Group Leader    | Handles events and attendance by role/group |
| Church Member   | Checks in to events, views their own record |
| Volunteer Agent | Helps new churches onboard using a chatbot |
| Low-Tech Church | Needs offline-first, mobile access |

**Example Stories:**
- A church administrator needs to easily add, view, and update member profiles, even when offline.
- A pastor needs to quickly record attendance for a service using a mobile device.
- A volunteer agent uses an AI chatbot to onboard a new church.
- A treasurer needs access to basic financial reports based on member contributions (if applicable).

---

## 4. Technical Requirements

- **Stack:**
  - Frontend: Next.js 15 + Chakra UI
  - Backend/API: Next.js API Routes/Server Actions
  - Database: Supabase (PostgreSQL)
  - ORM: Prisma
  - Auth: NextAuth.js
  - AI Integration: Flowise, n8n, Ollama, OpenAI/Claude fallback
  - State/Data: SWR, React Hook Form, Zod
- **Performance:** Fast load times (<2s), offline capability, low bandwidth usage.
- **Security:** RBAC, data encryption, input validation, standard web security practices.
- **Testing:** Unit, integration, E2E tests with high coverage (see `pm/testing-strategy.md`).
- **Offline:** SWR cache + background sync (planned)

---

## 5. Design & UI/UX

- Utilizes Chakra UI component library.
- Responsive design for various screen sizes.
- Dark mode support.
- Accessibility compliance (WCAG).
- Minimalist and intuitive user interface.
- Mobile-first, Africa-first design.

---

## 6. Success Metrics

- Number of churches onboarded
- Daily/weekly attendance submissions
- Offline sync success rate
- User satisfaction (surveys)
- Agent-led onboarding conversions
- System uptime and performance benchmarks

---

## 7. AI-Native Design

| Tool | Purpose |
|------|---------|
| **Flowise** | Visual LLM workflows (chatbot setup, data queries, onboarding) |
| **Ollama / GPT-4o / Claude** | AI reasoning, summaries, user queries |
| **pgvector / embeddings** | Search, similarity-based member discovery |
| **n8n** | Event automation (e.g., low attendance alerts) |

**Example Use Cases:**
- Smart onboarding (AI agents / forms)
- Automated engagement (reminders, re-engagement)
- Conversational interface for setup and reporting

---

## 8. Tradeoffs & Open Questions

| Decision                     | Alternatives |
|-----------------------------|--------------|
| AI-first onboarding         | Static form, manual entry |
| Face recognition for check-in | QR code fallback |
| Free core features          | Premium tier, pay-per-feature |
| Donation/ad model           | Paywall or enterprise sales |

**Open Questions:**
- Which offline sync method is most reliable (Service Workers, SWR + local queue)?
- How do we handle facial recognition legally and ethically?
- Can Flowise agents be embedded into mobile UIs effectively?
- Should we expose public APIs for integration?
- [Mark areas needing feedback here]

---

## 9. Roadmap

| Version | Features |
|---------|----------|
| **v0.1** | MVP: attendance, onboarding, AI agents |
| **v0.2** | Dashboards, reminders, offline sync |
| **v1.0** | Member search, analytics, monetization |
| **v2.0+** | Voice input, full CMS, WhatsApp bot |

---

## 10. Monetization Strategy

- **Always free** for core features (attendance, members, onboarding)
- **Optional ads**, with toggle control
- **Donations** from churches and sponsors
- **Premium tier** for AI-powered features or branding

---

## 11. Documentation & Collaboration

- PRD maintained in this repo (`pm/prd.md`)
- Collaborative editing via Google Docs/Notion as needed
- Feedback and open questions tracked in this document

---

**Created by:** [Your Name / Org]
**Maintained on:** GitHub Projects (Beta)
**Tools in use:** Notion, Google Docs, Flowise, Supabase
