# Attendance System - Feature Specification (Enhanced Multi-Service Support)

## Feature Overview
**Feature Name:** Enhanced Attendance System with Multi-Service Support
**Epic:** Core Features
**Priority:** P0 (CRITICAL - Complete attendance management)
**Implementation Phase:** MVP (Phase 1) + Post-MVP Enhancements (Phase 2)
**Africa-First Considerations:** Offline attendance recording, QR code and manual check-in, works on basic Android devices, family check-in support
**Enhanced Features:** Multi-service support, family check-in, child ministry assignment, location-specific tracking, advanced analytics

## 🚀 **MVP vs POST-MVP FEATURE BREAKDOWN**

### **MVP FEATURES (Phase 1: Weeks 3-4) - CRITICAL FOR LAUNCH**
1. **Multi-Service Attendance** - Support multiple services per day (morning, evening, midweek)
2. **Family Check-In** - Check in entire families with children's ministry assignment
3. **Enhanced QR Code System** - Service-specific QR codes with family linking
4. **Location-Specific Tracking** - Track attendance by specific locations within church
5. **Offline-First Architecture** - Complete functionality without internet connection

### **POST-MVP FEATURES (Phase 2: Weeks 9-16) - COMPETITIVE ADVANTAGES**
1. **Advanced Analytics Dashboard** - Attendance trends, engagement patterns, growth metrics
2. **Automated Follow-Up System** - Identify and follow up with absent members
3. **Child Check-In Security** - Secure child pickup with parent verification
4. **Visitor Journey Integration** - Link attendance to member journey tracking
5. **Multi-Location Support** - Attendance across multiple church campuses

## User Stories

### **MVP USER STORIES (Phase 1: Critical for Launch)**

#### **Multi-Service Attendance (MVP)**
- **As a** church administrator, **I want** to set up multiple services per day **so that** I can track attendance for morning, evening, and midweek services
- **As a** church greeter, **I want** to select the specific service during check-in **so that** attendance is recorded accurately
- **As a** pastor, **I want** service-specific attendance reports **so that** I can understand engagement patterns across different services

#### **Family Check-In (MVP)**
- **As a** church greeter, **I want** to check in entire families at once **so that** the process is efficient for families with multiple children
- **As a** children's ministry coordinator, **I want** automatic child ministry assignment **so that** children are directed to age-appropriate classes
- **As a** parent, **I want** secure child check-in with pickup verification **so that** I know my children are safe

#### **Enhanced QR Code System (MVP)**
- **As a** church member, **I want** service-specific QR codes **so that** I can quickly check in to the correct service
- **As a** family head, **I want** family QR codes **so that** I can check in my entire family with one scan
- **As a** church greeter, **I want** QR codes to work offline **so that** check-in continues even without internet

#### **Location-Specific Tracking (MVP)**
- **As a** church administrator, **I want** to track attendance by location **so that** I can manage capacity and resources
- **As a** usher, **I want** to record which section/area members sit in **so that** we can optimize seating and follow-up
- **As a** safety coordinator, **I want** location-based attendance **so that** I can manage emergency procedures

### **POST-MVP USER STORIES (Phase 2: Competitive Advantages)**

#### **Advanced Analytics (Post-MVP)**
- **As a** pastor, **I want** attendance trend analysis **so that** I can identify growth patterns and seasonal changes
- **As a** church leadership, **I want** engagement scoring **so that** I can identify members who may need additional care
- **As a** church planner, **I want** predictive attendance modeling **so that** I can plan resources and capacity

#### **Automated Follow-Up (Post-MVP)**
- **As a** pastoral care coordinator, **I want** automated absent member alerts **so that** I can follow up with members who haven't attended recently
- **As a** small group leader, **I want** attendance-based follow-up suggestions **so that** I can reach out to members effectively
- **As a** church administrator, **I want** visitor follow-up automation **so that** no first-time visitors are missed

## Functional Requirements

### **MVP FUNCTIONAL REQUIREMENTS (Phase 1: Weeks 3-4)**

#### **1. Multi-Service Attendance System (MVP - Critical)**
- **Service Management**
  - Create and manage multiple services per day (Morning, Evening, Midweek)
  - Service-specific settings (time, location, capacity, ministry assignments)
  - Recurring service schedules with automatic creation
- **Service-Specific Check-In**
  - Service selection during check-in process
  - Service-specific QR codes for members
  - Automatic service detection based on time and location
- **Cross-Service Analytics**
  - Attendance comparison across services
  - Member engagement patterns by service type
  - Service performance metrics and trends

#### **2. Family Check-In System (MVP - Critical)**
```php
// Laravel Service Implementation
class FamilyAttendanceService {
    public function checkInFamily($familyId, $serviceId, $memberIds) {
        // Check in entire family with children's ministry assignment
        foreach ($memberIds as $memberId) {
            $member = Member::find($memberId);
            $ministryAssignment = $this->assignChildMinistry($member, $serviceId);

            $this->recordAttendance($memberId, $serviceId, [
                'family_checkin' => true,
                'ministry_assignment' => $ministryAssignment,
                'checkin_time' => now(),
                'location' => $this->determineLocation($member, $serviceId)
            ]);
        }

        return $this->generateFamilyCheckinReceipt($familyId, $serviceId);
    }
}
```

- **Family Unit Check-In**
  - Single-scan family check-in with all members
  - Family-specific QR codes linking all members
  - Automatic child ministry assignment based on age/grade
- **Children's Ministry Integration**
  - Age-appropriate class assignment
  - Child security tags and parent pickup verification
  - Special needs and allergy tracking
- **Family Attendance Tracking**
  - Family attendance patterns and trends
  - Parent-child attendance correlation
  - Family engagement scoring

#### **3. Enhanced QR Code System (MVP - Enhanced)**
- **Dynamic QR Code Generation**
  - Service-specific QR codes with embedded service information
  - Family QR codes for group check-in
  - Temporary visitor QR codes for quick registration
- **Offline QR Processing**
  - Local QR code validation and processing
  - Offline attendance recording with sync capability
  - QR code backup systems for network failures
- **Security Features**
  - Encrypted QR codes with timestamp validation
  - QR code expiration for security
  - Anti-fraud measures and duplicate detection

#### **4. Location-Specific Attendance (MVP - Enhanced)**
- **Multi-Location Support**
  - Track attendance by building, room, or section
  - Location-based capacity management
  - Location-specific reporting and analytics
- **Seating and Area Management**
  - Section-based attendance tracking
  - Capacity monitoring and overflow management
  - Location-based follow-up and contact tracing
- **Resource Optimization**
  - Location utilization analytics
  - Resource allocation based on attendance patterns
  - Space planning and optimization insights

### **POST-MVP FUNCTIONAL REQUIREMENTS (Phase 2: Weeks 9-16)**

#### **5. Advanced Analytics Dashboard (Post-MVP)**
- **Attendance Trend Analysis**
  - Growth patterns and seasonal variations
  - Service comparison and optimization insights
  - Member engagement lifecycle analysis
- **Predictive Analytics**
  - Attendance forecasting for resource planning
  - Member retention risk based on attendance patterns
  - Optimal service timing and frequency recommendations

#### **6. Automated Follow-Up System (Post-MVP)**
- **Absent Member Detection**
  - Automated identification of members with declining attendance
  - Customizable absence thresholds and alerts
  - Integration with member journey tracking
- **Follow-Up Workflow Automation**
  - Automated follow-up task creation
  - Staff assignment based on member relationships
  - Follow-up effectiveness tracking and optimization

### Offline Behavior
- **When offline:** All attendance operations stored locally in IndexedDB
- **When coming online:** Attendance data syncs to Supabase automatically
- **Conflict resolution:** Merge attendance records, avoid duplicates by timestamp

### Mobile Considerations
- **Touch interactions:** Large check-in buttons, easy QR code scanning
- **Screen sizes:** Optimized for mobile devices, portrait orientation
- **Performance:** Fast QR scanning, instant feedback on check-in

## Technical Requirements

### **MVP API ENDPOINTS (Phase 1: Critical Implementation)**

#### **Multi-Service Attendance Endpoints (MVP)**
```php
// Enhanced Service Management
class AttendanceService {
    public function recordFamilyAttendance($familyId, $serviceId) {
        // Handle family check-in with children's ministry assignment
        $family = Family::with('members')->find($familyId);
        $service = Service::find($serviceId);

        foreach ($family->members as $member) {
            $ministryAssignment = $this->assignMinistry($member, $service);
            $location = $this->determineOptimalLocation($member, $service);

            Attendance::create([
                'member_id' => $member->id,
                'service_id' => $serviceId,
                'family_id' => $familyId,
                'ministry_assignment' => $ministryAssignment,
                'location' => $location,
                'checkin_method' => 'family_qr',
                'checked_in_at' => now()
            ]);
        }

        return $this->generateFamilyReceipt($familyId, $serviceId);
    }
}
```

- `GET /api/services` - List services with multi-service support and scheduling
- `POST /api/services` - Create new service with ministry assignments
- `GET /api/services/{id}/attendance` - Get service-specific attendance with analytics
- `POST /api/attendance/family-checkin` - Family check-in with children's ministry assignment
- `GET /api/attendance/family/{familyId}` - Family attendance history and patterns

#### **Enhanced QR Code Endpoints (MVP)**
- `GET /api/members/{id}/qr/{serviceId}` - Generate service-specific member QR code
- `GET /api/families/{id}/qr/{serviceId}` - Generate family QR code for group check-in
- `POST /api/attendance/qr-checkin` - Process QR code check-in with validation
- `GET /api/qr/validate/{qrCode}` - Validate QR code and return member/family info

#### **Location-Specific Attendance Endpoints (MVP)**
- `GET /api/locations` - List church locations and sections
- `POST /api/attendance/location-checkin` - Check in with specific location assignment
- `GET /api/attendance/location/{locationId}` - Location-specific attendance analytics
- `GET /api/locations/{id}/capacity` - Real-time location capacity and availability

### **MVP DATABASE SCHEMA (Phase 1: Critical Tables)**

#### **Enhanced Services Table (MVP)**
```sql
-- Multi-service support with ministry assignments
CREATE TABLE services (
    id BIGINT PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    service_type ENUM('sunday_morning', 'sunday_evening', 'midweek', 'special_event') NOT NULL,
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location_id BIGINT NULL,
    capacity INTEGER DEFAULT 0,

    -- Ministry assignments
    ministry_assignments JSON, -- Age-based ministry assignments
    special_requirements JSON, -- Special needs, security requirements

    -- Service configuration
    allow_family_checkin BOOLEAN DEFAULT TRUE,
    require_location_assignment BOOLEAN DEFAULT FALSE,
    enable_child_security BOOLEAN DEFAULT TRUE,

    -- Status and metadata
    status ENUM('scheduled', 'active', 'completed', 'cancelled') DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (location_id) REFERENCES church_locations(id),

    INDEX idx_services_org (organization_id),
    INDEX idx_services_date (scheduled_date),
    INDEX idx_services_type (service_type),
    INDEX idx_services_status (status)
);

-- Enhanced attendance table with family and location support
CREATE TABLE attendance (
    id BIGINT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    family_id BIGINT NULL, -- For family check-ins

    -- Check-in details
    checked_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checked_out_at TIMESTAMP NULL,
    checkin_method ENUM('qr_individual', 'qr_family', 'manual_search', 'visitor_registration') NOT NULL,

    -- Location and ministry assignment
    location_assignment VARCHAR(255) NULL, -- Specific room/section
    ministry_assignment VARCHAR(255) NULL, -- Children's ministry, adult service, etc.
    seat_section VARCHAR(100) NULL,

    -- Family and child-specific fields
    is_family_checkin BOOLEAN DEFAULT FALSE,
    parent_id BIGINT NULL, -- For children, reference to parent
    child_security_code VARCHAR(20) NULL, -- For secure child pickup
    special_needs_notes TEXT NULL,

    -- Metadata
    device_info JSON NULL, -- Check-in device information
    offline_sync BOOLEAN DEFAULT FALSE, -- Was this synced from offline?
    notes TEXT NULL,

    -- Staff tracking
    checked_in_by BIGINT NOT NULL, -- Staff member who processed check-in

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_id) REFERENCES members(id) ON DELETE SET NULL,
    FOREIGN KEY (checked_in_by) REFERENCES users(id),

    -- Prevent duplicate check-ins
    UNIQUE KEY unique_member_service (member_id, service_id),

    INDEX idx_attendance_member (member_id),
    INDEX idx_attendance_service (service_id),
    INDEX idx_attendance_family (family_id),
    INDEX idx_attendance_date (checked_in_at),
    INDEX idx_attendance_method (checkin_method),
    INDEX idx_attendance_location (location_assignment)
);
```

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
5. **Phase 5:** Basic reporting and export functionality

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

## Basic Reporting and Export

### Reporting Features
- **Attendance Summary**: Daily, weekly, monthly attendance reports
- **Member Attendance**: Individual member attendance history
- **Service Analytics**: Service-specific attendance trends
- **Visitor Reports**: Visitor attendance and follow-up tracking

### Export Capabilities
- **CSV Export**: Attendance data in spreadsheet format
- **PDF Reports**: Formatted attendance reports for printing
- **Excel Export**: Advanced spreadsheet analysis
- **JSON Export**: API-friendly data format

### Report Types
- **Daily Reports**: Today's attendance summary
- **Weekly Reports**: Weekly attendance trends
- **Monthly Reports**: Monthly attendance analytics
- **Custom Reports**: Date range and filter-based reports

### Offline Reporting
- **Cached Reports**: Reports available offline
- **Export Queuing**: Export requests queued when offline
- **Sync on Connection**: Reports sync when online
- **Local Storage**: Reports stored locally for offline access

## Future Enhancements

### Potential Improvements
- Self-service check-in kiosks
- Family group check-in
- Integration with member communication
- Advanced analytics and insights
- Automated report scheduling
- Advanced attendance analytics
- Check-out functionality for events

### Technical Debt
- Consider more sophisticated QR code security
- Add attendance prediction and insights
- Optimize for very large congregations (1000+ attendees)
