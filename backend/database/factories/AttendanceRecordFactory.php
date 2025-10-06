<?php

namespace Database\Factories;

use App\Models\AttendanceRecord;
use App\Models\Service;
use App\Models\User;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AttendanceRecord>
 */
class AttendanceRecordFactory extends Factory
{
    protected $model = AttendanceRecord::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checkInMethods = ['qr_code', 'manual_search', 'visitor'];
        $checkInMethod = $this->faker->randomElement($checkInMethods);
        
        // Generate check-in time (within the last 30 days)
        $checkInTime = $this->faker->dateTimeBetween('-30 days', 'now');
        
        // Determine if this is a member or visitor attendance
        $isMember = $checkInMethod !== 'visitor' && $this->faker->boolean(80); // 80% chance of member
        
        return [
            'organization_id' => Organization::factory(),
            'service_id' => Service::factory(),
            'member_id' => $isMember ? User::factory() : null,
            'visitor_name' => !$isMember ? $this->generateVisitorName() : null,
            'visitor_phone' => !$isMember ? $this->generateVisitorPhone() : null,
            'check_in_time' => $checkInTime,
            'check_in_method' => $checkInMethod,
            'checked_in_by' => User::factory(),
            'notes' => $this->faker->optional(0.3)->sentence(),
        ];
    }

    /**
     * Generate a realistic visitor name.
     */
    private function generateVisitorName(): string
    {
        $firstNames = [
            'John', 'Mary', 'David', 'Sarah', 'Michael', 'Grace', 'James', 'Faith',
            'Peter', 'Hope', 'Paul', 'Joy', 'Mark', 'Peace', 'Luke', 'Love',
            'Daniel', 'Ruth', 'Samuel', 'Esther', 'Joseph', 'Deborah', 'Joshua', 'Hannah'
        ];
        
        $lastNames = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
            'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
            'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
        ];
        
        return $this->faker->randomElement($firstNames) . ' ' . $this->faker->randomElement($lastNames);
    }

    /**
     * Generate a realistic visitor phone number.
     */
    private function generateVisitorPhone(): string
    {
        // Generate phone numbers for different African countries
        $countryCodes = ['+234', '+254', '+27', '+233', '+256', '+260', '+263'];
        $countryCode = $this->faker->randomElement($countryCodes);
        
        // Generate local number (8-9 digits)
        $localNumber = $this->faker->numerify('########');
        
        return $countryCode . $localNumber;
    }

    /**
     * Create a member attendance record.
     */
    public function member(): static
    {
        return $this->state(fn (array $attributes) => [
            'member_id' => User::factory(),
            'visitor_name' => null,
            'visitor_phone' => null,
            'check_in_method' => $this->faker->randomElement(['qr_code', 'manual_search']),
        ]);
    }

    /**
     * Create a visitor attendance record.
     */
    public function visitor(): static
    {
        return $this->state(fn (array $attributes) => [
            'member_id' => null,
            'visitor_name' => $this->generateVisitorName(),
            'visitor_phone' => $this->generateVisitorPhone(),
            'check_in_method' => 'visitor',
        ]);
    }

    /**
     * Create a QR code check-in.
     */
    public function qrCode(): static
    {
        return $this->state(fn (array $attributes) => [
            'check_in_method' => 'qr_code',
            'member_id' => User::factory(),
            'visitor_name' => null,
            'visitor_phone' => null,
        ]);
    }

    /**
     * Create a manual search check-in.
     */
    public function manualSearch(): static
    {
        return $this->state(fn (array $attributes) => [
            'check_in_method' => 'manual_search',
            'member_id' => User::factory(),
            'visitor_name' => null,
            'visitor_phone' => null,
        ]);
    }

    /**
     * Create an attendance record for today.
     */
    public function today(): static
    {
        return $this->state(fn (array $attributes) => [
            'check_in_time' => $this->faker->dateTimeBetween('today', 'now'),
        ]);
    }

    /**
     * Create an attendance record for a specific date.
     */
    public function forDate(Carbon $date): static
    {
        return $this->state(fn (array $attributes) => [
            'check_in_time' => $this->faker->dateTimeBetween($date->startOfDay(), $date->endOfDay()),
        ]);
    }

    /**
     * Create an attendance record for a specific service.
     */
    public function forService(Service $service): static
    {
        return $this->state(fn (array $attributes) => [
            'service_id' => $service->id,
            'organization_id' => $service->organization_id,
            'check_in_time' => $this->faker->dateTimeBetween(
                $service->service_date . ' ' . $service->start_time,
                $service->service_date . ' ' . ($service->end_time ?? $service->start_time)
            ),
        ]);
    }

    /**
     * Create an attendance record with notes.
     */
    public function withNotes(): static
    {
        return $this->state(fn (array $attributes) => [
            'notes' => $this->faker->sentence(),
        ]);
    }

    /**
     * Create an attendance record for a specific member.
     */
    public function forMember(User $member): static
    {
        return $this->state(fn (array $attributes) => [
            'member_id' => $member->id,
            'visitor_name' => null,
            'visitor_phone' => null,
            'check_in_method' => $this->faker->randomElement(['qr_code', 'manual_search']),
        ]);
    }
}
