<?php

namespace App\Http\Requests\Enrollment;

use Illuminate\Foundation\Http\FormRequest;

class RatingConfigurationRequest extends FormRequest
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
        $rules = [
            'rating_config' => 'required|array',
            'rating_config.plan_type' => 'required|in:simple,age_based,per_life,floater_highest_age,relation_wise,flexi',
            'rating_config.base_sum_insured_type' => 'required|in:fixed,grade_wise',
            'rating_config.company_contribution' => 'required|boolean',
        ];

        // Base sum insured validation
        if ($this->input('rating_config.base_sum_insured_type') === 'fixed') {
            $rules['rating_config.base_sum_insured'] = 'required|numeric|min:0|max:10000000';
        } else {
            $rules['rating_config.grade_wise_sum_insured'] = 'required|array|min:1';
            $rules['rating_config.grade_wise_sum_insured.*.grade_name'] = 'required|string|max:100';
            $rules['rating_config.grade_wise_sum_insured.*.sum_insured'] = 'required|numeric|min:1000|max:10000000';
        }

        // Company contribution validation
        if ($this->input('rating_config.company_contribution') === true) {
            $rules['rating_config.company_contribution_percentage'] = 'required|numeric|min:0|max:100';
        }

        // Plan type specific validation
        $planType = $this->input('rating_config.plan_type');

        switch ($planType) {
            case 'simple':
                $rules['rating_config.plans'] = 'required|array|min:1';
                $rules['rating_config.plans.*.plan_name'] = 'required|string|max:100';
                $rules['rating_config.plans.*.sum_insured'] = 'required|numeric|min:1000|max:10000000';
                $rules['rating_config.plans.*.premium_amount'] = 'required|numeric|min:1|max:1000000';
                break;

            case 'age_based':
            case 'per_life':
            case 'floater_highest_age':
                $rules['rating_config.plans'] = 'required|array|min:1';
                $rules['rating_config.plans.*.plan_name'] = 'required|string|max:100';
                $rules['rating_config.plans.*.sum_insured'] = 'required|numeric|min:1000|max:10000000';
                $rules['rating_config.plans.*.age_brackets'] = 'required|array|min:1';
                $rules['rating_config.plans.*.age_brackets.*.min_age'] = 'required|integer|min:0|max:100';
                $rules['rating_config.plans.*.age_brackets.*.max_age'] = 'required|integer|min:0|max:100';
                $rules['rating_config.plans.*.age_brackets.*.premium_amount'] = 'required|numeric|min:1|max:1000000';
                break;

            case 'relation_wise':
                $relations = ['self', 'spouse', 'kids', 'parent', 'parent_in_law', 'sibling', 'partners', 'others'];
                foreach ($relations as $relation) {
                    $rules["rating_config.relation_wise_config.{$relation}.sum_insured"] = 'nullable|numeric|min:1000|max:10000000';
                    $rules["rating_config.relation_wise_config.{$relation}.premium_amount"] = 'nullable|numeric|min:1|max:1000000';
                    $rules["rating_config.relation_wise_config.{$relation}.age_brackets"] = 'nullable|array';
                    $rules["rating_config.relation_wise_config.{$relation}.age_brackets.*.min_age"] = 'required|integer|min:0|max:100';
                    $rules["rating_config.relation_wise_config.{$relation}.age_brackets.*.max_age"] = 'required|integer|min:0|max:100';
                    $rules["rating_config.relation_wise_config.{$relation}.age_brackets.*.premium_amount"] = 'required|numeric|min:1|max:1000000';
                }
                break;
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'rating_config.required' => 'Rating configuration is required.',
            'rating_config.plan_type.required' => 'Plan type is required.',
            'rating_config.plan_type.in' => 'Invalid plan type selected.',
            'rating_config.base_sum_insured_type.required' => 'Base sum insured type is required.',
            'rating_config.base_sum_insured.required' => 'Base sum insured amount is required.',
            'rating_config.base_sum_insured.min' => 'Base sum insured cannot be negative.',
            'rating_config.base_sum_insured.max' => 'Base sum insured cannot exceed ₹1,00,00,000.',
            'rating_config.company_contribution_percentage.required' => 'Company contribution percentage is required when company contribution is enabled.',
            'rating_config.company_contribution_percentage.min' => 'Company contribution percentage cannot be negative.',
            'rating_config.company_contribution_percentage.max' => 'Company contribution percentage cannot exceed 100%.',
            'rating_config.plans.required' => 'At least one plan is required.',
            'rating_config.plans.min' => 'At least one plan is required.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure rating_config is an array if it's JSON string
        if (is_string($this->rating_config)) {
            $this->merge([
                'rating_config' => json_decode($this->rating_config, true) ?? []
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
            $ratingConfig = $this->rating_config ?? [];

            // Validate age brackets don't overlap
            if (isset($ratingConfig['plans'])) {
                foreach ($ratingConfig['plans'] as $planIndex => $plan) {
                    if (isset($plan['age_brackets']) && is_array($plan['age_brackets'])) {
                        $this->validateAgeBrackets($validator, $plan['age_brackets'], "rating_config.plans.{$planIndex}.age_brackets");
                    }
                }
            }

            // Validate relation wise age brackets
            if (isset($ratingConfig['relation_wise_config'])) {
                foreach ($ratingConfig['relation_wise_config'] as $relation => $config) {
                    if (isset($config['age_brackets']) && is_array($config['age_brackets'])) {
                        $this->validateAgeBrackets($validator, $config['age_brackets'], "rating_config.relation_wise_config.{$relation}.age_brackets");
                    }
                }
            }
        });
    }

    /**
     * Validate age brackets for overlaps and gaps
     */
    private function validateAgeBrackets($validator, $ageBrackets, $fieldPrefix)
    {
        if (empty($ageBrackets)) {
            return;
        }

        // Sort by min age
        usort($ageBrackets, function($a, $b) {
            return ($a['min_age'] ?? 0) - ($b['min_age'] ?? 0);
        });

        // Check for overlaps and gaps
        for ($i = 0; $i < count($ageBrackets) - 1; $i++) {
            $current = $ageBrackets[$i];
            $next = $ageBrackets[$i + 1];

            if (($current['max_age'] ?? 0) >= ($next['min_age'] ?? 0)) {
                $validator->errors()->add($fieldPrefix, 'Age brackets cannot overlap.');
                break;
            }
        }

        // Validate min_age <= max_age for each bracket
        foreach ($ageBrackets as $index => $bracket) {
            if (($bracket['min_age'] ?? 0) > ($bracket['max_age'] ?? 0)) {
                $validator->errors()->add("{$fieldPrefix}.{$index}.max_age", 'Maximum age must be greater than or equal to minimum age.');
            }
        }
    }
}
