<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\Organization;
use App\Models\Family;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Member>
 */
class MemberFactory extends Factory
{
    protected $model = Member::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $memberTypes = ['member', 'visitor', 'regular_attendee'];
        $genders = ['male', 'female', 'other'];
        $maritalStatuses = ['single', 'married', 'divorced', 'widowed'];

        return [
            'organization_id' => Organization::factory(),
            'family_id' => null, // Will be set by family factory if needed
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'middle_name' => $this->faker->optional(0.3)->firstName(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->optional(0.8)->phoneNumber(),
            'date_of_birth' => $this->faker->optional(0.7)->date('Y-m-d', '-18 years'),
            'gender' => $this->faker->randomElement($genders),
            'marital_status' => $this->faker->randomElement($maritalStatuses),
            'member_type' => $this->faker->randomElement($memberTypes),
            'joined_date' => $this->faker->dateTimeBetween('-5 years', 'now'),
            'address' => $this->faker->optional(0.6)->address(),
            'city' => $this->faker->optional(0.6)->city(),
            'state' => $this->faker->optional(0.6)->state(),
            'postal_code' => $this->faker->optional(0.6)->postcode(),
            'country' => $this->faker->optional(0.6)->country(),
            'emergency_contact_name' => $this->faker->optional(0.5)->name(),
            'emergency_contact_phone' => $this->faker->optional(0.5)->phoneNumber(),
            'emergency_contact_relationship' => $this->faker->optional(0.5)->randomElement([
                'spouse', 'parent', 'sibling', 'child', 'friend', 'other'
            ]),
            'notes' => $this->faker->optional(0.3)->paragraph(),
            'is_active' => $this->faker->boolean(95), // 95% chance of being active
        ];
    }

    /**
     * Indicate that the member is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the member is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Create a member with member type.
     */
    public function member(): static
    {
        return $this->state(fn (array $attributes) => [
            'member_type' => 'member',
            'joined_date' => $this->faker->dateTimeBetween('-2 years', 'now'),
        ]);
    }

    /**
     * Create a visitor.
     */
    public function visitor(): static
    {
        return $this->state(fn (array $attributes) => [
            'member_type' => 'visitor',
            'joined_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ]);
    }

    /**
     * Create a regular attendee.
     */
    public function regularAttendee(): static
    {
        return $this->state(fn (array $attributes) => [
            'member_type' => 'regular_attendee',
            'joined_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ]);
    }

    /**
     * Create a male member.
     */
    public function male(): static
    {
        return $this->state(fn (array $attributes) => [
            'gender' => 'male',
            'first_name' => $this->faker->firstNameMale(),
        ]);
    }

    /**
     * Create a female member.
     */
    public function female(): static
    {
        return $this->state(fn (array $attributes) => [
            'gender' => 'female',
            'first_name' => $this->faker->firstNameFemale(),
        ]);
    }

    /**
     * Create a married member.
     */
    public function married(): static
    {
        return $this->state(fn (array $attributes) => [
            'marital_status' => 'married',
        ]);
    }

    /**
     * Create a single member.
     */
    public function single(): static
    {
        return $this->state(fn (array $attributes) => [
            'marital_status' => 'single',
        ]);
    }

    /**
     * Create a member with complete contact information.
     */
    public function withCompleteContact(): static
    {
        return $this->state(fn (array $attributes) => [
            'email' => $this->faker->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'state' => $this->faker->state(),
            'postal_code' => $this->faker->postcode(),
            'country' => 'Nigeria',
        ]);
    }

    /**
     * Create a member with emergency contact.
     */
    public function withEmergencyContact(): static
    {
        return $this->state(fn (array $attributes) => [
            'emergency_contact_name' => $this->faker->name(),
            'emergency_contact_phone' => $this->faker->phoneNumber(),
            'emergency_contact_relationship' => $this->faker->randomElement([
                'spouse', 'parent', 'sibling', 'child', 'friend'
            ]),
        ]);
    }

    /**
     * Create a new convert (joined recently).
     */
    public function newConvert(): static
    {
        return $this->state(fn (array $attributes) => [
            'member_type' => 'member',
            'joined_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'notes' => 'New convert - recently accepted Christ',
        ]);
    }

    /**
     * Create a long-time member.
     */
    public function longTimeMember(): static
    {
        return $this->state(fn (array $attributes) => [
            'member_type' => 'member',
            'joined_date' => $this->faker->dateTimeBetween('-10 years', '-2 years'),
            'notes' => 'Long-time faithful member',
        ]);
    }

    /**
     * Create a youth member.
     */
    public function youth(): static
    {
        return $this->state(fn (array $attributes) => [
            'date_of_birth' => $this->faker->dateTimeBetween('-25 years', '-13 years'),
            'marital_status' => 'single',
            'notes' => 'Youth ministry member',
        ]);
    }

    /**
     * Create an elder member.
     */
    public function elder(): static
    {
        return $this->state(fn (array $attributes) => [
            'date_of_birth' => $this->faker->dateTimeBetween('-80 years', '-60 years'),
            'joined_date' => $this->faker->dateTimeBetween('-20 years', '-5 years'),
            'notes' => 'Church elder and senior member',
        ]);
    }

    /**
     * Create a member with family.
     */
    public function withFamily(): static
    {
        return $this->state(fn (array $attributes) => [
            'family_id' => Family::factory(),
            'marital_status' => 'married',
        ]);
    }
}
