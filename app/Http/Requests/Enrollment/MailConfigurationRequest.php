<?php

namespace App\Http\Requests\Enrollment;

use Illuminate\Foundation\Http\FormRequest;

class MailConfigurationRequest extends FormRequest
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
            'mail_configuration' => 'required|array',
            'mail_configuration.enrollment_mail' => 'required|array',
            'mail_configuration.enrollment_mail.template_id' => 'required|exists:message_templates,id',
            'mail_configuration.enrollment_mail.enabled' => 'required|boolean',
            'mail_configuration.reminder_mail' => 'required|array',
            'mail_configuration.reminder_mail.template_id' => 'required_if:mail_configuration.reminder_mail.enabled,true|nullable|exists:message_templates,id',
            'mail_configuration.reminder_mail.enabled' => 'required|boolean',
            'mail_configuration.reminder_mail.frequency' => 'required_if:mail_configuration.reminder_mail.enabled,true|nullable|in:daily,weekly,monthly',
            'mail_configuration.reminder_mail.frequency_value' => 'required_if:mail_configuration.reminder_mail.enabled,true|nullable|integer|min:1|max:30',
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
            'mail_configuration.required' => 'Mail configuration is required.',
            'mail_configuration.enrollment_mail.template_id.required' => 'Enrollment mail template is required.',
            'mail_configuration.enrollment_mail.template_id.exists' => 'Selected enrollment mail template is invalid.',
            'mail_configuration.enrollment_mail.enabled.required' => 'Enrollment mail status is required.',
            'mail_configuration.reminder_mail.template_id.required_if' => 'Reminder mail template is required when reminder mail is enabled.',
            'mail_configuration.reminder_mail.template_id.exists' => 'Selected reminder mail template is invalid.',
            'mail_configuration.reminder_mail.enabled.required' => 'Reminder mail status is required.',
            'mail_configuration.reminder_mail.frequency.required_if' => 'Reminder frequency is required when reminder mail is enabled.',
            'mail_configuration.reminder_mail.frequency.in' => 'Invalid reminder frequency selected.',
            'mail_configuration.reminder_mail.frequency_value.required_if' => 'Frequency value is required when reminder mail is enabled.',
            'mail_configuration.reminder_mail.frequency_value.min' => 'Frequency value must be at least 1.',
            'mail_configuration.reminder_mail.frequency_value.max' => 'Frequency value cannot exceed 30.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure mail_configuration is an array if it's JSON string
        if (is_string($this->mail_configuration)) {
            $this->merge([
                'mail_configuration' => json_decode($this->mail_configuration, true) ?? []
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
            $mailConfig = $this->mail_configuration ?? [];

            // Validate frequency value based on frequency type
            if (isset($mailConfig['reminder_mail']['enabled']) && $mailConfig['reminder_mail']['enabled']) {
                $frequency = $mailConfig['reminder_mail']['frequency'] ?? '';
                $frequencyValue = (int)($mailConfig['reminder_mail']['frequency_value'] ?? 0);

                switch ($frequency) {
                    case 'daily':
                        if ($frequencyValue > 7) {
                            $validator->errors()->add('mail_configuration.reminder_mail.frequency_value', 'For daily frequency, value cannot exceed 7 days.');
                        }
                        break;
                    case 'weekly':
                        if ($frequencyValue > 4) {
                            $validator->errors()->add('mail_configuration.reminder_mail.frequency_value', 'For weekly frequency, value cannot exceed 4 weeks.');
                        }
                        break;
                    case 'monthly':
                        if ($frequencyValue > 12) {
                            $validator->errors()->add('mail_configuration.reminder_mail.frequency_value', 'For monthly frequency, value cannot exceed 12 months.');
                        }
                        break;
                }
            }
        });
    }
}
