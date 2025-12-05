<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'logo', 'description'];

    public function questions()
    {
        return $this->hasMany(SurveyQuestion::class);
    }

    public function assignments()
    {
        return $this->hasMany(CompanyAssignSurvey::class);
    }

    public function companyAssignments()
    {
        return $this->hasMany(CompanyAssignSurvey::class);
    }

    public function responses()
    {
        return $this->hasMany(SurveyResponse::class);
    }
}
