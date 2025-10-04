# Attendance System - Feature Specification

## Feature Overview
**Feature Name:** Attendance System
**Epic:** Core Features
**Priority:** P0
**Africa-First Considerations:** Offline attendance recording, QR code and manual check-in, works on basic Android devices

## User Stories

### Primary User Stories
- **As a** church greeter, **I want** to record member attendance via QR code scanning **so that** check-in is fast and efficient
- **As a** church greeter, **I want** to search for members manually **so that** I can check in members without QR codes
- **As a** church administrator, **I want** to see attendance reports **so that** I can track church engagement
- **As a** church greeter, **I want** to record attendance offline **so that** check-in works without internet

### Edge Cases and Error Scenarios
- **As a** church greeter, **when** the QR scanner fails **I should** be able to manually enter member information
- **As a** church greeter, **when** I'm offline **I should** still be able to record all attendance
- **As a** church greeter, **when** a member is not found **I should** be able to add them as a visitor

## Functional Requirements

### Core Functionality
1. QR code generation for members
2. QR code scanning for quick check-in
3. Manual member search and check-in
4. Visitor registration and check-in
5. Attendance recording with service/event details
6. Basic attendance reports and statistics

### Offline Behavior
- **When offline:** All attendance operations stored locally in IndexedDB
- **When coming online:** Attendance data syncs to Supabase automatically
- **Conflict resolution:** Merge attendance records, avoid duplicates by timestamp

### Mobile Considerations
- **Touch interactions:** Large check-in buttons, easy QR code scanning
- **Screen sizes:** Optimized for mobile devices, portrait orientation
- **Performance:** Fast QR scanning, instant feedback on check-in

## Technical Requirements

### API Endpoints
- `GET /api/services` - List available services/events
- `POST /api/attendance` - Record attendance
- `GET /api/attendance` - Get attendance records with filters
- `GET /api/members/{id}/qr` - Generate member QR code
- `POST /api/attendance/checkin` - Check in member (QR or manual)
- `GET /api/attendance/reports` - Get attendance reports

### Database Schema
```sql
CREATE TABLE services (
    id BIGINT PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    service_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    service_type ENUM('sunday_service', 'midweek', 'special_event') DEFAULT 'sunday_service',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    INDEX idx_services_date (service_date),
    INDEX idx_services_org (organization_id)
);

CREATE TABLE attendance_records (
    id BIGINT PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    member_id BIGINT,
    visitor_name VARCHAR(255),
    visitor_phone VARCHAR(50),
    check_in_time TIMESTAMP NOT NULL,
    check_in_method ENUM('qr_code', 'manual_search', 'visitor') NOT NULL,
    checked_in_by BIGINT, -- staff member who recorded attendance
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (checked_in_by) REFERENCES members(id),
    INDEX idx_attendance_service (service_id),
    INDEX idx_attendance_member (member_id),
    INDEX idx_attendance_date (check_in_time)
);

CREATE TABLE member_qr_codes (
    id BIGINT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    qr_code_data VARCHAR(255) NOT NULL UNIQUE,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (member_id) REFERENCES members(id),
    INDEX idx_qr_codes_data (qr_code_data)
);
```

### Frontend Components
- `AttendanceScanner.vue` - QR code scanner component
- `MemberCheckIn.vue` - Manual member search and check-in
- `VisitorCheckIn.vue` - Visitor registration and check-in
- `AttendanceDashboard.vue` - Current service attendance overview
- `AttendanceReports.vue` - Basic attendance reports
- `ServiceSelector.vue` - Select current service for attendance

## User Experience Design

### User Flow
1. Greeter opens attendance system
2. Selects current service/event
3. Chooses check-in method (QR scan or manual)
4. For QR: Scans member QR code, confirms check-in
5. For manual: Searches member name, selects member, confirms check-in
6. For visitor: Enters visitor details, records attendance
7. System provides immediate feedback on successful check-in

### UI Requirements
- **Layout:** Large buttons for check-in methods, clear service indicator
- **Interactions:** One-tap check-in, visual feedback on success
- **Feedback:** Sound/vibration on successful scan, visual confirmation
- **Accessibility:** High contrast for outdoor use, voice feedback options

## Acceptance Criteria

### Functional Acceptance
- [ ] QR code scanning works reliably in various lighting conditions
- [ ] Manual search finds members with partial name matches
- [ ] Visitor check-in captures essential information
- [ ] All attendance records are saved offline
- [ ] Attendance syncs automatically when online
- [ ] Basic reports show attendance statistics

### Technical Acceptance
- [ ] Works completely offline (all check-in functionality)
- [ ] QR scanning works on Android camera
- [ ] Search responds in < 0.5 seconds
- [ ] Syncs attendance data when connection available
- [ ] Works on Android devices (tested on mid-range phones)
- [ ] Has 90%+ test coverage

### Africa-First Acceptance
- [ ] Functions without internet connection
- [ ] QR scanning works in bright sunlight (outdoor services)
- [ ] Fast check-in process (< 5 seconds per person)
- [ ] Works reliably on Android 8+ devices
- [ ] Minimal data usage for sync operations

## Testing Strategy

### Unit Tests
- Test QR code generation and validation
- Test attendance record creation
- Test search functionality
- Test offline storage operations

### Integration Tests
- Test attendance API endpoints
- Test QR code scanning integration
- Test data synchronization
- Test report generation

### E2E Tests
- Test complete check-in workflow (QR and manual)
- Test offline attendance recording and sync
- Test visitor registration process
- Test attendance reporting

## Dependencies and Risks

### Dependencies
- Member management system must be operational
- Camera access for QR code scanning
- Service/event management setup
- Offline storage capabilities

### Risks and Mitigation
- **Risk:** QR scanning fails in poor lighting
  **Mitigation:** Provide manual fallback, optimize scanner settings
- **Risk:** Large attendance lists slow down mobile performance
  **Mitigation:** Implement pagination and efficient search indexing

## Performance Considerations

### Metrics to Track
- QR scan success rate and speed
- Member search response time
- Check-in completion time
- Sync operation duration

### Optimization Strategies
- Pre-load member data for fast search
- Optimize QR scanner for mobile cameras
- Batch attendance sync operations
- Cache frequently checked-in members

## Security Considerations

### Authentication/Authorization
- Only authorized greeters can record attendance
- QR codes have expiration dates
- Attendance data is organization-specific

### Data Protection
- QR codes don't contain sensitive information
- Attendance data is encrypted in transit
- Visitor information is handled according to privacy policy

## Rollout Plan

### Development Phases
1. **Phase 1:** Basic manual check-in functionality
2. **Phase 2:** QR code generation and scanning
3. **Phase 3:** Visitor registration system
4. **Phase 4:** Offline sync and reporting

### Testing Phases
1. **Unit/Integration Testing**
2. **Mobile Camera Testing (QR scanning)**
3. **Field Testing During Actual Services**
4. **Performance Testing with Large Attendance**

### Deployment Strategy
- Pilot with small group of greeters
- Gradual rollout to all services
- Monitor attendance data accuracy

## Success Metrics

### Quantitative Metrics
- Check-in success rate > 98%
- Average check-in time < 5 seconds
- QR scan success rate > 95%
- Offline sync success rate > 99%

### Qualitative Metrics
- Greeter satisfaction with check-in process
- Reduction in service start delays
- Accuracy of attendance records

## Future Enhancements

### Potential Improvements
- Self-service check-in kiosks
- Family group check-in
- Integration with member communication
- Advanced attendance analytics
- Check-out functionality for events

### Technical Debt
- Consider more sophisticated QR code security
- Add attendance prediction and insights
- Optimize for very large congregations (1000+ attendees)
