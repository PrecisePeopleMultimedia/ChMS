<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Organization;
use App\Models\Member;
use App\Models\Family;
use App\Models\MemberHistory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MemberManagementTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private User $user;
    private Organization $organization;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create test organization and user
        $this->organization = Organization::factory()->create();
        $this->user = User::factory()->create([
            'organization_id' => $this->organization->id
        ]);
        
        // Authenticate user
        Sanctum::actingAs($this->user);
    }

    /** @test */
    public function it_can_list_members()
    {
        // Create test members
        Member::factory()->count(5)->create([
            'organization_id' => $this->organization->id
        ]);

        $response = $this->getJson('/api/members');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'data' => [
                            '*' => [
                                'id',
                                'first_name',
                                'last_name',
                                'email',
                                'phone',
                                'member_type',
                                'is_active',
                                'join_date'
                            ]
                        ],
                        'current_page',
                        'last_page',
                        'per_page',
                        'total'
                    ],
                    'message'
                ]);

        $this->assertTrue($response->json('success'));
        $this->assertCount(5, $response->json('data.data'));
    }

    /** @test */
    public function it_can_create_a_member()
    {
        $memberData = [
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'email' => $this->faker->unique()->safeEmail,
            'phone' => $this->faker->phoneNumber,
            'member_type' => 'adult',
            'join_date' => now()->toDateString(),
            'is_active' => true
        ];

        $response = $this->postJson('/api/members', $memberData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'first_name',
                        'last_name',
                        'email',
                        'phone',
                        'member_type',
                        'organization_id'
                    ],
                    'message'
                ]);

        $this->assertTrue($response->json('success'));
        $this->assertDatabaseHas('members', [
            'first_name' => $memberData['first_name'],
            'last_name' => $memberData['last_name'],
            'email' => $memberData['email'],
            'organization_id' => $this->organization->id
        ]);

        // Check member history was created
        $member = Member::where('email', $memberData['email'])->first();
        $this->assertDatabaseHas('member_history', [
            'member_id' => $member->id,
            'change_type' => 'created'
        ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_member()
    {
        $response = $this->postJson('/api/members', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['first_name', 'last_name', 'member_type']);
    }

    /** @test */
    public function it_can_show_a_member()
    {
        $member = Member::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        $response = $this->getJson("/api/members/{$member->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'id' => $member->id,
                        'first_name' => $member->first_name,
                        'last_name' => $member->last_name
                    ]
                ]);
    }

    /** @test */
    public function it_cannot_show_member_from_different_organization()
    {
        $otherOrganization = Organization::factory()->create();
        $member = Member::factory()->create([
            'organization_id' => $otherOrganization->id
        ]);

        $response = $this->getJson("/api/members/{$member->id}");

        $response->assertStatus(404);
    }

    /** @test */
    public function it_can_update_a_member()
    {
        $member = Member::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        $updateData = [
            'first_name' => 'Updated Name',
            'phone' => '+1234567890'
        ];

        $response = $this->putJson("/api/members/{$member->id}", $updateData);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'id' => $member->id,
                        'first_name' => 'Updated Name',
                        'phone' => '+1234567890'
                    ]
                ]);

        $this->assertDatabaseHas('members', [
            'id' => $member->id,
            'first_name' => 'Updated Name',
            'phone' => '+1234567890'
        ]);

        // Check member history was created
        $this->assertDatabaseHas('member_history', [
            'member_id' => $member->id,
            'change_type' => 'updated'
        ]);
    }

    /** @test */
    public function it_can_delete_a_member()
    {
        $member = Member::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        $response = $this->deleteJson("/api/members/{$member->id}");

        $response->assertStatus(200)
                ->assertJson(['success' => true]);

        $this->assertSoftDeleted('members', ['id' => $member->id]);

        // Check member history was created
        $this->assertDatabaseHas('member_history', [
            'member_id' => $member->id,
            'change_type' => 'deleted'
        ]);
    }

    /** @test */
    public function it_can_search_members()
    {
        $member1 = Member::factory()->create([
            'organization_id' => $this->organization->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com'
        ]);

        $member2 = Member::factory()->create([
            'organization_id' => $this->organization->id,
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane@example.com'
        ]);

        // Search by first name
        $response = $this->getJson('/api/members/search?query=John');
        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals($member1->id, $response->json('data.0.id'));

        // Search by email
        $response = $this->getJson('/api/members/search?query=jane@example.com');
        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals($member2->id, $response->json('data.0.id'));
    }

    /** @test */
    public function it_can_filter_members_by_type()
    {
        Member::factory()->create([
            'organization_id' => $this->organization->id,
            'member_type' => 'adult'
        ]);

        Member::factory()->create([
            'organization_id' => $this->organization->id,
            'member_type' => 'child'
        ]);

        $response = $this->getJson('/api/members?member_type=adult');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data.data'));
        $this->assertEquals('adult', $response->json('data.data.0.member_type'));
    }

    /** @test */
    public function it_detects_duplicate_members()
    {
        // Create existing member
        Member::factory()->create([
            'organization_id' => $this->organization->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com'
        ]);

        // Try to create duplicate
        $duplicateData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'member_type' => 'adult'
        ];

        $response = $this->postJson('/api/members', $duplicateData);

        $response->assertStatus(409)
                ->assertJson([
                    'success' => false,
                    'message' => 'Potential duplicate member found'
                ]);
    }

    /** @test */
    public function it_can_manage_family_relationships()
    {
        $family = Family::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        $memberData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'member_type' => 'adult',
            'family_id' => $family->id
        ];

        $response = $this->postJson('/api/members', $memberData);

        $response->assertStatus(201);
        
        $member = Member::where('first_name', 'John')->first();
        $this->assertEquals($family->id, $member->family_id);
    }
}
