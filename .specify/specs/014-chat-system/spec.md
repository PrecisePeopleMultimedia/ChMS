# SPEC 013: Chat System

## Overview

The Chat System provides real-time communication capabilities for church communities, enabling pastors, staff, and members to communicate effectively within the ChurchAfrica ChMS platform.

## Business Context

### Problem Statement
Churches need effective communication channels to:
- Coordinate ministry activities and events
- Provide pastoral care and support
- Share announcements and updates
- Build community connections
- Enable prayer request sharing
- Facilitate team collaboration

### Solution
A comprehensive chat system integrated into the ChMS platform that provides:
- Real-time messaging with conversation history
- Role-based communication channels
- File and media sharing capabilities
- Mobile-optimized interface
- Offline message queuing and sync

## User Stories

### Primary User Stories
- **As a** pastor, **I want** to communicate directly with congregation members **so that** I can provide guidance and support
- **As a** church administrator, **I want** to coordinate with ministry teams **so that** events and activities run smoothly
- **As a** church member, **I want** to share prayer requests **so that** I can receive community support
- **As a** ministry leader, **I want** to organize team discussions **so that** we can plan and execute our ministry effectively

### Secondary User Stories
- **As a** church staff member, **I want** to receive urgent notifications **so that** I can respond quickly to important matters
- **As a** church member, **I want** to participate in group discussions **so that** I can stay connected with my church community
- **As a** church administrator, **I want** to moderate conversations **so that** discussions remain appropriate and constructive

## Core Features

### 1. Real-Time Messaging
- **Instant messaging** with typing indicators
- **Message delivery status** (sent, delivered, read)
- **Message history** with search functionality
- **Emoji reactions** and basic formatting
- **Message threading** for organized discussions

### 2. Conversation Management
- **Direct messages** between individuals
- **Group conversations** for ministry teams
- **Church-wide announcements** channel
- **Prayer request** dedicated channel
- **Event coordination** channels

### 3. Role-Based Access
- **Pastor privileges** - Can message anyone, create announcements
- **Staff privileges** - Can create group conversations, moderate discussions
- **Member privileges** - Can participate in assigned conversations
- **Guest privileges** - Limited access to public announcements

### 4. Mobile Integration
- **Bottom navigation** chat tab for easy access
- **Push notifications** for new messages
- **Offline message** queuing and sync
- **Voice message** support for accessibility

### 5. File and Media Sharing
- **Image sharing** with compression for low bandwidth
- **Document sharing** (PDF, Word, etc.)
- **Voice messages** for personal touch
- **Link previews** with metadata

## Prototype Design Requirements (TweakCN Theme)

### Chat UI Patterns
**⚠️ CRITICAL**: The chat system must implement the prototype's chat UI patterns exactly:

#### ChatSidebar Component (Secondary Sidebar)
- **Width**: 320px, collapsible
- **Background**: `oklch(0.1822 0 0)` (dark background)
- **Conversation List**: 
  - Card styling: `oklch(0.2046 0 0)` (card background)
  - Border: `oklch(0.2809 0 0)` (border color)
  - Hover: Accent color with smooth transition
- **Active Conversation**: Highlighted with primary green `oklch(0.4365 0.1044 156.7556)`
- **Unread Badge**: Primary green with white text

#### MessageList Component
- **Message Bubbles**: 
  - Sent: Primary green background `oklch(0.4365 0.1044 156.7556)`
  - Received: Card background `oklch(0.2046 0 0)`
  - Border Radius: `0.5rem` (8px)
- **Message Text**: Geist font, regular weight (400)
- **Timestamps**: Muted foreground `oklch(0.7122 0 0)`
- **Status Indicators**: Read/delivered with OKLCH colors

#### MessageInput Component
- **Input Field**: 
  - Background: `oklch(0.2603 0 0)` (input background)
  - Border: `oklch(0.2809 0 0)` (border color)
  - Focus ring: `oklch(0.8003 0.1821 151.7110)` (ring color)
- **Send Button**: Primary green button
- **Emoji Picker**: Match prototype's emoji picker design

#### ConversationHeader Component
- **Header Background**: Card background `oklch(0.2046 0 0)`
- **Participant Info**: Geist font, light weight (300)
- **Online Status**: Primary green indicator

#### TypingIndicator Component
- **Animated Dots**: Use primary green color
- **Animation**: Smooth, 300ms ease-in-out

#### FileUpload Component
- **Upload Area**: Card styling with border
- **Progress Bar**: Primary green progress indicator
- **File Preview**: Match prototype's preview design

### Mobile Chat UI
- **Bottom Navigation**: Always visible on mobile (as per prototype)
- **Chat Tab**: Icon + label with active state
- **Notification Badge**: Unread count with primary green
- **Fullscreen Chat**: On mobile, chat takes full viewport

### Component Styling Requirements
- **Colors**: Use OKLCH color system throughout
- **Typography**: Geist font, light weights for headings, regular for body
- **Spacing**: Match prototype's spacing system (4px, 8px, 16px, etc.)
- **Shadows**: Use prototype's shadow system for elevation
- **Border Radius**: `0.5rem` (8px) base radius
- **Animations**: Smooth transitions (150ms-300ms ease-in-out)

## Technical Requirements

### Frontend Components
- **ChatSidebar.vue** - Conversation list and navigation
- **MessageList.vue** - Message display with infinite scroll
- **MessageInput.vue** - Text input with emoji picker
- **ConversationHeader.vue** - Chat title and participant info
- **MessageBubble.vue** - Individual message display
- **TypingIndicator.vue** - Real-time typing status
- **FileUpload.vue** - Media and document sharing

### Backend Services
- **ChatService** - Message handling and persistence
- **ConversationService** - Conversation management
- **NotificationService** - Push notification delivery
- **FileService** - Media upload and storage
- **ModerationService** - Content filtering and moderation

### Database Schema
```sql
-- Conversations table
conversations (id, type, name, description, created_by, created_at, updated_at)

-- Conversation participants
conversation_participants (conversation_id, user_id, role, joined_at, last_read_at)

-- Messages table
messages (id, conversation_id, user_id, content, type, file_url, reply_to, created_at, updated_at)

-- Message reactions
message_reactions (message_id, user_id, emoji, created_at)
```

### Real-Time Integration
- **Laravel WebSockets** or **Pusher** for real-time messaging
- **Vue 3 Composition API** for reactive message updates
- **Pinia store** for chat state management
- **Service Worker** for offline message queuing

## UI/UX Design

### Design System Integration
- **Green Dark Theme** - Primary color #1CE479 for active states
- **Dark Background** - #0A0A0F for main chat interface
- **Card Styling** - #1A1A20 for message bubbles and conversation cards
- **Typography** - Archivo font for clean, readable messages
- **Glass Morphism** - Subtle transparency effects for modern feel

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar]     │ [Chat Header]                           │
│ [Convos]      │ ┌─────────────────────────────────────┐ │
│ [Search]      │ │ [Message List]                      │ │
│ [New Chat]    │ │ [Message Bubbles]                   │ │
│               │ │ [Typing Indicator]                  │ │
│               │ └─────────────────────────────────────┘ │
│               │ [Message Input] [Send] [Attach]         │
└─────────────────────────────────────────────────────────┘
```

### Mobile Considerations
- **Bottom navigation** integration with chat tab
- **Swipe gestures** for message actions
- **Pull-to-refresh** for message history
- **Floating action button** for new conversations
- **Optimized touch targets** (48px minimum)

## Implementation Phases

### Phase 1: Core Messaging (P0)
- [ ] Basic message sending and receiving
- [ ] Conversation list and navigation
- [ ] Real-time message updates
- [ ] Message persistence and history
- [ ] Basic user authentication integration

### Phase 2: Enhanced Features (P1)
- [ ] File and image sharing
- [ ] Message reactions and formatting
- [ ] Typing indicators and read receipts
- [ ] Push notifications
- [ ] Offline message queuing

### Phase 3: Advanced Features (P2)
- [ ] Voice messages
- [ ] Message threading
- [ ] Advanced search and filtering
- [ ] Message moderation tools
- [ ] Analytics and reporting

## Success Metrics

### Engagement Metrics
- **Daily active users** in chat system
- **Messages sent per day** across all conversations
- **Response time** for pastoral care messages
- **Conversation participation rate** by role

### Technical Metrics
- **Message delivery time** < 500ms
- **Offline sync success rate** > 95%
- **Mobile app crash rate** < 1%
- **File upload success rate** > 98%

### User Satisfaction
- **User adoption rate** within 30 days
- **Feature usage distribution** across chat features
- **User feedback scores** for communication effectiveness
- **Support ticket reduction** due to improved communication

## Security and Privacy

### Data Protection
- **End-to-end encryption** for sensitive conversations
- **Message retention policies** with automatic cleanup
- **Role-based access control** for conversation visibility
- **Audit logging** for administrative actions

### Content Moderation
- **Automated content filtering** for inappropriate content
- **Report and block functionality** for users
- **Administrative moderation tools** for staff
- **Community guidelines** enforcement

## Integration Points

### ChMS Integration
- **Member directory** integration for user lookup
- **Event system** integration for event-related discussions
- **Attendance system** integration for follow-up communications
- **Prayer request** system integration for pastoral care

### External Services
- **Push notification** services (FCM, APNs)
- **File storage** services (Supabase Storage)
- **Real-time messaging** services (Pusher, WebSockets)
- **Content moderation** APIs for safety

## Acceptance Criteria

### Functional Requirements
- [ ] Users can send and receive messages in real-time
- [ ] Conversations are organized by type and participants
- [ ] File sharing works with appropriate size limits
- [ ] Offline messages sync when connection is restored
- [ ] Push notifications work on mobile devices

### Performance Requirements
- [ ] Messages load within 2 seconds
- [ ] Real-time updates have < 500ms latency
- [ ] File uploads complete within 30 seconds
- [ ] Chat interface remains responsive with 1000+ messages
- [ ] Offline functionality works for 24+ hours

### Accessibility Requirements
- [ ] Screen reader compatibility for all chat features
- [ ] Keyboard navigation for all interactive elements
- [ ] High contrast mode support
- [ ] Voice message alternatives for hearing impaired
- [ ] Large text support for visually impaired users
