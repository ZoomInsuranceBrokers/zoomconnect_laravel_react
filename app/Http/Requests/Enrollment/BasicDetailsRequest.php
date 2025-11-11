<?php

namespace App\Http\Requests\Enrollment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class BasicDetailsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'cmp_id' => 'required|exists:company_master,comp_id',
            'enrolment_name' => 'required|string|max:255|regex:/^[a-zA-Z0-9\s\-_]+$/',
            'corporate_enrolment_name' => 'required|string|max:255|regex:/^[a-zA-Z0-9\s\-_]+$/',
            'policy_start_date' => 'required|date',
            'policy_end_date' => 'required|date|after:policy_start_date',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'cmp_id.required' => 'Please select a company.',
            'cmp_id.exists' => 'The selected company is invalid.',
            'enrolment_name.required' => 'Enrollment name is required.',
            'enrolment_name.regex' => 'Enrollment name can only contain letters, numbers, spaces, hyphens, and underscores.',
            'corporate_enrolment_name.required' => 'Corporate enrollment name is required.',
            'corporate_enrolment_name.regex' => 'Corporate enrollment name can only contain letters, numbers, spaces, hyphens, and underscores.',
            'policy_start_date.required' => 'Policy start date is required.',
            'policy_end_date.required' => 'Policy end date is required.',
            'policy_end_date.after' => 'Policy end date must be after the policy start date.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Trim whitespace from string fields
        $this->merge([
            'enrolment_name' => trim($this->enrolment_name ?? ''),
            'corporate_enrolment_name' => trim($this->corporate_enrolment_name ?? ''),
        ]);
    }
}
