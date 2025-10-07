<?php

namespace Database\Factories;

use App\Models\MemberNote;
use App\Models\Member;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MemberNote>
 */
class MemberNoteFactory extends Factory
{
    protected $model = MemberNote::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $noteTypes = [
            'Personal Note', 'Follow-up', 'Prayer Request', 'Ministry', 
            'Administrative', 'Pastoral Care', 'Emergency'
        ];

        $privacyLevels = ['public', 'private', 'extreme'];

        return [
            'member_id' => Member::factory(),
            'author_id' => User::factory(),
            'title' => $this->faker->sentence(4),
            'content' => $this->faker->paragraphs(2, true),
            'note_type' => $this->faker->randomElement($noteTypes),
            'privacy_level' => $this->faker->randomElement($privacyLevels),
            'is_alert' => $this->faker->boolean(20), // 20% chance of being an alert
            'is_pinned' => $this->faker->boolean(10), // 10% chance of being pinned
            'alert_expires_at' => null,
        ];
    }

    /**
     * Indicate that the note is an alert.
     */
    public function alert(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_alert' => true,
            'alert_expires_at' => $this->faker->optional(0.7)->dateTimeBetween('now', '+30 days'),
        ]);
    }

    /**
     * Indicate that the note is an active alert (not expired).
     */
    public function activeAlert(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_alert' => true,
            'alert_expires_at' => $this->faker->dateTimeBetween('now', '+30 days'),
        ]);
    }

    /**
     * Indicate that the note is an expired alert.
     */
    public function expiredAlert(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_alert' => true,
            'alert_expires_at' => $this->faker->dateTimeBetween('-30 days', '-1 day'),
        ]);
    }

    /**
     * Indicate that the note is pinned.
     */
    public function pinned(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_pinned' => true,
        ]);
    }

    /**
     * Indicate that the note is not pinned.
     */
    public function unpinned(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_pinned' => false,
        ]);
    }

    /**
     * Set the privacy level to public.
     */
    public function public(): static
    {
        return $this->state(fn (array $attributes) => [
            'privacy_level' => 'public',
        ]);
    }

    /**
     * Set the privacy level to private.
     */
    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'privacy_level' => 'private',
        ]);
    }

    /**
     * Set the privacy level to extreme.
     */
    public function extreme(): static
    {
        return $this->state(fn (array $attributes) => [
            'privacy_level' => 'extreme',
        ]);
    }

    /**
     * Create a personal note.
     */
    public function personalNote(): static
    {
        return $this->state(fn (array $attributes) => [
            'note_type' => 'Personal Note',
            'title' => 'Personal Note',
            'content' => $this->faker->paragraph(),
        ]);
    }

    /**
     * Create a follow-up note.
     */
    public function followUp(): static
    {
        return $this->state(fn (array $attributes) => [
            'note_type' => 'Follow-up',
            'title' => 'Follow-up Required',
            'content' => 'Member needs follow-up contact regarding ' . $this->faker->randomElement([
                'recent visit', 'prayer request', 'ministry involvement', 'family situation'
            ]),
            'is_alert' => true,
            'alert_expires_at' => now()->addDays(7),
        ]);
    }

    /**
     * Create a prayer request note.
     */
    public function prayerRequest(): static
    {
        return $this->state(fn (array $attributes) => [
            'note_type' => 'Prayer Request',
            'title' => 'Prayer Request',
            'content' => 'Please pray for ' . $this->faker->randomElement([
                'healing and recovery', 'family situation', 'job search', 'financial needs', 'spiritual growth'
            ]),
        ]);
    }

    /**
     * Create a ministry note.
     */
    public function ministry(): static
    {
        return $this->state(fn (array $attributes) => [
            'note_type' => 'Ministry',
            'title' => 'Ministry Involvement',
            'content' => 'Member is involved in ' . $this->faker->randomElement([
                'youth ministry', 'music ministry', 'outreach programs', 'teaching ministry', 'administrative support'
            ]),
        ]);
    }

    /**
     * Create an administrative note.
     */
    public function administrative(): static
    {
        return $this->state(fn (array $attributes) => [
            'note_type' => 'Administrative',
            'title' => 'Administrative Note',
            'content' => $this->faker->randomElement([
                'Updated contact information', 'Membership status changed', 'Volunteer application submitted', 'Background check completed'
            ]),
        ]);
    }

    /**
     * Create a pastoral care note.
     */
    public function pastoralCare(): static
    {
        return $this->state(fn (array $attributes) => [
            'note_type' => 'Pastoral Care',
            'title' => 'Pastoral Care',
            'content' => 'Pastoral visit regarding ' . $this->faker->randomElement([
                'grief counseling', 'marriage counseling', 'spiritual guidance', 'crisis support'
            ]),
            'privacy_level' => 'private',
        ]);
    }

    /**
     * Create an emergency note.
     */
    public function emergency(): static
    {
        return $this->state(fn (array $attributes) => [
            'note_type' => 'Emergency',
            'title' => 'Emergency Alert',
            'content' => 'Emergency situation: ' . $this->faker->randomElement([
                'hospitalization', 'family crisis', 'urgent prayer needed', 'immediate assistance required'
            ]),
            'is_alert' => true,
            'is_pinned' => true,
            'privacy_level' => 'private',
            'alert_expires_at' => now()->addDays(3),
        ]);
    }
}
