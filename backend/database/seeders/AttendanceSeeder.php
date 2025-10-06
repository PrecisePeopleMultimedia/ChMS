<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Organization;
use App\Models\Service;
use App\Models\AttendanceRecord;
use App\Models\MemberQrCode;
use App\Models\User;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a test organization
        $organization = Organization::first() ?? Organization::factory()->create([
            'name' => 'Test Church',
            'email' => 'test@church.com',
        ]);

        // Create test users (members)
        $members = User::factory(20)->create([
            'organization_id' => $organization->id,
        ]);

        // Create QR codes for members
        foreach ($members as $member) {
            MemberQrCode::factory()
                ->forMember($member)
                ->valid()
                ->create();
        }

        // Create services for the past 4 weeks
        $services = $this->createServices($organization);

        // Create attendance records for each service
        foreach ($services as $service) {
            $this->createAttendanceForService($service, $members);
        }

        // Create some special events
        $this->createSpecialEvents($organization, $members);

        $this->command->info('Attendance system seeded successfully!');
        $this->command->info("Created {$services->count()} services");
        $this->command->info("Created " . AttendanceRecord::count() . " attendance records");
        $this->command->info("Created " . MemberQrCode::count() . " QR codes");
    }

    /**
     * Create services for the past 4 weeks.
     */
    private function createServices(Organization $organization)
    {
        $services = collect();
        $startDate = Carbon::now()->subWeeks(4)->startOfWeek();

        // Create Sunday services
        for ($week = 0; $week < 4; $week++) {
            $sundayDate = $startDate->copy()->addWeeks($week)->next(Carbon::SUNDAY);
            
            $services->push(
                Service::factory()
                    ->for($organization)
                    ->sundayService()
                    ->forDate($sundayDate)
                    ->active()
                    ->create()
            );
        }

        // Create midweek services
        for ($week = 0; $week < 4; $week++) {
            $wednesdayDate = $startDate->copy()->addWeeks($week)->next(Carbon::WEDNESDAY);
            
            $services->push(
                Service::factory()
                    ->for($organization)
                    ->midweek()
                    ->forDate($wednesdayDate)
                    ->active()
                    ->create()
            );
        }

        return $services;
    }

    /**
     * Create attendance records for a service.
     */
    private function createAttendanceForService(Service $service, $members)
    {
        // Random number of attendees (60-90% of members)
        $attendeeCount = rand(
            (int) ($members->count() * 0.6),
            (int) ($members->count() * 0.9)
        );

        // Select random members to attend
        $attendees = $members->random($attendeeCount);

        foreach ($attendees as $member) {
            // Create member attendance
            AttendanceRecord::factory()
                ->forService($service)
                ->forMember($member)
                ->create();
        }

        // Add some visitors (5-15% of attendance)
        $visitorCount = rand(2, 8);
        for ($i = 0; $i < $visitorCount; $i++) {
            AttendanceRecord::factory()
                ->forService($service)
                ->visitor()
                ->create();
        }
    }

    /**
     * Create special events.
     */
    private function createSpecialEvents(Organization $organization, $members)
    {
        $specialEvents = [
            [
                'name' => 'Easter Service',
                'date' => Carbon::now()->subMonths(2)->next(Carbon::SUNDAY),
                'type' => 'special_event',
            ],
            [
                'name' => 'Christmas Service',
                'date' => Carbon::now()->subMonths(1)->next(Carbon::SUNDAY),
                'type' => 'special_event',
            ],
            [
                'name' => 'Youth Conference',
                'date' => Carbon::now()->subWeeks(2)->next(Carbon::SATURDAY),
                'type' => 'special_event',
            ],
        ];

        foreach ($specialEvents as $event) {
            $service = Service::factory()
                ->for($organization)
                ->specialEvent()
                ->forDate($event['date'])
                ->active()
                ->create([
                    'name' => $event['name'],
                ]);

            // Higher attendance for special events
            $attendeeCount = rand(
                (int) ($members->count() * 0.8),
                $members->count()
            );

            $attendees = $members->random($attendeeCount);

            foreach ($attendees as $member) {
                AttendanceRecord::factory()
                    ->forService($service)
                    ->forMember($member)
                    ->create();
            }

            // More visitors for special events
            $visitorCount = rand(5, 15);
            for ($i = 0; $i < $visitorCount; $i++) {
                AttendanceRecord::factory()
                    ->forService($service)
                    ->visitor()
                    ->create();
            }
        }
    }
}
