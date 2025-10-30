<?php

namespace App\Http\Requests\Enrollment;

use Illuminate\Foundation\Http\FormRequest;

class ExtraCoverageRequest extends FormRequest
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
            'extra_coverage_plans' => 'nullable|array',
            'extra_coverage_plans.*.plan_name' => 'required|string|max:100',
            'extra_coverage_plans.*.premium_amount' => 'required|numeric|min:0|max:1000000',
            'extra_coverage_plans.*.extra_coverages' => 'required|array',
            'extra_coverage_plans.*.extra_coverages.co_pay.enabled' => 'required|boolean',
            'extra_coverage_plans.*.extra_coverages.co_pay.name' => 'required|string|max:50',
            'extra_coverage_plans.*.extra_coverages.co_pay.amount' => 'required_if:extra_coverage_plans.*.extra_coverages.co_pay.enabled,true|nullable|numeric|min:0|max:100000',
            'extra_coverage_plans.*.extra_coverages.maternity.enabled' => 'required|boolean',
            'extra_coverage_plans.*.extra_coverages.maternity.name' => 'required|string|max:50',
            'extra_coverage_plans.*.extra_coverages.maternity.amount' => 'required_if:extra_coverage_plans.*.extra_coverages.maternity.enabled,true|nullable|numeric|min:0|max:1000000',
            'extra_coverage_plans.*.extra_coverages.room_rent.enabled' => 'required|boolean',
            'extra_coverage_plans.*.extra_coverages.room_rent.name' => 'required|string|max:50',
            'extra_coverage_plans.*.extra_coverages.room_rent.amount' => 'required_if:extra_coverage_plans.*.extra_coverages.room_rent.enabled,true|nullable|numeric|min:0|max:100000',
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
            'extra_coverage_plans.*.plan_name.required' => 'Plan name is required.',
            'extra_coverage_plans.*.plan_name.max' => 'Plan name cannot exceed 100 characters.',
            'extra_coverage_plans.*.premium_amount.required' => 'Premium amount is required.',
            'extra_coverage_plans.*.premium_amount.min' => 'Premium amount cannot be negative.',
            'extra_coverage_plans.*.premium_amount.max' => 'Premium amount cannot exceed ₹10,00,000.',
            'extra_coverage_plans.*.extra_coverages.co_pay.amount.required_if' => 'Co-pay amount is required when co-pay is enabled.',
            'extra_coverage_plans.*.extra_coverages.maternity.amount.required_if' => 'Maternity amount is required when maternity coverage is enabled.',
            'extra_coverage_plans.*.extra_coverages.room_rent.amount.required_if' => 'Room rent amount is required when room rent coverage is enabled.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure extra_coverage_plans is an array if it's JSON string
        if (is_string($this->extra_coverage_plans)) {
            $this->merge([
                'extra_coverage_plans' => json_decode($this->extra_coverage_plans, true) ?? []
            ]);
        }
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $extraCoveragePlans = $this->extra_coverage_plans ?? [];

            // Check if at least one coverage is enabled in each plan
            foreach ($extraCoveragePlans as $index => $plan) {
                $coverages = $plan['extra_coverages'] ?? [];
                $hasEnabledCoverage = false;

                foreach (['co_pay', 'maternity', 'room_rent'] as $coverageType) {
                    if (isset($coverages[$coverageType]['enabled']) && $coverages[$coverageType]['enabled']) {
                        $hasEnabledCoverage = true;
                        break;
                    }
                }

                if (!$hasEnabledCoverage) {
                    $validator->errors()->add("extra_coverage_plans.{$index}", 'At least one coverage type must be enabled in each plan.');
                }
            }

            // Validate unique plan names
            $planNames = array_column($extraCoveragePlans, 'plan_name');
            if (count($planNames) !== count(array_unique($planNames))) {
                $validator->errors()->add('extra_coverage_plans', 'Plan names must be unique.');
            }
        });
    }
}
