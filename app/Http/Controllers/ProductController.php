<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function employee()
    {
        return Inertia::render('Public/Employee');
    }
    public function employer()
    {
        return Inertia::render('Public/Employer');
    }
    public function mobile()
    {
        return Inertia::render('Public/Mobile');
    }
    public function smallTeams()
    {
        return Inertia::render('Public/Solutions/SmallTeams');
    }
    public function largeTeams()
    {
        return Inertia::render('Public/Solutions/LargeTeams');
    }
    public function mediumTeams()
    {
        return Inertia::render('Public/Solutions/mediumTeams');
    }
    public function resources()
    {
        return Inertia::render('Public/Resources');
    }
    public function blog()
    {
        return Inertia::render('Public/Blog');
    }
    public function cases()
    {
        return Inertia::render('Public/Cases');
    }
    public function faq()
    {
        return Inertia::render('Public/Faq');
    }
    public function about()
    {
        return Inertia::render('Public/About');
    }
    public function careers()
    {
        return Inertia::render('Public/Careers');
    }
    public function contact()
    {
        return Inertia::render('Public/Contact');
    }
    public function groupMedicalCover()
    {
        return Inertia::render('Public/Products/GroupMedicalCover');
    }

    public function groupAccidentCover()
    {
        return Inertia::render('Public/Products/GroupAccidentCover');
    }

    public function groupTermLife()
    {
        return Inertia::render('Public/Products/GroupTermLife');
    }

    public function wellnessPrograms()
    {
        return Inertia::render('Public/Products/WellnessPrograms');
    }

    public function telehealthServices()
    {
        return Inertia::render('Public/Products/TelehealthServices');
    }

    public function contactUs()
    {
        return Inertia::render('Public/Products/ContactUs');
    }
}
