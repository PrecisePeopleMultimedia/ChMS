<?php

namespace Tests\Unit;

use App\Models\Service;
use App\Models\Organization;
use App\Models\AttendanceRecord;
use App\Models\MemberQrCode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class ServiceModelTest extends TestCase
{
    use RefreshDatabase;

    protected $organization;
    protected $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->organization = Organization::factory()->create();
        $this->service = Service::factory()->create([
            'organization_id' => $this->organization->id,
            'scheduled_date' => now()->format('Y-m-d'),
            'start_time' => '09:00:00',
            'end_time' => '11:00:00',
            'status' => 'scheduled',
            'allow_late_checkin' => true,
        ]);
    }

    /** @test */
    public function it_has_correct_fillable_attributes()
    {
        $fillable = [
            'organization_id',
            'name',
            'service_type',
            'description',
            'scheduled_date',
            'start_time',
            'end_time',
            'location',
            'capacity',
            'expected_attendance',
            'status',
            'started_at',
            'ended_at',
            'total_attendance',
            'member_attendance',
            'visitor_attendance',
            'child_attendance',
            'allow_late_checkin',
            'require_checkout',
            'enable_family_checkin',
            'notes',
        ];

        $this->assertEquals($fillable, $this->service->getFillable());
    }

    /** @test */
    public function it_casts_attributes_correctly()
    {
        $casts = [
            'scheduled_date' => 'date',
            'start_time' => 'datetime:H:i:s',
            'end_time' => 'datetime:H:i:s',
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
            'allow_late_checkin' => 'boolean',
            'require_checkout' => 'boolean',
            'enable_family_checkin' => 'boolean',
        ];

        foreach ($casts as $attribute => $cast) {
            $this->assertArrayHasKey($attribute, $this->service->getCasts());
        }
    }

    /** @test */
    public function it_belongs_to_organization()
    {
        $this->assertInstanceOf(Organization::class, $this->service->organization);
        $this->assertEquals($this->organization->id, $this->service->organization->id);
    }

    /** @test */
    public function it_has_many_attendance_records()
    {
        $attendanceRecord = AttendanceRecord::factory()->create([
            'service_id' => $this->service->id,
        ]);

        $this->assertTrue($this->service->attendanceRecords->contains($attendanceRecord));
    }

    /** @test */
    public function it_has_many_qr_codes()
    {
        $qrCode = MemberQrCode::factory()->create([
            'service_id' => $this->service->id,
            'organization_id' => $this->organization->id,
        ]);

        $this->assertTrue($this->service->qrCodes->contains($qrCode));
    }

    /** @test */
    public function it_can_scope_today_services()
    {
        $todayService = Service::factory()->create([
            'organization_id' => $this->organization->id,
            'scheduled_date' => now()->format('Y-m-d'),
        ]);

        $yesterdayService = Service::factory()->create([
            'organization_id' => $this->organization->id,
            'scheduled_date' => now()->subDay()->format('Y-m-d'),
        ]);

        $todayServices = Service::today()->get();

        $this->assertTrue($todayServices->contains($todayService));
        $this->assertFalse($todayServices->contains($yesterdayService));
    }

    /** @test */
    public function it_can_scope_active_services()
    {
        $activeService = Service::factory()->create([
            'organization_id' => $this->organization->id,
            'status' => 'active',
        ]);

        $scheduledService = Service::factory()->create([
            'organization_id' => $this->organization->id,
            'status' => 'scheduled',
        ]);

        $activeServices = Service::active()->get();

        $this->assertTrue($activeServices->contains($activeService));
        $this->assertFalse($activeServices->contains($scheduledService));
    }

    /** @test */
    public function it_can_scope_by_type()
    {
        $sundayMorning = Service::factory()->create([
            'organization_id' => $this->organization->id,
            'service_type' => 'sunday_morning',
        ]);

        $midweek = Service::factory()->create([
            'organization_id' => $this->organization->id,
            'service_type' => 'midweek',
        ]);

        $sundayServices = Service::byType('sunday_morning')->get();

        $this->assertTrue($sundayServices->contains($sundayMorning));
        $this->assertFalse($sundayServices->contains($midweek));
    }

    /** @test */
    public function it_can_check_if_service_is_active()
    {
        $this->service->update(['status' => 'active']);
        $this->assertTrue($this->service->isActive());

        $this->service->update(['status' => 'scheduled']);
        $this->assertFalse($this->service->isActive());
    }

    /** @test */
    public function it_can_check_if_late_checkin_is_allowed()
    {
        // Service allows late check-in and is within 30 minutes of start
        $this->service->update([
            'allow_late_checkin' => true,
            'start_time' => now()->subMinutes(20)->format('H:i:s'),
            'status' => 'active',
        ]);

        $this->assertTrue($this->service->allowsLateCheckin());

        // Service doesn't allow late check-in
        $this->service->update(['allow_late_checkin' => false]);
        $this->assertFalse($this->service->allowsLateCheckin());

        // Service allows late check-in but is more than 30 minutes past start
        $this->service->update([
            'allow_late_checkin' => true,
            'start_time' => now()->subMinutes(40)->format('H:i:s'),
        ]);

        $this->assertFalse($this->service->allowsLateCheckin());
    }

    /** @test */
    public function it_can_start_service()
    {
        $this->service->start();

        $this->assertEquals('active', $this->service->status);
        $this->assertNotNull($this->service->started_at);
    }

    /** @test */
    public function it_can_end_service()
    {
        $this->service->update(['status' => 'active']);
        $this->service->end();

        $this->assertEquals('completed', $this->service->status);
        $this->assertNotNull($this->service->ended_at);
    }

    /** @test */
    public function it_can_update_attendance_counts()
    {
        // Create attendance records
        AttendanceRecord::factory()->create([
            'service_id' => $this->service->id,
            'is_visitor' => false,
            'is_child' => false,
        ]);

        AttendanceRecord::factory()->create([
            'service_id' => $this->service->id,
            'is_visitor' => true,
            'is_child' => false,
        ]);

        AttendanceRecord::factory()->create([
            'service_id' => $this->service->id,
            'is_visitor' => false,
            'is_child' => true,
        ]);

        $this->service->updateAttendanceCounts();

        $this->assertEquals(3, $this->service->total_attendance);
        $this->assertEquals(2, $this->service->member_attendance);
        $this->assertEquals(1, $this->service->visitor_attendance);
        $this->assertEquals(1, $this->service->child_attendance);
    }

    /** @test */
    public function it_can_get_attendance_stats()
    {
        // Create attendance records with different methods
        AttendanceRecord::factory()->create([
            'service_id' => $this->service->id,
            'checkin_method' => 'qr_individual',
            'is_visitor' => false,
        ]);

        AttendanceRecord::factory()->create([
            'service_id' => $this->service->id,
            'checkin_method' => 'manual',
            'is_visitor' => true,
        ]);

        $stats = $this->service->getAttendanceStats();

        $this->assertArrayHasKey('total', $stats);
        $this->assertArrayHasKey('members', $stats);
        $this->assertArrayHasKey('visitors', $stats);
        $this->assertArrayHasKey('children', $stats);
        $this->assertArrayHasKey('by_method', $stats);

        $this->assertEquals(2, $stats['total']);
        $this->assertEquals(1, $stats['members']);
        $this->assertEquals(1, $stats['visitors']);
        $this->assertEquals(1, $stats['by_method']['qr_individual']);
        $this->assertEquals(1, $stats['by_method']['manual']);
    }

    /** @test */
    public function it_has_service_types_constant()
    {
        $expectedTypes = [
            'sunday_morning' => 'Sunday Morning',
            'sunday_evening' => 'Sunday Evening',
            'midweek' => 'Midweek Service',
            'special_event' => 'Special Event',
        ];

        $this->assertEquals($expectedTypes, Service::SERVICE_TYPES);
    }

    /** @test */
    public function it_has_service_statuses_constant()
    {
        $expectedStatuses = [
            'scheduled' => 'Scheduled',
            'active' => 'Active',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
        ];

        $this->assertEquals($expectedStatuses, Service::SERVICE_STATUSES);
    }
}
