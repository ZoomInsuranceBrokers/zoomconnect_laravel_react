<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\CompanyMaster;

class WelcomeMailer extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'welcome_mailers';

    protected $fillable = [
        'cmp_id',
        'policy_id',
        'endorsement_id',
        'template_id',
        'total_count',
        'sent_count',
        'not_sent_count',
        'subject',
        'status',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'total_count' => 'integer',
        'sent_count' => 'integer',
        'not_sent_count' => 'integer',
        'status' => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(CompanyMaster::class, 'cmp_id', 'comp_id');
    }
}
