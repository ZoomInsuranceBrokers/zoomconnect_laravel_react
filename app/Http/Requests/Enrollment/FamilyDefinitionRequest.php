<?php

namespace App\Http\Requests\Enrollment;

use Illuminate\Foundation\Http\FormRequest;

class FamilyDefinitionRequest extends FormRequest
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
            'family_defination' => 'required|array',
            'family_defination.self' => 'required|in:0,1',
            'family_defination.self_no' => 'required_if:family_defination.self,1|integer|min:1|max:10',
            'family_defination.self_min_age' => 'required_if:family_defination.self,1|integer|min:0|max:100',
            'family_defination.self_max_age' => 'required_if:family_defination.self,1|integer|min:0|max:100|gte:family_defination.self_min_age',
            'family_defination.self_gender' => 'required_if:family_defination.self,1|in:male,female,both',
        ];

        // Add validation for other family members
        $members = ['spouse', 'kid', 'parent', 'parent_in_law', 'sibling', 'partners', 'others'];

        foreach ($members as $member) {
            $rules["family_defination.{$member}"] = 'required|in:0,1';
            $rules["family_defination.{$member}_no"] = "required_if:family_defination.{$member},1|integer|min:0|max:10";
            $rules["family_defination.{$member}_min_age"] = "required_if:family_defination.{$member},1|integer|min:0|max:100";
            $rules["family_defination.{$member}_max_age"] = "required_if:family_defination.{$member},1|integer|min:0|max:100|gte:family_defination.{$member}_min_age";
            $rules["family_defination.{$member}_gender"] = "required_if:family_defination.{$member},1|in:male,female,both";
        }

        // Additional specific rules
        $rules['family_defination.spouse_with_same_gender'] = 'nullable|in:null,yes,no';
        $rules['family_defination.add_both_parent_n_parent_in_law'] = 'required|in:either,both,none';

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
            'family_defination.required' => 'Family definition is required.',
            'family_defination.self.required' => 'Self member selection is required.',
            'family_defination.self_no.required_if' => 'Number of self members is required when self is enabled.',
            'family_defination.self_min_age.required_if' => 'Minimum age for self is required when self is enabled.',
            'family_defination.self_max_age.required_if' => 'Maximum age for self is required when self is enabled.',
            'family_defination.self_max_age.gte' => 'Maximum age must be greater than or equal to minimum age.',
            'family_defination.spouse_no.required_if' => 'Number of spouse members is required when spouse is enabled.',
            'family_defination.kid_no.required_if' => 'Number of kid members is required when kids are enabled.',
            'family_defination.parent_no.required_if' => 'Number of parent members is required when parents are enabled.',
            'family_defination.add_both_parent_n_parent_in_law.required' => 'Parent inclusion policy is required.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure family_defination is an array if it's JSON string
        if (is_string($this->family_defination)) {
            $this->merge([
                'family_defination' => json_decode($this->family_defination, true) ?? []
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
            $familyDef = $this->family_defination ?? [];

            // Check if at least one family member is enabled
            $enabledMembers = array_filter([
                $familyDef['self'] ?? '0',
                $familyDef['spouse'] ?? '0',
                $familyDef['kid'] ?? '0',
                $familyDef['parent'] ?? '0',
                $familyDef['parent_in_law'] ?? '0',
                $familyDef['sibling'] ?? '0',
                $familyDef['partners'] ?? '0',
                $familyDef['others'] ?? '0'
            ], function($value) {
                return $value === '1';
            });

            if (empty($enabledMembers)) {
                $validator->errors()->add('family_defination', 'At least one family member type must be enabled.');
            }

            // Validate age ranges make sense
            foreach (['self', 'spouse', 'kid', 'parent', 'parent_in_law', 'sibling', 'partners', 'others'] as $member) {
                if (($familyDef[$member] ?? '0') === '1') {
                    $minAge = (int)($familyDef["{$member}_min_age"] ?? 0);
                    $maxAge = (int)($familyDef["{$member}_max_age"] ?? 0);

                    if ($minAge > $maxAge) {
                        $validator->errors()->add("family_defination.{$member}_max_age", "Maximum age must be greater than or equal to minimum age for {$member}.");
                    }
                }
            }
        });
    }
}
