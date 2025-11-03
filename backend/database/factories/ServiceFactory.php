<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Service::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $serviceTypes = ['sunday_morning', 'sunday_evening', 'midweek', 'special_event'];
        $serviceNames = [
            'sunday_morning' => ['Sunday Morning Service', 'Morning Worship', 'First Service'],
            'sunday_evening' => ['Sunday Evening Service', 'Evening Worship', 'Second Service'],
            'midweek' => ['Wednesday Bible Study', 'Prayer Meeting', 'Midweek Service'],
            'special_event' => ['Revival Meeting', 'Conference', 'Special Service', 'Guest Speaker'],
        ];

        $serviceType = $this->faker->randomElement($serviceTypes);
        $name = $this->faker->randomElement($serviceNames[$serviceType]);

        // Generate realistic times based on service type
        $times = $this->getServiceTimes($serviceType);

        return [
            'organization_id' => Organization::factory(),
            'name' => $name,
            'service_type' => $serviceType,
            'scheduled_date' => $this->faker->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
            'start_time' => $times['start'],
            'end_time' => $times['end'],
            'location' => $this->faker->optional(0.7)->randomElement([
                'Main Sanctuary',
                'Fellowship Hall',
                'Youth Center',
                'Children\'s Building',
                'Conference Room',
            ]),
            'location_assignment' => $this->faker->optional(0.3)->randomElement([
                'Section A',
                'Section B',
                'Balcony',
                'Front Rows',
                'Family Section',
            ]),
            'capacity' => $this->faker->numberBetween(50, 500),
            'ministry_assignments' => $this->faker->optional(0.4)->randomElement([
                ['children' => 'Children\'s Ministry', 'youth' => 'Youth Ministry'],
                ['nursery' => 'Nursery', 'kids' => 'Kids Church'],
                ['teens' => 'Teen Ministry', 'adults' => 'Adult Ministry'],
            ]),
            'special_requirements' => $this->faker->optional(0.2)->randomElement([
                ['security' => 'Enhanced security required'],
                ['accessibility' => 'Wheelchair accessible'],
                ['translation' => 'Translation services available'],
            ]),
            'allow_family_checkin' => $this->faker->boolean(85), // 85% allow family checkin
            'require_location_assignment' => $this->faker->boolean(30), // 30% require location
            'enable_child_security' => $this->faker->boolean(90), // 90% enable child security
            'status' => $this->faker->randomElement(['scheduled', 'active', 'completed', 'cancelled']),
            'notes' => $this->faker->optional(0.3)->sentence(),
        ];
    }

    /**
     * Get realistic service times based on service type.
     */
    private function getServiceTimes(string $serviceType): array
    {
        switch ($serviceType) {
            case 'sunday_morning':
                $startHour = $this->faker->numberBetween(8, 11);
                $duration = $this->faker->numberBetween(90, 150); // 1.5 to 2.5 hours
                break;
            case 'sunday_evening':
                $startHour = $this->faker->numberBetween(17, 19);
                $duration = $this->faker->numberBetween(90, 120); // 1.5 to 2 hours
                break;
            case 'midweek':
                $startHour = $this->faker->numberBetween(18, 20);
                $duration = $this->faker->numberBetween(60, 90); // 1 to 1.5 hours
                break;
            case 'special_event':
                $startHour = $this->faker->numberBetween(9, 19);
                $duration = $this->faker->numberBetween(120, 240); // 2 to 4 hours
                break;
            default:
                $startHour = 10;
                $duration = 120;
        }

        $startTime = sprintf('%02d:%02d:00', $startHour, $this->faker->numberBetween(0, 59));
        $endTime = Carbon::createFromFormat('H:i:s', $startTime)
            ->addMinutes($duration)
            ->format('H:i:s');

        return [
            'start' => $startTime,
            'end' => $endTime,
        ];
    }

    /**
     * Indicate that the service is scheduled.
     */
    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'scheduled',
            'scheduled_date' => $this->faker->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
        ]);
    }

    /**
     * Indicate that the service is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'scheduled_date' => now()->format('Y-m-d'),
        ]);
    }

    /**
     * Indicate that the service is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'scheduled_date' => $this->faker->dateTimeBetween('-30 days', 'now')->format('Y-m-d'),
        ]);
    }

    /**
     * Create a Sunday morning service.
     */
    public function sundayMorning(): static
    {
        return $this->state(fn (array $attributes) => [
            'service_type' => 'sunday_morning',
            'name' => 'Sunday Morning Service',
            'start_time' => '09:00:00',
            'end_time' => '11:00:00',
        ]);
    }

    /**
     * Create a midweek service.
     */
    public function midweek(): static
    {
        return $this->state(fn (array $attributes) => [
            'service_type' => 'midweek',
            'name' => 'Wednesday Bible Study',
            'start_time' => '19:00:00',
            'end_time' => '20:30:00',
        ]);
    }

    /**
     * Set a specific organization for the service.
     */
    public function forOrganization(Organization $organization): static
    {
        return $this->state(fn (array $attributes) => [
            'organization_id' => $organization->id,
        ]);
    }

    /**
     * Set a specific date for the service.
     */
    public function onDate(string $date): static
    {
        return $this->state(fn (array $attributes) => [
            'scheduled_date' => $date,
        ]);
    }

    /**
     * Enable family checkin for the service.
     */
    public function withFamilyCheckin(): static
    {
        return $this->state(fn (array $attributes) => [
            'allow_family_checkin' => true,
        ]);
    }

    /**
     * Enable child security for the service.
     */
    public function withChildSecurity(): static
    {
        return $this->state(fn (array $attributes) => [
            'enable_child_security' => true,
        ]);
    }
}
