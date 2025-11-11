<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogMaster extends Model
{
    use HasFactory;

    protected $table = 'blog_master';

    protected $fillable = [
        'blog_title',
        'blog_slug',
        'blog_author',
        'blog_thumbnail',
        'blog_thumbnail_alt',
        'blog_banner',
        'blog_content',
        'blog_banner_alt',
        'blog_date',
        'focus_keyword',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_title',
        'og_description',
        'twitter_title',
        'twitter_description',
        'blog_tags',
        'blog_categories',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'blog_date' => 'datetime',
    ];
}
