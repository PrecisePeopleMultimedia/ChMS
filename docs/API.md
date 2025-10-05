# ChurchAfrica API Documentation

## Base URL
- **Development**: `http://backend.test/api`
- **Production**: `https://your-domain.com/api`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {your-token}
```

## Endpoints

### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-05T11:02:54.942506Z",
  "version": "1.0.0"
}
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "role": "member"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "role": "member",
    "created_at": "2025-10-05T08:53:54.000000Z"
  },
  "token": "1|abc123def456..."
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "role": "member",
    "created_at": "2025-10-05T08:53:54.000000Z"
  },
  "token": "1|abc123def456..."
}
```

#### Logout User
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### User Profile Endpoints

#### Get Current User
```http
GET /api/user
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "role": "member",
  "created_at": "2025-10-05T08:53:54.000000Z",
  "updated_at": "2025-10-05T08:53:54.000000Z"
}
```

#### Get User Profile
```http
GET /api/profile
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "role": "member",
  "organization_id": null,
  "created_at": "2025-10-05T08:53:54.000000Z",
  "updated_at": "2025-10-05T08:53:54.000000Z"
}
```

#### Update User Profile
```http
PUT /api/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "role": "member",
    "updated_at": "2025-10-05T12:00:00.000000Z"
  }
}
```

#### Change Password
```http
POST /api/profile/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "current_password": "oldpassword123",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

## Error Responses

### Validation Errors (422)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 6 characters."]
  }
}
```

### Authentication Errors (401)
```json
{
  "message": "Unauthenticated."
}
```

### Not Found Errors (404)
```json
{
  "message": "Not Found"
}
```

### Server Errors (500)
```json
{
  "message": "Server Error"
}
```

## Rate Limiting
- **Authentication endpoints**: 5 requests per minute
- **API endpoints**: 60 requests per minute

## CORS Configuration
- **Allowed Origins**: `http://localhost:1811`, `http://localhost:3000`
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization, X-Requested-With

## Security Features
- ✅ **CSRF Protection**: Disabled for API routes (using Sanctum tokens)
- ✅ **CORS Protection**: Configured for frontend domains
- ✅ **Token Security**: Laravel Sanctum with secure token generation
- ✅ **Password Hashing**: Bcrypt with 12 rounds
- ✅ **Input Validation**: Comprehensive validation on all endpoints
- ✅ **SQL Injection Protection**: Laravel Eloquent ORM
