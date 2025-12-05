<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFamilyDefinitionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            'relations' => 'required|array|min:1',
        ];

        // Dynamic validation based on selected relations
        if (in_array('self', $this->input('relations', []))) {
            $rules['self_no'] = 'required|integer|min:1';
            $rules['self_min_age'] = 'required|integer|min:0';
            $rules['self_max_age'] = 'required|integer|min:1';
            $rules['self_gender'] = 'required|in:male,female,both';
        }

        if (in_array('spouse', $this->input('relations', []))) {
            $rules['spouse_no'] = 'required|integer|min:1';
            $rules['spouse_min_age'] = 'required|integer|min:0';
            $rules['spouse_max_age'] = 'required|integer|min:1';
            $rules['spouse_gender'] = 'required|in:male,female,both';
        }

        if (in_array('kids', $this->input('relations', []))) {
            $rules['kids_no'] = 'required|integer|min:1';
            $rules['kids_min_age'] = 'required|integer|min:0';
            $rules['kids_max_age'] = 'required|integer|min:1';
            $rules['kids_gender'] = 'required|in:male,female,both';
        }

        if (in_array('parent', $this->input('relations', []))) {
            $rules['parent_no'] = 'required|integer|min:1';
            $rules['parent_min_age'] = 'required|integer|min:0';
            $rules['parent_max_age'] = 'required|integer|min:1';
            $rules['parent_gender'] = 'required|in:male,female,both';
        }

        if (in_array('parent_in_law', $this->input('relations', []))) {
            $rules['parent_in_law_no'] = 'required|integer|min:1';
            $rules['parent_in_law_min_age'] = 'required|integer|min:0';
            $rules['parent_in_law_max_age'] = 'required|integer|min:1';
            $rules['parent_in_law_gender'] = 'required|in:male,female,both';
        }

        if (in_array('sibling', $this->input('relations', []))) {
            $rules['sibling_no'] = 'required|integer|min:1';
            $rules['sibling_min_age'] = 'required|integer|min:0';
            $rules['sibling_max_age'] = 'required|integer|min:1';
            $rules['sibling_gender'] = 'required|in:male,female,both';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'relations.required' => 'Please select at least one relation',
            'relations.min' => 'Please select at least one relation',
        ];
    }
}
