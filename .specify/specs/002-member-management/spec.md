# Member Management - Feature Specification (Enhanced with AI-Powered Journey Tracking)

## Feature Overview
**Feature Name:** Member Management with AI-Powered Journey Tracking
**Epic:** Core Features
**Priority:** P0 (CRITICAL - Complete member lifecycle management)
**Implementation Phase:** MVP (Phase 1) + Post-MVP (Phase 2)
**Africa-First Considerations:** Offline member addition/editing, efficient search, family unit support, mobile data capture, low-bandwidth optimization
**Enhanced Features:** AI duplicate detection (95%+ accuracy), 360° contact view, anonymous visitor tracking, predictive analytics, mobile-first capture

## 🚀 **MVP vs POST-MVP FEATURE BREAKDOWN**

### **MVP FEATURES (Phase 1: Weeks 1-8) - CRITICAL FOR LAUNCH**
1. **Enhanced AI Duplicate Detection** - 95%+ accuracy vs 30% basic matching
2. **360° Contact View** - Complete member timeline with all touchpoints
3. **Mobile Data Capture** - Voice-to-text, photo OCR, offline sync
4. **Advanced Journey Tracking** - 6-stage progression with automation
5. **Custom Attributes System** - Unlimited fields with 8 data types
6. **Person Badges System** - Visual indicators with filtering

### **POST-MVP FEATURES (Phase 2: Weeks 9-16) - COMPETITIVE ADVANTAGES**
1. **Anonymous Visitor Tracking** - Track before they become contacts
2. **Predictive Member Analytics** - AI-powered retention scoring
3. **Advanced Workflow Engine** - Automated follow-up sequences
4. **Multi-Location Territory Management** - Branch-specific assignments
5. **Advanced Journey Analytics** - Conversion funnel with insights
6. **AI-Powered Engagement Scoring** - Predictive member engagement

## 🚨 COMPREHENSIVE MEMBER LIFECYCLE MANAGEMENT
This specification includes complete member lifecycle management from first contact to active membership:
1. **Custom Attributes System** - Unlimited custom fields per person (baptism dates, external IDs, etc.)
2. **Person Badges System** - Visual indicators for member status, roles, and characteristics
3. **Enhanced Notes System** - Notes with alerts, privacy settings, and categorization
4. **Advanced Family Relationships** - Spouse relationships, parent-child with custody, extended family
5. **Journey Tracking** - Complete touchpoint tracking from first contact to active membership
6. **AI Duplicate Detection** - Intelligent matching to prevent duplicate records
7. **Mobile Data Capture** - Voice, photo, and quick capture for outreach activities

## User Stories

### **MVP USER STORIES (Phase 1: Critical for Launch)**

#### **AI-Powered Duplicate Detection (MVP)**
- **As a** church administrator, **I want** AI to detect potential duplicates with 95%+ accuracy **so that** I can maintain clean member data without manual checking
- **As a** church staff member, **I want** real-time duplicate alerts during member entry **so that** I can prevent duplicate records immediately
- **As a** data manager, **I want** confidence scores for potential matches **so that** I can prioritize which duplicates to review first

#### **360° Contact View (MVP)**
- **As a** pastor, **I want** to see a complete timeline of a person's interactions **so that** I can understand their complete spiritual journey
- **As a** church administrator, **I want** all touchpoints consolidated in one view **so that** I can quickly assess member engagement
- **As a** follow-up coordinator, **I want** to see interaction history **so that** I can personalize my follow-up approach

#### **Mobile Data Capture (MVP)**
- **As an** outreach coordinator, **I want** voice-to-text capture during evangelism **so that** I can quickly record contact information without typing
- **As a** church staff member, **I want** photo OCR for business cards **so that** I can instantly capture contact details from printed materials
- **As an** event coordinator, **I want** offline data capture **so that** I can record attendee information even without internet connection

#### **Enhanced Journey Tracking (MVP)**
- **As a** church administrator, **I want** 6-stage journey progression **so that** I can track members from first contact to leadership
- **As a** pastor, **I want** automated stage progression **so that** members advance based on attendance and engagement patterns
- **As a** follow-up coordinator, **I want** journey timeline visualization **so that** I can see member progression at a glance

### **POST-MVP USER STORIES (Phase 2: Competitive Advantages)**

#### **Anonymous Visitor Tracking (Post-MVP)**
- **As an** outreach coordinator, **I want** to track website visitors before they register **so that** I can understand their interests before first contact
- **As a** marketing coordinator, **I want** to link anonymous activity to contacts **so that** I can see their complete digital journey
- **As a** pastor, **I want** to see pre-contact engagement **so that** I can understand what drew them to our church

#### **Predictive Member Analytics (Post-MVP)**
- **As a** pastor, **I want** AI to predict member retention risk **so that** I can proactively engage members likely to leave
- **As a** church administrator, **I want** engagement scoring **so that** I can identify members who need more attention
- **As a** leadership team, **I want** predictive insights **so that** I can make data-driven decisions about member care

### Member Journey Tracking User Stories (Integrated)
- **As an** outreach coordinator, **I want** to capture contact information during evangelism activities **so that** I can track potential members from first contact
- **As a** church staff member, **I want** to track when visitors attend services **so that** I can follow up appropriately and track their journey
- **As a** pastor, **I want** to see a complete timeline of a person's interactions with our church **so that** I can understand their spiritual journey
- **As a** church administrator, **I want** the system to detect potential duplicate records **so that** I can maintain clean data and avoid losing people
- **As an** event coordinator, **I want** to track event registrations and link them to member records **so that** I can see engagement patterns
- **As a** church staff member, **I want** to record life events (baptisms, testimonies, celebrations) **so that** I can track member milestones
- **As a** follow-up coordinator, **I want** automated reminders for member follow-up **so that** no one falls through the cracks
- **As a** church administrator, **I want** to track member progression through different stages **so that** I can measure our effectiveness in member integration

### Edge Cases and Error Scenarios
- **As a** church administrator, **when** I'm offline **I should** still be able to add and edit members, custom attributes, and notes
- **As a** church administrator, **when** I search for a member **I should** get results even with partial names or custom attribute values
- **As a** church administrator, **when** there are duplicate members **I should** be warned before creating duplicates
- **As a** church administrator, **when** I create custom attributes **I should** be prevented from creating duplicate field names
- **As a** church administrator, **when** I assign badges **I should** see visual confirmation and badge conflicts should be highlighted
- **As a** church administrator, **when** I add private notes **I should** be warned about privacy settings and access controls

## Functional Requirements

### **Prompt Integration (AI-Assisted Design)**
- **Figma AI Compatibility** - All member management UI components must be compatible with prompt templates defined in `../004-ui-ux-system/figma-ai-prompts.md`
- **Auto Layout Requirements** - Use Figma's auto layout for all member management components to ensure AI generation consistency
- **Component Naming Conventions** - Follow established patterns (e.g., `card/member`, `form/member-edit`, `modal/member-detail`, `list/member-search`)
- **Design System Variables** - Use semantic variable naming (e.g., `var/color/primary`, `var/spacing/large`, `var/radius/card`)
- **Member Management Templates** - Components must align with member management and mobile app templates in figma-ai-prompts.md
- **State Variant Support** - Include all interactive states (hover, active, disabled, loading, error, success) for AI generation
- **Mobile Data Capture Design** - Follow mobile-first prompt templates with voice-to-text and photo OCR interface requirements
- **360° Contact View Design** - Use dashboard widget and timeline prompt templates for comprehensive member views

### **MVP FUNCTIONAL REQUIREMENTS (Phase 1: Weeks 1-8)**

#### **1. Enhanced AI Duplicate Detection (MVP - Critical)**
- **AI-Powered Matching Algorithm**
  - Name similarity using Levenshtein distance (40% weight)
  - Phone number normalization and matching (30% weight)
  - Email domain and similarity analysis (20% weight)
  - Address and family connection matching (10% weight)
- **Real-Time Detection**
  - Instant duplicate alerts during member entry
  - Confidence scoring: High (90%+), Medium (70-89%), Low (50-69%)
  - Batch processing for existing member database cleanup
- **Merge Functionality**
  - Smart merge with conflict resolution interface
  - Preserve all historical data during merge
  - Audit trail for all merge operations

#### **2. 360° Contact View (MVP - Critical)**
- **Complete Timeline Interface**
  - Chronological view of all member interactions
  - Service attendance, event participation, outreach contacts
  - Life events (baptisms, testimonies, celebrations)
  - Communication history and follow-up activities
- **Interaction Consolidation**
  - Single dashboard showing all touchpoints
  - Quick access to recent activities
  - Visual indicators for follow-up requirements
- **Engagement Metrics**
  - Visit frequency and attendance patterns
  - Engagement score based on activity level
  - Journey stage progression visualization

#### **3. Mobile Data Capture (MVP - Critical)**
- **Voice-to-Text Conversion**
  - Real-time speech recognition for contact information
  - Support for multiple languages (English, Yoruba, Hausa, Igbo)
  - Offline voice processing with cloud sync
- **Photo OCR Processing**
  - Business card scanning with contact extraction
  - Form scanning for event registrations
  - Handwriting recognition for paper forms
- **Quick Capture Forms**
  - One-tap contact creation during outreach
  - Minimal required fields for rapid entry
  - Offline storage with automatic sync

#### **4. Advanced Journey Tracking (MVP - Enhanced)**
- **6-Stage Journey Progression**
  - First Contact → Visitor → Potential → New Member → Active Member → Leader
  - Automated progression based on attendance and engagement
  - Manual override with notes and justification
- **Touchpoint Management**
  - Record all interactions with timestamp and location
  - Link to specific events, services, or activities
  - Track source of contact (evangelism, referral, online)
- **Follow-up Automation**
  - Rule-based follow-up scheduling (3 days, 1 week, 1 month)
  - Staff assignment and notification system
  - Completion tracking and outcome recording

#### **5. Custom Attributes System (MVP - Enhanced)**
- **Unlimited Custom Fields**
  - 8 field types: text, textarea, number, date, boolean, select, email, phone
  - Category organization (Personal, Ministry, Contact, Spiritual)
  - Required/optional field configuration
- **Bulk Operations**
  - Mass update custom attributes for multiple members
  - Import/export custom field definitions
  - Template-based attribute sets for different member types

#### **6. Person Badges System (MVP - Enhanced)**
- **Visual Badge Management**
  - Custom badge types with colors and icons
  - Auto-assignment based on member attributes
  - Badge filtering in member search and lists
- **Badge Categories**
  - Status badges (Member, Visitor, VIP)
  - Role badges (Volunteer, Leader, Staff)
  - Special badges (First-time, Anniversary, Birthday)

### **POST-MVP FUNCTIONAL REQUIREMENTS (Phase 2: Weeks 9-16)**

#### **7. Anonymous Visitor Tracking (Post-MVP)**
- **Pre-Contact Engagement**
  - Website visitor tracking before registration
  - Event attendance before member creation
  - Digital engagement scoring
- **Conversion Linking**
  - Connect anonymous activity to member records
  - Complete digital journey visualization
  - Source attribution for member acquisition

#### **8. Predictive Member Analytics (Post-MVP)**
- **AI-Powered Insights**
  - Member retention risk scoring
  - Engagement decline prediction
  - Volunteer potential identification
- **Automated Recommendations**
  - Suggested follow-up actions
  - Optimal contact timing
  - Personalized engagement strategies

#### **9. Advanced Workflow Engine (Post-MVP)**
- **Automated Sequences**
  - Multi-step follow-up workflows
  - Conditional logic based on member responses
  - Integration with communication systems
- **Performance Analytics**
  - Workflow effectiveness tracking
  - Conversion rate optimization
  - A/B testing for follow-up strategies

### Member Journey Tracking (Integrated)
11. **Journey Stage Management**
    - Track member progression: First Contact → Visitor → Potential → Member → Active → Leader
    - Automatic stage progression based on attendance and engagement
    - Manual stage updates with notes and reasons
    - Journey timeline visualization for each person

12. **Touchpoint Tracking**
    - Record all interactions: events, visits, outreach contacts, life events
    - Link touchpoints to specific services, events, or activities
    - Track source of each contact (evangelism, referral, online, etc.)
    - Capture location and staff member responsible

13. **AI Duplicate Detection**
    - Intelligent matching using name similarity, phone, email, address
    - Confidence scoring for potential matches (High, Medium, Low, Unlikely)
    - Real-time notifications for potential duplicates
    - Merge functionality for confirmed duplicates

14. **Mobile Data Capture**
    - Quick capture forms for outreach activities
    - Voice-to-text conversion for rapid data entry
    - Photo capture with OCR for contact cards/forms
    - Offline sync for data captured without internet

15. **Automated Follow-up System**
    - Rule-based follow-up scheduling (3 days, 1 week, 1 month)
    - Staff assignment for follow-up tasks
    - Follow-up reminders and notifications
    - Track follow-up completion and outcomes

### Offline Behavior (Enhanced)
- **When offline:** All member operations work locally with IndexedDB storage, including custom attributes, badges, and notes
- **When coming online:** Local changes sync to Supabase with conflict resolution for all enhanced features
- **Conflict resolution:** Timestamp-based with user notification for conflicts, special handling for custom attributes and notes
- **Custom attributes offline:** Full CRUD operations for custom fields and values stored locally
- **Badges offline:** Badge assignments and custom badge creation work offline
- **Notes offline:** Full notes functionality including privacy settings and alerts work offline

### Mobile Considerations
- **Touch interactions:** Large search buttons, swipe gestures for member cards
- **Screen sizes:** Responsive member cards, collapsible details
- **Performance:** Fast search with local indexing, lazy loading for large lists

## Technical Requirements

### **MVP API ENDPOINTS (Phase 1: Critical Implementation)**

#### **AI Duplicate Detection Endpoints (MVP)**
```php
// Laravel Service Implementation
class AIDeduplicationService {
    public function detectDuplicates($person, $confidence_threshold = 0.7) {
        // Name similarity (40% weight) - Levenshtein distance
        $nameScore = $this->calculateNameSimilarity($person->name, $existingMembers);

        // Phone matching (30% weight) - Normalized comparison
        $phoneScore = $this->normalizeAndMatchPhone($person->phone, $existingMembers);

        // Email similarity (20% weight) - Domain analysis
        $emailScore = $this->calculateEmailSimilarity($person->email, $existingMembers);

        // Family connections (10% weight) - Relationship matching
        $familyScore = $this->analyzeFamilyConnections($person, $existingMembers);

        return $this->calculateConfidenceScore($nameScore, $phoneScore, $emailScore, $familyScore);
    }
}
```

- `POST /api/members/check-duplicates` - AI-powered duplicate detection with confidence scoring
- `GET /api/members/{id}/potential-matches` - Get potential duplicate matches with similarity scores
- `POST /api/members/{id}/merge` - Smart merge duplicate member records with conflict resolution
- `POST /api/members/bulk-check` - Batch duplicate detection for existing database cleanup

#### **360° Contact View Endpoints (MVP)**
- `GET /api/members/{id}/timeline` - Complete chronological interaction timeline
- `GET /api/members/{id}/engagement-score` - Real-time engagement metrics and scoring
- `GET /api/members/{id}/touchpoints` - All touchpoints with filtering and pagination
- `POST /api/members/{id}/touchpoints` - Add new touchpoint with automatic categorization

#### **Mobile Data Capture Endpoints (MVP)**
- `POST /api/capture/voice-to-text` - Voice recognition with multi-language support
- `POST /api/capture/photo-ocr` - Photo OCR processing for business cards and forms
- `POST /api/capture/quick-contact` - Rapid contact creation for outreach activities
- `GET /api/capture/offline-sync` - Sync offline captured data with conflict resolution

#### **Enhanced Journey Tracking Endpoints (MVP)**
- `GET /api/members/{id}/journey-stage` - Current journey stage with progression history
- `POST /api/members/{id}/journey/advance` - Advance member to next journey stage
- `GET /api/journey/analytics` - Journey funnel analytics with conversion rates
- `POST /api/journey/bulk-update` - Bulk journey stage updates with automation rules

#### Custom Attributes Endpoints
- `GET /api/member-attributes` - List available custom attributes
- `POST /api/member-attributes` - Create new custom attribute
- `PUT /api/member-attributes/{id}` - Update custom attribute definition
- `DELETE /api/member-attributes/{id}` - Delete custom attribute
- `GET /api/members/{id}/attributes` - Get member's custom attribute values
- `PUT /api/members/{id}/attributes` - Update member's custom attribute values

#### Person Badges Endpoints
- `GET /api/badges` - List available badge types
- `POST /api/badges` - Create new badge type
- `PUT /api/badges/{id}` - Update badge type
- `DELETE /api/badges/{id}` - Delete badge type
- `GET /api/members/{id}/badges` - Get member's assigned badges
- `POST /api/members/{id}/badges` - Assign badges to member
- `DELETE /api/members/{id}/badges/{badgeId}` - Remove badge from member

#### Enhanced Notes Endpoints
- `GET /api/members/{id}/notes` - Get member's notes
- `POST /api/members/{id}/notes` - Add note to member
- `PUT /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note
- `GET /api/notes/search` - Search notes across all members

#### Advanced Family Endpoints
- `GET /api/families/{id}/relationships` - Get detailed family relationships
- `POST /api/families/{id}/relationships` - Create family relationship
- `PUT /api/relationships/{id}` - Update relationship details
- `DELETE /api/relationships/{id}` - Remove family relationship

#### Member Journey Tracking Endpoints
- `GET /api/members/{id}/journey` - Get member's complete journey timeline
- `POST /api/members/{id}/journey/stage` - Update member's journey stage
- `GET /api/members/{id}/touchpoints` - Get member's touchpoint history
- `POST /api/members/{id}/touchpoints` - Add new touchpoint
- `PUT /api/touchpoints/{id}` - Update touchpoint details
- `DELETE /api/touchpoints/{id}` - Remove touchpoint

#### Duplicate Detection Endpoints
- `POST /api/members/check-duplicates` - Check for potential duplicates
- `GET /api/members/{id}/potential-matches` - Get potential duplicate matches
- `POST /api/members/{id}/merge` - Merge duplicate member records
- `POST /api/members/bulk-check` - Bulk duplicate detection

#### Mobile Capture Endpoints
- `POST /api/capture/quick` - Quick capture form for outreach
- `POST /api/capture/voice` - Voice-to-text conversion
- `POST /api/capture/photo` - Photo OCR processing
- `GET /api/capture/sync` - Sync offline captured data

#### Follow-up Management Endpoints
- `GET /api/followups` - List pending follow-ups
- `POST /api/followups` - Create follow-up task
- `PUT /api/followups/{id}` - Update follow-up status
- `GET /api/members/{id}/followups` - Get member's follow-up history

### **MVP DATABASE SCHEMA (Phase 1: Critical Tables)**

#### **Enhanced Members Table with AI Duplicate Detection (MVP)**
```sql
-- Core members table optimized for AI duplicate detection and journey tracking
CREATE TABLE members (
    id BIGINT PRIMARY KEY,
    organization_id BIGINT NOT NULL,

    -- Basic Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    alternate_phone VARCHAR(50),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    member_type ENUM('member', 'visitor', 'child') DEFAULT 'member',
    family_id BIGINT,
    joined_date DATE,
    is_active BOOLEAN DEFAULT TRUE,

    -- AI Duplicate Detection Fields (MVP Critical)
    duplicate_confidence DECIMAL(5,2) DEFAULT 0.00, -- 0-100 confidence score
    potential_duplicate_of BIGINT NULL,
    is_duplicate BOOLEAN DEFAULT FALSE,
    duplicate_checked_at TIMESTAMP NULL,
    name_hash VARCHAR(64), -- For fast name similarity matching
    phone_normalized VARCHAR(20), -- Normalized phone for matching
    email_domain VARCHAR(100), -- Email domain for similarity analysis

    -- Journey Tracking Fields (MVP Enhanced)
    journey_stage ENUM('first_contact', 'visitor', 'potential', 'new_member', 'active_member', 'leader') DEFAULT 'first_contact',
    journey_stage_date DATE DEFAULT (CURRENT_DATE),
    previous_stage ENUM('first_contact', 'visitor', 'potential', 'new_member', 'active_member', 'leader') NULL,
    first_contact_date DATE DEFAULT (CURRENT_DATE),
    last_contact_date DATE DEFAULT (CURRENT_DATE),
    visit_count INT DEFAULT 0,
    engagement_score DECIMAL(5,2) DEFAULT 0.00, -- 0-100 engagement score
    conversion_date DATE NULL,
    assigned_to BIGINT NULL, -- Staff member responsible for follow-up

    -- Mobile Capture Fields (MVP)
    capture_source ENUM('manual', 'voice', 'photo_ocr', 'quick_capture', 'import') DEFAULT 'manual',
    capture_location VARCHAR(255) NULL,
    captured_by BIGINT NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Keys
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (potential_duplicate_of) REFERENCES members(id),
    FOREIGN KEY (captured_by) REFERENCES users(id),

    -- Optimized Indexes for AI Duplicate Detection
    INDEX idx_members_name_hash (name_hash),
    INDEX idx_members_phone_normalized (phone_normalized),
    INDEX idx_members_email_domain (email_domain),
    INDEX idx_members_duplicate_confidence (duplicate_confidence),
    INDEX idx_members_potential_duplicate (potential_duplicate_of),

    -- Journey Tracking Indexes
    INDEX idx_members_journey_stage (journey_stage),
    INDEX idx_members_engagement_score (engagement_score),
    INDEX idx_members_assigned (assigned_to),

    -- Standard Indexes
    INDEX idx_members_name (first_name, last_name),
    INDEX idx_members_email (email),
    INDEX idx_members_phone (phone),
    INDEX idx_members_family (family_id),
    INDEX idx_members_active (is_active),
    INDEX idx_members_org (organization_id)
);
```

#### **AI Duplicate Detection Support Tables (MVP)**
```sql
-- Duplicate detection algorithm weights and configuration
CREATE TABLE duplicate_detection_config (
    id BIGINT PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    algorithm_version VARCHAR(20) DEFAULT 'v1.0',
    name_weight DECIMAL(3,2) DEFAULT 0.40, -- 40% weight for name similarity
    phone_weight DECIMAL(3,2) DEFAULT 0.30, -- 30% weight for phone matching
    email_weight DECIMAL(3,2) DEFAULT 0.20, -- 20% weight for email similarity
    family_weight DECIMAL(3,2) DEFAULT 0.10, -- 10% weight for family connections
    confidence_threshold DECIMAL(3,2) DEFAULT 0.70, -- 70% threshold for alerts
    auto_merge_threshold DECIMAL(3,2) DEFAULT 0.95, -- 95% threshold for auto-merge
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    UNIQUE KEY unique_org_config (organization_id, algorithm_version)
);

-- Duplicate detection audit trail
CREATE TABLE duplicate_detection_log (
    id BIGINT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    potential_duplicate_id BIGINT NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL,
    algorithm_version VARCHAR(20) NOT NULL,
    detection_details JSON, -- Detailed scoring breakdown
    action_taken ENUM('flagged', 'merged', 'dismissed', 'manual_review') NOT NULL,
    reviewed_by BIGINT NULL,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (potential_duplicate_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    INDEX idx_duplicate_log_member (member_id),
    INDEX idx_duplicate_log_confidence (confidence_score),
    INDEX idx_duplicate_log_action (action_taken)
);
```

-- Enhanced families table
CREATE TABLE families (
    id BIGINT PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    family_name VARCHAR(255) NOT NULL,
    head_of_family_id BIGINT,
    address TEXT,
    anniversary_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (head_of_family_id) REFERENCES members(id)
);
```

#### **Journey Tracking and Touchpoint Tables (MVP)**
```sql
-- Member journey stage history with detailed tracking
CREATE TABLE member_journey_history (
    id BIGINT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    from_stage ENUM('first_contact', 'visitor', 'potential', 'new_member', 'active_member', 'leader') NULL,
    to_stage ENUM('first_contact', 'visitor', 'potential', 'new_member', 'active_member', 'leader') NOT NULL,
    stage_date DATE NOT NULL,
    progression_type ENUM('automatic', 'manual', 'bulk_update') DEFAULT 'manual',
    progression_reason TEXT NULL,
    engagement_score_at_change DECIMAL(5,2) NULL,
    assigned_to BIGINT NULL, -- Staff member responsible
    notes TEXT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_journey_history_member (member_id),
    INDEX idx_journey_history_stage (to_stage),
    INDEX idx_journey_history_date (stage_date),
    INDEX idx_journey_history_type (progression_type)
);

-- Comprehensive touchpoint tracking for 360° view
CREATE TABLE member_touchpoints (
    id BIGINT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    type ENUM('service_attendance', 'event_registration', 'outreach_contact', 'phone_call', 'home_visit', 'testimony', 'baptism', 'ministry_join', 'volunteer_activity', 'life_event') NOT NULL,
    subtype VARCHAR(100) NULL, -- Specific event type, service name, etc.
    date DATE NOT NULL,
    time TIME NULL,
    location VARCHAR(255) NULL,
    description TEXT NULL,

    -- Source tracking for analytics
    source ENUM('manual', 'qr_scan', 'voice_capture', 'photo_ocr', 'import', 'api', 'mobile_app') DEFAULT 'manual',
    source_details JSON NULL, -- Additional source-specific data

    -- Engagement scoring
    engagement_value DECIMAL(5,2) DEFAULT 1.00, -- Contribution to engagement score
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE NULL,
    follow_up_completed BOOLEAN DEFAULT FALSE,

    -- Staff tracking
    captured_by BIGINT NOT NULL, -- Staff member who recorded
    assigned_to BIGINT NULL, -- Staff member for follow-up

    -- Metadata for mobile capture
    capture_metadata JSON NULL, -- Voice transcription, OCR confidence, etc.

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (captured_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),

    INDEX idx_touchpoints_member (member_id),
    INDEX idx_touchpoints_type (type),
    INDEX idx_touchpoints_date (date),
    INDEX idx_touchpoints_source (source),
    INDEX idx_touchpoints_followup (follow_up_required, follow_up_date),
    INDEX idx_touchpoints_engagement (engagement_value)
);

-- Mobile capture session tracking
CREATE TABLE mobile_capture_sessions (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_type ENUM('outreach', 'event', 'service', 'home_visit') NOT NULL,
    location VARCHAR(255) NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    contacts_captured INT DEFAULT 0,
    voice_captures INT DEFAULT 0,
    photo_captures INT DEFAULT 0,
    sync_status ENUM('pending', 'syncing', 'completed', 'failed') DEFAULT 'pending',
    sync_errors JSON NULL,
    device_info JSON NULL, -- Device type, OS version, app version
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_capture_sessions_user (user_id),
    INDEX idx_capture_sessions_type (session_type),
    INDEX idx_capture_sessions_sync (sync_status)
);
```

#### **Custom Attributes System Tables (MVP)**
```sql
-- Custom attribute definitions
CREATE TABLE member_attributes (
    id BIGINT PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    key VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    field_type ENUM('text', 'textarea', 'number', 'date', 'boolean', 'select', 'email', 'phone') NOT NULL,
    category VARCHAR(100) DEFAULT 'Personal',
    field_options JSON, -- For select fields: {"options": ["Option 1", "Option 2"]}
    is_required BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    UNIQUE KEY unique_org_key (organization_id, key),
    INDEX idx_attributes_category (category),
    INDEX idx_attributes_order (display_order)
);

-- Custom attribute values for members
CREATE TABLE member_attribute_values (
    id BIGINT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    attribute_id BIGINT NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_id) REFERENCES member_attributes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_member_attribute (member_id, attribute_id),
    INDEX idx_attribute_values_member (member_id),
    INDEX idx_attribute_values_attribute (attribute_id)
);
```

#### Person Badges System Tables
```sql
-- Badge type definitions
CREATE TABLE badge_types (
    id BIGINT PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#007bff', -- Hex color code
    icon VARCHAR(50) DEFAULT 'badge', -- Icon name/class
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    UNIQUE KEY unique_org_badge_name (organization_id, name),
    INDEX idx_badges_active (is_active)
);

-- Member badge assignments
CREATE TABLE member_badges (
    id BIGINT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    badge_type_id BIGINT NOT NULL,
    assigned_by BIGINT, -- User who assigned the badge
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL, -- Optional expiration
    notes TEXT, -- Reason for assignment
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_type_id) REFERENCES badge_types(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    UNIQUE KEY unique_member_badge (member_id, badge_type_id),
    INDEX idx_member_badges_member (member_id),
    INDEX idx_member_badges_type (badge_type_id)
);
```

#### Enhanced Notes System Tables
```sql
-- Enhanced notes with alerts and privacy
CREATE TABLE member_notes (
    id BIGINT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL, -- User who created the note
    title VARCHAR(255),
    content TEXT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'Personal Note', -- Personal Note, Follow-up, Prayer Request, etc.
    privacy_level ENUM('public', 'private', 'extreme') DEFAULT 'public',
    is_alert BOOLEAN DEFAULT FALSE, -- Alert flag for important notes
    is_pinned BOOLEAN DEFAULT FALSE, -- Pin to top of member profile
    alert_expires_at TIMESTAMP NULL, -- When alert should stop showing
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_notes_member (member_id),
    INDEX idx_notes_author (author_id),
    INDEX idx_notes_alert (is_alert),
    INDEX idx_notes_pinned (is_pinned),
    INDEX idx_notes_privacy (privacy_level),
    INDEX idx_notes_type (note_type)
);
```

#### Advanced Family Relationships Tables
```sql
-- Detailed family relationships
CREATE TABLE family_relationships (
    id BIGINT PRIMARY KEY,
    family_id BIGINT NOT NULL,
    person1_id BIGINT NOT NULL, -- First person in relationship
    person2_id BIGINT NOT NULL, -- Second person in relationship
    relationship_type ENUM('spouse', 'parent', 'child', 'sibling', 'grandparent', 'grandchild', 'guardian', 'other') NOT NULL,
    relationship_details JSON, -- Additional details like custody info, anniversary date
    is_primary BOOLEAN DEFAULT FALSE, -- Primary relationship (e.g., head of household)
    start_date DATE, -- When relationship started (marriage, adoption, etc.)
    end_date DATE, -- When relationship ended (divorce, death, etc.)
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
    FOREIGN KEY (person1_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (person2_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_relationships_family (family_id),
    INDEX idx_relationships_person1 (person1_id),
    INDEX idx_relationships_person2 (person2_id),
    INDEX idx_relationships_type (relationship_type)
);
```

#### Member Journey Tracking Tables
```sql
-- Journey stage history
CREATE TABLE member_journey_stages (
    id BIGINT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    stage ENUM('first_contact', 'visitor', 'potential', 'new_member', 'active_member', 'leader') NOT NULL,
    previous_stage ENUM('first_contact', 'visitor', 'potential', 'new_member', 'active_member', 'leader'),
    stage_date DATE NOT NULL,
    notes TEXT,
    assigned_to BIGINT, -- Staff member responsible
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_journey_member (member_id),
    INDEX idx_journey_stage (stage),
    INDEX idx_journey_date (stage_date)
);

-- Touchpoint tracking
CREATE TABLE member_touchpoints (
    id BIGINT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    type ENUM('event_registration', 'service_attendance', 'outreach_contact', 'testimony', 'life_event', 'ministry_join', 'follow_up_call', 'home_visit') NOT NULL,
    event_id BIGINT, -- Link to specific event if applicable
    service_id BIGINT, -- Link to specific service if applicable
    date DATE NOT NULL,
    location VARCHAR(255),
    source ENUM('manual', 'qr_scan', 'import', 'api', 'mobile_capture') DEFAULT 'manual',
    notes TEXT,
    metadata JSON, -- Additional touchpoint-specific data
    captured_by BIGINT NOT NULL, -- Staff member who captured
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (captured_by) REFERENCES users(id),
    INDEX idx_touchpoints_member (member_id),
    INDEX idx_touchpoints_type (type),
    INDEX idx_touchpoints_date (date),
    INDEX idx_touchpoints_source (source),
    INDEX idx_touchpoints_followup (follow_up_required, follow_up_date)
);

-- Follow-up tasks
CREATE TABLE member_followups (
    id BIGINT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    touchpoint_id BIGINT, -- Link to originating touchpoint
    assigned_to BIGINT NOT NULL,
    type ENUM('call', 'visit', 'email', 'text', 'meeting') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    due_date DATE NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    completion_notes TEXT,
    completed_at TIMESTAMP NULL,
    completed_by BIGINT,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (touchpoint_id) REFERENCES member_touchpoints(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (completed_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_followups_member (member_id),
    INDEX idx_followups_assigned (assigned_to),
    INDEX idx_followups_due (due_date),
    INDEX idx_followups_status (status)
);

-- Unique identifiers for duplicate detection
CREATE TABLE member_unique_identifiers (
    id BIGINT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    type ENUM('phone', 'email', 'address', 'name_variant', 'family_connection') NOT NULL,
    value VARCHAR(255) NOT NULL,
    confidence DECIMAL(5,2) NOT NULL, -- 0-100 confidence score
    source VARCHAR(100) NOT NULL, -- Where this identifier was captured
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_identifiers_member (member_id),
    INDEX idx_identifiers_type (type),
    INDEX idx_identifiers_value (value),
    INDEX idx_identifiers_confidence (confidence)
);
```

### **MVP FRONTEND COMPONENTS (Phase 1: Critical Implementation)**

#### **Prompt-Ready Component Requirements**
All member management components must follow these AI-assisted design principles:
- **Layout Logic Integration** - Components must follow member management prompt templates from `../004-ui-ux-system/figma-ai-prompts.md`
- **State Management** - Include all interactive states (default, hover, active, disabled, loading, error, success) for AI generation
- **Responsive Behavior** - Components must align with mobile-first member management prompt templates
- **Accessibility States** - Include focus indicators, error states, and ARIA labels as specified in accessibility prompts
- **Component Hierarchy** - Follow established naming conventions for consistent AI generation
- **Mobile Data Capture** - Voice-to-text and photo OCR components must follow mobile app prompt templates

#### **AI Duplicate Detection Components (MVP)**
```javascript
// Vue 3 Composition API Components
// DuplicateDetector.vue - Real-time duplicate detection
<template>
  <div class="duplicate-detector">
    <q-banner v-if="duplicates.length > 0" class="bg-warning text-dark">
      <template v-slot:avatar>
        <q-icon name="warning" />
      </template>
      Potential duplicates detected with {{ highestConfidence }}% confidence
      <template v-slot:action>
        <q-btn flat label="Review" @click="showDuplicateDialog = true" />
      </template>
    </q-banner>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAIDuplicateDetection } from '@/composables/useAIDuplicateDetection'

const props = defineProps(['memberData'])
const { detectDuplicates, duplicates, highestConfidence } = useAIDuplicateDetection()

watch(() => props.memberData, async (newData) => {
  if (newData.first_name && newData.last_name) {
    await detectDuplicates(newData)
  }
}, { deep: true })
</script>
```

- `DuplicateDetector.vue` - Real-time AI duplicate detection with confidence scoring
- `DuplicateMatchList.vue` - Display potential matches with similarity breakdown
- `MemberMerger.vue` - Smart merge interface with conflict resolution
- `ConfidenceIndicator.vue` - Visual confidence score display with color coding

#### **360° Contact View Components (MVP)**
```javascript
// JourneyTimeline.vue - Complete member interaction timeline
<template>
  <div class="journey-timeline">
    <q-timeline color="primary">
      <q-timeline-entry
        v-for="touchpoint in timeline"
        :key="touchpoint.id"
        :title="touchpoint.type"
        :subtitle="formatDate(touchpoint.date)"
        :icon="getIconForTouchpoint(touchpoint.type)"
      >
        <div>{{ touchpoint.description }}</div>
        <q-chip v-if="touchpoint.follow_up_required" color="orange" text-color="white" icon="schedule">
          Follow-up Required
        </q-chip>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMemberTimeline } from '@/composables/useMemberTimeline'

const props = defineProps(['memberId'])
const { timeline, loadTimeline } = useMemberTimeline()

onMounted(() => loadTimeline(props.memberId))
</script>
```

- `JourneyTimeline.vue` - Visual timeline of all member interactions
- `EngagementScore.vue` - Real-time engagement metrics with visual indicators
- `TouchpointTracker.vue` - Quick touchpoint recording with categorization
- `ContactView360.vue` - Comprehensive member dashboard with all data

#### **Mobile Data Capture Components (MVP)**
```javascript
// VoiceCapture.vue - Voice-to-text conversion for mobile
<template>
  <div class="voice-capture">
    <q-btn
      :color="isRecording ? 'negative' : 'primary'"
      :icon="isRecording ? 'stop' : 'mic'"
      :label="isRecording ? 'Stop Recording' : 'Start Voice Capture'"
      @click="toggleRecording"
      size="lg"
      class="full-width q-mb-md"
    />

    <q-linear-progress
      v-if="isRecording"
      :value="recordingProgress"
      color="primary"
      class="q-mb-md"
    />

    <q-input
      v-model="transcribedText"
      type="textarea"
      label="Transcribed Text"
      readonly
      rows="4"
      class="q-mb-md"
    />

    <q-btn
      v-if="transcribedText"
      label="Create Contact"
      color="positive"
      @click="createContactFromVoice"
      class="full-width"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useVoiceCapture } from '@/composables/useVoiceCapture'

const {
  isRecording,
  recordingProgress,
  transcribedText,
  toggleRecording,
  createContactFromVoice
} = useVoiceCapture()
</script>
```

- `VoiceCapture.vue` - Voice-to-text conversion with multi-language support
- `PhotoOCR.vue` - Business card scanning with contact extraction
- `QuickCaptureForm.vue` - Rapid contact creation for outreach
- `OfflineSyncManager.vue` - Offline data synchronization with conflict resolution

#### **Enhanced Journey Tracking Components (MVP)**
- `JourneyStageManager.vue` - Visual journey stage progression with automation
- `StageProgressIndicator.vue` - Progress visualization with next steps
- `JourneyAnalytics.vue` - Funnel analytics with conversion insights
- `AutomationRules.vue` - Configure automatic stage progression rules

#### Custom Attributes Components
- `CustomAttributeManager.vue` - Manage custom attribute definitions
- `CustomAttributeForm.vue` - Create/edit custom attribute definitions
- `CustomAttributeInput.vue` - Dynamic input component for different field types
- `CustomAttributeDisplay.vue` - Display custom attribute values in member profiles
- `BulkAttributeEditor.vue` - Bulk edit custom attributes for multiple members

#### Person Badges Components
- `BadgeManager.vue` - Manage badge types and assignments
- `BadgeTypeForm.vue` - Create/edit badge type definitions
- `BadgeAssignment.vue` - Assign/remove badges from members
- `BadgeDisplay.vue` - Display badges in member profiles and lists
- `BadgeFilter.vue` - Filter members by assigned badges

#### Enhanced Notes Components
- `NotesManager.vue` - Comprehensive notes management for members
- `NoteForm.vue` - Create/edit notes with privacy and alert settings
- `NotesList.vue` - Display member notes with filtering and search
- `AlertNotes.vue` - Display alert notes prominently
- `NotesSearch.vue` - Search notes across all members

#### Advanced Family Components
- `FamilyRelationshipManager.vue` - Manage detailed family relationships
- `RelationshipForm.vue` - Create/edit family relationships
- `FamilyTree.vue` - Visual family tree display
- `RelationshipTimeline.vue` - Timeline of family relationship changes

#### Member Journey Tracking Components
- `JourneyTimeline.vue` - Visual timeline of member's complete journey
- `JourneyStageManager.vue` - Manage member journey stage progression
- `TouchpointTracker.vue` - Record and display member touchpoints
- `TouchpointForm.vue` - Quick capture form for new touchpoints
- `JourneyAnalytics.vue` - Analytics dashboard for member journey insights
- `StageProgressIndicator.vue` - Visual progress indicator for journey stages

#### Duplicate Detection Components
- `DuplicateDetector.vue` - AI-powered duplicate detection interface
- `DuplicateMatchList.vue` - Display potential duplicate matches
- `MemberMerger.vue` - Interface for merging duplicate records
- `MatchConfidenceIndicator.vue` - Visual confidence score display

#### Mobile Capture Components
- `QuickCaptureForm.vue` - Rapid data entry for outreach activities
- `VoiceCapture.vue` - Voice-to-text conversion interface
- `PhotoCapture.vue` - Photo OCR processing for contact cards
- `OfflineSyncManager.vue` - Manage offline data synchronization

#### Follow-up Management Components
- `FollowupDashboard.vue` - Dashboard for pending follow-up tasks
- `FollowupForm.vue` - Create and assign follow-up tasks
- `FollowupCalendar.vue` - Calendar view of follow-up schedules
- `FollowupReminders.vue` - Notification system for due follow-ups

## User Experience Design

### User Flow (Enhanced)

#### Core User Flow
1. User navigates to Members section
2. User sees list of existing members with badges and key custom attributes
3. User can search for specific members by name, attributes, or badges
4. User can add new member via enhanced form with custom attributes
5. User can edit member by clicking on member card
6. User can manage family relationships with detailed relationship types

#### Enhanced User Flows

**Custom Attributes Flow:**
1. Admin creates custom attribute definitions (baptism date, external ID, etc.)
2. User adds/edits member with custom attribute fields displayed
3. Custom attributes appear in member profiles and search results
4. Bulk editing available for updating multiple members

**Person Badges Flow:**
1. Admin creates badge types (Volunteer, VIP, First-time Visitor)
2. User assigns badges to members during profile editing
3. Badges display prominently in member cards and lists
4. Users can filter member lists by assigned badges

**Enhanced Notes Flow:**
1. User adds note to member with privacy level selection
2. Important notes can be flagged as alerts
3. Alert notes display prominently in member profile
4. Users can search notes across all members
5. Private notes only visible to authorized users

**Advanced Family Flow:**
1. User creates family unit
2. User adds detailed relationships (spouse, parent-child, etc.)
3. Relationship details include dates, custody info, etc.
4. Family tree visualization shows complex relationships
5. Changes tracked in relationship timeline

### UI Requirements (Enhanced)
- **Layout:** Card-based member display with badges, search bar with filters, custom attribute sections
- **Interactions:** Tap to view details, swipe for quick actions, drag-and-drop for family relationships
- **Feedback:** Instant search results, save confirmations, badge assignment feedback, alert note highlights
- **Accessibility:** Screen reader support, keyboard navigation, high contrast badges, clear privacy indicators
- **Visual Hierarchy:** Badges prominently displayed, alert notes highlighted, custom attributes organized by category

## Acceptance Criteria

### **MVP ACCEPTANCE CRITERIA (Phase 1: Critical for Launch)**

#### **AI Duplicate Detection Acceptance (MVP)**
- [ ] AI duplicate detection achieves 95%+ accuracy on test dataset
- [ ] Real-time duplicate alerts appear within 2 seconds of data entry
- [ ] Confidence scoring correctly categorizes matches (High 90%+, Medium 70-89%, Low 50-69%)
- [ ] Merge functionality preserves all historical data without loss
- [ ] Batch duplicate detection processes 1000+ members in under 5 minutes
- [ ] False positive rate remains below 5% for high-confidence matches

#### **360° Contact View Acceptance (MVP)**
- [ ] Complete timeline loads all touchpoints in chronological order
- [ ] Engagement score updates in real-time based on new interactions
- [ ] Timeline displays all interaction types with proper categorization
- [ ] Follow-up indicators clearly show pending actions
- [ ] Performance remains fast with 100+ touchpoints per member
- [ ] Mobile timeline view is fully responsive and touch-friendly

#### **Mobile Data Capture Acceptance (MVP)**
- [ ] Voice-to-text achieves 90%+ accuracy for English, Yoruba, Hausa, Igbo
- [ ] Photo OCR extracts contact information from business cards with 85%+ accuracy
- [ ] Quick capture form creates complete contact in under 30 seconds
- [ ] Offline capture stores data locally and syncs when connection available
- [ ] Voice capture works in noisy environments (church services, events)
- [ ] Photo capture works in various lighting conditions

#### **Enhanced Journey Tracking Acceptance (MVP)**
- [ ] 6-stage journey progression works with automatic and manual advancement
- [ ] Journey timeline visualizes complete member progression
- [ ] Automated stage progression triggers based on attendance and engagement
- [ ] Journey analytics show conversion rates between stages
- [ ] Bulk stage updates process multiple members efficiently
- [ ] Journey data syncs correctly between online and offline modes

#### **Custom Attributes & Badges Acceptance (MVP)**
- [ ] Unlimited custom attributes with 8 field types work correctly
- [ ] Badge system displays visual indicators in all member views
- [ ] Custom attribute search returns accurate results
- [ ] Bulk editing updates multiple members without errors
- [ ] Badge filtering works in member lists and search
- [ ] Custom attributes and badges sync properly offline/online

### **POST-MVP ACCEPTANCE CRITERIA (Phase 2: Competitive Advantages)**

#### **Anonymous Visitor Tracking Acceptance (Post-MVP)**
- [ ] Website visitor tracking links to member records upon registration
- [ ] Pre-contact engagement data displays in member timeline
- [ ] Anonymous activity attribution works with 90%+ accuracy
- [ ] Digital journey visualization shows complete funnel

#### **Predictive Analytics Acceptance (Post-MVP)**
- [ ] Member retention risk scoring achieves 80%+ prediction accuracy
- [ ] Engagement decline alerts trigger 2 weeks before significant drop
- [ ] AI recommendations improve follow-up success rates by 25%
- [ ] Predictive insights update daily with new interaction data

#### Custom Attributes System
- [ ] Admin can create unlimited custom attributes with different field types
- [ ] Custom attributes display in member forms and profiles
- [ ] Custom attribute values save and sync correctly
- [ ] Search includes custom attribute values
- [ ] Bulk editing of custom attributes works for multiple members
- [ ] Custom attributes work completely offline

#### Person Badges System
- [ ] Admin can create custom badge types with colors and icons
- [ ] Users can assign/remove badges from members
- [ ] Badges display prominently in member profiles and lists
- [ ] Badge filtering works in member search
- [ ] Badge assignments sync correctly online/offline
- [ ] Badge conflicts and duplicates are handled properly

#### Enhanced Notes System
- [ ] Users can add notes with privacy level settings
- [ ] Alert notes display prominently in member profiles
- [ ] Note categorization and search works correctly
- [ ] Pinned notes stay at top of member profile
- [ ] Privacy controls restrict note visibility appropriately
- [ ] Notes search across all members functions properly

#### Advanced Family Relationships
- [ ] Detailed relationship types (spouse, parent-child, etc.) work correctly
- [ ] Relationship details (dates, custody info) save properly
- [ ] Family tree visualization displays complex relationships
- [ ] Relationship timeline tracks changes accurately
- [ ] Blended family structures are supported
- [ ] Household vs. family distinction is maintained

### Technical Acceptance (Enhanced)
- [ ] Works completely offline with local storage for all enhanced features
- [ ] Syncs data when internet connection available (members, attributes, badges, notes, relationships)
- [ ] Search is fast even with 1000+ members and extensive custom attributes
- [ ] Works on Android devices (tested on mid-range phones)
- [ ] Passes accessibility tests (WCAG AA) including enhanced features
- [ ] Has 85%+ test coverage for all enhanced functionality
- [ ] Custom attributes system handles all field types correctly
- [ ] Badge system performs well with multiple badges per member
- [ ] Notes system maintains privacy controls and search performance
- [ ] Family relationships handle complex structures without performance degradation
- [ ] Database queries optimized for enhanced features (proper indexing)
- [ ] API endpoints handle enhanced features with proper validation and error handling

### Africa-First Acceptance
- [ ] Functions without internet connection
- [ ] Fast search and navigation on mobile
- [ ] Minimal data usage for sync operations
- [ ] Works reliably on Android 8+ devices
- [ ] Simple, intuitive member management

## Testing Strategy

### Unit Tests (Enhanced)
- Test member model validation with custom attributes
- Test search functionality including custom attributes and badges
- Test family linking logic with detailed relationships
- Test offline storage operations for all enhanced features
- Test custom attribute field type validation and conversion
- Test badge assignment and removal logic
- Test notes privacy level enforcement
- Test family relationship validation and constraints

### Integration Tests (Enhanced)
- Test API endpoints with database for all enhanced features
- Test member sync operations including custom attributes, badges, and notes
- Test search with large datasets and complex custom attributes
- Test family relationship queries with complex structures
- Test custom attribute CRUD operations with proper validation
- Test badge system with multiple badge assignments
- Test notes system with privacy controls and search functionality
- Test bulk operations for custom attributes and badge assignments

### E2E Tests (Enhanced)
- Test complete member management workflow with all enhanced features
- Test offline member addition and sync including custom attributes
- Test mobile member search and editing with badges and notes
- Test family management scenarios with detailed relationships
- Test custom attribute creation and assignment workflow
- Test badge management and assignment workflow
- Test notes creation with privacy levels and alerts
- Test advanced family relationship management
- Test bulk editing of custom attributes across multiple members
- Test search functionality across all enhanced features

## Dependencies and Risks

### Dependencies
- Organization setup must be completed first
- Laravel backend with member APIs
- Vue 3 frontend with offline storage
- Supabase real-time subscriptions

### Risks and Mitigation
- **Risk:** Large member lists slow down mobile performance
  **Mitigation:** Implement pagination and virtual scrolling
- **Risk:** Offline sync conflicts with member data
  **Mitigation:** Timestamp-based conflict resolution with user notification

## Performance Considerations

### Metrics to Track
- Member search response time
- Member list loading time
- Sync operation duration
- Mobile scroll performance

### Optimization Strategies
- Index member names for fast search
- Implement virtual scrolling for large lists
- Cache frequently accessed members
- Optimize images and member photos

## Security Considerations

### Authentication/Authorization
- Only authenticated users can access members
- Role-based permissions for member editing
- Organization-level data isolation

### Data Protection
- Encrypt sensitive member information
- Validate all member data inputs
- Audit trail for member data changes
- GDPR compliance for member data

## Rollout Plan

### Development Phases
1. **Phase 1:** Basic member CRUD operations
2. **Phase 2:** Search and filtering functionality
3. **Phase 3:** Family linking and management
4. **Phase 4:** Offline sync and conflict resolution

### Testing Phases
1. **Unit/Integration Testing**
2. **Performance Testing with Large Datasets**
3. **Mobile Device Testing**
4. **User Acceptance Testing**

### Deployment Strategy
- Deploy incrementally with feature flags
- Monitor member data sync performance
- Gradual rollout to avoid data issues

## Success Metrics

### Quantitative Metrics
- Member addition success rate > 98%
- Search response time < 1 second
- Sync success rate > 95%
- Mobile usage rate > 70%

### Qualitative Metrics
- User satisfaction with member management
- Ease of finding members during services
- Effectiveness of family management features

## Future Enhancements

### Implemented Enhancements (RockRMS Competitive Parity)
- ✅ Custom attributes system (unlimited custom fields)
- ✅ Person badges and visual indicators
- ✅ Enhanced notes with alerts and privacy
- ✅ Advanced family relationship management
- ✅ Comprehensive search across all features
- ✅ Bulk editing capabilities

### Future Enhancements (Post-MVP)
- Member photo support with image optimization
- Advanced member analytics and reporting
- Member communication preferences and history
- Import/export member data (CSV, Excel)
- Member attendance history integration
- AI-powered duplicate detection and member matching
- Advanced member segmentation and targeting
- Member lifecycle tracking and automation
- Integration with external church management systems
- Advanced reporting and dashboard widgets for member data

### Technical Debt and Optimizations
- Consider more sophisticated search (fuzzy matching, phonetic search)
- Add member data analytics and insights
- Optimize for very large member databases (10,000+)
- Implement advanced caching strategies for custom attributes
- Add database partitioning for large organizations
- Optimize badge and notes queries for performance
- Add advanced indexing for complex family relationship queries
- Consider NoSQL storage for highly dynamic custom attributes

## 🎯 Competitive Analysis Summary

### RockRMS Feature Parity Achieved
This enhanced specification achieves competitive parity with RockRMS in the following critical areas:

#### ✅ Custom Attributes System
- **RockRMS**: Unlimited custom fields per person with categories and validation
- **Our Implementation**: Comprehensive custom attributes with 8 field types, categories, and bulk editing
- **Competitive Advantage**: Modern Vue 3 UI with better mobile experience

#### ✅ Person Badges System
- **RockRMS**: Visual badges for member status and roles
- **Our Implementation**: Flexible badge system with colors, icons, and filtering
- **Competitive Advantage**: Modern design with better mobile touch interactions

#### ✅ Enhanced Notes System
- **RockRMS**: Notes with alerts, privacy settings, and categorization
- **Our Implementation**: Comprehensive notes with privacy levels, alerts, and search
- **Competitive Advantage**: Better search functionality and mobile-optimized interface

#### ✅ Advanced Family Management
- **RockRMS**: Complex family relationships and household management
- **Our Implementation**: Detailed relationships with timeline and visual family tree
- **Competitive Advantage**: Modern relationship visualization and mobile-first design

### Strategic Positioning
With these enhancements, ChMS now offers:
1. **Feature Parity**: Matches RockRMS core member management capabilities
2. **Modern Technology**: Vue 3, Laravel 11 vs. RockRMS's older ASP.NET Web Forms
3. **Mobile-First**: Optimized for African mobile usage patterns
4. **Offline-First**: Complete functionality without internet connection
5. **Cost-Effective**: Lower hosting and maintenance costs
6. **Nigeria-First**: Designed for Nigerian church needs and infrastructure

### Implementation Priority
- **P0 (Critical)**: Custom attributes, person badges, enhanced notes
- **P1 (High)**: Advanced family relationships, bulk editing
- **P2 (Medium)**: Advanced search, analytics integration

This enhanced Member Management system positions ChMS as a modern, comprehensive church management solution while maintaining our Africa-first advantages.
