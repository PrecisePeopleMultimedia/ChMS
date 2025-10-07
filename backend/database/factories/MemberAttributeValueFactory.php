<?php

namespace Database\Factories;

use App\Models\MemberAttributeValue;
use App\Models\Member;
use App\Models\MemberAttribute;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MemberAttributeValue>
 */
class MemberAttributeValueFactory extends Factory
{
    protected $model = MemberAttributeValue::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'member_id' => Member::factory(),
            'attribute_id' => MemberAttribute::factory(),
            'value' => $this->faker->word(),
        ];
    }

    /**
     * Create a text value.
     */
    public function textValue(): static
    {
        return $this->state(fn (array $attributes) => [
            'value' => $this->faker->sentence(3),
        ]);
    }

    /**
     * Create a number value.
     */
    public function numberValue(): static
    {
        return $this->state(fn (array $attributes) => [
            'value' => (string) $this->faker->numberBetween(1, 100),
        ]);
    }

    /**
     * Create a date value.
     */
    public function dateValue(): static
    {
        return $this->state(fn (array $attributes) => [
            'value' => $this->faker->date('Y-m-d'),
        ]);
    }

    /**
     * Create a boolean value.
     */
    public function booleanValue(): static
    {
        return $this->state(fn (array $attributes) => [
            'value' => $this->faker->boolean() ? '1' : '0',
        ]);
    }

    /**
     * Create an email value.
     */
    public function emailValue(): static
    {
        return $this->state(fn (array $attributes) => [
            'value' => $this->faker->safeEmail(),
        ]);
    }

    /**
     * Create a phone value.
     */
    public function phoneValue(): static
    {
        return $this->state(fn (array $attributes) => [
            'value' => $this->faker->phoneNumber(),
        ]);
    }
}
