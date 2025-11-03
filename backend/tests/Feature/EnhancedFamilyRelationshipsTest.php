<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Organization;
use App\Models\Member;
use App\Models\Family;
use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\FamilyRelationship;
use App\Models\RelationshipType;
use App\Services\RelationshipAnalysisService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnhancedFamilyRelationshipsTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $organization;
    protected $family;
    protected $household;
    protected $members;
    protected $relationshipTypes;

    protected function setUp(): void
    {
        parent::setUp();

        // Create organization and user
        $this->organization = Organization::factory()->create();
        $this->user = User::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        // Create family and household
        $this->family = Family::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        $this->household = Household::factory()->create([
            'organization_id' => $this->organization->id
        ]);

        // Create members
        $this->members = collect([
            Member::factory()->create([
                'organization_id' => $this->organization->id,
                'family_id' => $this->family->id,
                'first_name' => 'John',
                'last_name' => 'Smith'
            ]),
            Member::factory()->create([
                'organization_id' => $this->organization->id,
                'family_id' => $this->family->id,
                'first_name' => 'Jane',
                'last_name' => 'Smith'
            ]),
            Member::factory()->create([
                'organization_id' => $this->organization->id,
                'family_id' => $this->family->id,
                'first_name' => 'Bobby',
                'last_name' => 'Smith'
            ])
        ]);

        // Create relationship types
        $this->relationshipTypes = collect([
            RelationshipType::factory()->create([
                'organization_id' => $this->organization->id,
                'name' => 'Spouse',
                'slug' => 'spouse',
                'category' => 'family',
                'is_family' => true
            ]),
            RelationshipType::factory()->create([
                'organization_id' => $this->organization->id,
                'name' => 'Parent',
                'slug' => 'parent',
                'category' => 'family',
                'is_family' => true
            ]),
            RelationshipType::factory()->create([
                'organization_id' => $this->organization->id,
                'name' => 'Child',
                'slug' => 'child',
                'category' => 'family',
                'is_family' => true
            ]),
            RelationshipType::factory()->create([
                'organization_id' => $this->organization->id,
                'name' => 'Guardian',
                'slug' => 'guardian',
                'category' => 'legal',
                'is_legal' => true
            ])
        ]);
    }

    /** @test */
    public function it_can_analyze_complex_relationships()
    {
        $this->actingAs($this->user);

        $member = $this->members->first();

        // Create some complex relationships
        FamilyRelationship::create([
            'organization_id' => $this->organization->id,
            'family_id' => $this->family->id,
            'person1_id' => $member->id,
            'person2_id' => $this->members->get(1)->id,
            'relationship_type_id' => $this->relationshipTypes->where('slug', 'spouse')->first()->id,
            'status' => 'active'
        ]);

        FamilyRelationship::create([
            'organization_id' => $this->organization->id,
            'family_id' => $this->family->id,
            'person1_id' => $member->id,
            'person2_id' => $this->members->get(2)->id,
            'relationship_type_id' => $this->relationshipTypes->where('slug', 'parent')->first()->id,
            'status' => 'active',
            'custody_type' => 'full',
            'custody_notes' => 'Full legal custody'
        ]);

        $response = $this->getJson("/api/members/{$member->id}/relationships/analysis");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'data' => [
                        'conflicts',
                        'cross_family_relationships',
                        'custody_relationships',
                        'household_overlaps',
                        'suggestions'
                    ]
                ]);

        $data = $response->json('data');
        $this->assertIsArray($data['custody_relationships']);
        $this->assertCount(1, $data['custody_relationships']);
    }

    /** @test */
    public function it_can_get_relationship_statistics()
    {
        $this->actingAs($this->user);

        $member = $this->members->first();

        // Create relationships
        FamilyRelationship::create([
            'organization_id' => $this->organization->id,
            'family_id' => $this->family->id,
            'person1_id' => $member->id,
            'person2_id' => $this->members->get(1)->id,
            'relationship_type_id' => $this->relationshipTypes->where('slug', 'spouse')->first()->id,
            'status' => 'active',
            'is_primary' => true
        ]);

        FamilyRelationship::create([
            'organization_id' => $this->organization->id,
            'family_id' => $this->family->id,
            'person1_id' => $member->id,
            'person2_id' => $this->members->get(2)->id,
            'relationship_type_id' => $this->relationshipTypes->where('slug', 'parent')->first()->id,
            'status' => 'active',
            'custody_type' => 'joint'
        ]);

        $response = $this->getJson("/api/members/{$member->id}/relationships/statistics");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'data' => [
                        'total_relationships',
                        'active_relationships',
                        'custody_relationships',
                        'primary_relationships',
                        'household_memberships',
                        'relationship_types'
                    ]
                ]);

        $data = $response->json('data');
        $this->assertEquals(2, $data['total_relationships']);
        $this->assertEquals(2, $data['active_relationships']);
        $this->assertEquals(1, $data['custody_relationships']);
        $this->assertEquals(1, $data['primary_relationships']);
    }

    /** @test */
    public function it_detects_relationship_conflicts()
    {
        $analysisService = new RelationshipAnalysisService();
        $member = $this->members->first();
        $otherMember = $this->members->get(1);

        // Create conflicting relationships (spouse and parent to same person)
        FamilyRelationship::create([
            'organization_id' => $this->organization->id,
            'family_id' => $this->family->id,
            'person1_id' => $member->id,
            'person2_id' => $otherMember->id,
            'relationship_type_id' => $this->relationshipTypes->where('slug', 'spouse')->first()->id,
            'status' => 'active'
        ]);

        FamilyRelationship::create([
            'organization_id' => $this->organization->id,
            'family_id' => $this->family->id,
            'person1_id' => $member->id,
            'person2_id' => $otherMember->id,
            'relationship_type_id' => $this->relationshipTypes->where('slug', 'parent')->first()->id,
            'status' => 'active'
        ]);

        $analysis = $analysisService->analyzeComplexRelationships($member->id, $this->organization->id);

        $this->assertNotEmpty($analysis['conflicts']);
        $this->assertEquals('duplicate_relationship', $analysis['conflicts'][0]['type']);
    }

    /** @test */
    public function it_finds_household_overlaps()
    {
        $analysisService = new RelationshipAnalysisService();
        $member = $this->members->first();

        // Create second household
        $secondHousehold = Household::factory()->create([
            'organization_id' => $this->organization->id,
            'name' => 'Second Household'
        ]);

        // Add member to both households
        HouseholdMember::create([
            'organization_id' => $this->organization->id,
            'household_id' => $this->household->id,
            'member_id' => $member->id,
            'role' => 'head',
            'residency_status' => 'permanent'
        ]);

        HouseholdMember::create([
            'organization_id' => $this->organization->id,
            'household_id' => $secondHousehold->id,
            'member_id' => $member->id,
            'role' => 'resident',
            'residency_status' => 'temporary'
        ]);

        $analysis = $analysisService->analyzeComplexRelationships($member->id, $this->organization->id);

        $this->assertNotEmpty($analysis['household_overlaps']);
        $overlap = collect($analysis['household_overlaps'])->firstWhere('member_id', $member->id);
        $this->assertNotNull($overlap);
        $this->assertCount(2, $overlap['households']);
    }

    /** @test */
    public function it_generates_relationship_suggestions()
    {
        $analysisService = new RelationshipAnalysisService();
        $member = $this->members->first();

        // Add member to household with other family members but no relationships
        HouseholdMember::create([
            'organization_id' => $this->organization->id,
            'household_id' => $this->household->id,
            'member_id' => $member->id,
            'role' => 'head',
            'residency_status' => 'permanent'
        ]);

        HouseholdMember::create([
            'organization_id' => $this->organization->id,
            'household_id' => $this->household->id,
            'member_id' => $this->members->get(1)->id,
            'role' => 'resident',
            'residency_status' => 'permanent'
        ]);

        $analysis = $analysisService->analyzeComplexRelationships($member->id, $this->organization->id);

        $this->assertNotEmpty($analysis['suggestions']);
        $suggestion = collect($analysis['suggestions'])->first();
        $this->assertArrayHasKey('type', $suggestion);
        $this->assertArrayHasKey('description', $suggestion);
        $this->assertArrayHasKey('reason', $suggestion);
    }

    /** @test */
    public function it_handles_custody_relationships()
    {
        $this->actingAs($this->user);

        $guardian = $this->members->first();
        $child = $this->members->get(2);

        $relationshipData = [
            'family_id' => $this->family->id,
            'person1_id' => $guardian->id,
            'person2_id' => $child->id,
            'relationship_type_id' => $this->relationshipTypes->where('slug', 'guardian')->first()->id,
            'custody_type' => 'full',
            'custody_start_date' => '2023-01-01',
            'custody_notes' => 'Court-ordered full custody',
            'status' => 'active'
        ];

        $response = $this->postJson('/api/family-relationships', $relationshipData);

        $response->assertStatus(201)
                ->assertJsonPath('data.custody_type', 'full')
                ->assertJsonPath('data.custody_notes', 'Court-ordered full custody');

        // Verify custody relationship appears in analysis
        $analysisResponse = $this->getJson("/api/members/{$guardian->id}/relationships/analysis");
        $analysisData = $analysisResponse->json('data');
        
        $this->assertNotEmpty($analysisData['custody_relationships']);
        $this->assertEquals('full', $analysisData['custody_relationships'][0]['custody_type']);
    }
}
