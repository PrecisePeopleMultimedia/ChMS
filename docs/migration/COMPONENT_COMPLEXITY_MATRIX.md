# Component Complexity Matrix & Migration Priority

**Created**: 2025-11-13  
**Purpose**: Categorize all components for migration prioritization  
**Status**: In Progress

---

## Component Categorization

### Complexity Levels

- **Simple**: Basic UI components with minimal logic (4-6 hours each)
- **Moderate**: Feature components with some business logic (8-12 hours each)
- **Complex**: Interactive components with complex state management (16-24 hours each)

---

## Component Inventory

### UI Components (Simple)

| Component | Location | Complexity | User Impact | Usage Frequency | Migration Priority | Estimated Hours |
|-----------|----------|------------|------------|----------------|-------------------|----------------|
| ModernButton | `components/ui/ModernButton.vue` | Simple | High | Daily | **P0** | 4-6 |
| ModernInput | `components/ui/ModernInput.vue` | Simple | High | Daily | **P0** | 4-6 |
| ModernAlert | `components/ui/ModernAlert.vue` | Simple | Medium | Daily | **P0** | 4-6 |
| ModernSpinner | `components/ui/ModernSpinner.vue` | Simple | Medium | Daily | **P0** | 4-6 |
| ThemeToggle | `components/ui/ThemeToggle.vue` | Simple | Low | Weekly | P1 | 4-6 |
| AccessibleButton | `components/accessibility/AccessibleButton.vue` | Simple | Medium | Daily | **P0** | 4-6 |
| AccessibleInput | `components/accessibility/AccessibleInput.vue` | Simple | Medium | Daily | **P0** | 4-6 |
| SkipLinks | `components/accessibility/SkipLinks.vue` | Simple | Low | Daily | P1 | 4-6 |
| BaseFormCard | `components/common/BaseFormCard.vue` | Simple | High | Daily | **P0** | 4-6 |

**Total UI Components**: 9  
**Total Estimated Hours**: 36-54 hours

---

### Layout Components (Moderate to Complex)

| Component | Location | Complexity | User Impact | Usage Frequency | Migration Priority | Estimated Hours |
|-----------|----------|------------|------------|----------------|-------------------|----------------|
| DashboardLayout | `layouts/DashboardLayout.vue` | Complex | High | Daily | **P0** | 16-24 |
| AuthLayout | `layouts/AuthLayout.vue` | Moderate | High | Daily | **P0** | 8-12 |
| AccessibleDashboardLayout | `layouts/AccessibleDashboardLayout.vue` | Complex | High | Daily | **P0** | 16-24 |
| LandingLayout | `layouts/LandingLayout.vue` | Moderate | Low | Monthly | P2 | 8-12 |
| QuasarPrimeLayout | `layouts/QuasarPrimeLayout.vue` | Complex | High | Daily | **P0** | 16-24 |
| QuasarPrimeHeader | `components/layout/QuasarPrimeHeader.vue` | Moderate | High | Daily | **P0** | 8-12 |
| QuasarPrimeSidebar | `components/layout/QuasarPrimeSidebar.vue` | Complex | High | Daily | **P0** | 16-24 |

**Total Layout Components**: 7  
**Total Estimated Hours**: 88-120 hours

---

### Authentication Components (Moderate)

| Component | Location | Complexity | User Impact | Usage Frequency | Migration Priority | Estimated Hours |
|-----------|----------|------------|------------|----------------|-------------------|----------------|
| LoginForm | `components/auth/LoginForm.vue` | Moderate | High | Daily | **P0** | 8-12 |

**Total Auth Components**: 1  
**Total Estimated Hours**: 8-12 hours

---

### Dashboard Components (Moderate to Complex)

| Component | Location | Complexity | User Impact | Usage Frequency | Migration Priority | Estimated Hours |
|-----------|----------|------------|------------|----------------|-------------------|----------------|
| DashboardGrid | `components/dashboard/DashboardGrid.vue` | Complex | High | Daily | **P0** | 16-24 |
| DashboardWidget | `components/dashboard/DashboardWidget.vue` | Moderate | High | Daily | **P0** | 8-12 |
| AttendanceOverviewCard | `components/dashboard/AttendanceOverviewCard.vue` | Moderate | High | Daily | **P0** | 8-12 |
| MemberStatsCard | `components/dashboard/MemberStatsCard.vue` | Moderate | High | Daily | **P0** | 8-12 |
| QuickActionsPanel | `components/dashboard/QuickActionsPanel.vue` | Moderate | High | Daily | **P0** | 8-12 |
| RecentActivitiesCard | `components/dashboard/RecentActivitiesCard.vue` | Moderate | Medium | Daily | **P0** | 8-12 |
| SystemStatusCard | `components/dashboard/SystemStatusCard.vue` | Moderate | Medium | Daily | P1 | 8-12 |
| WidgetConfigPanel | `components/dashboard/WidgetConfigPanel.vue` | Complex | Medium | Weekly | P1 | 16-24 |
| WidgetLibrary | `components/dashboard/WidgetLibrary.vue` | Complex | Medium | Weekly | P1 | 16-24 |
| WidgetLibraryCard | `components/dashboard/WidgetLibraryCard.vue` | Moderate | Medium | Weekly | P1 | 8-12 |
| WidgetPreview | `components/dashboard/WidgetPreview.vue` | Moderate | Medium | Weekly | P1 | 8-12 |
| MemberCountWidget | `components/dashboard/widgets/MemberCountWidget.vue` | Moderate | High | Daily | **P0** | 8-12 |
| QuickMemberAddWidget | `components/dashboard/widgets/QuickMemberAddWidget.vue` | Moderate | High | Daily | **P0** | 8-12 |
| DefaultPreview | `components/dashboard/widgets/previews/DefaultPreview.vue` | Simple | Low | Weekly | P2 | 4-6 |

**Total Dashboard Components**: 14  
**Total Estimated Hours**: 140-198 hours

---

### Member Management Components (Moderate to Complex)

| Component | Location | Complexity | User Impact | Usage Frequency | Migration Priority | Estimated Hours |
|-----------|----------|------------|------------|----------------|-------------------|----------------|
| MemberAttributesPanel | `components/members/MemberAttributesPanel.vue` | Moderate | High | Daily | **P0** | 8-12 |
| MemberBadges | `components/members/MemberBadges.vue` | Moderate | Medium | Daily | **P0** | 8-12 |
| MemberNotes | `components/members/MemberNotes.vue` | Moderate | Medium | Daily | **P0** | 8-12 |
| AttributeManager | `components/members/AttributeManager.vue` | Complex | Medium | Weekly | P1 | 16-24 |
| BadgeManager | `components/members/BadgeManager.vue` | Complex | Medium | Weekly | P1 | 16-24 |
| AttributeFormDialog | `components/members/AttributeFormDialog.vue` | Moderate | Medium | Weekly | P1 | 8-12 |
| AttributeValueInput | `components/members/AttributeValueInput.vue` | Simple | Medium | Weekly | P1 | 4-6 |
| BadgeDisplay | `components/members/BadgeDisplay.vue` | Simple | Medium | Daily | **P0** | 4-6 |
| BadgeTypeFormDialog | `components/members/BadgeTypeFormDialog.vue` | Moderate | Low | Monthly | P2 | 8-12 |
| MemberBadgeAssignDialog | `components/members/MemberBadgeAssignDialog.vue` | Moderate | Medium | Weekly | P1 | 8-12 |
| MemberBadgeEditDialog | `components/members/MemberBadgeEditDialog.vue` | Moderate | Low | Monthly | P2 | 8-12 |
| NoteCard | `components/members/NoteCard.vue` | Simple | Medium | Daily | **P0** | 4-6 |
| NoteDialog | `components/members/NoteDialog.vue` | Moderate | Medium | Daily | **P0** | 8-12 |

**Total Member Components**: 13  
**Total Estimated Hours**: 108-156 hours

---

### Attendance Components (Moderate to Complex)

| Component | Location | Complexity | User Impact | Usage Frequency | Migration Priority | Estimated Hours |
|-----------|----------|------------|------------|----------------|-------------------|----------------|
| AttendanceDashboard | `components/attendance/AttendanceDashboard.vue` | Complex | High | Daily | **P0** | 16-24 |
| FamilyCheckIn | `components/attendance/FamilyCheckIn.vue` | Complex | High | Daily | **P0** | 16-24 |
| ManualCheckIn | `components/attendance/ManualCheckIn.vue` | Moderate | High | Daily | **P0** | 8-12 |
| QRScanner | `components/attendance/QRScanner.vue` | Complex | High | Daily | **P0** | 16-24 |
| ServiceSelector | `components/attendance/ServiceSelector.vue` | Moderate | High | Daily | **P0** | 8-12 |
| MemberQrCodeDisplay | `components/attendance/MemberQrCodeDisplay.vue` | Moderate | Medium | Weekly | P1 | 8-12 |

**Total Attendance Components**: 6  
**Total Estimated Hours**: 72-108 hours

---

### Family Components (Moderate to Complex)

| Component | Location | Complexity | User Impact | Usage Frequency | Migration Priority | Estimated Hours |
|-----------|----------|------------|------------|----------------|-------------------|----------------|
| FamilyTree | `components/family/FamilyTree.vue` | Complex | Medium | Weekly | P1 | 16-24 |
| RelationshipMapper | `components/family/RelationshipMapper.vue` | Complex | Medium | Weekly | P1 | 16-24 |
| HouseholdFamilyDistinction | `components/family/HouseholdFamilyDistinction.vue` | Moderate | Medium | Weekly | P1 | 8-12 |
| HouseholdManager | `components/family/HouseholdManager.vue` | Moderate | Medium | Weekly | P1 | 8-12 |
| ComplexRelationshipManager | `components/family/ComplexRelationshipManager.vue` | Complex | Low | Monthly | P2 | 16-24 |
| CustodyManager | `components/family/CustodyManager.vue` | Complex | Low | Monthly | P2 | 16-24 |

**Total Family Components**: 6  
**Total Estimated Hours**: 80-120 hours

---

### Organization Components (Moderate)

| Component | Location | Complexity | User Impact | Usage Frequency | Migration Priority | Estimated Hours |
|-----------|----------|------------|------------|----------------|-------------------|----------------|
| OrganizationSetup | `components/organization/OrganizationSetup.vue` | Moderate | High | Weekly | **P0** | 8-12 |
| ChurchProfileForm | `components/organization/ChurchProfileForm.vue` | Moderate | Medium | Weekly | P1 | 8-12 |
| ServiceScheduleForm | `components/organization/ServiceScheduleForm.vue` | Moderate | Medium | Weekly | P1 | 8-12 |
| SettingsForm | `components/organization/SettingsForm.vue` | Moderate | Medium | Weekly | P1 | 8-12 |

**Total Organization Components**: 4  
**Total Estimated Hours**: 32-48 hours

---

### View Components (Moderate to Complex)

| Component | Location | Complexity | User Impact | Usage Frequency | Migration Priority | Estimated Hours |
|-----------|----------|------------|------------|----------------|-------------------|----------------|
| DashboardView | `views/DashboardView.vue` | Complex | High | Daily | **P0** | 16-24 |
| MemberListView | `views/MemberListView.vue` | Complex | High | Daily | **P0** | 16-24 |
| MemberDetailView | `views/MemberDetailView.vue` | Complex | High | Daily | **P0** | 16-24 |
| MemberFormView | `views/MemberFormView.vue` | Moderate | High | Daily | **P0** | 8-12 |
| AttendanceCheckInView | `views/AttendanceCheckInView.vue` | Complex | High | Daily | **P0** | 16-24 |
| AttendanceReportsView | `views/AttendanceReportsView.vue` | Moderate | Medium | Weekly | P1 | 8-12 |
| LoginView | `views/LoginView.vue` | Moderate | High | Daily | **P0** | 8-12 |
| RegisterView | `views/RegisterView.vue` | Moderate | Low | Monthly | P1 | 8-12 |
| ForgotPasswordView | `views/ForgotPasswordView.vue` | Moderate | Low | Monthly | P2 | 8-12 |
| ResetPasswordView | `views/ResetPasswordView.vue` | Moderate | Low | Monthly | P2 | 8-12 |
| ProfileView | `views/ProfileView.vue` | Moderate | Medium | Weekly | P1 | 8-12 |
| OrganizationSetupView | `views/OrganizationSetupView.vue` | Moderate | Medium | Weekly | P1 | 8-12 |
| QuasarPrimeDashboard | `views/QuasarPrimeDashboard.vue` | Complex | High | Daily | **P0** | 16-24 |
| NotFoundView | `views/NotFoundView.vue` | Simple | Low | Monthly | P2 | 4-6 |

**Total View Components**: 14  
**Total Estimated Hours**: 152-210 hours

---

### Supporting Components (Simple to Moderate)

| Component | Location | Complexity | User Impact | Usage Frequency | Migration Priority | Estimated Hours |
|-----------|----------|------------|------------|----------------|-------------------|----------------|
| CardCharts | `components/cards/CardCharts.vue` | Moderate | Medium | Daily | **P0** | 8-12 |
| CardSocial | `components/cards/CardSocial.vue` | Simple | Low | Monthly | P2 | 4-6 |
| CardTimeLine | `components/cards/CardTimeLine.vue` | Moderate | Low | Monthly | P2 | 8-12 |
| CardWithImage | `components/cards/CardWithImage.vue` | Simple | Low | Monthly | P2 | 4-6 |
| Messages | `components/Messages.vue` | Moderate | Medium | Daily | **P0** | 8-12 |
| MonitoringDashboard | `components/monitoring/MonitoringDashboard.vue` | Complex | Low | Monthly | P2 | 16-24 |
| TableVisits | `components/tables/TableVisits.vue` | Moderate | Medium | Weekly | P1 | 8-12 |
| TabSocial | `components/tabs/TabSocial.vue` | Simple | Low | Monthly | P2 | 4-6 |
| TodoList | `components/list/TodoList.vue` | Moderate | Low | Monthly | P2 | 8-12 |
| ThemeSwitcher | `components/theme/ThemeSwitcher.vue` | Simple | Low | Weekly | P1 | 4-6 |
| InstallPrompt | `components/pwa/InstallPrompt.vue` | Moderate | Low | Monthly | P2 | 8-12 |
| OfflineIndicator | `components/pwa/OfflineIndicator.vue` | Simple | Medium | Daily | **P0** | 4-6 |
| PWAStatus | `components/pwa/PWAStatus.vue` | Moderate | Low | Monthly | P2 | 8-12 |

**Total Supporting Components**: 13  
**Total Estimated Hours**: 88-132 hours

---

## Summary Statistics

### By Complexity
- **Simple**: 15 components (36-90 hours)
- **Moderate**: 42 components (336-504 hours)
- **Complex**: 19 components (304-456 hours)

### By User Impact
- **High Impact**: 32 components
- **Medium Impact**: 30 components
- **Low Impact**: 14 components

### By Usage Frequency
- **Daily**: 35 components
- **Weekly**: 25 components
- **Monthly**: 16 components

### By Migration Priority
- **P0 (Critical)**: 35 components
- **P1 (High)**: 20 components
- **P2 (Medium/Low)**: 21 components

---

## Total Component Count

**Grand Total**: 76 components  
**Total Estimated Hours**: 676-1,050 hours

---

## Migration Priority Matrix

### Priority 0 (Critical - Migrate First)
**Criteria**: High Impact + High Frequency (Daily) OR Critical Infrastructure

**Components** (35 total):
1. Layout Components (7)
2. Core UI Components (9)
3. Dashboard Components (8)
4. Member Management Core (6)
5. Attendance Core (5)

**Estimated Hours**: 340-510 hours

### Priority 1 (High - Migrate Second)
**Criteria**: High Impact + Medium Frequency OR Medium Impact + High Frequency

**Components** (20 total):
1. Dashboard Widgets (4)
2. Member Management Advanced (6)
3. Attendance Advanced (1)
4. Organization (3)
5. Views (3)
6. Supporting (3)

**Estimated Hours**: 160-240 hours

### Priority 2 (Medium/Low - Migrate Last)
**Criteria**: Medium Impact + Low Frequency OR Low Impact + Any Frequency

**Components** (21 total):
1. Family Advanced (2)
2. Supporting Cards (4)
3. PWA Components (2)
4. Low-usage Views (3)
5. Other Supporting (10)

**Estimated Hours**: 176-300 hours

---

## Component Dependencies

### Critical Dependencies (Must Migrate First)
1. **Layout System** → All views depend on this
   - Components: DashboardLayout, AuthLayout, AccessibleDashboardLayout, QuasarPrimeLayout
   - Dependencies: None (foundation)
   - Migration Order: **First**

2. **Core UI Components** → All feature components depend on these
   - Components: ModernButton, ModernInput, ModernAlert, ModernSpinner, BaseFormCard
   - Dependencies: None (foundation)
   - Migration Order: **Second** (after layout)

3. **BaseFormCard** → All forms depend on this
   - Components: LoginForm, MemberFormView, OrganizationSetup
   - Dependencies: Core UI Components
   - Migration Order: **Second** (with Core UI)

### Feature Dependencies

1. **Dashboard Components** → Depend on Layout + Core UI
   - Components: DashboardGrid, DashboardWidget, AttendanceOverviewCard, etc.
   - Store Dependencies: `useDashboardStore`, `useMembersStore`, `useAttendanceStore`
   - Migration Order: **Third** (after Layout + Core UI)

2. **Member Components** → Depend on Layout + Core UI + Dashboard
   - Components: MemberAttributesPanel, MemberBadges, MemberNotes, etc.
   - Store Dependencies: `useMembersStore`, `useAttributesStore`, `useBadgesStore`
   - Migration Order: **Fourth** (after Dashboard)

3. **Attendance Components** → Depend on Layout + Core UI + Member components
   - Components: AttendanceDashboard, FamilyCheckIn, QRScanner, etc.
   - Store Dependencies: `useAttendanceStore`, `useMembersStore`, `useServicesStore`
   - Migration Order: **Fifth** (after Member components)

4. **Family Components** → Depend on Layout + Core UI + Member components
   - Components: FamilyTree, RelationshipMapper, HouseholdManager, etc.
   - Store Dependencies: `useFamiliesStore`, `useMembersStore`, `useRelationshipsStore`
   - Migration Order: **Sixth** (after Member components)

5. **Organization Components** → Depend on Layout + Core UI
   - Components: OrganizationSetup, ChurchProfileForm, ServiceScheduleForm
   - Store Dependencies: `useOrganizationStore`
   - Migration Order: **Third** (can be parallel with Dashboard)

### Store Dependencies (PRESERVE - No Changes)

**Pinia Stores to Keep (Functional Foundation)**:
- `stores/auth.ts` - Authentication state
- `stores/organization.ts` - Organization data
- `stores/members.ts` - Member data
- `stores/attendance.ts` - Attendance data
- `stores/dashboard.ts` - Dashboard stats
- `stores/families.ts` - Family relationships
- `stores/relationships.ts` - Relationship management
- `stores/services.ts` - Service schedules
- `stores/attributes.ts` - Member attributes
- `stores/badges.ts` - Badge management

**Store Usage Pattern**:
- All components use stores via `use*Store()` composable pattern
- Store structure and logic remain unchanged
- Only component UI/styling changes during migration

---

## Next Steps

1. ✅ Component inventory complete
2. ⏳ Review and validate complexity estimates
3. ⏳ Document component dependencies in detail
4. ⏳ Create migration dependency graph
5. ⏳ Finalize migration order

---

**Last Updated**: 2025-11-13  
**Status**: Initial Inventory Complete - Ready for Review

