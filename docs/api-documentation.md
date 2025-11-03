# ChMS API Documentation

## Overview

The ChMS (Church Management System) API provides RESTful endpoints for managing church operations, including member management, attendance tracking, and organizational settings. All API endpoints require authentication unless otherwise specified.

## Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:8000/api
```

## Authentication

The API uses Laravel Sanctum for authentication. Include the Bearer token in the Authorization header:

```
Authorization: Bearer {your-token}
```

### Authentication Endpoints

#### POST /auth/login
Authenticate a user and receive an access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "organization_id": 1
    },
    "token": "1|abc123...",
    "organization": {
      "id": 1,
      "name": "Sample Church",
      "is_setup_complete": true
    }
  }
}
```

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "organization_name": "My Church"
}
```

#### POST /auth/logout
Logout the current user and revoke the token.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Health Check

#### GET /health
Check API health status (no authentication required).

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-03T16:25:36+00:00",
  "version": "1.0.0",
  "environment": "local",
  "checks": {
    "database": "healthy",
    "cache": "healthy",
    "storage": "healthy"
  }
}
```

## Organization Management

#### GET /organizations/{id}
Get organization details.

**Response:**
```json
{
  "id": 1,
  "name": "Sample Church",
  "description": "A welcoming community church",
  "address": "123 Church St",
  "city": "Anytown",
  "state": "ST",
  "postal_code": "12345",
  "country": "US",
  "phone": "+1234567890",
  "email": "info@samplechurch.org",
  "website": "https://samplechurch.org",
  "timezone": "America/New_York",
  "is_setup_complete": true
}
```

#### PUT /organizations/{id}
Update organization details.

**Request Body:**
```json
{
  "name": "Updated Church Name",
  "description": "Updated description",
  "address": "456 New St",
  "phone": "+1987654321"
}
```

## Member Management

#### GET /members
List all members with optional filtering.

**Query Parameters:**
- `search` - Search by name, email, or phone
- `family_id` - Filter by family ID
- `status` - Filter by status (active, inactive)
- `page` - Page number for pagination
- `per_page` - Items per page (max 100)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "date_of_birth": "1990-01-01",
      "gender": "male",
      "marital_status": "married",
      "family_id": 1,
      "status": "active",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 50,
    "per_page": 20
  }
}
```

#### POST /members
Create a new member.

**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "date_of_birth": "1985-05-15",
  "gender": "female",
  "marital_status": "single",
  "family_id": 2,
  "address": "789 Member St",
  "city": "Anytown",
  "state": "ST",
  "postal_code": "12345"
}
```

#### GET /members/{id}
Get member details.

#### PUT /members/{id}
Update member information.

#### DELETE /members/{id}
Soft delete a member (sets status to inactive).

## Family Management

#### GET /families
List all families.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "family_name": "The Smiths",
      "head_of_household": "John Smith",
      "address": "123 Family St",
      "phone": "+1234567890",
      "email": "smiths@example.com",
      "members_count": 4,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /families
Create a new family.

#### GET /families/{id}
Get family details with members.

#### PUT /families/{id}
Update family information.

## Family Relationships

### Basic Relationship Management

#### GET /family-relationships
List all family relationships.

**Query Parameters:**
- `family_id` - Filter by family ID
- `member_id` - Filter by member ID
- `relationship_type_id` - Filter by relationship type
- `status` - Filter by status (active, inactive)

#### POST /family-relationships
Create a new family relationship.

**Request Body:**
```json
{
  "family_id": 1,
  "person1_id": 1,
  "person2_id": 2,
  "relationship_type_id": 1,
  "status": "active",
  "is_primary": true,
  "start_date": "2020-06-15",
  "custody_type": "full",
  "custody_start_date": "2023-01-01",
  "custody_notes": "Court-ordered custody",
  "notes": "Additional relationship notes"
}
```

#### GET /family-relationships/{id}
Get relationship details.

#### PUT /family-relationships/{id}
Update relationship information.

#### DELETE /family-relationships/{id}
Delete a relationship.

### Enhanced Relationship Analysis

#### GET /members/{member}/relationships
Get all relationships for a specific member.

**Response:**
```json
{
  "message": "Member relationships retrieved successfully",
  "data": [
    {
      "id": 1,
      "person1_id": 1,
      "person2_id": 2,
      "relationship_type": {
        "id": 1,
        "name": "Spouse",
        "category": "family"
      },
      "status": "active",
      "is_primary": true,
      "start_date": "2020-06-15",
      "custody_type": null,
      "notes": "Married in 2020"
    }
  ]
}
```

#### GET /members/{member}/relationships/analysis
Analyze complex relationships for a member.

**Response:**
```json
{
  "message": "Complex relationship analysis completed",
  "data": {
    "conflicts": [
      {
        "id": "duplicate_1_2",
        "type": "duplicate_relationship",
        "description": "Multiple relationships with Jane Smith",
        "details": "Spouse, Parent",
        "relationships": [...]
      }
    ],
    "cross_family_relationships": [
      {
        "id": 1,
        "person1_name": "John Smith",
        "person2_name": "Mary Johnson",
        "relationship_type": "Guardian",
        "family1": "Smith Family",
        "family2": "Johnson Family",
        "status": "active"
      }
    ],
    "custody_relationships": [
      {
        "id": 2,
        "person1_id": 1,
        "person2_id": 3,
        "custody_type": "full",
        "custody_notes": "Court-ordered custody",
        "custody_start_date": "2023-01-01"
      }
    ],
    "household_overlaps": [
      {
        "member_id": 1,
        "member_name": "John Smith",
        "households": [
          {
            "id": 1,
            "name": "Main House",
            "type": "primary",
            "role": "head",
            "residency_status": "permanent"
          }
        ]
      }
    ],
    "suggestions": [
      {
        "id": "family_1_4",
        "type": "missing_family_relationship",
        "description": "Add relationship with Bobby Smith",
        "reason": "Both members belong to Smith Family",
        "suggested_person1_id": 1,
        "suggested_person2_id": 4
      }
    ]
  }
}
```

#### GET /members/{member}/relationships/statistics
Get relationship statistics for a member.

**Response:**
```json
{
  "message": "Relationship statistics retrieved successfully",
  "data": {
    "total_relationships": 5,
    "active_relationships": 4,
    "custody_relationships": 2,
    "primary_relationships": 1,
    "household_memberships": 2,
    "relationship_types": {
      "family": 3,
      "legal": 1,
      "household": 1
    }
  }
}
```

## Attendance System

### Service Management

#### GET /attendance/services
List services with optional filtering.

**Query Parameters:**
- `start_date` - Filter services from this date
- `end_date` - Filter services until this date
- `service_type` - Filter by type (sunday_morning, sunday_evening, midweek, special_event)
- `status` - Filter by status (scheduled, active, completed, cancelled)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Sunday Morning Service",
      "service_type": "sunday_morning",
      "scheduled_date": "2025-11-03",
      "start_time": "09:00:00",
      "end_time": "11:00:00",
      "location": "Main Sanctuary",
      "capacity": 200,
      "status": "scheduled",
      "total_attendance": 0,
      "allow_late_checkin": true,
      "enable_family_checkin": true
    }
  ]
}
```

#### POST /attendance/services
Create a new service.

**Request Body:**
```json
{
  "name": "Sunday Evening Service",
  "service_type": "sunday_evening",
  "scheduled_date": "2025-11-03",
  "start_time": "18:00",
  "end_time": "20:00",
  "location": "Main Sanctuary",
  "capacity": 150,
  "allow_late_checkin": true,
  "enable_family_checkin": true,
  "description": "Evening worship service"
}
```

#### GET /attendance/services/{id}
Get service details with attendance statistics.

#### PUT /attendance/services/{id}
Update service information.

#### POST /attendance/services/{id}/start
Start a service (changes status to active).

#### POST /attendance/services/{id}/end
End a service (changes status to completed).

### Check-in Operations

#### POST /attendance/qr-checkin
Check in using QR code.

**Request Body:**
```json
{
  "qr_code_data": "encoded-qr-data-string",
  "service_id": 1,
  "device_info": "iPad Pro",
  "notes": "Checked in via QR scanner"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Check-in successful",
  "attendance": {
    "id": 1,
    "member_id": 1,
    "service_id": 1,
    "checkin_method": "qr_individual",
    "checked_in_at": "2025-11-03T09:15:00Z",
    "member": {
      "name": "John Doe",
      "family_name": "The Does"
    }
  }
}
```

#### POST /attendance/manual-checkin
Manual check-in by member search.

**Request Body:**
```json
{
  "member_id": 1,
  "service_id": 1,
  "location": "Main Sanctuary",
  "section": "Section A",
  "ministry_assignment": "Usher",
  "notes": "Manual check-in"
}
```

#### POST /attendance/family-checkin
Check in multiple family members.

**Request Body:**
```json
{
  "family_id": 1,
  "service_id": 1,
  "member_ids": [1, 2, 3],
  "location": "Main Sanctuary",
  "ministry_assignments": {
    "1": "Usher",
    "2": "Greeter"
  },
  "notes": "Family check-in"
}
```

#### POST /attendance/visitor-checkin
Check in a visitor.

**Request Body:**
```json
{
  "service_id": 1,
  "visitor_name": "Jane Visitor",
  "visitor_email": "jane@example.com",
  "visitor_phone": "+1234567890",
  "location": "Main Sanctuary",
  "notes": "First time visitor"
}
```

### QR Code Management

#### POST /attendance/members/{id}/qr-code
Generate QR code for a member.

**Query Parameters:**
- `family` - Generate family QR code (boolean)
- `expires_at` - Expiration date (ISO 8601)

**Response:**
```json
{
  "qr_code_data": "encoded-qr-string",
  "qr_code": {
    "id": 1,
    "member_id": 1,
    "is_family_code": false,
    "expires_at": "2025-12-31T23:59:59Z",
    "is_active": true,
    "usage_count": 0
  },
  "member": {
    "id": 1,
    "name": "John Doe"
  }
}
```

### Attendance Records

#### GET /attendance/records
Get attendance records with filtering.

**Query Parameters:**
- `service_id` - Filter by service
- `member_id` - Filter by member
- `family_id` - Filter by family
- `start_date` - Records from this date
- `end_date` - Records until this date
- `checkin_method` - Filter by check-in method

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "member_id": 1,
      "service_id": 1,
      "checkin_method": "qr_individual",
      "checked_in_at": "2025-11-03T09:15:00Z",
      "location": "Main Sanctuary",
      "is_visitor": false,
      "member": {
        "name": "John Doe"
      },
      "service": {
        "name": "Sunday Morning Service"
      }
    }
  ]
}
```

### Statistics

#### GET /attendance/statistics
Get attendance statistics.

**Query Parameters:**
- `start_date` - Statistics from this date
- `end_date` - Statistics until this date
- `service_type` - Filter by service type

**Response:**
```json
{
  "total_attendance": 150,
  "today_attendance": 25,
  "unique_members": 120,
  "average_attendance": 75,
  "by_service_type": {
    "sunday_morning": 100,
    "sunday_evening": 30,
    "midweek": 20
  },
  "by_method": {
    "qr_individual": 80,
    "qr_family": 40,
    "manual": 30
  },
  "growth_rate": 5.2
}
```

### Offline Sync

#### POST /attendance/sync-offline
Sync offline attendance records.

**Request Body:**
```json
{
  "attendances": [
    {
      "member_id": 1,
      "service_id": 1,
      "checked_in_at": "2025-11-03T09:15:00Z",
      "checkin_method": "qr_individual",
      "location": "Main Sanctuary"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "synced": 5,
  "failed": 1,
  "synced_records": [
    {
      "id": 1,
      "member_id": 1,
      "service_id": 1
    }
  ],
  "failed_records": [
    {
      "member_id": 2,
      "error": "Member already checked in"
    }
  ]
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., duplicate check-in)
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to:
- 60 requests per minute for authenticated users
- 10 requests per minute for unauthenticated endpoints

## Pagination

List endpoints support pagination with these parameters:
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "total": 100,
    "per_page": 20,
    "last_page": 5
  }
}
```

## Changelog

### Version 1.0.0 (2025-11-03)
- Initial API release
- Authentication system
- Member and family management
- Attendance system with QR codes
- Offline sync capabilities
- Organization management

---

*This documentation is updated regularly. Last updated: 2025-11-03*
