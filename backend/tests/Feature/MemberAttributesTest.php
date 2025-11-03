<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Organization;
use App\Models\Member;
use App\Models\MemberAttribute;
use App\Models\MemberAttributeValue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class MemberAttributesTest extends TestCase
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
    public function it_can_create_member_attribute()
    {
        $attributeData = [
            'key' => 'baptism_date',
            'name' => 'Baptism Date',
            'field_type' => 'date',
            'category' => 'Personal',
            'is_required' => false,
            'display_order' => 1
        ];

        $response = $this->postJson('/api/member-attributes', $attributeData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'key',
                    'name',
                    'field_type',
                    'category',
                    'is_required',
                    'display_order'
                ]
            ]);

        $this->assertDatabaseHas('member_attributes', [
            'key' => 'baptism_date',
            'organization_id' => $this->organization->id
        ]);
    }

    /** @test */
    public function it_can_list_member_attributes()
    {
        MemberAttribute::factory()->count(3)->create([
            'organization_id' => $this->organization->id
        ]);

        $response = $this->getJson('/api/member-attributes');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'key',
                        'name',
                        'field_type',
                        'category'
                    ]
                ],
                'categories',
                'field_types'
            ]);
    }

    /** @test */
    public function it_can_filter_attributes_by_category()
    {
        MemberAttribute::factory()->create([
            'organization_id' => $this->organization->id,
            'category' => 'Personal'
        ]);

        MemberAttribute::factory()->create([
            'organization_id' => $this->organization->id,
            'category' => 'Ministry'
        ]);

        $response = $this->getJson('/api/member-attributes?category=Personal');

        $response->assertStatus(200);
        
        $attributes = $response->json('data');
        $this->assertCount(1, $attributes);
        $this->assertEquals('Personal', $attributes[0]['category']);
    }

    /** @test */
    public function it_can_create_select_field_with_options()
    {
        $attributeData = [
            'key' => 'ministry_role',
            'name' => 'Ministry Role',
            'field_type' => 'select',
            'category' => 'Ministry',
            'field_options' => [
                'options' => ['Leader', 'Member', 'Volunteer']
            ]
        ];

        $response = $this->postJson('/api/member-attributes', $attributeData);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('member_attributes', [
            'key' => 'ministry_role',
            'field_type' => 'select'
        ]);

        $attribute = MemberAttribute::where('key', 'ministry_role')->first();
        $this->assertEquals(['options' => ['Leader', 'Member', 'Volunteer']], $attribute->field_options);
    }

    /** @test */
    public function it_can_update_attribute_display_order()
    {
        $attributes = MemberAttribute::factory()->count(3)->create([
            'organization_id' => $this->organization->id
        ]);

        $orderData = [
            'attributes' => [
                ['id' => $attributes[0]->id, 'display_order' => 3],
                ['id' => $attributes[1]->id, 'display_order' => 1],
                ['id' => $attributes[2]->id, 'display_order' => 2],
            ]
        ];

        $response = $this->postJson('/api/member-attributes/update-order', $orderData);

        $response->assertStatus(200);

        $this->assertDatabaseHas('member_attributes', [
            'id' => $attributes[0]->id,
            'display_order' => 3
        ]);
    }

    /** @test */
    public function it_can_store_attribute_values_for_member()
    {
        $attribute = MemberAttribute::factory()->create([
            'organization_id' => $this->organization->id,
            'key' => 'baptism_date',
            'field_type' => 'date'
        ]);

        $memberData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'member_type' => 'member',
            'custom_attributes' => [
                'baptism_date' => '2023-01-15'
            ]
        ];

        $response = $this->postJson('/api/members', $memberData);

        $response->assertStatus(201);

        $this->assertDatabaseHas('member_attribute_values', [
            'attribute_id' => $attribute->id,
            'value' => '2023-01-15'
        ]);
    }

    /** @test */
    public function it_validates_required_attributes()
    {
        MemberAttribute::factory()->create([
            'organization_id' => $this->organization->id,
            'key' => 'required_field',
            'field_type' => 'text',
            'is_required' => true
        ]);

        $memberData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'member_type' => 'member',
            'custom_attributes' => [
                // Missing required_field
            ]
        ];

        $response = $this->postJson('/api/members', $memberData);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors' => [
                    'custom_attributes' => [
                        'required_field'
                    ]
                ]
            ]);
    }

    /** @test */
    public function it_validates_field_types()
    {
        $emailAttribute = MemberAttribute::factory()->create([
            'organization_id' => $this->organization->id,
            'key' => 'secondary_email',
            'field_type' => 'email'
        ]);

        $numberAttribute = MemberAttribute::factory()->create([
            'organization_id' => $this->organization->id,
            'key' => 'years_attending',
            'field_type' => 'number'
        ]);

        $memberData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'member_type' => 'member',
            'custom_attributes' => [
                'secondary_email' => 'invalid-email',
                'years_attending' => 'not-a-number'
            ]
        ];

        $response = $this->postJson('/api/members', $memberData);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors' => [
                    'custom_attributes' => [
                        'secondary_email',
                        'years_attending'
                    ]
                ]
            ]);
    }

    /** @test */
    public function it_can_search_members_by_custom_attributes()
    {
        $attribute = MemberAttribute::factory()->create([
            'organization_id' => $this->organization->id,
            'key' => 'ministry',
            'field_type' => 'text'
        ]);

        $member1 = Member::factory()->create([
            'organization_id' => $this->organization->id,
            'first_name' => 'John'
        ]);

        $member2 = Member::factory()->create([
            'organization_id' => $this->organization->id,
            'first_name' => 'Jane'
        ]);

        MemberAttributeValue::create([
            'member_id' => $member1->id,
            'attribute_id' => $attribute->id,
            'value' => 'Youth Ministry'
        ]);

        MemberAttributeValue::create([
            'member_id' => $member2->id,
            'attribute_id' => $attribute->id,
            'value' => 'Music Ministry'
        ]);

        $response = $this->getJson('/api/members?search=Youth');

        $response->assertStatus(200);
        
        $members = $response->json('data');
        $this->assertCount(1, $members);
        $this->assertEquals('John', $members[0]['first_name']);
    }

    /** @test */
    public function it_can_bulk_update_custom_attributes()
    {
        $attribute = MemberAttribute::factory()->active()->create([
            'organization_id' => $this->organization->id,
            'key' => 'status',
            'field_type' => 'text'
        ]);

        $members = Member::factory()->count(3)->create([
            'organization_id' => $this->organization->id
        ]);

        $bulkData = [
            'member_ids' => $members->pluck('id')->toArray(),
            'updates' => [
                'custom_attributes' => [
                    'status' => 'Active'
                ]
            ]
        ];

        $response = $this->postJson('/api/members/bulk-update', $bulkData);

        $response->assertStatus(200);

        foreach ($members as $member) {
            $this->assertDatabaseHas('member_attribute_values', [
                'member_id' => $member->id,
                'attribute_id' => $attribute->id,
                'value' => 'Active'
            ]);
        }
    }

    /** @test */
    public function it_prevents_duplicate_attribute_keys_per_organization()
    {
        MemberAttribute::factory()->create([
            'organization_id' => $this->organization->id,
            'key' => 'duplicate_key'
        ]);

        $duplicateData = [
            'key' => 'duplicate_key',
            'name' => 'Duplicate Attribute',
            'field_type' => 'text'
        ];

        $response = $this->postJson('/api/member-attributes', $duplicateData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['key']);
    }

    /** @test */
    public function it_can_get_member_with_custom_attributes()
    {
        $attribute = MemberAttribute::factory()->create([
            'organization_id' => $this->organization->id,
            'key' => 'baptism_date',
            'field_type' => 'date'
        ]);

        MemberAttributeValue::create([
            'member_id' => $this->member->id,
            'attribute_id' => $attribute->id,
            'value' => '2023-01-15'
        ]);

        $response = $this->getJson("/api/members/{$this->member->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'first_name',
                    'last_name'
                ],
                'custom_attributes' => [
                    '*' => [
                        'attribute',
                        'value',
                        'formatted_value',
                        'display_value'
                    ]
                ]
            ]);
    }
}
