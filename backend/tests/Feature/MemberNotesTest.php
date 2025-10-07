<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Organization;
use App\Models\Member;
use App\Models\MemberNote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Carbon\Carbon;

class MemberNotesTest extends TestCase
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
    public function it_can_create_member_note()
    {
        $noteData = [
            'title' => 'Test Note',
            'content' => 'This is a test note content',
            'note_type' => 'Personal Note',
            'privacy_level' => 'public',
            'is_alert' => false,
            'is_pinned' => false
        ];

        $response = $this->postJson("/api/members/{$this->member->id}/notes", $noteData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'title',
                    'content',
                    'note_type',
                    'privacy_level',
                    'is_alert',
                    'is_pinned',
                    'author_name'
                ]
            ]);

        $this->assertDatabaseHas('member_notes', [
            'member_id' => $this->member->id,
            'title' => 'Test Note',
            'author_id' => $this->user->id
        ]);
    }

    /** @test */
    public function it_can_list_member_notes()
    {
        MemberNote::factory()->count(3)->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id
        ]);

        $response = $this->getJson("/api/members/{$this->member->id}/notes");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'content',
                        'note_type',
                        'privacy_level',
                        'is_alert',
                        'is_pinned'
                    ]
                ]
            ]);
    }

    /** @test */
    public function it_can_create_alert_note_with_expiry()
    {
        $noteData = [
            'title' => 'Alert Note',
            'content' => 'This is an important alert',
            'note_type' => 'Emergency',
            'privacy_level' => 'public',
            'is_alert' => true,
            'alert_expires_at' => now()->addDays(7)->toDateString()
        ];

        $response = $this->postJson("/api/members/{$this->member->id}/notes", $noteData);

        $response->assertStatus(201);

        $this->assertDatabaseHas('member_notes', [
            'member_id' => $this->member->id,
            'is_alert' => true,
            'alert_expires_at' => now()->addDays(7)->startOfDay()
        ]);
    }

    /** @test */
    public function it_can_pin_and_unpin_notes()
    {
        $note = MemberNote::factory()->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id,
            'is_pinned' => false
        ]);

        // Pin the note
        $response = $this->putJson("/api/members/{$this->member->id}/notes/{$note->id}", [
            'is_pinned' => true
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('member_notes', [
            'id' => $note->id,
            'is_pinned' => true
        ]);

        // Unpin the note
        $response = $this->putJson("/api/members/{$this->member->id}/notes/{$note->id}", [
            'is_pinned' => false
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('member_notes', [
            'id' => $note->id,
            'is_pinned' => false
        ]);
    }

    /** @test */
    public function it_can_filter_notes_by_type()
    {
        MemberNote::factory()->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id,
            'note_type' => 'Personal Note'
        ]);

        MemberNote::factory()->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id,
            'note_type' => 'Prayer Request'
        ]);

        $response = $this->getJson("/api/members/{$this->member->id}/notes?note_type=Personal Note");

        $response->assertStatus(200);
        
        $notes = $response->json('data');
        $this->assertCount(1, $notes);
        $this->assertEquals('Personal Note', $notes[0]['note_type']);
    }

    /** @test */
    public function it_can_filter_notes_by_privacy_level()
    {
        MemberNote::factory()->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id,
            'privacy_level' => 'public'
        ]);

        MemberNote::factory()->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id,
            'privacy_level' => 'private'
        ]);

        $response = $this->getJson("/api/members/{$this->member->id}/notes?privacy_level=public");

        $response->assertStatus(200);
        
        $notes = $response->json('data');
        $this->assertCount(1, $notes);
        $this->assertEquals('public', $notes[0]['privacy_level']);
    }

    /** @test */
    public function it_can_search_notes_content()
    {
        MemberNote::factory()->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id,
            'title' => 'Important Meeting',
            'content' => 'Discussed ministry opportunities'
        ]);

        MemberNote::factory()->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id,
            'title' => 'Prayer Request',
            'content' => 'Needs prayer for family situation'
        ]);

        $response = $this->getJson("/api/members/{$this->member->id}/notes?search=ministry");

        $response->assertStatus(200);
        
        $notes = $response->json('data');
        $this->assertCount(1, $notes);
        $this->assertEquals('Important Meeting', $notes[0]['title']);
    }

    /** @test */
    public function it_can_get_active_alert_notes()
    {
        // Active alert (no expiry)
        MemberNote::factory()->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id,
            'is_alert' => true,
            'alert_expires_at' => null
        ]);

        // Active alert (expires in future)
        MemberNote::factory()->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id,
            'is_alert' => true,
            'alert_expires_at' => now()->addDays(5)
        ]);

        // Expired alert
        MemberNote::factory()->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id,
            'is_alert' => true,
            'alert_expires_at' => now()->subDays(1)
        ]);

        $response = $this->getJson("/api/members/{$this->member->id}/notes?alerts_only=true");

        $response->assertStatus(200);
        
        $notes = $response->json('data');
        $this->assertCount(2, $notes); // Only active alerts
    }

    /** @test */
    public function it_can_get_pinned_notes()
    {
        MemberNote::factory()->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id,
            'is_pinned' => true
        ]);

        MemberNote::factory()->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id,
            'is_pinned' => false
        ]);

        $response = $this->getJson("/api/members/{$this->member->id}/notes?pinned_only=true");

        $response->assertStatus(200);
        
        $notes = $response->json('data');
        $this->assertCount(1, $notes);
        $this->assertTrue($notes[0]['is_pinned']);
    }

    /** @test */
    public function it_can_update_note()
    {
        $note = MemberNote::factory()->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id
        ]);

        $updateData = [
            'title' => 'Updated Title',
            'content' => 'Updated content',
            'privacy_level' => 'private'
        ];

        $response = $this->putJson("/api/members/{$this->member->id}/notes/{$note->id}", $updateData);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('member_notes', [
            'id' => $note->id,
            'title' => 'Updated Title',
            'privacy_level' => 'private'
        ]);
    }

    /** @test */
    public function it_can_delete_note()
    {
        $note = MemberNote::factory()->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id
        ]);

        $response = $this->deleteJson("/api/members/{$this->member->id}/notes/{$note->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('member_notes', ['id' => $note->id]);
    }

    /** @test */
    public function it_validates_note_creation()
    {
        $invalidData = [
            'title' => '', // Required
            'content' => '', // Required
            'privacy_level' => 'invalid', // Invalid enum
            'note_type' => 'Invalid Type' // Invalid type
        ];

        $response = $this->postJson("/api/members/{$this->member->id}/notes", $invalidData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'content', 'privacy_level', 'note_type']);
    }

    /** @test */
    public function it_can_search_across_all_member_notes()
    {
        $member1 = Member::factory()->create(['organization_id' => $this->organization->id]);
        $member2 = Member::factory()->create(['organization_id' => $this->organization->id]);

        MemberNote::factory()->create([
            'member_id' => $member1->id,
            'author_id' => $this->user->id,
            'content' => 'Unique search term here'
        ]);

        MemberNote::factory()->create([
            'member_id' => $member2->id,
            'author_id' => $this->user->id,
            'content' => 'Different content'
        ]);

        $response = $this->getJson('/api/member-notes/search?query=unique');

        $response->assertStatus(200);
        
        $notes = $response->json('data');
        $this->assertCount(1, $notes);
        $this->assertStringContainsString('Unique search term', $notes[0]['content']);
    }

    /** @test */
    public function it_respects_privacy_levels()
    {
        // This test would need to be expanded based on your user role system
        $privateNote = MemberNote::factory()->create([
            'member_id' => $this->member->id,
            'author_id' => $this->user->id,
            'privacy_level' => 'extreme',
            'content' => 'Extremely private content'
        ]);

        $response = $this->getJson("/api/members/{$this->member->id}/notes");

        $response->assertStatus(200);
        
        // Depending on user permissions, extreme privacy notes might be filtered
        // This would need to be implemented based on your authorization logic
    }
}
