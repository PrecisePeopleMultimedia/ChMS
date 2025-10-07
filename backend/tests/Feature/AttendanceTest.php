<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Organization;
use App\Models\Service;
use App\Models\AttendanceRecord;
use Laravel\Sanctum\Sanctum;

class AttendanceTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $organization;
    protected $service;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test organization
        $this->organization = Organization::factory()->create();

        // Create test user
        $this->user = User::factory()->create([
            'organization_id' => $this->organization->id,
            'role' => 'admin'
        ]);

        // Create test service
        $this->service = Service::factory()->create([
            'organization_id' => $this->organization->id,
            'service_date' => now()->format('Y-m-d'),
            'start_time' => '10:00:00'
        ]);

        // Authenticate user
        Sanctum::actingAs($this->user);
    }

    /** @test */
    public function it_can_create_a_service()
    {
        $serviceData = [
            'name' => 'Sunday Service',
            'service_date' => now()->format('Y-m-d'),
            'start_time' => '10:00:00',
            'end_time' => '12:00:00',
            'service_type' => 'sunday_service',
            'is_active' => true
        ];

        $response = $this->postJson('/api/services', $serviceData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'organization_id',
                    'name',
                    'service_date',
                    'start_time',
                    'end_time',
                    'service_type',
                    'is_active',
                    'created_at',
                    'updated_at'
                ]
            ]);

        $this->assertDatabaseHas('services', [
            'name' => 'Sunday Service',
            'organization_id' => $this->organization->id
        ]);
    }

    /** @test */
    public function it_can_get_today_services()
    {
        // Create additional services
        Service::factory()->create([
            'organization_id' => $this->organization->id,
            'service_date' => now()->format('Y-m-d'),
            'service_type' => 'midweek'
        ]);

        Service::factory()->create([
            'organization_id' => $this->organization->id,
            'service_date' => now()->addDay()->format('Y-m-d'),
            'service_type' => 'sunday_service'
        ]);

        $response = $this->getJson('/api/services/today');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    /** @test */
    public function it_can_record_attendance_for_member()
    {
        $attendanceData = [
            'service_id' => $this->service->id,
            'member_id' => $this->user->id,
            'check_in_method' => 'qr_code',
            'check_in_time' => now()->toISOString(),
            'notes' => 'Test attendance'
        ];

        $response = $this->postJson('/api/attendance', $attendanceData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'organization_id',
                    'service_id',
                    'member_id',
                    'check_in_time',
                    'check_in_method',
                    'notes',
                    'created_at',
                    'updated_at'
                ]
            ]);

        $this->assertDatabaseHas('attendance_records', [
            'service_id' => $this->service->id,
            'member_id' => $this->user->id,
            'check_in_method' => 'qr_code'
        ]);
    }

    /** @test */
    public function it_can_record_attendance_for_visitor()
    {
        $attendanceData = [
            'service_id' => $this->service->id,
            'visitor_name' => 'John Doe',
            'visitor_phone' => '+1234567890',
            'check_in_method' => 'visitor',
            'check_in_time' => now()->toISOString(),
            'notes' => 'First time visitor'
        ];

        $response = $this->postJson('/api/attendance', $attendanceData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'organization_id',
                    'service_id',
                    'visitor_name',
                    'visitor_phone',
                    'check_in_time',
                    'check_in_method',
                    'notes',
                    'created_at',
                    'updated_at'
                ]
            ]);

        $this->assertDatabaseHas('attendance_records', [
            'service_id' => $this->service->id,
            'visitor_name' => 'John Doe',
            'visitor_phone' => '+1234567890',
            'check_in_method' => 'visitor'
        ]);
    }

    /** @test */
    public function it_can_get_attendance_records_for_service()
    {
        // Create attendance records
        AttendanceRecord::factory()->create([
            'organization_id' => $this->organization->id,
            'service_id' => $this->service->id,
            'member_id' => $this->user->id,
            'check_in_method' => 'qr_code'
        ]);

        AttendanceRecord::factory()->create([
            'organization_id' => $this->organization->id,
            'service_id' => $this->service->id,
            'visitor_name' => 'Jane Doe',
            'visitor_phone' => '+1234567891',
            'check_in_method' => 'visitor'
        ]);

        $response = $this->getJson("/api/attendance?service_id={$this->service->id}");

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    /** @test */
    public function it_can_get_attendance_summary()
    {
        // Create attendance records
        AttendanceRecord::factory()->create([
            'organization_id' => $this->organization->id,
            'service_id' => $this->service->id,
            'member_id' => $this->user->id,
            'check_in_method' => 'qr_code'
        ]);

        AttendanceRecord::factory()->create([
            'organization_id' => $this->organization->id,
            'service_id' => $this->service->id,
            'visitor_name' => 'Jane Doe',
            'visitor_phone' => '+1234567891',
            'check_in_method' => 'visitor'
        ]);

        $response = $this->getJson('/api/attendance/summary');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'total_attendance',
                    'member_attendance',
                    'visitor_attendance',
                    'services_held'
                ]
            ]);
    }

    /** @test */
    public function it_validates_required_fields_for_attendance()
    {
        $response = $this->postJson('/api/attendance', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['service_id', 'check_in_method']);
    }

    /** @test */
    public function it_validates_service_exists_for_attendance()
    {
        $attendanceData = [
            'service_id' => 999, // Non-existent service
            'member_id' => $this->user->id,
            'check_in_method' => 'qr_code'
        ];

        $response = $this->postJson('/api/attendance', $attendanceData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['service_id']);
    }

    /** @test */
    public function it_validates_member_exists_for_attendance()
    {
        $attendanceData = [
            'service_id' => $this->service->id,
            'member_id' => 999, // Non-existent member
            'check_in_method' => 'qr_code'
        ];

        $response = $this->postJson('/api/attendance', $attendanceData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['member_id']);
    }

    /** @test */
    public function it_requires_visitor_name_for_visitor_checkin()
    {
        $attendanceData = [
            'service_id' => $this->service->id,
            'check_in_method' => 'visitor',
            'visitor_phone' => '+1234567890'
            // Missing visitor_name
        ];

        $response = $this->postJson('/api/attendance', $attendanceData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['visitor_name']);
    }

    /** @test */
    public function it_can_get_service_stats()
    {
        // Create attendance records
        AttendanceRecord::factory()->create([
            'organization_id' => $this->organization->id,
            'service_id' => $this->service->id,
            'member_id' => $this->user->id,
            'check_in_method' => 'qr_code'
        ]);

        AttendanceRecord::factory()->create([
            'organization_id' => $this->organization->id,
            'service_id' => $this->service->id,
            'visitor_name' => 'Jane Doe',
            'visitor_phone' => '+1234567891',
            'check_in_method' => 'visitor'
        ]);

        $response = $this->getJson("/api/services/{$this->service->id}/stats");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'total_attendance',
                    'member_attendance',
                    'visitor_attendance',
                    'qr_code_checkins',
                    'manual_checkins',
                    'visitor_checkins'
                ]
            ]);
    }

    /** @test */
    public function it_can_filter_attendance_by_date_range()
    {
        $startDate = now()->subDays(7)->format('Y-m-d');
        $endDate = now()->format('Y-m-d');

        $response = $this->getJson("/api/attendance?start_date={$startDate}&end_date={$endDate}");

        $response->assertStatus(200);
    }

    /** @test */
    public function it_can_filter_attendance_by_checkin_method()
    {
        $response = $this->getJson('/api/attendance?check_in_method=qr_code');

        $response->assertStatus(200);
    }

    /** @test */
    public function it_can_filter_attendance_by_member_type()
    {
        $response = $this->getJson('/api/attendance?type=members');

        $response->assertStatus(200);
    }
}
