<?php

namespace Database\Factories;

use App\Models\MemberQrCode;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MemberQrCode>
 */
class MemberQrCodeFactory extends Factory
{
    protected $model = MemberQrCode::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $member = User::factory();
        $generatedAt = $this->faker->dateTimeBetween('-1 year', 'now');
        
        return [
            'member_id' => $member,
            'qr_code_data' => $this->generateQrCodeData($member->id ?? 1),
            'generated_at' => $generatedAt,
            'expires_at' => $this->faker->optional(0.8)->dateTimeBetween($generatedAt, '+1 year'),
            'is_active' => $this->faker->boolean(85), // 85% chance of being active
        ];
    }

    /**
     * Generate unique QR code data.
     */
    private function generateQrCodeData(int $memberId): string
    {
        $timestamp = time();
        $randomBytes = bin2hex(random_bytes(8));
        
        return "member_{$memberId}_{$timestamp}_{$randomBytes}";
    }

    /**
     * Create an active QR code.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Create an inactive QR code.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Create a QR code that never expires.
     */
    public function neverExpires(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => null,
        ]);
    }

    /**
     * Create an expired QR code.
     */
    public function expired(): static
    {
        $expiredDate = $this->faker->dateTimeBetween('-1 year', '-1 day');
        
        return $this->state(fn (array $attributes) => [
            'expires_at' => $expiredDate,
            'is_active' => $this->faker->boolean(20), // 20% chance of being active (some expired codes might still be active)
        ]);
    }

    /**
     * Create a QR code that expires soon.
     */
    public function expiresSoon(): static
    {
        $expiresAt = $this->faker->dateTimeBetween('now', '+7 days');
        
        return $this->state(fn (array $attributes) => [
            'expires_at' => $expiresAt,
            'is_active' => true,
        ]);
    }

    /**
     * Create a QR code for a specific member.
     */
    public function forMember(User $member): static
    {
        return $this->state(fn (array $attributes) => [
            'member_id' => $member->id,
            'qr_code_data' => $this->generateQrCodeData($member->id),
        ]);
    }

    /**
     * Create a valid QR code (active and not expired).
     */
    public function valid(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
            'expires_at' => $this->faker->dateTimeBetween('+1 month', '+1 year'),
        ]);
    }

    /**
     * Create an invalid QR code (inactive or expired).
     */
    public function invalid(): static
    {
        $isExpired = $this->faker->boolean(50);
        
        return $this->state(fn (array $attributes) => [
            'is_active' => $isExpired ? $this->faker->boolean(30) : false,
            'expires_at' => $isExpired ? $this->faker->dateTimeBetween('-1 year', '-1 day') : $this->faker->dateTimeBetween('+1 month', '+1 year'),
        ]);
    }

    /**
     * Create a QR code with a specific expiration date.
     */
    public function expiresAt(Carbon $date): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => $date,
        ]);
    }

    /**
     * Create a QR code generated recently.
     */
    public function recentlyGenerated(): static
    {
        return $this->state(fn (array $attributes) => [
            'generated_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
        ]);
    }

    /**
     * Create a QR code generated long ago.
     */
    public function old(): static
    {
        return $this->state(fn (array $attributes) => [
            'generated_at' => $this->faker->dateTimeBetween('-1 year', '-6 months'),
        ]);
    }
}
