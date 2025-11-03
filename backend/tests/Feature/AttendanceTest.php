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

class AttendanceTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $organization;
    protected $service;
    protected $member;
    protected $family;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test organization
        $this->organization = Organization::factory()->create();

        // Create test user
        $this->user = User::factory()->create([
            'organization_id' => $this->organization->id,
        ]);

        // Create test family
        $this->family = Family::factory()->create([
            'organization_id' => $this->organization->id,
        ]);

        // Create test member
        $this->member = Member::factory()->create([
            'organization_id' => $this->organization->id,
            'family_id' => $this->family->id,
        ]);

        // Create test service
        $this->service = Service::factory()->create([
            'organization_id' => $this->organization->id,
            'status' => 'active',
        ]);

        // Authenticate user
        Sanctum::actingAs($this->user);
    }

    /** @test */
    public function it_can_fetch_services()
    {
        $response = $this->getJson('/api/attendance/services');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    '*' => [
                        'id',
                        'name',
                        'service_type',
                        'scheduled_date',
                        'start_time',
                        'status',
                    ]
                ]);
    }

    /** @test */
    public function it_can_create_service()
    {
        $serviceData = [
            'name' => 'Sunday Morning Service',
            'service_type' => 'sunday_morning',
            'scheduled_date' => now()->format('Y-m-d'),
            'start_time' => '09:00',
            'end_time' => '11:00',
            'location' => 'Main Sanctuary',
            'capacity' => 200,
        ];

        $response = $this->postJson('/api/attendance/services', $serviceData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'service_type',
                    'scheduled_date',
                    'start_time',
                    'status',
                ]);

        $this->assertDatabaseHas('services', [
            'name' => 'Sunday Morning Service',
            'organization_id' => $this->organization->id,
        ]);
    }

    /** @test */
    public function it_can_check_in_member_manually()
    {
        $checkInData = [
            'member_id' => $this->member->id,
            'service_id' => $this->service->id,
            'location' => 'Main Sanctuary',
            'section' => 'Section A',
            'notes' => 'Test check-in',
        ];

        $response = $this->postJson('/api/attendance/checkin', $checkInData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'id',
                        'member_id',
                        'service_id',
                        'checked_in_at',
                        'checkin_method',
                    ]
                ]);

        $this->assertDatabaseHas('attendance_records', [
            'member_id' => $this->member->id,
            'service_id' => $this->service->id,
            'checkin_method' => 'manual',
        ]);
    }

    /** @test */
    public function it_prevents_duplicate_check_ins()
    {
        // First check-in
        AttendanceRecord::createMemberRecord([
            'organization_id' => $this->organization->id,
            'service_id' => $this->service->id,
            'member_id' => $this->member->id,
            'checkin_method' => 'manual',
        ]);

        // Attempt duplicate check-in
        $checkInData = [
            'member_id' => $this->member->id,
            'service_id' => $this->service->id,
        ];

        $response = $this->postJson('/api/attendance/checkin', $checkInData);

        $response->assertStatus(409)
                ->assertJson([
                    'success' => false,
                    'message' => 'Member is already checked in to this service',
                ]);
    }

    /** @test */
    public function it_can_check_in_visitor()
    {
        $visitorData = [
            'service_id' => $this->service->id,
            'visitor_name' => 'John Visitor',
            'visitor_email' => 'john@example.com',
            'visitor_phone' => '+1234567890',
            'notes' => 'First time visitor',
        ];

        $response = $this->postJson('/api/attendance/visitor-checkin', $visitorData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'id',
                        'service_id',
                        'visitor_name',
                        'is_visitor',
                        'checked_in_at',
                    ]
                ]);

        $this->assertDatabaseHas('attendance_records', [
            'service_id' => $this->service->id,
            'visitor_name' => 'John Visitor',
            'is_visitor' => true,
        ]);
    }

    /** @test */
    public function it_can_check_in_family()
    {
        // Create additional family members
        $member2 = Member::factory()->create([
            'organization_id' => $this->organization->id,
            'family_id' => $this->family->id,
        ]);

        $familyData = [
            'family_id' => $this->family->id,
            'service_id' => $this->service->id,
            'member_ids' => [$this->member->id, $member2->id],
            'location' => 'Main Sanctuary',
        ];

        $response = $this->postJson('/api/attendance/family-checkin', $familyData);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'attendances' => [
                        '*' => [
                            'id',
                            'member_id',
                            'service_id',
                            'is_family_checkin',
                        ]
                    ]
                ]);

        $this->assertDatabaseHas('attendance_records', [
            'member_id' => $this->member->id,
            'service_id' => $this->service->id,
            'is_family_checkin' => true,
        ]);

        $this->assertDatabaseHas('attendance_records', [
            'member_id' => $member2->id,
            'service_id' => $this->service->id,
            'is_family_checkin' => true,
        ]);
    }

    /** @test */
    public function it_can_generate_qr_code_for_member()
    {
        $response = $this->postJson("/api/attendance/members/{$this->member->id}/qr-code");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'qr_code_data',
                    'qr_code' => [
                        'id',
                        'member_id',
                        'qr_code_data',
                        'qr_code_type',
                        'is_active',
                    ],
                    'member',
                ]);

        $this->assertDatabaseHas('member_qr_codes', [
            'member_id' => $this->member->id,
            'organization_id' => $this->organization->id,
            'is_active' => true,
        ]);
    }

    /** @test */
    public function it_can_fetch_attendance_statistics()
    {
        // Create some attendance records
        AttendanceRecord::createMemberRecord([
            'organization_id' => $this->organization->id,
            'service_id' => $this->service->id,
            'member_id' => $this->member->id,
            'checkin_method' => 'manual',
        ]);

        AttendanceRecord::createVisitorRecord([
            'organization_id' => $this->organization->id,
            'service_id' => $this->service->id,
            'visitor_name' => 'Test Visitor',
            'checkin_method' => 'manual',
        ]);

        $response = $this->getJson('/api/attendance/statistics');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'total_attendance',
                    'today_attendance',
                    'unique_members',
                    'by_service_type',
                    'by_method',
                ]);
    }

    /** @test */
    public function it_can_sync_offline_records()
    {
        $offlineData = [
            'attendances' => [
                [
                    'member_id' => $this->member->id,
                    'service_id' => $this->service->id,
                    'checked_in_at' => now()->toISOString(),
                    'checkin_method' => 'qr_individual',
                ]
            ]
        ];

        $response = $this->postJson('/api/attendance/sync', $offlineData);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'synced',
                    'failed',
                    'synced_records',
                ]);

        $this->assertDatabaseHas('attendance_records', [
            'member_id' => $this->member->id,
            'service_id' => $this->service->id,
            'synced' => true,
        ]);
    }

    /** @test */
    public function it_requires_authentication_for_attendance_endpoints()
    {
        // Logout user
        $this->withoutMiddleware();

        $response = $this->getJson('/api/attendance/services');
        $response->assertStatus(401);

        $response = $this->postJson('/api/attendance/checkin', []);
        $response->assertStatus(401);
    }

    /** @test */
    public function it_validates_check_in_data()
    {
        $response = $this->postJson('/api/attendance/checkin', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['service_id', 'member_id']);
    }
}
