<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AttendanceRequest extends FormRequest
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
        $rules = [
            'service_id' => 'required|exists:services,id',
            'check_in_method' => [
                'required',
                Rule::in(['qr_code', 'manual_search', 'visitor']),
            ],
            'check_in_time' => 'nullable|date',
            'notes' => 'nullable|string|max:1000',
        ];

        // Conditional validation based on check-in method
        if ($this->check_in_method === 'visitor') {
            $rules['visitor_name'] = 'required|string|max:255';
            $rules['visitor_phone'] = 'nullable|string|max:50';
            $rules['member_id'] = 'nullable|exists:users,id';
        } else {
            $rules['member_id'] = 'required|exists:users,id';
            $rules['visitor_name'] = 'nullable|string|max:255';
            $rules['visitor_phone'] = 'nullable|string|max:50';
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'service_id.required' => 'Please select a service.',
            'service_id.exists' => 'The selected service does not exist.',
            'check_in_method.required' => 'Please select a check-in method.',
            'check_in_method.in' => 'Invalid check-in method selected.',
            'member_id.required' => 'Please select a member.',
            'member_id.exists' => 'The selected member does not exist.',
            'visitor_name.required' => 'Visitor name is required.',
            'visitor_name.max' => 'Visitor name cannot exceed 255 characters.',
            'visitor_phone.max' => 'Visitor phone cannot exceed 50 characters.',
            'check_in_time.date' => 'Check-in time must be a valid date.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
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
            'service_id' => 'service',
            'member_id' => 'member',
            'visitor_name' => 'visitor name',
            'visitor_phone' => 'visitor phone',
            'check_in_method' => 'check-in method',
            'check_in_time' => 'check-in time',
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
            // Additional validation for member check-ins
            if ($this->check_in_method !== 'visitor' && $this->member_id) {
                // Check if member belongs to the same organization
                $member = \App\Models\User::find($this->member_id);
                if ($member && $member->organization_id !== auth()->user()->organization_id) {
                    $validator->errors()->add('member_id', 'The selected member does not belong to your organization.');
                }
            }

            // Additional validation for service
            if ($this->service_id) {
                $service = \App\Models\Service::find($this->service_id);
                if ($service && $service->organization_id !== auth()->user()->organization_id) {
                    $validator->errors()->add('service_id', 'The selected service does not belong to your organization.');
                }
            }
        });
    }
}
