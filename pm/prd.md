# Product Requirements Document (PRD) - ChMS

---

## 🌍 West Africa Context

ChMS is designed for the realities of West Africa. This context shapes every technical and product decision:

| Area                | Consideration                                                                 |
|---------------------|-------------------------------------------------------------------------------|
| Offline-first       | Cache data, background sync, defer heavy ops to backend                       |
| Device compatibility| Prioritize Android, mobile-first, avoid heavy JS                              |
| Data sync queues    | Log attendance offline, sync later                                            |

These priorities are reflected in the MVP, technical stack, and roadmap. Features and tasks influenced by these constraints are labeled `africa-priority` and/or `low-bandwidth` in the project board.

---

## ✅ TL;DR

ChMS is a low-resource church management system (ChMS) built for Africa. It starts with attendance and member tracking and grows into a full platform for church operations.

- 🌍 Built for low-connectivity environments in West Africa
- 📱 Mobile-first, offline-capable
- 🆓 Free core

---

## 1. Introduction & Purpose

ChMS (Church Management System) is a solution designed for the needs of African churches. The primary purpose is to provide an easy-to-use, reliable, and accessible system for managing church operations, focusing on scalability, offline-first functionality, and optimization for low-bandwidth environments.

**Target Audience:** Churches in Africa, potentially with limited or intermittent internet connectivity.

**Vision:**
To empower every church in Africa — rural or urban — to manage their members, attendance, and growth using accessible technology. No cost. No complexity. No compromise.

**Goals:**

- **Scalable and Maintainable:** Built with modern best practices to support growth.
- **Offline-First & Low-Bandwidth Optimized:** Core functionality should work reliably with poor connectivity.
- **Accessible and User-Friendly:** Intuitive interface for users with varying technical skills.
- **Well-documented and Testable:** Ensure ease of maintenance and future development.
- **Africa-First:** Prioritize local context, languages, and connectivity realities in core flows.

---

## 2. Features Overview (MVP)

- **Foundation:**
  - Project Setup & Core Components
  - Authentication & Authorization (Role-Based Access Control)
  - Basic Routing
  - Database Setup
- **Core Features:**
  - Organization Management
  - Member Management (including Family Units)
  - Attendance System (QR check-in, search/autocomplete, offline queue)
  - Minimal Reporting (attendance summaries)

---

## 3. User Needs & User Stories (MVP)

| User            | Description |
|-----------------|-------------|
| Church Admin    | Manages church data, attendance, people |
| Group Leader    | Handles events and attendance by role/group |
| Church Member   | Checks in to events, views their own record |
| Low-Tech Church | Needs offline-first, mobile access |

**Example Stories:**
- A church administrator needs to easily add, view, and update member profiles, even when offline.
- A pastor needs to quickly record attendance for a service using a mobile device (QR or search).
- A member is checked in by scanning a QR code or searching their name and confirming sign-in.
- The system must work offline and sync attendance data when connectivity is restored.

---

## 4. Technical Requirements (MVP)

- **Stack:**
  - Frontend: Next.js 15 + Chakra UI
  - Backend/API: Next.js API Routes/Server Actions
  - Database: Supabase (PostgreSQL)
  - ORM: Prisma
  - Auth: NextAuth.js
  - State/Data: SWR, React Hook Form, Zod
- **Performance:** Fast load times (<2s), offline capability, low bandwidth usage.
- **Security:** RBAC, data encryption, input validation, standard web security practices.
- **Testing:** Unit, integration, E2E tests with high coverage (see `pm/testing-strategy.md`).
- **Offline:** SWR cache + background sync (planned), data sync queues for attendance.
- **Device Compatibility:** Mobile-first, Android-priority, avoid heavy JS.

---

## 5. Design & UI/UX (MVP)

- Utilizes Chakra UI component library.
- Responsive design for various screen sizes.
- Accessibility compliance (WCAG).
- Minimalist and intuitive user interface.
- Mobile-first, Africa-first design.

---

## 6. Success Metrics (MVP)

- Number of churches onboarded
- Daily/weekly attendance submissions
- Offline sync success rate
- User satisfaction (surveys)
- System uptime and performance benchmarks

---

## 7. Tradeoffs & Open Questions

| Decision                     | Alternatives |
|-----------------------------|--------------|
| QR check-in for attendance  | Manual search/autocomplete |
| Free core features          | Premium tier, pay-per-feature |
| Donation/ad model           | Paywall or enterprise sales |

**Open Questions:**
- Which offline sync method is most reliable (Service Workers, SWR + local queue)?
- Should we expose public APIs for integration?
- How to optimize for low-end devices?
- [Mark areas needing feedback here]

---

## 8. Roadmap

| Version | Features |
|---------|----------|
| **v0.1** | MVP: attendance (QR/search/autocomplete, offline queue), onboarding, minimal reporting |
| **v0.2** | Dashboards, reminders, offline sync improvements |
| **v1.0** | Member search, analytics, payments, monetization, WhatsApp/USSD fallback, AI/agent onboarding |
| **v2.0+** | Voice input, full CMS, WhatsApp bot, media integration, multi-language support |

---

## 9. Monetization Strategy

- **Always free** for core features (attendance, members, onboarding)
- **Optional ads**, with toggle control
- **Donations** from churches and sponsors
- **Premium tier** for advanced features or branding

---

## 10. Documentation & Collaboration

- PRD maintained in this repo (`pm/prd.md`)
- Collaborative editing via Google Docs/Notion as needed
- Feedback and open questions tracked in this document

---

## 11. Feature-to-Context Mapping (MVP)

| Epic/Feature                | West Africa Consideration(s)         | Label(s)           |
|-----------------------------|--------------------------------------|--------------------|
| Attendance                  | Offline, QR, Lite mode               | africa-priority    |
| Device Compatibility        | Android, low-end, mobile-first       | low-bandwidth      |

---

**Created by:** [Your Name / Org]
**Maintained on:** GitHub Projects (Beta)
**Tools in use:** Notion, Google Docs, Flowise, Supabase
