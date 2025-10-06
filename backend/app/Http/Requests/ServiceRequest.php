<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class ServiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'service_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'nullable|date_format:H:i:s|after:start_time',
            'service_type' => [
                'required',
                Rule::in(['sunday_service', 'midweek', 'special_event']),
            ],
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Service name is required.',
            'name.max' => 'Service name cannot exceed 255 characters.',
            'service_date.required' => 'Service date is required.',
            'service_date.date' => 'Service date must be a valid date.',
            'service_date.after_or_equal' => 'Service date cannot be in the past.',
            'start_time.required' => 'Start time is required.',
            'start_time.date_format' => 'Start time must be in HH:MM:SS format.',
            'end_time.date_format' => 'End time must be in HH:MM:SS format.',
            'end_time.after' => 'End time must be after start time.',
            'service_type.required' => 'Service type is required.',
            'service_type.in' => 'Invalid service type selected.',
            'is_active.boolean' => 'Active status must be true or false.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'service_date' => 'service date',
            'start_time' => 'start time',
            'end_time' => 'end time',
            'service_type' => 'service type',
            'is_active' => 'active status',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Check for duplicate services on the same date and time
            if ($this->service_date && $this->start_time) {
                $existingService = \App\Models\Service::where('organization_id', auth()->user()->organization_id)
                    ->where('service_date', $this->service_date)
                    ->where('start_time', $this->start_time)
                    ->where('id', '!=', $this->route('service')?->id) // Exclude current service when updating
                    ->first();

                if ($existingService) {
                    $validator->errors()->add('start_time', 'A service already exists at this date and time.');
                }
            }

            // Validate service date is not too far in the future (optional business rule)
            if ($this->service_date) {
                $serviceDate = Carbon::parse($this->service_date);
                $maxFutureDate = Carbon::now()->addYear();
                
                if ($serviceDate->gt($maxFutureDate)) {
                    $validator->errors()->add('service_date', 'Service date cannot be more than one year in the future.');
                }
            }

            // Validate end time is reasonable (not more than 8 hours after start time)
            if ($this->start_time && $this->end_time) {
                $startTime = Carbon::parse($this->start_time);
                $endTime = Carbon::parse($this->end_time);
                $maxDuration = 8; // hours
                
                if ($endTime->diffInHours($startTime) > $maxDuration) {
                    $validator->errors()->add('end_time', 'Service duration cannot exceed 8 hours.');
                }
            }
        });
    }
}
