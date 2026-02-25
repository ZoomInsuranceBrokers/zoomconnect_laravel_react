<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FaqMaster extends Model
{
    use HasFactory;

    protected $table = 'faq_master';

    protected $fillable = [
        'faq_title',
        'faq_description',
        'icon_url',
        'is_active',
        'is_mobile',
        'is_webportal',
        'is_website',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_mobile' => 'boolean',
        'is_webportal' => 'boolean',
        'is_website' => 'boolean',
    ];
}
