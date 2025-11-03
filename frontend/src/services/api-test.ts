/**
 * API Test Helper
 * Utility functions for testing the households and relationships API endpoints
 */

import { api } from './api'

export interface ApiTestResult {
  success: boolean
  message: string
  data?: any
  error?: any
}

/**
 * Test Relationship Types API
 */
export async function testRelationshipTypes(): Promise<ApiTestResult> {
  try {
    const response = await api.get('/relationship-types')
    return {
      success: true,
      message: 'Relationship types fetched successfully',
      data: response.data
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to fetch relationship types',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Test Households API
 */
export async function testHouseholds(): Promise<ApiTestResult> {
  try {
    const response = await api.get('/households')
    return {
      success: true,
      message: 'Households fetched successfully',
      data: response.data
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to fetch households',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Test Family Relationships API
 */
export async function testFamilyRelationships(memberId?: number): Promise<ApiTestResult> {
  try {
    const url = memberId 
      ? `/members/${memberId}/relationships`
      : '/family-relationships'
    const response = await api.get(url)
    return {
      success: true,
      message: 'Family relationships fetched successfully',
      data: response.data
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to fetch family relationships',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Test Create Household
 */
export async function testCreateHousehold(householdData: {
  name: string
  description?: string
  household_type?: string
}): Promise<ApiTestResult> {
  try {
    const response = await api.post('/households', householdData)
    return {
      success: true,
      message: 'Household created successfully',
      data: response.data
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to create household',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Test Create Family Relationship
 */
export async function testCreateRelationship(relationshipData: {
  family_id: number
  person1_id: number
  person2_id: number
  relationship_type_id: number
}): Promise<ApiTestResult> {
  try {
    const response = await api.post('/family-relationships', relationshipData)
    return {
      success: true,
      message: 'Family relationship created successfully',
      data: response.data
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to create family relationship',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Run all API tests
 */
export async function runAllApiTests(): Promise<{
  relationshipTypes: ApiTestResult
  households: ApiTestResult
  relationships: ApiTestResult
}> {
  const [relationshipTypes, households, relationships] = await Promise.all([
    testRelationshipTypes(),
    testHouseholds(),
    testFamilyRelationships()
  ])

  return {
    relationshipTypes,
    households,
    relationships
  }
}

