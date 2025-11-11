<?php

namespace App\Http\Requests\Enrollment;

use Illuminate\Foundation\Http\FormRequest;

class AdditionalSettingsRequest extends FormRequest
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
            'twin_allowed' => 'required|boolean',
            'enrollment_statements' => 'nullable|array',
            'enrollment_statements.*.id' => 'required|integer',
            'enrollment_statements.*.statement' => 'required|string|max:500',
            'enrollment_statements.*.is_required' => 'required|boolean',
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
            'twin_allowed.required' => 'Twin allowance setting is required.',
            'twin_allowed.boolean' => 'Twin allowance must be true or false.',
            'enrollment_statements.*.statement.required' => 'Statement text is required.',
            'enrollment_statements.*.statement.max' => 'Statement cannot exceed 500 characters.',
            'enrollment_statements.*.is_required.required' => 'Statement requirement setting is required.',
            'enrollment_statements.*.is_required.boolean' => 'Statement requirement must be true or false.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure enrollment_statements is an array if it's JSON string
        if (is_string($this->enrollment_statements)) {
            $this->merge([
                'enrollment_statements' => json_decode($this->enrollment_statements, true) ?? []
            ]);
        }

        // Convert twin_allowed to boolean if it's a string
        if (is_string($this->twin_allowed)) {
            $this->merge([
                'twin_allowed' => filter_var($this->twin_allowed, FILTER_VALIDATE_BOOLEAN)
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
            $statements = $this->input('enrollment_statements', []);

            // If statements exist, filter out empty ones for validation
            if (!empty($statements)) {
                $validStatements = array_filter($statements, function($statement) {
                    return !empty(trim($statement['statement'] ?? ''));
                });

                // If no valid statements, that's fine - they're optional
                if (empty($validStatements) && !empty($statements)) {
                    // This means we have statements but they're all empty
                    // We can either allow this or require at least one valid statement
                    // For now, we'll allow empty statements
                }
            }
        });
    }
}
