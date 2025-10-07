<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Organization;
use App\Models\Member;
use App\Models\Family;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FamilyManagementTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private User $user;
    private Organization $organization;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->organization = Organization::factory()->create();
        $this->user = User::factory()->create([
            'organization_id' => $this->organization->id
        ]);
        
        Sanctum::actingAs($this->user);
    }

    /** @test */
    public function it_can_list_families()
    {
        Family::factory()->count(3)->create([
            'organization_id' => $this->organization->id
        ]);

        $response = $this->getJson('/api/families');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'data' => [
                            '*' => [
                                'id',
                                'family_name',
                                'head_of_family_id',
                                'address',
                                'phone',
                                'email'
                            ]
                        ]
                    ]
                ]);

        $this->assertCount(3, $response->json('data.data'));
    }

    /** @test */
    public function it_can_create_a_family()
    {
        $familyData = [
            'family_name' => 'The Smith Family',
            'address' => '123 Main St, City, State',
            'phone' => '+1234567890',
            'email' => 'smith.family@example.com'
        ];

        $response = $this->postJson('/api/families', $familyData);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'family_name' => 'The Smith Family',
                        'organization_id' => $this->organization->id
                    ]
                ]);

        $this->assertDatabaseHas('families', [
            'family_name' => 'The Smith Family',
            'organization_id' => $this->organization->id
        ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_family()
    {
        $response = $this->postJson('/api/families', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['family_name']);
    }

    /** @test */
    public function it_can_show_a_family()
    {
        $family = Family::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        $response = $this->getJson("/api/families/{$family->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'id' => $family->id,
                        'family_name' => $family->family_name
                    ]
                ]);
    }

    /** @test */
    public function it_can_update_a_family()
    {
        $family = Family::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        $updateData = [
            'family_name' => 'Updated Family Name',
            'phone' => '+9876543210'
        ];

        $response = $this->putJson("/api/families/{$family->id}", $updateData);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'family_name' => 'Updated Family Name',
                        'phone' => '+9876543210'
                    ]
                ]);

        $this->assertDatabaseHas('families', [
            'id' => $family->id,
            'family_name' => 'Updated Family Name'
        ]);
    }

    /** @test */
    public function it_can_delete_empty_family()
    {
        $family = Family::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        $response = $this->deleteJson("/api/families/{$family->id}");

        $response->assertStatus(200)
                ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('families', ['id' => $family->id]);
    }

    /** @test */
    public function it_cannot_delete_family_with_members()
    {
        $family = Family::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        // Add member to family
        Member::factory()->create([
            'organization_id' => $this->organization->id,
            'family_id' => $family->id
        ]);

        $response = $this->deleteJson("/api/families/{$family->id}");

        $response->assertStatus(422)
                ->assertJson([
                    'success' => false,
                    'message' => 'Cannot delete family with existing members. Please remove all members first.'
                ]);

        $this->assertDatabaseHas('families', ['id' => $family->id]);
    }

    /** @test */
    public function it_can_assign_head_of_family()
    {
        $family = Family::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        $member = Member::factory()->create([
            'organization_id' => $this->organization->id,
            'family_id' => $family->id
        ]);

        $updateData = [
            'head_of_family_id' => $member->id
        ];

        $response = $this->putJson("/api/families/{$family->id}", $updateData);

        $response->assertStatus(200);

        $this->assertDatabaseHas('families', [
            'id' => $family->id,
            'head_of_family_id' => $member->id
        ]);
    }

    /** @test */
    public function it_cannot_access_family_from_different_organization()
    {
        $otherOrganization = Organization::factory()->create();
        $family = Family::factory()->create([
            'organization_id' => $otherOrganization->id
        ]);

        $response = $this->getJson("/api/families/{$family->id}");

        $response->assertStatus(404);
    }

    /** @test */
    public function it_can_search_families()
    {
        Family::factory()->create([
            'organization_id' => $this->organization->id,
            'family_name' => 'The Johnson Family'
        ]);

        Family::factory()->create([
            'organization_id' => $this->organization->id,
            'family_name' => 'The Williams Family'
        ]);

        $response = $this->getJson('/api/families?search=Johnson');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data.data'));
        $this->assertStringContainsString('Johnson', $response->json('data.data.0.family_name'));
    }

    /** @test */
    public function it_loads_family_relationships()
    {
        $family = Family::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        $headOfFamily = Member::factory()->create([
            'organization_id' => $this->organization->id,
            'family_id' => $family->id
        ]);

        $family->update(['head_of_family_id' => $headOfFamily->id]);

        // Create additional family members
        Member::factory()->count(2)->create([
            'organization_id' => $this->organization->id,
            'family_id' => $family->id
        ]);

        $response = $this->getJson("/api/families/{$family->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'family_name',
                        'members',
                        'head_of_family'
                    ]
                ]);

        $this->assertCount(3, $response->json('data.members'));
        $this->assertEquals($headOfFamily->id, $response->json('data.head_of_family.id'));
    }
}
