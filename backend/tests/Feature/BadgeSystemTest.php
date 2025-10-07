<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Organization;
use App\Models\Member;
use App\Models\BadgeType;
use App\Models\MemberBadge;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class BadgeSystemTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Organization $organization;
    private Member $member;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->organization = Organization::factory()->create();
        $this->user = User::factory()->create([
            'organization_id' => $this->organization->id
        ]);
        $this->member = Member::factory()->create([
            'organization_id' => $this->organization->id
        ]);
        
        Sanctum::actingAs($this->user);
    }

    /** @test */
    public function it_can_create_badge_type()
    {
        $badgeData = [
            'name' => 'Test Badge',
            'description' => 'A test badge for testing',
            'color' => '#ff0000',
            'icon' => 'star',
            'is_active' => true
        ];

        $response = $this->postJson('/api/badge-types', $badgeData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'name',
                    'description',
                    'color',
                    'icon',
                    'is_active',
                    'organization_id'
                ]
            ]);

        $this->assertDatabaseHas('badge_types', [
            'name' => 'Test Badge',
            'organization_id' => $this->organization->id
        ]);
    }

    /** @test */
    public function it_can_list_badge_types()
    {
        BadgeType::factory()->count(3)->create([
            'organization_id' => $this->organization->id
        ]);

        $response = $this->getJson('/api/badge-types');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'description',
                        'color',
                        'icon',
                        'is_active'
                    ]
                ],
                'available_icons'
            ]);
    }

    /** @test */
    public function it_can_update_badge_type()
    {
        $badgeType = BadgeType::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        $updateData = [
            'name' => 'Updated Badge',
            'color' => '#00ff00'
        ];

        $response = $this->putJson("/api/badge-types/{$badgeType->id}", $updateData);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('badge_types', [
            'id' => $badgeType->id,
            'name' => 'Updated Badge',
            'color' => '#00ff00'
        ]);
    }

    /** @test */
    public function it_can_delete_badge_type_without_assignments()
    {
        $badgeType = BadgeType::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        $response = $this->deleteJson("/api/badge-types/{$badgeType->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('badge_types', ['id' => $badgeType->id]);
    }

    /** @test */
    public function it_cannot_delete_badge_type_with_assignments()
    {
        $badgeType = BadgeType::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        MemberBadge::factory()->create([
            'member_id' => $this->member->id,
            'badge_type_id' => $badgeType->id
        ]);

        $response = $this->deleteJson("/api/badge-types/{$badgeType->id}");

        $response->assertStatus(422);
        $this->assertDatabaseHas('badge_types', ['id' => $badgeType->id]);
    }

    /** @test */
    public function it_can_assign_badge_to_member()
    {
        $badgeType = BadgeType::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        $assignmentData = [
            'badge_type_id' => $badgeType->id,
            'notes' => 'Test assignment'
        ];

        $response = $this->postJson("/api/members/{$this->member->id}/badges", $assignmentData);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('member_badges', [
            'member_id' => $this->member->id,
            'badge_type_id' => $badgeType->id,
            'notes' => 'Test assignment'
        ]);
    }

    /** @test */
    public function it_can_remove_badge_from_member()
    {
        $badgeType = BadgeType::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        $memberBadge = MemberBadge::factory()->create([
            'member_id' => $this->member->id,
            'badge_type_id' => $badgeType->id
        ]);

        $response = $this->deleteJson("/api/members/{$this->member->id}/badges/{$badgeType->id}");

        $response->assertStatus(200);
        
        $this->assertDatabaseMissing('member_badges', [
            'member_id' => $this->member->id,
            'badge_type_id' => $badgeType->id
        ]);
    }

    /** @test */
    public function it_can_bulk_assign_badges()
    {
        $badgeType = BadgeType::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        $members = Member::factory()->count(3)->create([
            'organization_id' => $this->organization->id
        ]);

        $bulkData = [
            'member_ids' => $members->pluck('id')->toArray(),
            'badge_type_id' => $badgeType->id,
            'notes' => 'Bulk assignment'
        ];

        $response = $this->postJson('/api/member-badges/bulk-assign', $bulkData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'assigned_count',
                'skipped_count',
                'total_members'
            ]);

        foreach ($members as $member) {
            $this->assertDatabaseHas('member_badges', [
                'member_id' => $member->id,
                'badge_type_id' => $badgeType->id
            ]);
        }
    }

    /** @test */
    public function it_can_auto_assign_badges()
    {
        // Create default badge types
        BadgeType::createDefaultBadges($this->organization->id);

        $visitor = Member::factory()->create([
            'organization_id' => $this->organization->id,
            'member_type' => 'visitor'
        ]);

        $response = $this->postJson("/api/members/{$visitor->id}/badges/auto-assign");

        $response->assertStatus(200);

        // Should have visitor badge
        $this->assertDatabaseHas('member_badges', [
            'member_id' => $visitor->id
        ]);
    }

    /** @test */
    public function it_can_get_expiring_badges()
    {
        $badgeType = BadgeType::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        MemberBadge::factory()->create([
            'member_id' => $this->member->id,
            'badge_type_id' => $badgeType->id,
            'expires_at' => now()->addDays(3) // Expires in 3 days
        ]);

        $response = $this->getJson('/api/member-badges/expiring?days=7');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'member_name',
                        'badge_name',
                        'expires_at',
                        'days_until_expiration'
                    ]
                ],
                'total_expiring'
            ]);
    }

    /** @test */
    public function it_validates_badge_type_creation()
    {
        $invalidData = [
            'name' => '', // Required
            'color' => 'invalid-color', // Invalid hex
            'icon' => 'invalid-icon' // Not in available icons
        ];

        $response = $this->postJson('/api/badge-types', $invalidData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'color', 'icon']);
    }

    /** @test */
    public function it_prevents_duplicate_badge_names_per_organization()
    {
        BadgeType::factory()->create([
            'organization_id' => $this->organization->id,
            'name' => 'Duplicate Badge'
        ]);

        $duplicateData = [
            'name' => 'Duplicate Badge',
            'color' => '#ff0000',
            'icon' => 'star'
        ];

        $response = $this->postJson('/api/badge-types', $duplicateData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function it_can_create_default_badges()
    {
        $response = $this->postJson('/api/badge-types/create-defaults');

        $response->assertStatus(200);

        // Check that default badges were created
        $this->assertDatabaseHas('badge_types', [
            'organization_id' => $this->organization->id,
            'name' => 'Member'
        ]);

        $this->assertDatabaseHas('badge_types', [
            'organization_id' => $this->organization->id,
            'name' => 'Visitor'
        ]);
    }
}
