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
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
