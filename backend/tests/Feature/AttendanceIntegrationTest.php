<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Organization;
use App\Models\Service;
use App\Models\Member;
use App\Models\Family;
use App\Models\AttendanceRecord;
use App\Models\MemberQrCode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use Carbon\Carbon;

class AttendanceIntegrationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $organization;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test organization
        $this->organization = Organization::factory()->create([
            'name' => 'Test Church',
            'timezone' => 'UTC',
        ]);

        // Create test user
        $this->user = User::factory()->create([
            'organization_id' => $this->organization->id,
            'email' => 'admin@testchurch.com',
        ]);

        // Authenticate user
        Sanctum::actingAs($this->user);
    }

    /** @test */
    public function complete_attendance_workflow_integration()
    {
        // Step 1: Create a service
        $serviceData = [
            'name' => 'Sunday Morning Service',
            'service_type' => 'sunday_morning',
            'scheduled_date' => now()->format('Y-m-d'),
            'start_time' => '09:00',
            'end_time' => '11:00',
            'location' => 'Main Sanctuary',
            'capacity' => 200,
            'allow_late_checkin' => true,
            'enable_family_checkin' => true,
        ];

        $serviceResponse = $this->postJson('/api/attendance/services', $serviceData);
        $serviceResponse->assertStatus(201);
        $service = $serviceResponse->json();

        // Step 2: Create family and members
        $family = Family::factory()->create([
            'organization_id' => $this->organization->id,
            'family_name' => 'Smith Family',
        ]);

        $parent = Member::factory()->create([
            'organization_id' => $this->organization->id,
            'family_id' => $family->id,
            'first_name' => 'John',
            'last_name' => 'Smith',
            'date_of_birth' => '1980-01-01',
        ]);

        $child = Member::factory()->create([
            'organization_id' => $this->organization->id,
            'family_id' => $family->id,
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'date_of_birth' => '2010-01-01',
        ]);

        // Step 3: Generate QR code for parent
        $qrResponse = $this->postJson("/api/attendance/members/{$parent->id}/qr-code");
        $qrResponse->assertStatus(200);
        $qrData = $qrResponse->json();

        $this->assertArrayHasKey('qr_code_data', $qrData);
        $this->assertArrayHasKey('qr_code', $qrData);

        // Step 4: Check in parent using QR code
        $qrCheckInResponse = $this->postJson('/api/attendance/qr-checkin', [
            'qr_code_data' => $qrData['qr_code_data'],
            'service_id' => $service['id'],
            'notes' => 'QR code check-in test',
        ]);

        $qrCheckInResponse->assertStatus(200);
        $qrCheckInData = $qrCheckInResponse->json();

        $this->assertTrue($qrCheckInData['success']);
        $this->assertArrayHasKey('attendance', $qrCheckInData);

        // Step 5: Check in child manually
        $manualCheckInResponse = $this->postJson('/api/attendance/checkin', [
            'member_id' => $child->id,
            'service_id' => $service['id'],
            'location' => 'Children\'s Ministry',
            'section' => 'Age 10-12',
            'is_child' => true,
            'child_ministry' => 'Kids Church',
            'guardian_contact' => $parent->phone ?? 'N/A',
            'notes' => 'Manual check-in for child',
        ]);

        $manualCheckInResponse->assertStatus(201);
        $manualCheckInData = $manualCheckInResponse->json();

        $this->assertTrue($manualCheckInData['success']);
        $this->assertEquals($child->id, $manualCheckInData['data']['member_id']);

        // Step 6: Check in a visitor
        $visitorCheckInResponse = $this->postJson('/api/attendance/visitor-checkin', [
            'service_id' => $service['id'],
            'visitor_name' => 'Bob Visitor',
            'visitor_email' => 'bob@example.com',
            'visitor_phone' => '+1234567890',
            'location' => 'Main Sanctuary',
            'notes' => 'First time visitor',
        ]);

        $visitorCheckInResponse->assertStatus(201);
        $visitorData = $visitorCheckInResponse->json();

        $this->assertTrue($visitorData['success']);
        $this->assertTrue($visitorData['data']['is_visitor']);
        $this->assertEquals('Bob Visitor', $visitorData['data']['visitor_name']);

        // Step 7: Fetch attendance records for the service
        $attendanceResponse = $this->getJson('/api/attendance/records?service_id=' . $service['id']);
        $attendanceResponse->assertStatus(200);
        $attendanceData = $attendanceResponse->json();

        $this->assertCount(3, $attendanceData['data']); // Parent, child, visitor

        // Step 8: Get attendance statistics
        $statsResponse = $this->getJson('/api/attendance/statistics');
        $statsResponse->assertStatus(200);
        $stats = $statsResponse->json();

        $this->assertEquals(3, $stats['total_attendance']);
        $this->assertEquals(3, $stats['today_attendance']);
        $this->assertEquals(2, $stats['unique_members']); // Parent and child
        $this->assertArrayHasKey('by_service_type', $stats);
        $this->assertArrayHasKey('by_method', $stats);

        // Step 9: Start the service
        $startResponse = $this->postJson("/api/services/{$service['id']}/start");
        $startResponse->assertStatus(200);
        $updatedService = $startResponse->json();

        $this->assertEquals('active', $updatedService['status']);
        $this->assertNotNull($updatedService['started_at']);

        // Step 10: End the service
        $endResponse = $this->postJson("/api/services/{$service['id']}/end");
        $endResponse->assertStatus(200);
        $completedService = $endResponse->json();

        $this->assertEquals('completed', $completedService['status']);
        $this->assertNotNull($completedService['ended_at']);

        // Step 11: Verify database state
        $this->assertDatabaseHas('services', [
            'id' => $service['id'],
            'status' => 'completed',
            'organization_id' => $this->organization->id,
        ]);

        $this->assertDatabaseHas('attendance_records', [
            'service_id' => $service['id'],
            'member_id' => $parent->id,
            'checkin_method' => 'qr_individual',
            'synced' => true,
        ]);

        $this->assertDatabaseHas('attendance_records', [
            'service_id' => $service['id'],
            'member_id' => $child->id,
            'checkin_method' => 'manual',
            'is_child' => true,
            'child_ministry' => 'Kids Church',
        ]);

        $this->assertDatabaseHas('attendance_records', [
            'service_id' => $service['id'],
            'visitor_name' => 'Bob Visitor',
            'is_visitor' => true,
            'visitor_email' => 'bob@example.com',
        ]);

        $this->assertDatabaseHas('member_qr_codes', [
            'member_id' => $parent->id,
            'organization_id' => $this->organization->id,
            'is_active' => true,
            'usage_count' => 1,
        ]);
    }

    /** @test */
    public function family_checkin_integration_workflow()
    {
        // Create service
        $service = Service::factory()->create([
            'organization_id' => $this->organization->id,
            'status' => 'active',
            'enable_family_checkin' => true,
        ]);

        // Create family with multiple members
        $family = Family::factory()->create([
            'organization_id' => $this->organization->id,
        ]);

        $members = Member::factory()->count(3)->create([
            'organization_id' => $this->organization->id,
            'family_id' => $family->id,
        ]);

        // Perform family check-in
        $familyCheckInResponse = $this->postJson('/api/attendance/family-checkin', [
            'family_id' => $family->id,
            'service_id' => $service->id,
            'member_ids' => $members->pluck('id')->toArray(),
            'location' => 'Main Sanctuary',
            'notes' => 'Family check-in test',
        ]);

        $familyCheckInResponse->assertStatus(200);
        $familyData = $familyCheckInResponse->json();

        $this->assertTrue($familyData['success']);
        $this->assertCount(3, $familyData['attendances']);

        // Verify all family members are checked in
        foreach ($members as $member) {
            $this->assertDatabaseHas('attendance_records', [
                'service_id' => $service->id,
                'member_id' => $member->id,
                'family_id' => $family->id,
                'is_family_checkin' => true,
                'location' => 'Main Sanctuary',
            ]);
        }
    }

    /** @test */
    public function offline_sync_integration_workflow()
    {
        // Create service and member
        $service = Service::factory()->create([
            'organization_id' => $this->organization->id,
        ]);

        $member = Member::factory()->create([
            'organization_id' => $this->organization->id,
        ]);

        // Simulate offline attendance records
        $offlineData = [
            'attendances' => [
                [
                    'member_id' => $member->id,
                    'service_id' => $service->id,
                    'checked_in_at' => now()->subHours(2)->toISOString(),
                    'checkin_method' => 'qr_individual',
                ],
                [
                    'member_id' => $member->id,
                    'service_id' => $service->id,
                    'checked_in_at' => now()->subHour()->toISOString(),
                    'checkin_method' => 'manual',
                ]
            ]
        ];

        // Sync offline records
        $syncResponse = $this->postJson('/api/attendance/sync', $offlineData);
        $syncResponse->assertStatus(200);
        $syncData = $syncResponse->json();

        $this->assertTrue($syncData['success']);
        $this->assertEquals(1, $syncData['synced']); // Only one should sync (duplicate prevention)
        $this->assertEquals(1, $syncData['failed']); // One should fail due to duplicate

        // Verify synced record exists
        $this->assertDatabaseHas('attendance_records', [
            'member_id' => $member->id,
            'service_id' => $service->id,
            'synced' => true,
        ]);
    }

    /** @test */
    public function attendance_reports_integration()
    {
        // Create multiple services and attendance records
        $services = Service::factory()->count(3)->create([
            'organization_id' => $this->organization->id,
            'scheduled_date' => now()->format('Y-m-d'),
        ]);

        $members = Member::factory()->count(5)->create([
            'organization_id' => $this->organization->id,
        ]);

        // Create attendance records across services
        foreach ($services as $service) {
            foreach ($members->take(3) as $member) {
                AttendanceRecord::createMemberRecord([
                    'organization_id' => $this->organization->id,
                    'service_id' => $service->id,
                    'member_id' => $member->id,
                    'checkin_method' => 'manual',
                ]);
            }

            // Add some visitors
            AttendanceRecord::createVisitorRecord([
                'organization_id' => $this->organization->id,
                'service_id' => $service->id,
                'visitor_name' => 'Test Visitor',
                'checkin_method' => 'manual',
            ]);
        }

        // Get statistics
        $statsResponse = $this->getJson('/api/attendance/statistics');
        $statsResponse->assertStatus(200);
        $stats = $statsResponse->json();

        $this->assertEquals(12, $stats['total_attendance']); // 3 services × 4 attendees
        $this->assertEquals(3, $stats['unique_members']); // 3 unique members
        $this->assertArrayHasKey('by_service_type', $stats);
        $this->assertArrayHasKey('by_method', $stats);

        // Get attendance records with filters
        $recordsResponse = $this->getJson('/api/attendance/records?start_date=' . now()->format('Y-m-d'));
        $recordsResponse->assertStatus(200);
        $records = $recordsResponse->json();

        $this->assertCount(12, $records['data']);
    }

    /** @test */
    public function error_handling_integration()
    {
        // Test duplicate check-in prevention
        $service = Service::factory()->create([
            'organization_id' => $this->organization->id,
        ]);

        $member = Member::factory()->create([
            'organization_id' => $this->organization->id,
        ]);

        // First check-in
        $firstCheckIn = $this->postJson('/api/attendance/checkin', [
            'member_id' => $member->id,
            'service_id' => $service->id,
        ]);
        $firstCheckIn->assertStatus(201);

        // Duplicate check-in attempt
        $duplicateCheckIn = $this->postJson('/api/attendance/checkin', [
            'member_id' => $member->id,
            'service_id' => $service->id,
        ]);
        $duplicateCheckIn->assertStatus(409);
        $duplicateCheckIn->assertJson([
            'success' => false,
            'message' => 'Member is already checked in to this service',
        ]);

        // Test invalid QR code
        $invalidQrResponse = $this->postJson('/api/attendance/qr-checkin', [
            'qr_code_data' => 'invalid-qr-data',
            'service_id' => $service->id,
        ]);
        $invalidQrResponse->assertStatus(400);

        // Test unauthorized access (different organization)
        $otherOrg = Organization::factory()->create();
        $otherService = Service::factory()->create([
            'organization_id' => $otherOrg->id,
        ]);

        $unauthorizedResponse = $this->postJson('/api/attendance/checkin', [
            'member_id' => $member->id,
            'service_id' => $otherService->id,
        ]);
        $unauthorizedResponse->assertStatus(403);
    }
}
