<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrganizationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_user_can_create_organization(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($user);

        $organizationData = [
            'name' => 'Test Church',
            'address' => '123 Test Street, Test City',
            'phone' => '+234 123 456 7890',
            'email' => 'test@testchurch.com',
            'website' => 'https://testchurch.com',
            'description' => 'A test church for testing purposes',
            'timezone' => 'Africa/Lagos'
        ];

        $response = $this->postJson('/api/organizations', $organizationData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'message',
                    'data' => [
                        'id',
                        'name',
                        'address',
                        'phone',
                        'email',
                        'website',
                        'description',
                        'timezone',
                        'created_at',
                        'updated_at'
                    ]
                ]);

        $this->assertDatabaseHas('organizations', [
            'name' => 'Test Church',
            'email' => 'test@testchurch.com'
        ]);

        // Check that user is associated with organization
        $user->refresh();
        $this->assertNotNull($user->organization_id);
        $this->assertEquals('admin', $user->role);
    }

    public function test_organization_creation_requires_authentication(): void
    {
        $organizationData = [
            'name' => 'Test Church',
            'timezone' => 'Africa/Lagos'
        ];

        $response = $this->postJson('/api/organizations', $organizationData);

        $response->assertStatus(401);
    }

    public function test_organization_creation_validates_required_fields(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/organizations', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['name']);
    }

    public function test_organization_creation_validates_email_format(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/organizations', [
            'name' => 'Test Church',
            'email' => 'invalid-email'
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }

    public function test_organization_creation_validates_website_url(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/organizations', [
            'name' => 'Test Church',
            'website' => 'not-a-url'
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['website']);
    }

    public function test_user_can_view_their_organization(): void
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->create([
            'organization_id' => $organization->id,
            'role' => 'admin'
        ]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/organizations');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'data' => [
                        'id',
                        'name',
                        'address',
                        'phone',
                        'email',
                        'website',
                        'description',
                        'timezone',
                        'created_at',
                        'updated_at'
                    ]
                ]);
    }

    public function test_user_without_organization_gets_404(): void
    {
        $user = User::factory()->create(['organization_id' => null]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/organizations');

        $response->assertStatus(404)
                ->assertJson([
                    'message' => 'No organization found for user'
                ]);
    }

    public function test_user_can_update_their_organization(): void
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->create([
            'organization_id' => $organization->id,
            'role' => 'admin'
        ]);
        Sanctum::actingAs($user);

        $updateData = [
            'name' => 'Updated Church Name',
            'description' => 'Updated description'
        ];

        $response = $this->putJson("/api/organizations/{$organization->id}", $updateData);

        $response->assertStatus(200)
                ->assertJsonFragment([
                    'name' => 'Updated Church Name',
                    'description' => 'Updated description'
                ]);

        $this->assertDatabaseHas('organizations', [
            'id' => $organization->id,
            'name' => 'Updated Church Name'
        ]);
    }

    public function test_non_admin_cannot_update_organization(): void
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->create([
            'organization_id' => $organization->id,
            'role' => 'member'
        ]);
        Sanctum::actingAs($user);

        $updateData = ['name' => 'Updated Name'];

        $response = $this->putJson("/api/organizations/{$organization->id}", $updateData);

        $response->assertStatus(403);
    }

    public function test_user_cannot_update_other_organization(): void
    {
        $organization1 = Organization::factory()->create();
        $organization2 = Organization::factory()->create();
        $user = User::factory()->create([
            'organization_id' => $organization1->id,
            'role' => 'admin'
        ]);
        Sanctum::actingAs($user);

        $updateData = ['name' => 'Updated Name'];

        $response = $this->putJson("/api/organizations/{$organization2->id}", $updateData);

        $response->assertStatus(403);
    }
}
