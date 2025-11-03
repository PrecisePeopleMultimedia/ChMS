/**
 * Test Data Fixtures for Regression Testing
 * 
 * Centralized test data to ensure consistency across all regression tests.
 * This includes user data, organization data, member data, and API responses.
 */

// User fixtures
export const userFixtures = {
  admin: {
    id: 1,
    email: 'admin@testchurch.com',
    password: 'AdminPass123!',
    first_name: 'Admin',
    last_name: 'User',
    name: 'Admin User',
    role: 'admin',
    organization_id: 1,
    phone: '+234-801-234-5678',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  
  staff: {
    id: 2,
    email: 'staff@testchurch.com',
    password: 'StaffPass123!',
    first_name: 'Staff',
    last_name: 'Member',
    name: 'Staff Member',
    role: 'staff',
    organization_id: 1,
    phone: '+234-802-234-5678',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  
  member: {
    id: 3,
    email: 'test@example.com',
    password: 'password123',
    first_name: 'Test',
    last_name: 'User',
    name: 'Test User',
    role: 'member',
    organization_id: 1,
    phone: '+234-803-234-5678',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
}

// Organization fixtures
export const organizationFixtures = {
  testChurch: {
    id: 1,
    name: 'Test Church Lagos',
    slug: 'test-church-lagos',
    description: 'A test church for regression testing',
    address: '123 Victoria Island, Lagos, Nigeria',
    phone: '+234-801-123-4567',
    email: 'info@testchurch.com',
    website: 'https://testchurch.com',
    timezone: 'Africa/Lagos',
    logo_url: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
}

// Member fixtures for member management tests
export const memberFixtures = {
  johnDoe: {
    id: 1,
    organization_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    middle_name: 'Michael',
    email: 'john.doe@example.com',
    phone: '+234-804-123-4567',
    date_of_birth: '1985-06-15',
    gender: 'male',
    marital_status: 'married',
    address: '456 Ikeja, Lagos, Nigeria',
    member_type: 'member',
    family_id: 1,
    joined_date: '2023-01-15',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  
  janeDoe: {
    id: 2,
    organization_id: 1,
    first_name: 'Jane',
    last_name: 'Doe',
    middle_name: 'Elizabeth',
    email: 'jane.doe@example.com',
    phone: '+234-805-123-4567',
    date_of_birth: '1987-08-22',
    gender: 'female',
    marital_status: 'married',
    address: '456 Ikeja, Lagos, Nigeria',
    member_type: 'member',
    family_id: 1,
    joined_date: '2023-01-15',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  
  visitor: {
    id: 3,
    organization_id: 1,
    first_name: 'Visitor',
    last_name: 'Guest',
    middle_name: null,
    email: 'visitor@example.com',
    phone: '+234-806-123-4567',
    date_of_birth: '1990-12-01',
    gender: 'male',
    marital_status: 'single',
    address: '789 Surulere, Lagos, Nigeria',
    member_type: 'visitor',
    family_id: null,
    joined_date: '2024-10-01',
    is_active: true,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z'
  }
}

// API response fixtures
export const apiResponseFixtures = {
  loginSuccess: {
    message: 'Login successful',
    user: userFixtures.member,
    token: 'test-jwt-token-12345',
    expires_at: '2024-12-01T00:00:00Z'
  },
  
  loginError: {
    message: 'Invalid credentials',
    errors: {
      email: ['The provided credentials are incorrect.']
    }
  },
  
  registerSuccess: {
    message: 'User registered successfully',
    user: {
      ...userFixtures.member,
      id: 999,
      email: 'newuser@example.com'
    },
    token: 'test-jwt-token-67890',
    expires_at: '2024-12-01T00:00:00Z'
  },
  
  dashboardData: {
    memberStats: {
      totalMembers: 150,
      newMembersThisMonth: 8,
      activeMembersThisWeek: 120
    },
    attendanceOverview: {
      todayAttendance: 85,
      weeklyAverage: 78,
      monthlyAverage: 82
    },
    systemStatus: {
      connectionStatus: 'online',
      lastSync: '2024-11-03T10:30:00Z',
      pendingSync: 0
    },
    recentActivities: [
      {
        id: 1,
        type: 'member_added',
        description: 'New member John Smith added',
        timestamp: '2024-11-03T09:15:00Z'
      },
      {
        id: 2,
        type: 'attendance_recorded',
        description: 'Sunday service attendance recorded',
        timestamp: '2024-11-03T08:00:00Z'
      }
    ]
  },
  
  membersListResponse: {
    data: [memberFixtures.johnDoe, memberFixtures.janeDoe, memberFixtures.visitor],
    meta: {
      current_page: 1,
      per_page: 15,
      total: 3,
      last_page: 1
    }
  }
}

// Error response fixtures
export const errorFixtures = {
  networkError: {
    message: 'Network error occurred',
    code: 'NETWORK_ERROR'
  },
  
  serverError: {
    message: 'Internal server error',
    code: 'SERVER_ERROR'
  },
  
  validationError: {
    message: 'Validation failed',
    errors: {
      email: ['The email field is required.'],
      password: ['The password field is required.']
    }
  },
  
  unauthorizedError: {
    message: 'Unauthorized access',
    code: 'UNAUTHORIZED'
  }
}

// Test scenarios for different user flows
export const testScenarios = {
  newUserRegistration: {
    firstName: 'New',
    lastName: 'User',
    email: 'newuser@example.com',
    password: 'NewUserPass123!',
    confirmPassword: 'NewUserPass123!'
  },
  
  passwordReset: {
    email: 'reset@example.com',
    newPassword: 'NewPassword123!',
    token: 'reset-token-12345'
  },
  
  memberCreation: {
    first_name: 'New',
    last_name: 'Member',
    email: 'newmember@example.com',
    phone: '+234-807-123-4567',
    date_of_birth: '1992-03-10',
    gender: 'female',
    member_type: 'member'
  }
}
