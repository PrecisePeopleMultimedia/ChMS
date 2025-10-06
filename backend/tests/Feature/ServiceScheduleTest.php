<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\ServiceSchedule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ServiceScheduleTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_admin_can_create_service_schedule(): void
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->create([
            'organization_id' => $organization->id,
            'role' => 'admin'
        ]);
        Sanctum::actingAs($user);

        $scheduleData = [
            'name' => 'Sunday Morning Service',
            'day_of_week' => 0,
            'start_time' => '09:00',
            'end_time' => '11:00',
            'is_active' => true
        ];

        $response = $this->postJson('/api/service-schedules', $scheduleData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'message',
                    'data' => [
                        'id',
                        'organization_id',
                        'name',
                        'day_of_week',
                        'start_time',
                        'end_time',
                        'is_active',
                        'created_at',
                        'updated_at'
                    ]
                ]);

        $this->assertDatabaseHas('service_schedules', [
            'organization_id' => $organization->id,
            'name' => 'Sunday Morning Service',
            'day_of_week' => 0
        ]);
    }

    public function test_staff_can_create_service_schedule(): void
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->create([
            'organization_id' => $organization->id,
            'role' => 'staff'
        ]);
        Sanctum::actingAs($user);

        $scheduleData = [
            'name' => 'Bible Study',
            'day_of_week' => 3,
            'start_time' => '19:00',
            'end_time' => '21:00',
            'is_active' => true
        ];

        $response = $this->postJson('/api/service-schedules', $scheduleData);

        $response->assertStatus(201);
    }

    public function test_member_cannot_create_service_schedule(): void
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->create([
            'organization_id' => $organization->id,
            'role' => 'member'
        ]);
        Sanctum::actingAs($user);

        $scheduleData = [
            'name' => 'Sunday Service',
            'day_of_week' => 0,
            'start_time' => '09:00'
        ];

        $response = $this->postJson('/api/service-schedules', $scheduleData);

        $response->assertStatus(403);
    }

    public function test_service_schedule_creation_validates_required_fields(): void
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->create([
            'organization_id' => $organization->id,
            'role' => 'admin'
        ]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/service-schedules', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['name', 'day_of_week', 'start_time']);
    }

    public function test_service_schedule_validates_day_of_week_range(): void
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->create([
            'organization_id' => $organization->id,
            'role' => 'admin'
        ]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/service-schedules', [
            'name' => 'Invalid Day Service',
            'day_of_week' => 7, // Invalid - should be 0-6
            'start_time' => '09:00'
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['day_of_week']);
    }

    public function test_service_schedule_validates_time_format(): void
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->create([
            'organization_id' => $organization->id,
            'role' => 'admin'
        ]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/service-schedules', [
            'name' => 'Invalid Time Service',
            'day_of_week' => 0,
            'start_time' => 'invalid-time'
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['start_time']);
    }

    public function test_end_time_must_be_after_start_time(): void
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->create([
            'organization_id' => $organization->id,
            'role' => 'admin'
        ]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/service-schedules', [
            'name' => 'Invalid Time Range Service',
            'day_of_week' => 0,
            'start_time' => '11:00',
            'end_time' => '09:00' // Before start time
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['end_time']);
    }

    public function test_user_can_view_organization_service_schedules(): void
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->create([
            'organization_id' => $organization->id,
            'role' => 'member'
        ]);

        // Create some schedules
        ServiceSchedule::factory()->count(3)->create([
            'organization_id' => $organization->id
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/service-schedules');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'data' => [
                        '*' => [
                            'id',
                            'organization_id',
                            'name',
                            'day_of_week',
                            'start_time',
                            'end_time',
                            'is_active'
                        ]
                    ]
                ]);
    }
}
