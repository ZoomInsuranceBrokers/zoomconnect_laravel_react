<?php

namespace App\Http\Controllers;

use App\Models\BlogMaster;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display a listing of all blogs
     */
    public function index()
    {
        $blogs = BlogMaster::where('is_active', true)
            ->orderBy('blog_date', 'desc')
            ->get()
            ->map(function ($blog) {
                return [
                    'id' => $blog->id,
                    'title' => $blog->blog_title,
                    'slug' => $blog->blog_slug,
                    'author' => $blog->blog_author,
                    'thumbnail' => $blog->blog_thumbnail,
                    'thumbnail_alt' => $blog->blog_thumbnail_alt,
                    'excerpt' => strip_tags(substr($blog->blog_content, 0, 200)) . '...',
                    'content' => $blog->blog_content,
                    'date' => $blog->blog_date,
                    'tags' => $blog->blog_tags,
                    'categories' => $blog->blog_categories,
                    'meta_title' => $blog->meta_title,
                    'meta_description' => $blog->meta_description,
                ];
            });

        return Inertia::render('Public/Blog', [
            'blogs' => $blogs
        ]);
    }

    /**
     * Display a single blog by slug
     */
    public function show($slug)
    {
        $blog = BlogMaster::where('blog_slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Get related blogs (same category, limit 3)
        $relatedBlogs = BlogMaster::where('is_active', true)
            ->where('id', '!=', $blog->id)
            ->where(function ($query) use ($blog) {
                if ($blog->blog_categories) {
                    $query->where('blog_categories', $blog->blog_categories);
                }
            })
            ->orderBy('blog_date', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($relatedBlog) {
                return [
                    'id' => $relatedBlog->id,
                    'title' => $relatedBlog->blog_title,
                    'slug' => $relatedBlog->blog_slug,
                    'thumbnail' => $relatedBlog->blog_thumbnail,
                    'excerpt' => strip_tags(substr($relatedBlog->blog_content, 0, 150)) . '...',
                    'date' => $relatedBlog->blog_date,
                ];
            });

        return Inertia::render('Public/SingleBlog', [
            'blog' => [
                'id' => $blog->id,
                'title' => $blog->blog_title,
                'slug' => $blog->blog_slug,
                'author' => $blog->blog_author,
                'thumbnail' => $blog->blog_thumbnail,
                'thumbnail_alt' => $blog->blog_thumbnail_alt,
                'banner' => $blog->blog_banner,
                'banner_alt' => $blog->blog_banner_alt,
                'content' => $blog->blog_content,
                'date' => $blog->blog_date,
                'tags' => $blog->blog_tags,
                'categories' => $blog->blog_categories,
                'meta_title' => $blog->meta_title,
                'meta_description' => $blog->meta_description,
                'meta_keywords' => $blog->meta_keywords,
                'og_title' => $blog->og_title,
                'og_description' => $blog->og_description,
                'twitter_title' => $blog->twitter_title,
                'twitter_description' => $blog->twitter_description,
            ],
            'relatedBlogs' => $relatedBlogs
        ]);
    }
}
