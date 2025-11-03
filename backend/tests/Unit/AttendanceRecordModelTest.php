<?php

namespace Tests\Unit;

use App\Models\AttendanceRecord;
use App\Models\Organization;
use App\Models\Service;
use App\Models\Member;
use App\Models\Family;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class AttendanceRecordModelTest extends TestCase
{
    use RefreshDatabase;

    protected $organization;
    protected $service;
    protected $member;
    protected $family;
    protected $user;
    protected $attendanceRecord;

    protected function setUp(): void
    {
        parent::setUp();

        $this->organization = Organization::factory()->create();
        $this->user = User::factory()->create(['organization_id' => $this->organization->id]);
        $this->family = Family::factory()->create(['organization_id' => $this->organization->id]);
        $this->member = Member::factory()->create([
            'organization_id' => $this->organization->id,
            'family_id' => $this->family->id,
        ]);
        $this->service = Service::factory()->create(['organization_id' => $this->organization->id]);

        $this->attendanceRecord = AttendanceRecord::factory()->create([
            'organization_id' => $this->organization->id,
            'service_id' => $this->service->id,
            'member_id' => $this->member->id,
            'family_id' => $this->family->id,
        ]);
    }

    /** @test */
    public function it_has_correct_fillable_attributes()
    {
        $fillable = [
            'organization_id',
            'service_id',
            'member_id',
            'visitor_name',
            'visitor_email',
            'visitor_phone',
            'is_visitor',
            'family_id',
            'is_family_checkin',
            'checkin_method',
            'checked_in_at',
            'checked_out_at',
            'location',
            'section',
            'assigned_to',
            'is_child',
            'child_ministry',
            'guardian_contact',
            'qr_code_used',
            'qr_scanned_at',
            'synced',
            'synced_at',
            'offline_data',
            'notes',
            'special_needs',
        ];

        $this->assertEquals($fillable, $this->attendanceRecord->getFillable());
    }

    /** @test */
    public function it_casts_attributes_correctly()
    {
        $casts = [
            'is_visitor' => 'boolean',
            'is_family_checkin' => 'boolean',
            'checked_in_at' => 'datetime',
            'checked_out_at' => 'datetime',
            'is_child' => 'boolean',
            'qr_scanned_at' => 'datetime',
            'synced' => 'boolean',
            'synced_at' => 'datetime',
            'offline_data' => 'array',
            'special_needs' => 'array',
        ];

        foreach ($casts as $attribute => $cast) {
            $this->assertArrayHasKey($attribute, $this->attendanceRecord->getCasts());
        }
    }

    /** @test */
    public function it_belongs_to_organization()
    {
        $this->assertInstanceOf(Organization::class, $this->attendanceRecord->organization);
        $this->assertEquals($this->organization->id, $this->attendanceRecord->organization->id);
    }

    /** @test */
    public function it_belongs_to_service()
    {
        $this->assertInstanceOf(Service::class, $this->attendanceRecord->service);
        $this->assertEquals($this->service->id, $this->attendanceRecord->service->id);
    }

    /** @test */
    public function it_belongs_to_member()
    {
        $this->assertInstanceOf(Member::class, $this->attendanceRecord->member);
        $this->assertEquals($this->member->id, $this->attendanceRecord->member->id);
    }

    /** @test */
    public function it_belongs_to_family()
    {
        $this->assertInstanceOf(Family::class, $this->attendanceRecord->family);
        $this->assertEquals($this->family->id, $this->attendanceRecord->family->id);
    }

    /** @test */
    public function it_can_scope_by_service()
    {
        $anotherService = Service::factory()->create(['organization_id' => $this->organization->id]);
        $anotherRecord = AttendanceRecord::factory()->create([
            'service_id' => $anotherService->id,
        ]);

        $serviceRecords = AttendanceRecord::byService($this->service->id)->get();

        $this->assertTrue($serviceRecords->contains($this->attendanceRecord));
        $this->assertFalse($serviceRecords->contains($anotherRecord));
    }

    /** @test */
    public function it_can_scope_by_member()
    {
        $anotherMember = Member::factory()->create(['organization_id' => $this->organization->id]);
        $anotherRecord = AttendanceRecord::factory()->create([
            'member_id' => $anotherMember->id,
        ]);

        $memberRecords = AttendanceRecord::byMember($this->member->id)->get();

        $this->assertTrue($memberRecords->contains($this->attendanceRecord));
        $this->assertFalse($memberRecords->contains($anotherRecord));
    }

    /** @test */
    public function it_can_scope_by_family()
    {
        $anotherFamily = Family::factory()->create(['organization_id' => $this->organization->id]);
        $anotherRecord = AttendanceRecord::factory()->create([
            'family_id' => $anotherFamily->id,
        ]);

        $familyRecords = AttendanceRecord::byFamily($this->family->id)->get();

        $this->assertTrue($familyRecords->contains($this->attendanceRecord));
        $this->assertFalse($familyRecords->contains($anotherRecord));
    }

    /** @test */
    public function it_can_scope_by_method()
    {
        $qrRecord = AttendanceRecord::factory()->create([
            'checkin_method' => 'qr_individual',
        ]);

        $manualRecord = AttendanceRecord::factory()->create([
            'checkin_method' => 'manual',
        ]);

        $qrRecords = AttendanceRecord::byMethod('qr_individual')->get();

        $this->assertTrue($qrRecords->contains($qrRecord));
        $this->assertFalse($qrRecords->contains($manualRecord));
    }

    /** @test */
    public function it_can_scope_visitors()
    {
        $visitorRecord = AttendanceRecord::factory()->create([
            'is_visitor' => true,
        ]);

        $memberRecord = AttendanceRecord::factory()->create([
            'is_visitor' => false,
        ]);

        $visitorRecords = AttendanceRecord::visitors()->get();

        $this->assertTrue($visitorRecords->contains($visitorRecord));
        $this->assertFalse($visitorRecords->contains($memberRecord));
    }

    /** @test */
    public function it_can_scope_members()
    {
        $visitorRecord = AttendanceRecord::factory()->create([
            'is_visitor' => true,
        ]);

        $memberRecord = AttendanceRecord::factory()->create([
            'is_visitor' => false,
        ]);

        $memberRecords = AttendanceRecord::members()->get();

        $this->assertTrue($memberRecords->contains($memberRecord));
        $this->assertFalse($memberRecords->contains($visitorRecord));
    }

    /** @test */
    public function it_can_scope_children()
    {
        $childRecord = AttendanceRecord::factory()->create([
            'is_child' => true,
        ]);

        $adultRecord = AttendanceRecord::factory()->create([
            'is_child' => false,
        ]);

        $childRecords = AttendanceRecord::children()->get();

        $this->assertTrue($childRecords->contains($childRecord));
        $this->assertFalse($childRecords->contains($adultRecord));
    }

    /** @test */
    public function it_can_scope_needing_sync()
    {
        $syncedRecord = AttendanceRecord::factory()->create([
            'synced' => true,
        ]);

        $unsyncedRecord = AttendanceRecord::factory()->create([
            'synced' => false,
        ]);

        $needingSyncRecords = AttendanceRecord::needingSync()->get();

        $this->assertTrue($needingSyncRecords->contains($unsyncedRecord));
        $this->assertFalse($needingSyncRecords->contains($syncedRecord));
    }

    /** @test */
    public function it_can_check_if_visitor()
    {
        $this->attendanceRecord->update(['is_visitor' => true]);
        $this->assertTrue($this->attendanceRecord->isVisitor());

        $this->attendanceRecord->update(['is_visitor' => false]);
        $this->assertFalse($this->attendanceRecord->isVisitor());
    }

    /** @test */
    public function it_can_check_if_family_checkin()
    {
        $this->attendanceRecord->update(['is_family_checkin' => true]);
        $this->assertTrue($this->attendanceRecord->isFamilyCheckin());

        $this->attendanceRecord->update(['is_family_checkin' => false]);
        $this->assertFalse($this->attendanceRecord->isFamilyCheckin());
    }

    /** @test */
    public function it_can_check_if_checked_in()
    {
        $this->attendanceRecord->update([
            'checked_in_at' => now(),
            'checked_out_at' => null,
        ]);
        $this->assertTrue($this->attendanceRecord->isCheckedIn());

        $this->attendanceRecord->update(['checked_out_at' => now()]);
        $this->assertFalse($this->attendanceRecord->isCheckedIn());
    }

    /** @test */
    public function it_can_check_out()
    {
        $this->attendanceRecord->update(['checked_out_at' => null]);
        $this->attendanceRecord->checkOut();

        $this->assertNotNull($this->attendanceRecord->fresh()->checked_out_at);
    }

    /** @test */
    public function it_can_mark_as_synced()
    {
        $this->attendanceRecord->update(['synced' => false, 'synced_at' => null]);
        $this->attendanceRecord->markAsSynced();

        $fresh = $this->attendanceRecord->fresh();
        $this->assertTrue($fresh->synced);
        $this->assertNotNull($fresh->synced_at);
    }

    /** @test */
    public function it_can_create_visitor_record()
    {
        $data = [
            'organization_id' => $this->organization->id,
            'service_id' => $this->service->id,
            'visitor_name' => 'John Visitor',
            'visitor_email' => 'john@example.com',
            'checkin_method' => 'manual',
        ];

        $record = AttendanceRecord::createVisitorRecord($data);

        $this->assertTrue($record->is_visitor);
        $this->assertNotNull($record->checked_in_at);
        $this->assertTrue($record->synced);
        $this->assertEquals('John Visitor', $record->visitor_name);
    }

    /** @test */
    public function it_can_create_member_record()
    {
        $data = [
            'organization_id' => $this->organization->id,
            'service_id' => $this->service->id,
            'member_id' => $this->member->id,
            'checkin_method' => 'qr_individual',
        ];

        $record = AttendanceRecord::createMemberRecord($data);

        $this->assertFalse($record->is_visitor);
        $this->assertNotNull($record->checked_in_at);
        $this->assertTrue($record->synced);
        $this->assertEquals($this->member->id, $record->member_id);
    }

    /** @test */
    public function it_has_checkin_methods_constant()
    {
        $expectedMethods = [
            'qr_individual' => 'QR Code (Individual)',
            'qr_family' => 'QR Code (Family)',
            'manual_search' => 'Manual Search',
            'visitor_registration' => 'Visitor Registration',
        ];

        $this->assertEquals($expectedMethods, AttendanceRecord::CHECKIN_METHODS);
    }
}
