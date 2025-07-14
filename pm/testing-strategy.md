# Testing Strategy - ChMS MVP

## Overview
This strategy covers only the MVP features:
- Organization management
- Member management
- Attendance (QR code, search/autocomplete, offline queue)
- Minimal reporting

## Approach
- **TDD/BDD hybrid:** All features are developed test-first, with user stories and acceptance criteria tracked in GitHub Projects.
- **Test Coverage:**
  - Unit tests for all components and services
  - Integration tests for feature flows
  - E2E tests for critical user journeys (attendance, member management)
  - Minimum 85% coverage for MVP

## Tools
- Vitest (unit/integration)
- React Testing Library (component tests)
- MSW (API mocking)
- Cypress/Playwright (E2E)

## MVP Test Scenarios
- Organization creation, update, view
- Member add, update, search, view, family link
- Attendance check-in (QR/search), confirmation, offline queue, sync
- Minimal reporting (attendance summary)

## Excluded (Future)
- AI/agent onboarding
- WhatsApp/USSD fallback
- Payments
- Advanced analytics
- Communication features
- Multi-language support
- Media integration

## Notes
- All tests should be written before or alongside feature code
- All features tracked and tested via GitHub Projects
