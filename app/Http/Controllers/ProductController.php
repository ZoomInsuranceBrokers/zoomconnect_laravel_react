<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function groupMedicalCover()
    {
        return Inertia::render('Products/GroupMedicalCover');
    }

    public function groupAccidentCover()
    {
        return Inertia::render('Products/GroupAccidentCover');
    }

    public function groupTermLife()
    {
        return Inertia::render('Products/GroupTermLife');
    }

    public function wellnessPrograms()
    {
        return Inertia::render('Products/WellnessPrograms');
    }

    public function telehealthServices()
    {
        return Inertia::render('Products/TelehealthServices');
    }

    public function contactUs()
    {
        return Inertia::render('Products/ContactUs');
    }
}