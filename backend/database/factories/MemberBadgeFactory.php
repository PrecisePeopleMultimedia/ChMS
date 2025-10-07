<?php

namespace Database\Factories;

use App\Models\MemberBadge;
use App\Models\Member;
use App\Models\BadgeType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MemberBadge>
 */
class MemberBadgeFactory extends Factory
{
    protected $model = MemberBadge::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'member_id' => Member::factory(),
            'badge_type_id' => BadgeType::factory(),
            'assigned_by' => User::factory(),
            'assigned_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'expires_at' => $this->faker->optional(0.3)->dateTimeBetween('now', '+1 year'), // 30% chance of expiration
            'notes' => $this->faker->optional(0.6)->sentence(), // 60% chance of having notes
        ];
    }

    /**
     * Indicate that the badge assignment has no expiration.
     */
    public function permanent(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => null,
        ]);
    }

    /**
     * Indicate that the badge assignment expires soon.
     */
    public function expiringSoon(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => $this->faker->dateTimeBetween('now', '+7 days'),
        ]);
    }

    /**
     * Indicate that the badge assignment is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => $this->faker->dateTimeBetween('-30 days', '-1 day'),
        ]);
    }

    /**
     * Indicate that the badge assignment has notes.
     */
    public function withNotes(): static
    {
        return $this->state(fn (array $attributes) => [
            'notes' => $this->faker->randomElement([
                'Assigned during new member orientation',
                'Volunteer for youth ministry',
                'Active in church leadership',
                'Needs follow-up contact',
                'First-time visitor - show special attention',
                'Long-time member and supporter',
                'Recently baptized',
                'Ministry team leader',
                'Requires pastoral care',
                'Emergency contact needed'
            ]),
        ]);
    }

    /**
     * Indicate that the badge was auto-assigned.
     */
    public function autoAssigned(): static
    {
        return $this->state(fn (array $attributes) => [
            'assigned_by' => null,
            'notes' => 'Auto-assigned based on member type',
        ]);
    }

    /**
     * Create a member badge assignment.
     */
    public function memberBadge(): static
    {
        return $this->state(fn (array $attributes) => [
            'notes' => 'Regular church member',
        ]);
    }

    /**
     * Create a visitor badge assignment.
     */
    public function visitorBadge(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => now()->addDays(30), // Visitor badges expire in 30 days
            'notes' => 'First-time visitor',
        ]);
    }

    /**
     * Create a volunteer badge assignment.
     */
    public function volunteerBadge(): static
    {
        return $this->state(fn (array $attributes) => [
            'notes' => 'Active volunteer in church ministries',
        ]);
    }

    /**
     * Create a new convert badge assignment.
     */
    public function newConvertBadge(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => now()->addDays(90), // New convert badges expire in 90 days
            'notes' => 'Recently accepted Christ',
        ]);
    }
}
