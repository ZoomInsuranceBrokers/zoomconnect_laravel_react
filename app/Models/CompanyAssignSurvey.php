<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyAssignSurvey extends Model
{
    use HasFactory;

    protected $table = 'company_assign_survey';

    protected $fillable = [
        'name',
        'survey_id',
        'comp_id',
        'survey_start_date',
        'survey_end_date',
        'is_active',
    ];

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    public function company()
    {
        return $this->belongsTo(CompanyMaster::class, 'comp_id', 'comp_id');
    }
}
