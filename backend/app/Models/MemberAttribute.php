<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MemberAttribute extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'key',
        'name',
        'field_type',
        'category',
        'field_options',
        'is_required',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'field_options' => 'array',
        'is_required' => 'boolean',
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    /**
     * Available field types for custom attributes
     */
    public const FIELD_TYPES = [
        'text' => 'Text',
        'textarea' => 'Textarea',
        'number' => 'Number',
        'date' => 'Date',
        'boolean' => 'Boolean',
        'select' => 'Select',
        'email' => 'Email',
        'phone' => 'Phone',
    ];

    /**
     * Default categories for custom attributes
     */
    public const CATEGORIES = [
        'Personal' => 'Personal Information',
        'Contact' => 'Contact Details',
        'Ministry' => 'Ministry Information',
        'Family' => 'Family Details',
        'Medical' => 'Medical Information',
        'Emergency' => 'Emergency Contacts',
        'Custom' => 'Custom Fields',
    ];

    /**
     * Get the organization that owns the attribute
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get all attribute values for this attribute
     */
    public function attributeValues(): HasMany
    {
        return $this->hasMany(MemberAttributeValue::class, 'attribute_id');
    }

    /**
     * Scope to get active attributes only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get attributes by category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope to get attributes ordered by display order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order')->orderBy('name');
    }

    /**
     * Scope to get required attributes only
     */
    public function scopeRequired($query)
    {
        return $query->where('is_required', true);
    }

    /**
     * Get the validation rules for this attribute
     */
    public function getValidationRules(): array
    {
        $rules = [];

        if ($this->is_required) {
            $rules[] = 'required';
        } else {
            $rules[] = 'nullable';
        }

        switch ($this->field_type) {
            case 'text':
                $rules[] = 'string';
                $rules[] = 'max:255';
                break;
            case 'textarea':
                $rules[] = 'string';
                $rules[] = 'max:65535';
                break;
            case 'number':
                $rules[] = 'numeric';
                break;
            case 'date':
                $rules[] = 'date';
                break;
            case 'boolean':
                $rules[] = 'boolean';
                break;
            case 'select':
                if (isset($this->field_options['options']) && is_array($this->field_options['options'])) {
                    $rules[] = 'in:' . implode(',', $this->field_options['options']);
                }
                break;
            case 'email':
                $rules[] = 'email';
                $rules[] = 'max:255';
                break;
            case 'phone':
                $rules[] = 'string';
                $rules[] = 'max:20';
                break;
        }

        return $rules;
    }

    /**
     * Format the value based on field type
     */
    public function formatValue($value)
    {
        if ($value === null || $value === '') {
            return null;
        }

        switch ($this->field_type) {
            case 'boolean':
                return (bool) $value;
            case 'number':
                return is_numeric($value) ? (float) $value : null;
            case 'date':
                try {
                    return \Carbon\Carbon::parse($value)->format('Y-m-d');
                } catch (\Exception $e) {
                    return null;
                }
            default:
                return (string) $value;
        }
    }

    /**
     * Get the display value for this attribute
     */
    public function getDisplayValue($value): string
    {
        if ($value === null || $value === '') {
            return '';
        }

        switch ($this->field_type) {
            case 'boolean':
                return $value ? 'Yes' : 'No';
            case 'date':
                try {
                    return \Carbon\Carbon::parse($value)->format('M j, Y');
                } catch (\Exception $e) {
                    return $value;
                }
            case 'select':
                return (string) $value;
            default:
                return (string) $value;
        }
    }
}
