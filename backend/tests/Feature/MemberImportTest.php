<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MemberImportTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Organization $organization;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->organization = Organization::factory()->create();
        $this->user = User::factory()->create([
            'organization_id' => $this->organization->id
        ]);
    }

    public function test_it_can_import_members_from_csv()
    {
        Storage::fake('local');

        // Create CSV content
        $csvContent = "first_name,last_name,email,phone,gender\n";
        $csvContent .= "John,Doe,john.doe@example.com,+234-804-123-4567,male\n";
        $csvContent .= "Jane,Smith,jane.smith@example.com,+234-804-123-4568,female\n";

        $file = UploadedFile::fake()->createWithContent('members.csv', $csvContent);

        $response = $this->actingAs($this->user)
            ->postJson('/api/members/import', [
                'file' => $file
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'imported' => 2,
                    'skipped' => 0,
                    'errors' => []
                ]
            ]);

        // Verify members were created
        $this->assertDatabaseHas('members', [
            'organization_id' => $this->organization->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com'
        ]);

        $this->assertDatabaseHas('members', [
            'organization_id' => $this->organization->id,
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane.smith@example.com'
        ]);
    }

    public function test_it_validates_required_headers()
    {
        Storage::fake('local');

        // Create CSV with missing required headers
        $csvContent = "name,email\n";
        $csvContent .= "John Doe,john.doe@example.com\n";

        $file = UploadedFile::fake()->createWithContent('members.csv', $csvContent);

        $response = $this->actingAs($this->user)
            ->postJson('/api/members/import', [
                'file' => $file
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Missing required headers: first_name, last_name'
            ]);
    }

    public function test_it_skips_duplicate_emails()
    {
        Storage::fake('local');

        // Create existing member
        Member::factory()->create([
            'organization_id' => $this->organization->id,
            'email' => 'john.doe@example.com'
        ]);

        // Create CSV with duplicate email
        $csvContent = "first_name,last_name,email\n";
        $csvContent .= "John,Doe,john.doe@example.com\n";
        $csvContent .= "Jane,Smith,jane.smith@example.com\n";

        $file = UploadedFile::fake()->createWithContent('members.csv', $csvContent);

        $response = $this->actingAs($this->user)
            ->postJson('/api/members/import', [
                'file' => $file
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'imported' => 1,
                    'skipped' => 1
                ]
            ]);

        // Verify only new member was created
        $this->assertEquals(2, Member::where('organization_id', $this->organization->id)->count());
    }

    public function test_it_validates_required_fields()
    {
        Storage::fake('local');

        // Create CSV with missing required fields
        $csvContent = "first_name,last_name,email\n";
        $csvContent .= ",Doe,john.doe@example.com\n"; // Missing first_name
        $csvContent .= "Jane,,jane.smith@example.com\n"; // Missing last_name

        $file = UploadedFile::fake()->createWithContent('members.csv', $csvContent);

        $response = $this->actingAs($this->user)
            ->postJson('/api/members/import', [
                'file' => $file
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'imported' => 0,
                    'skipped' => 2
                ]
            ]);

        // Verify no members were created
        $this->assertEquals(0, Member::where('organization_id', $this->organization->id)->count());
    }

    public function test_it_can_download_import_template()
    {
        $response = $this->actingAs($this->user)
            ->get('/api/members/import/template');

        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'text/csv; charset=UTF-8')
            ->assertHeader('Content-Disposition', 'attachment; filename="member_import_template.csv"');

        // Verify CSV content contains headers
        $content = $response->getContent();
        $this->assertStringContainsString('first_name,last_name,email', $content);
        $this->assertStringContainsString('John,Doe,john.doe@example.com', $content);
    }

    public function test_it_validates_file_upload()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/members/import', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_it_validates_file_type()
    {
        $file = UploadedFile::fake()->create('document.pdf', 100);

        $response = $this->actingAs($this->user)
            ->postJson('/api/members/import', [
                'file' => $file
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_it_validates_file_size()
    {
        $file = UploadedFile::fake()->create('large.csv', 11000); // 11MB

        $response = $this->actingAs($this->user)
            ->postJson('/api/members/import', [
                'file' => $file
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_it_handles_malformed_csv()
    {
        Storage::fake('local');

        // Create malformed CSV
        $csvContent = "first_name,last_name,email\n";
        $csvContent .= "John,Doe,john.doe@example.com,extra_field\n"; // Extra field
        $csvContent .= "Jane\n"; // Missing fields

        $file = UploadedFile::fake()->createWithContent('members.csv', $csvContent);

        $response = $this->actingAs($this->user)
            ->postJson('/api/members/import', [
                'file' => $file
            ]);

        $response->assertStatus(200);
        
        $data = $response->json('data');
        $this->assertGreaterThan(0, $data['skipped']);
    }
}
