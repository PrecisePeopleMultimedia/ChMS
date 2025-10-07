<?php

namespace Database\Factories;

use App\Models\MemberAttribute;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MemberAttribute>
 */
class MemberAttributeFactory extends Factory
{
    protected $model = MemberAttribute::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fieldTypes = ['text', 'textarea', 'number', 'date', 'boolean', 'select', 'email', 'phone'];
        $categories = ['Personal', 'Contact', 'Ministry', 'Family', 'Medical', 'Emergency', 'Custom'];
        
        $fieldType = $this->faker->randomElement($fieldTypes);
        $fieldOptions = null;
        
        // Add options for select fields
        if ($fieldType === 'select') {
            $fieldOptions = [
                'options' => $this->faker->randomElements([
                    'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'
                ], $this->faker->numberBetween(2, 4))
            ];
        }

        return [
            'organization_id' => Organization::factory(),
            'key' => $this->faker->unique()->slug(2),
            'name' => $this->faker->words(2, true),
            'field_type' => $fieldType,
            'category' => $this->faker->randomElement($categories),
            'field_options' => $fieldOptions,
            'is_required' => $this->faker->boolean(20), // 20% chance of being required
            'display_order' => $this->faker->numberBetween(1, 100),
            'is_active' => $this->faker->boolean(95), // 95% chance of being active
        ];
    }

    /**
     * Indicate that the attribute is required.
     */
    public function required(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_required' => true,
        ]);
    }

    /**
     * Indicate that the attribute is optional.
     */
    public function optional(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_required' => false,
        ]);
    }

    /**
     * Indicate that the attribute is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the attribute is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Create a text field attribute.
     */
    public function textField(): static
    {
        return $this->state(fn (array $attributes) => [
            'field_type' => 'text',
            'field_options' => null,
        ]);
    }

    /**
     * Create a textarea field attribute.
     */
    public function textareaField(): static
    {
        return $this->state(fn (array $attributes) => [
            'field_type' => 'textarea',
            'field_options' => null,
        ]);
    }

    /**
     * Create a number field attribute.
     */
    public function numberField(): static
    {
        return $this->state(fn (array $attributes) => [
            'field_type' => 'number',
            'field_options' => null,
        ]);
    }

    /**
     * Create a date field attribute.
     */
    public function dateField(): static
    {
        return $this->state(fn (array $attributes) => [
            'field_type' => 'date',
            'field_options' => null,
        ]);
    }

    /**
     * Create a boolean field attribute.
     */
    public function booleanField(): static
    {
        return $this->state(fn (array $attributes) => [
            'field_type' => 'boolean',
            'field_options' => null,
        ]);
    }

    /**
     * Create a select field attribute.
     */
    public function selectField(): static
    {
        return $this->state(fn (array $attributes) => [
            'field_type' => 'select',
            'field_options' => [
                'options' => ['Option 1', 'Option 2', 'Option 3']
            ],
        ]);
    }

    /**
     * Create an email field attribute.
     */
    public function emailField(): static
    {
        return $this->state(fn (array $attributes) => [
            'field_type' => 'email',
            'field_options' => null,
        ]);
    }

    /**
     * Create a phone field attribute.
     */
    public function phoneField(): static
    {
        return $this->state(fn (array $attributes) => [
            'field_type' => 'phone',
            'field_options' => null,
        ]);
    }

    /**
     * Create a personal category attribute.
     */
    public function personal(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Personal',
        ]);
    }

    /**
     * Create a contact category attribute.
     */
    public function contact(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Contact',
        ]);
    }

    /**
     * Create a ministry category attribute.
     */
    public function ministry(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Ministry',
        ]);
    }

    /**
     * Create a family category attribute.
     */
    public function family(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Family',
        ]);
    }

    /**
     * Create common church attributes.
     */
    public function baptismDate(): static
    {
        return $this->state(fn (array $attributes) => [
            'key' => 'baptism_date',
            'name' => 'Baptism Date',
            'field_type' => 'date',
            'category' => 'Personal',
        ]);
    }

    public function ministry(): static
    {
        return $this->state(fn (array $attributes) => [
            'key' => 'ministry',
            'name' => 'Ministry Involvement',
            'field_type' => 'select',
            'category' => 'Ministry',
            'field_options' => [
                'options' => ['Youth Ministry', 'Music Ministry', 'Outreach', 'Teaching', 'Administration']
            ],
        ]);
    }

    public function emergencyContact(): static
    {
        return $this->state(fn (array $attributes) => [
            'key' => 'emergency_contact',
            'name' => 'Emergency Contact',
            'field_type' => 'text',
            'category' => 'Emergency',
            'is_required' => true,
        ]);
    }
}
