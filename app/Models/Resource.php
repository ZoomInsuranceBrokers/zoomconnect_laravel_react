<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasFactory;

    protected $table = 'resources';

    protected $fillable = [
        'heading',
        'slug',
        'tags',
        'category',
        'content',
        'file_url',
        'cover_image',
        'author',
        'status',
        'published_at',
    ];
}
