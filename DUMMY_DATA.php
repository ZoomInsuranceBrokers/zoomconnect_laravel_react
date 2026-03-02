<?php

/**
 * READY-TO-USE DUMMY DATA FOR ENROLLMENTS
 * 
 * Copy this PHP array and paste it into your EnrollmentController
 * File: app/Http/Controllers/CompanyUser/EnrollmentController.php
 */

// ============================================================================
// COPY THIS ENTIRE ARRAY INTO YOUR CONTROLLER
// ============================================================================

return [
    'total' => 12,
    'from' => 1,
    'to' => 10,
    'data' => [
        [
            'id' => 1,
            'enrolment_name' => 'gmc_2024',
            'corporate_enrolment_name' => 'General Medical Coverage 2024',
            'status' => 1,
            'policy_start_date' => '2024-01-01',
            'policy_end_date' => '2024-12-31',
            'company' => [
                'id' => 1,
                'comp_name' => 'Tech Solutions Ltd'
            ],
            'created_at' => '2024-01-01'
        ],
        [
            'id' => 2,
            'enrolment_name' => 'gpa_2024',
            'corporate_enrolment_name' => 'Group Personal Accident 2024',
            'status' => 1,
            'policy_start_date' => '2024-01-01',
            'policy_end_date' => '2024-12-31',
            'company' => [
                'id' => 1,
                'comp_name' => 'Tech Solutions Ltd'
            ],
            'created_at' => '2024-01-02'
        ],
        [
            'id' => 3,
            'enrolment_name' => 'gtl_2024',
            'corporate_enrolment_name' => 'Group Term Life 2024',
            'status' => 1,
            'policy_start_date' => '2024-01-15',
            'policy_end_date' => '2025-01-14',
            'company' => [
                'id' => 2,
                'comp_name' => 'Global Enterprises Inc'
            ],
            'created_at' => '2024-01-15'
        ],
        [
            'id' => 4,
            'enrolment_name' => 'health_plus_2023',
            'corporate_enrolment_name' => 'Health Plus Premium Coverage 2023',
            'status' => 0,
            'policy_start_date' => '2023-01-01',
            'policy_end_date' => '2023-12-31',
            'company' => [
                'id' => 1,
                'comp_name' => 'Tech Solutions Ltd'
            ],
            'created_at' => '2023-12-21'
        ],
        [
            'id' => 5,
            'enrolment_name' => 'wellness_2024',
            'corporate_enrolment_name' => 'Corporate Wellness Program 2024',
            'status' => 1,
            'policy_start_date' => '2024-02-01',
            'policy_end_date' => '2025-01-31',
            'company' => [
                'id' => 3,
                'comp_name' => 'Innovation Corp'
            ],
            'created_at' => '2024-02-01'
        ],
        [
            'id' => 6,
            'enrolment_name' => 'dental_care_2024',
            'corporate_enrolment_name' => 'Dental Care Coverage 2024',
            'status' => 1,
            'policy_start_date' => '2024-03-01',
            'policy_end_date' => '2025-02-28',
            'company' => [
                'id' => 2,
                'comp_name' => 'Global Enterprises Inc'
            ],
            'created_at' => '2024-03-01'
        ],
        [
            'id' => 7,
            'enrolment_name' => 'vision_care_2024',
            'corporate_enrolment_name' => 'Vision Care Enrollment 2024',
            'status' => 1,
            'policy_start_date' => '2024-04-01',
            'policy_end_date' => '2025-03-31',
            'company' => [
                'id' => 1,
                'comp_name' => 'Tech Solutions Ltd'
            ],
            'created_at' => '2024-04-01'
        ],
        [
            'id' => 8,
            'enrolment_name' => 'executive_health_2024',
            'corporate_enrolment_name' => 'Executive Health Plan 2024',
            'status' => 1,
            'policy_start_date' => '2024-05-01',
            'policy_end_date' => '2025-04-30',
            'company' => [
                'id' => 4,
                'comp_name' => 'Premier Business Group'
            ],
            'created_at' => '2024-05-01'
        ],
        [
            'id' => 9,
            'enrolment_name' => 'maternity_2024',
            'corporate_enrolment_name' => 'Maternity Benefit Program 2024',
            'status' => 1,
            'policy_start_date' => '2024-06-01',
            'policy_end_date' => '2025-05-31',
            'company' => [
                'id' => 3,
                'comp_name' => 'Innovation Corp'
            ],
            'created_at' => '2024-06-01'
        ],
        [
            'id' => 10,
            'enrolment_name' => 'critical_illness_2023',
            'corporate_enrolment_name' => 'Critical Illness Coverage 2023',
            'status' => 0,
            'policy_start_date' => '2023-06-01',
            'policy_end_date' => '2024-05-31',
            'company' => [
                'id' => 4,
                'comp_name' => 'Premier Business Group'
            ],
            'created_at' => '2023-06-01'
        ]
    ],
    'links' => [
        ['url' => null, 'label' => '&laquo; Previous', 'active' => false],
        ['url' => '/company-user/enrollments?page=1', 'label' => '1', 'active' => true],
        ['url' => '/company-user/enrollments?page=2', 'label' => '2', 'active' => false],
        ['url' => '/company-user/enrollments?page=2', 'label' => 'Next &raquo;', 'active' => false]
    ]
];

// ============================================================================
// HOW TO USE IN YOUR CONTROLLER
// ============================================================================

/*
namespace App\Http\Controllers\CompanyUser;

use Illuminate\Http\Request;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    public function index(Request $request)
    {
        // Get the dummy data (copy the array above and store in a method)
        $enrollments = $this->getDummyEnrollmentData();
        
        return Inertia::render('CompanyUser/Enrollments', [
            'user' => auth()->user(),
            'enrollments' => $enrollments,
            'filters' => $request->only(['status'])
        ]);
    }
    
    private function getDummyEnrollmentData()
    {
        // Paste the entire array from above here
        return [
            'total' => 12,
            'from' => 1,
            'to' => 10,
            'data' => [
                // ... all the enrollment records ...
            ],
            'links' => [
                // ... pagination links ...
            ]
        ];
    }
}
*/
