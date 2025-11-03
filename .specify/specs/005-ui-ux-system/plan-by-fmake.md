Perfect! Now I have complete context. Let me analyze what I need to do:



Tech Stack Clarification: The user wants Vue 3 + Quasar + Laravel for production, but we're building a React prototype in Figma Make as a reference implementation (Option 3 - Hybrid Approach)


New Information from SPEC.MD and TASK.MD:
Green Dark Theme with specific colors: #1CE479 (primary), #0A0A0F (background), #1A1A20 (card), #2A2A35 (secondary)
Archivo font family
Material Design 3 approach
Offline-first visual feedback
PWA features with install prompts
Customizable dashboard with drag-and-drop
Chat feature integration (already in my plan)
High contrast mode
Africa-first mobile optimization (48px touch targets, one-handed operation)
Performance targets: <3s load on 3G, 60fps animations, <50KB overhead
WCAG AA compliance


Current File Structure: Basic Figma Make setup with shadcn/ui components, Supabase connected, globals.css ready for theming


User is using spec-kit from GitHub for project management - this is just organizational, doesn't affect implementation


Let me create a comprehensive, detailed plan that:

Incorporates ALL requirements from the SPEC.MD and TASK.MD
Maintains my original structure but enhances it with the new details
Clearly separates React prototype vs Vue production documentation
Provides clear mapping for Vue team
Follows the Green Dark Theme specifications
Includes all Africa-first optimizations
Covers PWA features
Includes customizable dashboard
Has complete chat system


I'll organize this into a clear, numbered plan.

Perfect! Now I have complete context. Let me provide the comprehensive detailed implementation plan incorporating all your specifications.



---



🚀 ChurchAfrica ChMS - Complete Implementation Plan
Hybrid Approach: React Prototype → Vue 3 + Quasar + Laravel Production


---



📊 Project Overview


Development Strategy
Phase 1: Build fully functional React + Tailwind + Supabase prototype in Figma Make
Phase 2: Document React → Vue 3 + Quasar component mappings
Phase 3: Provide Supabase → Laravel + PostgreSQL migration guide
Phase 4: Create production deployment specifications


Tech Stack Mapping


| React Prototype (Figma Make) | Production (Your Stack) | Migration Notes |
|------------------------------|-------------------------|-----------------|
| React + Composition Pattern | Vue 3 + Composition API | Similar reactive patterns |
| shadcn/ui components | Quasar Framework components | Direct component mapping |
| Tailwind CSS utilities | Tailwind CSS (same) | No changes needed |
| Supabase (PostgreSQL) | Laravel + PostgreSQL | Schema export, API rewrite |
| Supabase Auth | Laravel Sanctum | Auth pattern documentation |
| Supabase Realtime | Laravel WebSockets/Pusher | Real-time migration guide |
| React state management | Pinia stores | State pattern mapping |



---



🎨 Design System Foundation


Green Dark Theme Specifications
```css
/* globals.css - Primary Theme Tokens */
:root {
  /* Green Dark Theme (Default) */
  --color-primary: #1CE479;           /* Bright neon green */
  --color-background: #0A0A0F;        /* Very dark navy */
  --color-card: #1A1A20;              /* Card background */
  --color-secondary: #2A2A35;         /* Medium dark grey */
  --color-accent: #FFB800;            /* Orange accent for charts */
  
  /* Semantic Colors */
  --color-success: #1CE479;
  --color-warning: #FFB800;
  --color-error: #FF4444;
  --color-info: #4A9EFF;
  
  /* Typography */
  --font-family: 'Archivo', -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* Spacing (Material Design 3) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* Touch Targets (Africa-First) */
  --touch-target-min: 48px;          /* Minimum 48px for accessibility */
  
  /* Shadows (Glass Morphism) */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  
  /* Glass Effect */
  --glass-bg: rgba(26, 26, 32, 0.7);
  --glass-border: rgba(28, 228, 121, 0.1);
}



/* Light Mode (Secondary Theme) */
[data-theme="light"] {
  --color-primary: #1CE479;
  --color-background: #FFFFFF;
  --color-card: #F8F9FA;
  --color-secondary: #E9ECEF;
  --color-accent: #FFB800;
}



/* High Contrast Mode (Accessibility) */
[data-theme="high-contrast"] {
  --color-primary: #00FF00;           /* Pure green */
  --color-background: #000000;        /* Pure black */
  --color-card: #1A1A1A;
  --color-secondary: #333333;
}
```



---



📋 Detailed Phase-by-Phase Plan


---



PHASE 1: Foundation & Design System (Week 1, Days 1-2)


1.1 Design System Setup ✅ PRIORITY
Estimated Time: 4 hours



Tasks:
Update `styles/globals.css` with Green Dark Theme tokens
Configure Archivo font from Google Fonts
Set up theme switching infrastructure
Create theme context/provider


Deliverables:
```typescript
// /lib/theme-config.ts
export const themeTokens = {
  greenDark: { /* tokens */ },
  light: { /* tokens */ },
  highContrast: { /* tokens */ }
}



// /components/theme/ThemeProvider.tsx
// Theme context and switching logic



// /components/theme/ThemeToggle.tsx  
// UI component for theme switching
```



Vue Migration Notes:
```typescript
// React Context → Vue Provide/Inject
// React: <ThemeProvider>
// Vue: provide('theme', themeState)



// React: useTheme() hook
// Vue: const theme = inject('theme')
```



---



1.2 Layout Architecture ✅ PRIORITY
Estimated Time: 6 hours



Tasks:
Create 3-column responsive grid system
Build navigation components
Implement mobile bottom navigation
Set up routing structure


Component Structure:
```
/components/layout/
├── AppLayout.tsx              # Main 3-column layout
├── Sidebar.tsx                # Left sidebar (280px)
├── MainContent.tsx            # Center content (flexible)
├── SecondarySidebar.tsx       # Right sidebar (320px) - Chat
├── Header.tsx                 # Top header with search/profile
├── MobileBottomNav.tsx        # Mobile navigation (5 tabs max)
└── NavigationItems.tsx        # Navigation menu items
```



Responsive Behavior:
```typescript
// Desktop: 3 columns (280px + flex + 320px)
// Tablet: 2 columns (collapsible sidebar + main)
// Mobile: 1 column with bottom nav



const breakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1440
}
```



Vue Migration Notes:
```vue
<!-- React: <AppLayout> component -->
<!-- Vue: <q-layout view="hHh lpR fFf"> Quasar layout -->



<!-- React: CSS Grid/Flexbox -->
<!-- Vue: Quasar Grid (q-page, q-drawer) -->
```



---



1.3 Offline-First Infrastructure ✅ PRIORITY
Estimated Time: 4 hours



Tasks:
Set up Service Worker for caching
Implement sync queue for offline actions
Create offline indicators
Build background sync logic


Components:
```typescript
// /lib/offline/service-worker.ts
// Service worker registration and caching strategies



// /lib/offline/sync-queue.ts
// Queue for offline operations



// /components/offline/OfflineIndicator.tsx
// Connection status component



// /components/offline/SyncProgress.tsx
// Sync progress indicator
```



Caching Strategy:
```typescript
// Cache-first: Static assets, images, fonts
// Network-first: API calls, dynamic data
// Stale-while-revalidate: Dashboard data
```



Vue Migration Notes:
```typescript
// Same Service Worker approach
// Vue: Quasar PWA plugin handles service worker
// Sync queue: Pinia store with persistence
```



---



PHASE 2: Authentication System (Week 1, Days 3-4)


2.1 Authentication UI Components ✅ PRIORITY
Estimated Time: 6 hours



Components to Build:
```
/components/auth/
├── AuthLayout.tsx             # Auth page wrapper
├── LoginForm.tsx              # Email/password login
├── RegisterForm.tsx           # Multi-step registration
├── PasswordReset.tsx          # Password recovery
├── SocialLogin.tsx            # Google/Facebook OAuth
└── RoleSelector.tsx           # Role selection (Pastor, Staff, etc.)
```



Features:
Email/password authentication via Supabase
Social login (Google, Facebook)
Role-based registration (Pastor, Staff, Volunteer, Member)
Password strength validation
Offline authentication caching
"Remember me" functionality


Database Schema (Supabase):
```sql
-- Users table (extended from auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  church_id UUID REFERENCES churches(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50), -- 'pastor', 'staff', 'volunteer', 'member'
  photo_url TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);



-- Churches table
CREATE TABLE churches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  country VARCHAR(100),
  city VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```



Vue Migration Notes:
```typescript
// React: Supabase auth.signInWithPassword()
// Laravel: POST /api/auth/login with Sanctum



// React: useAuth() hook
// Vue: useAuthStore() Pinia composable



// React: Protected routes with <Route>
// Vue: router.beforeEach() navigation guard
```



---



2.2 Supabase Auth Integration
Estimated Time: 3 hours



Server-Side Setup:
```typescript
// /supabase/functions/server/auth-routes.tsx
import { Hono } from 'npm:hono';
import { createClient } from 'npm:@supabase/supabase-js';



const app = new Hono();



// Sign up route
app.post('/make-server-1b8f0a52/auth/signup', async (c) => {
  const { email, password, firstName, lastName, role } = await c.req.json();
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm for demo
    user_metadata: { firstName, lastName, role }
  });
  
  return c.json({ data, error });
});



// Sign in route (handled by Supabase client-side)
// Social auth routes (Google, Facebook)
```



Laravel Migration:
```php
// app/Http/Controllers/AuthController.php
public function signup(Request $request) {
    $validated = $request->validate([
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8',
        'first_name' => 'required',
        'last_name' => 'required',
        'role' => 'required|in:pastor,staff,volunteer,member'
    ]);
    
    $user = User::create([
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'first_name' => $validated['first_name'],
        'last_name' => $validated['last_name'],
        'role' => $validated['role']
    ]);
    
    return response()->json([
        'user' => $user,
        'token' => $user->createToken('auth_token')->plainTextToken
    ]);
}
```



---



PHASE 3: Dashboard System (Week 1-2, Days 5-7)


3.1 Dashboard Layout with Exact Card Specifications ✅ PRIORITY
Estimated Time: 8 hours



Top Metrics Bar (4 KPI Cards - Always Visible):
```typescript
// /components/dashboard/metrics/
├── TotalMembersCard.tsx       // Current count + monthly growth
├── WeeklyAttendanceCard.tsx   // Last Sunday + trend arrow
├── MonthlyGivingCard.tsx      // Current month + % vs budget
└── ActiveVolunteersCard.tsx   // Count who served this month



// Data structure for each metric:
interface MetricCardData {
  value: number | string;
  label: string;
  trend: {
    direction: 'up' | 'down' | 'stable';
    value: number;
    period: string;
  };
  icon: LucideIcon;
  color: string;
}



// Example:
{
  value: 1247,
  label: "Total Members",
  trend: { direction: 'up', value: 12, period: 'this month' },
  icon: Users,
  color: 'primary'
}
```



Main Dashboard Grid (8 Customizable Cards):
```typescript
// /components/dashboard/cards/
├── RecentMembersCard.tsx      // Last 5 members with photos
├── UpcomingEventsCard.tsx     // Next 3 events with RSVP counts
├── PrayerRequestsCard.tsx     // Latest 3 with "Pray" buttons
├── AttendanceTrendsChart.tsx  // 12-week line chart (recharts)
├── GivingTrendsChart.tsx      // 6-month bar chart (recharts)
├── MinistryTeamsCard.tsx      // Teams + member counts
├── ActivityFeedCard.tsx       // Last 10 actions with timestamps
└── QuickActionsCard.tsx       // 4 action buttons



// Card sizing options:
type CardSize = '1x1' | '2x1' | '2x2';



interface DashboardCard {
  id: string;
  component: ComponentType;
  size: CardSize;
  position: { x: number; y: number };
  visible: boolean;
}
```



Sidebar Quick Stats:
```typescript
// /components/dashboard/sidebar/
├── ThisWeekStats.tsx          // Attendance, new members, events
├── ThisMonthStats.tsx         // Giving, volunteer hours, prayers
└── AlertsPanel.tsx            // Birthdays, upcoming events, tasks
```



---



3.2 Customizable Dashboard System ✅ KEY FEATURE
Estimated Time: 6 hours



Features:
Drag-and-Drop Rearrangement (react-dnd)
Show/Hide Toggle for each card
Card Size Selection (1x1, 2x1, 2x2)
Role-Based Defaults:
Pastor: Giving, attendance, prayer requests, member growth
Staff: Events, volunteers, member check-ins, announcements
Volunteer: Events, ministry teams, prayer requests, quick actions
Mobile Priority (choose 3 cards for mobile view)
Layout Persistence (save to user profile)


Implementation:
```typescript
// /components/dashboard/DashboardCustomizer.tsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';



const DashboardCustomizer = () => {
  const [cards, setCards] = useState<DashboardCard[]>(defaultCards);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const handleDrop = (cardId: string, newPosition: Position) => {
    // Update card position
  };
  
  const toggleCardVisibility = (cardId: string) => {
    // Show/hide card
  };
  
  const changeCardSize = (cardId: string, newSize: CardSize) => {
    // Resize card
  };
  
  const saveDashboardLayout = async () => {
    // Save to Supabase user preferences
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      {/* Dashboard grid with draggable cards */}
    </DndProvider>
  );
};
```



Database Schema:
```sql
CREATE TABLE dashboard_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  layout_config JSONB, -- Card positions, sizes, visibility
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```



Vue Migration Notes:
```vue
<!-- React: react-dnd for drag-and-drop -->
<!-- Vue: vue-draggable-next or Quasar's q-card with draggable -->



<!-- React: useState for layout state -->
<!-- Vue: ref() with Pinia store persistence -->
```



---



3.3 Charts and Data Visualization
Estimated Time: 4 hours



Chart Components (recharts library):
```typescript
// /components/dashboard/charts/
├── AttendanceTrendChart.tsx   // Line chart (12 weeks)
├── GivingTrendChart.tsx       // Bar chart (6 months)
├── MemberGrowthChart.tsx      // Area chart
└── MinistryDistChart.tsx      // Pie chart



// Example: Attendance Trend Chart
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';



const AttendanceTrendChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <XAxis dataKey="week" stroke="var(--color-secondary)" />
      <YAxis stroke="var(--color-secondary)" />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--glass-border)'
        }} 
      />
      <Line 
        type="monotone" 
        dataKey="attendance" 
        stroke="var(--color-primary)" 
        strokeWidth={2}
      />
    </LineChart>
  </ResponsiveContainer>
);
```



---



PHASE 4: Member Management System (Week 2, Days 8-10)


4.1 Member List Interface ✅ PRIORITY
Estimated Time: 8 hours



Components:
```typescript
// /components/members/
├── MemberTable.tsx            // Desktop data table
├── MemberCard.tsx             // Mobile card view
├── MemberFilters.tsx          // Advanced filtering
├── MemberSearch.tsx           // Search with autocomplete
├── BulkActions.tsx            // Bulk operations
├── MemberPagination.tsx       // Pagination component
└── MemberExport.tsx           // Export functionality
```



Features:
Sortable columns (name, join date, status, attendance rate)
Advanced filters (status, ministry, attendance range, age group)
Search with debounced autocomplete
Bulk operations (export, message, assign ministry, delete)
Infinite scroll + traditional pagination
Export to CSV/Excel


Database Schema:
```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  photo_url TEXT,
  date_of_birth DATE,
  gender VARCHAR(20),
  address TEXT,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'new'
  membership_date DATE DEFAULT CURRENT_DATE,
  family_id UUID REFERENCES families(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);



CREATE TABLE member_ministries (
  member_id UUID REFERENCES members(id),
  ministry_id UUID REFERENCES ministries(id),
  role VARCHAR(100),
  joined_date DATE DEFAULT CURRENT_DATE,
  PRIMARY KEY (member_id, ministry_id)
);



CREATE TABLE ministries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES members(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```



---



4.2 Member Profile & Details
Estimated Time: 6 hours



Components:
```typescript
// /components/members/profile/
├── MemberProfile.tsx          // Main profile view
├── ProfileHeader.tsx          // Photo, name, status
├── PersonalInfo.tsx           // Contact & demographics
├── AttendanceHistory.tsx      // Attendance records
├── MinistryInvolvement.tsx    // Ministry assignments
├── FamilyConnections.tsx      // Family relationships
├── GivingHistory.tsx          // Donation records (if permitted)
├── CommunicationLog.tsx       // Messages & interactions
└── NotesSection.tsx           // Admin notes
```



Member Data Interface:
```typescript
interface Member {
  id: string;
  churchId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  status: 'active' | 'inactive' | 'new';
  membershipDate: Date;
  familyId?: string;
  ministries: Ministry[];
  attendanceRate: number;
  lastAttended?: Date;
  totalAttendances: number;
  createdAt: Date;
  updatedAt: Date;
}
```



---



4.3 Add/Edit Member Forms
Estimated Time: 5 hours



Multi-Step Form:
```typescript
// /components/members/forms/
├── MemberForm.tsx             // Main form wrapper
├── PersonalInfoStep.tsx       // Step 1: Name, contact, photo
├── DemographicsStep.tsx       // Step 2: DOB, gender, address
├── FamilyConnectionStep.tsx   // Step 3: Family relationships
├── MinistryAssignmentStep.tsx // Step 4: Ministry involvement
└── ReviewSubmitStep.tsx       // Step 5: Review & submit



// Form state management
const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState<Partial<Member>>({});



const steps = [
  { label: 'Personal Info', component: PersonalInfoStep },
  { label: 'Demographics', component: DemographicsStep },
  { label: 'Family', component: FamilyConnectionStep },
  { label: 'Ministries', component: MinistryAssignmentStep },
  { label: 'Review', component: ReviewSubmitStep }
];
```



Photo Upload with Cropping:
```typescript
// /components/members/forms/PhotoUpload.tsx
// - Upload to Supabase Storage
// - Client-side image cropping
// - Thumbnail generation
// - Offline queueing
```



---



PHASE 5: Chat System (Week 2-3, Days 11-14)


5.1 Chat Interface Components ✅ PRIORITY
Estimated Time: 10 hours



Components:
```typescript
// /components/chat/
├── ChatLayout.tsx             // Chat wrapper layout
├── ChatSidebar.tsx            // Conversation list
├── ConversationList.tsx       // Active conversations
├── ConversationItem.tsx       // Individual conversation
├── MessageInterface.tsx       // Main chat area
├── MessageList.tsx            // Message history
├── MessageBubble.tsx          // Individual message
├── MessageInput.tsx           // Input with attachments
├── TypingIndicator.tsx        // Real-time typing status
├── UserAvatar.tsx             // User profile picture
├── OnlineStatus.tsx           // Online/offline indicator
└── ChatNotifications.tsx      // Unread badges & sounds
```



Chat Features:
Conversation Types:
Direct messages (1-on-1)
Group chats (ministry teams, events)
Announcement channels (broadcast only)
   
Message Types:
Text messages
File attachments (images, PDFs)
Prayer requests (special formatting)
Event invitations
Announcements


Real-Time Features (Supabase Realtime):
Typing indicators
Message delivery status
Online/offline presence
Read receipts


Mobile Integration:
Slide-out chat panel
Bottom navigation tab
Push notifications
Badge counts


Database Schema:
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL, -- 'direct', 'group', 'ministry', 'announcement'
  name VARCHAR(200),
  church_id UUID REFERENCES churches(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);



CREATE TABLE conversation_participants (
  conversation_id UUID REFERENCES conversations(id),
  user_id UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  PRIMARY KEY (conversation_id, user_id)
);



CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'text', -- 'text', 'file', 'prayer-request', 'announcement'
  file_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);



CREATE TABLE message_status (
  message_id UUID REFERENCES messages(id),
  user_id UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'delivered', 'read'
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (message_id, user_id)
);
```



---



5.2 Real-Time Chat Implementation
Estimated Time: 6 hours



Supabase Realtime Setup:
```typescript
// /lib/chat/realtime.ts
import { createClient } from '@supabase/supabase-js';



const supabase = createClient(/* ... */);



// Subscribe to new messages
const subscribeToMessages = (conversationId: string, callback: Function) => {
  return supabase
    .channel(`conversation:${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    }, (payload) => {
      callback(payload.new);
    })
    .subscribe();
};



// Subscribe to typing indicators
const subscribeToTyping = (conversationId: string, callback: Function) => {
  return supabase
    .channel(`typing:${conversationId}`)
    .on('presence', { event: 'sync' }, () => {
      const state = supabase.channel(`typing:${conversationId}`).presenceState();
      callback(state);
    })
    .subscribe();
};



// Publish typing status
const sendTypingStatus = (conversationId: string, userId: string, isTyping: boolean) => {
  const channel = supabase.channel(`typing:${conversationId}`);
  
  if (isTyping) {
    channel.track({ userId, typing: true });
  } else {
    channel.untrack();
  }
};
```



Laravel Migration (WebSockets):
```php
// Laravel Broadcasting with Pusher
// config/broadcasting.php
'pusher' => [
    'driver' => 'pusher',
    'key' => env('PUSHER_APP_KEY'),
    'secret' => env('PUSHER_APP_SECRET'),
    'app_id' => env('PUSHER_APP_ID'),
];



// app/Events/MessageSent.php
class MessageSent implements ShouldBroadcast {
    use Dispatchable, SerializesModels;
    
    public function broadcastOn() {
        return new PresenceChannel('conversation.' . $this->message->conversation_id);
    }
}



// Vue: Echo.private(`conversation.${conversationId}`)
//     .listen('MessageSent', (e) => { /* handle */ });
```



---



5.3 Church-Specific Chat Features
Estimated Time: 4 hours



Prayer Request System:
```typescript
// /components/chat/PrayerRequestMessage.tsx
interface PrayerRequest {
  id: string;
  messageId: string;
  requestedBy: string;
  prayerText: string;
  prayedBy: string[]; // Array of user IDs who prayed
  createdAt: Date;
}



// Prayer button interaction
const handlePrayerClick = async (requestId: string) => {
  // Add current user to prayedBy array
  // Show toast confirmation
  // Update database
};
```



Announcement Broadcasting:
```typescript
// /components/chat/AnnouncementChannel.tsx
// - Read-only for most users
// - Only admins can post
// - Important updates highlighted
// - Push notification integration
```



Ministry Team Channels:
```typescript
// Auto-created channels for each ministry
// Members automatically added based on ministry assignments
// Event planning discussions
// Volunteer coordination
```



---



PHASE 6: Attendance System (Week 3, Days 15-17)


6.1 Attendance Tracking ✅ PRIORITY
Estimated Time: 8 hours



Components:
```typescript
// /components/attendance/
├── AttendanceLayout.tsx       // Main attendance view
├── QRScanner.tsx              // Mobile QR code scanner
├── QRCodeGenerator.tsx        // Generate member QR codes
├── ManualCheckIn.tsx          // Search & check-in interface
├── AttendanceDashboard.tsx    // Live attendance stats
├── AttendanceReport.tsx       // Analytics & reports
├── ServiceSelector.tsx        // Choose service/event
└── BulkFamilyCheckIn.tsx      // Check in entire families
```



Features:
QR Code Check-In:
Generate unique QR codes for each member
Mobile camera scanner
Instant check-in feedback
Works offline (queued sync)


Manual Check-In:
Search by name/phone/member ID
Quick family check-in
Visitor tracking (non-members)
Guest registration


Live Dashboard:
Real-time attendance count
Attendance rate vs. last week
First-time visitors
Absent members


Reports:
Weekly attendance trends
Member attendance history
Ministry team attendance
Export to Excel/PDF


Database Schema:
```sql
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id),
  event_id UUID REFERENCES events(id),
  check_in_time TIMESTAMPTZ NOT NULL,
  check_in_method VARCHAR(50), -- 'qr', 'manual', 'auto'
  checked_in_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);



CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50), -- 'service', 'meeting', 'event', 'class'
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  location VARCHAR(200),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```



---



6.2 QR Code System
Estimated Time: 4 hours



QR Code Generation:
```typescript
// /lib/attendance/qr-generator.ts
import QRCode from 'qrcode';



const generateMemberQRCode = async (memberId: string) => {
  const qrData = {
    type: 'member-checkin',
    memberId,
    churchId: currentChurch.id,
    timestamp: Date.now()
  };
  
  const qrString = JSON.stringify(qrData);
  const qrCodeDataUrl = await QRCode.toDataURL(qrString);
  
  return qrCodeDataUrl;
};
```



QR Code Scanner (Mobile):
```typescript
// /components/attendance/QRScanner.tsx
import { Html5Qrcode } from 'html5-qrcode';



const QRScanner = () => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  
  const handleScan = async (decodedText: string) => {
    const qrData = JSON.parse(decodedText);
    
    // Check in member
    await checkInMember(qrData.memberId);
    
    // Show success feedback
    toast.success(`${memberName} checked in!`);
  };
  
  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    
    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      handleScan,
      handleError
    );
    
    return () => scanner.stop();
  }, []);
  
  return <div id="qr-reader" />;
};
```



---



6.3 Offline Attendance Sync
Estimated Time: 3 hours



Offline Queue:
```typescript
// /lib/attendance/offline-sync.ts
interface OfflineAttendance {
  id: string;
  memberId: string;
  eventId: string;
  checkInTime: Date;
  synced: boolean;
}



const queueOfflineAttendance = (attendance: OfflineAttendance) => {
  const queue = getOfflineQueue();
  queue.push(attendance);
  saveOfflineQueue(queue);
};



const syncOfflineAttendances = async () => {
  const queue = getOfflineQueue();
  const syncPromises = queue.map(attendance => 
    supabase.from('attendance_records').insert(attendance)
  );
  
  await Promise.all(syncPromises);
  clearOfflineQueue();
};
```



---



PHASE 7: Event Management (Week 4, Days 18-20)


7.1 Event System ✅ PRIORITY
Estimated Time: 8 hours



Components:
```typescript
// /components/events/
├── EventCalendar.tsx          // Calendar view
├── EventList.tsx              // List view
├── EventCard.tsx              // Event card component
├── EventDetails.tsx           // Full event details
├── EventForm.tsx              // Create/edit event
├── RSVPManager.tsx            // RSVP tracking
├── VolunteerAssignment.tsx    // Assign volunteers
└── EventCheckIn.tsx           // Event attendance
```



Features:
Calendar View:
Month/week/day views
Multiple events per day
Color-coded by category
Drag-to-reschedule


Event Types:
Sunday services
Midweek meetings
Special events
Community outreach
Classes/training


RSVP System:
Online registration
Capacity limits
Waitlist management
Automated reminders


Volunteer Management:
Role assignments
Shift scheduling
Volunteer notifications
Check-in tracking


Database Schema:
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  type VARCHAR(50), -- 'service', 'meeting', 'event', 'outreach', 'class'
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  location VARCHAR(200),
  capacity INTEGER,
  requires_rsvp BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);



CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id),
  member_id UUID REFERENCES members(id),
  status VARCHAR(50) DEFAULT 'attending', -- 'attending', 'maybe', 'declined', 'waitlist'
  guests_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);



CREATE TABLE event_volunteers (
  event_id UUID REFERENCES events(id),
  member_id UUID REFERENCES members(id),
  role VARCHAR(100),
  shift_start TIMESTAMPTZ,
  shift_end TIMESTAMPTZ,
  checked_in BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (event_id, member_id, shift_start)
);
```



---



PHASE 8: PWA & Mobile Optimization (Week 4-5, Days 21-23)


8.1 Progressive Web App Setup ✅ PRIORITY
Estimated Time: 6 hours



PWA Configuration:
```typescript
// /public/manifest.json
{
  "name": "ChurchAfrica ChMS",
  "short_name": "ChurchAfrica",
  "description": "Africa-first church management system",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1CE479",
  "background_color": "#0A0A0F",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```



Install Prompt Component:
```typescript
// /components/pwa/InstallPrompt.tsx
const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });
  }, []);
  
  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('App installed successfully!');
    }
    
    setDeferredPrompt(null);
    setShowInstall(false);
  };
  
  if (!showInstall) return null;
  
  return (
    <div className="install-banner">
      <p>Install ChurchAfrica for a better experience</p>
      <button onClick={handleInstall}>Install App</button>
    </div>
  );
};
```



---



8.2 Africa-First Mobile Optimizations
Estimated Time: 5 hours



Touch Optimization:
```css
/* Minimum 48px touch targets */
.btn, .link, .input, .card {
  min-height: 48px;
  min-width: 48px;
}



/* Larger spacing for thumb-friendly UI */
.mobile-nav {
  padding: 16px;
  gap: 16px;
}



/* Prevent text selection on UI elements */
.ui-element {
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
```



One-Handed Operation:
```typescript
// /components/mobile/ThumbReachableNav.tsx
// - Bottom navigation (always within thumb reach)
// - Floating action button (bottom-right corner)
// - Swipe gestures for common actions
// - Pull-down for refresh
```



Performance Optimizations:
```typescript
// /lib/performance/
├── image-optimizer.ts         // Progressive image loading
├── code-splitting.ts          // Route-based code splitting
├── lazy-components.ts         // Lazy load heavy components
└── resource-hints.ts          // Preload/prefetch critical assets
```



---



8.3 Offline Visual Feedback
Estimated Time: 4 hours



Components:
```typescript
// /components/offline/
├── OfflineIndicator.tsx       // Connection status banner
├── SyncProgress.tsx           // Sync progress indicator
├── DataFreshnessIndicator.tsx // Show last updated time
└── OfflineCapabilityBadge.tsx // Show what works offline
```



Implementation:
```typescript
// /components/offline/OfflineIndicator.tsx
const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (isOnline && !isSyncing) return null;
  
  return (
    <div className="offline-banner">
      {!isOnline && (
        <div className="offline-status">
          <WifiOff size={20} />
          <span>You're offline. Changes will sync when online.</span>
        </div>
      )}
      {isSyncing && (
        <div className="sync-status">
          <Loader2 className="animate-spin" size={20} />
          <span>Syncing offline changes...</span>
        </div>
      )}
    </div>
  );
};
```



---



PHASE 9: Testing & Documentation (Week 5, Days 24-25)


9.1 Testing Implementation
Estimated Time: 6 hours



Test Types:
```typescript
// /tests/
├── unit/                      // Component unit tests
│   ├── dashboard.test.tsx
│   ├── members.test.tsx
│   └── chat.test.tsx
├── integration/               // Feature integration tests
│   ├── auth-flow.test.tsx
│   ├── attendance.test.tsx
│   └── events.test.tsx
└── e2e/                       // End-to-end tests (Playwright)
    ├── user-journey.spec.ts
    └── mobile-flow.spec.ts
```



---



9.2 React → Vue Migration Documentation
Estimated Time: 4 hours



Component Mapping Guide:
```markdown

React → Vue 3 Component Migration Guide


State Management
| React | Vue 3 |
|-------|-------|
| useState() | ref(), reactive() |
| useEffect() | watchEffect(), onMounted() |
| useContext() | inject() |
| Redux/Zustand | Pinia stores |



Component Patterns
| React | Vue 3 |
|-------|-------|
| <Component {...props} /> | <Component v-bind="props" /> |
| {condition && <Child />} | <Child v-if="condition" /> |
| {items.map()} | <Child v-for="item in items" :key="item.id" /> |
| children prop | <slot /> |



shadcn/ui → Quasar Components
| shadcn | Quasar |
|--------|--------|
| Button | q-btn |
| Card | q-card |
| Dialog | q-dialog |
| Table | q-table |
| Input | q-input |
| Select | q-select |
```



---



9.3 Supabase → Laravel Migration Guide
Estimated Time: 3 hours



```markdown

Supabase → Laravel Migration Guide


Database Schema Export
Export PostgreSQL schema from Supabase
Convert to Laravel migrations
Seed data conversion


API Endpoint Mapping
| Supabase | Laravel |
|----------|---------|
| supabase.from('members').select() | GET /api/members |
| supabase.from('members').insert() | POST /api/members |
| supabase.from('members').update() | PUT /api/members/{id} |
| supabase.from('members').delete() | DELETE /api/members/{id} |



Real-Time Features
| Supabase Realtime | Laravel |
|-------------------|---------|
| Postgres Changes | Laravel Broadcasting + Pusher |
| Presence | Laravel Echo Presence Channels |



Authentication
| Supabase Auth | Laravel |
|---------------|---------|
| auth.signIn() | POST /api/login (Sanctum) |
| auth.signUp() | POST /api/register |
| auth.signOut() | POST /api/logout |
| auth.getSession() | GET /api/user |
```



---



📦 Final Deliverables


For Your Team
✅ Fully Functional React Prototype (this environment)
✅ Component Library Documentation
✅ API Endpoint Specifications
✅ Database Schema (PostgreSQL)
✅ React → Vue Migration Guide
✅ Supabase → Laravel Migration Guide
✅ Design System Tokens
✅ Performance Optimization Guide
✅ Accessibility Compliance Documentation
✅ Mobile Optimization Guide


---



⏱️ Timeline Summary


| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1: Foundation | 2 days | Design system, layout, offline infrastructure |
| Phase 2: Authentication | 2 days | Login/register, role-based auth |
| Phase 3: Dashboard | 3 days | KPI cards, customizable dashboard, charts |
| Phase 4: Members | 3 days | Member list, profiles, forms |
| Phase 5: Chat | 4 days | Real-time messaging, conversations |
| Phase 6: Attendance | 3 days | QR scanning, check-in, reports |
| Phase 7: Events | 3 days | Calendar, RSVP, volunteers |
| Phase 8: PWA/Mobile | 3 days | PWA setup, mobile optimization |
| Phase 9: Testing/Docs | 2 days | Testing, migration guides |
| TOTAL | 25 days | Full prototype + documentation |



---



🎯 Success Metrics


Performance Targets
[ ] Bundle size < 500KB
[ ] Load time < 3s on 3G
[ ] 60fps animations on mid-range devices
[ ] Touch response < 16ms


Accessibility Targets
[ ] WCAG AA compliance
[ ] 48px minimum touch targets
[ ] Keyboard navigation support
[ ] Screen reader compatible


Africa-First Targets
[ ] Offline-first architecture
[ ] Low-bandwidth optimization
[ ] Mobile-first design
[ ] One-handed operation for 90% of tasks


---



🚀 Ready to Start?


I'm ready to begin building immediately. Shall I start with:

✅ Design System Setup (Green Dark Theme + globals.css)
✅ Layout Architecture (3-column responsive grid)
✅ Authentication System (Login/Register forms)


Which would you like me to prioritize first?