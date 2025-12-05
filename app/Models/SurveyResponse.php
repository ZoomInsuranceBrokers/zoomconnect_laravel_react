<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'assigned_survey_id',
        'survey_id',
        'question_id',
        'emp_id',
        'rating',
        'response_text',
        'response_choice',
        'response_checkboxes',
        'focus_area',
    ];

    protected $casts = [
        'response_choice' => 'array',
        'response_checkboxes' => 'array',
    ];

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    public function question()
    {
        return $this->belongsTo(SurveyQuestion::class);
    }

    public function assignedSurvey()
    {
        return $this->belongsTo(CompanyAssignSurvey::class, 'assigned_survey_id');
    }
}
