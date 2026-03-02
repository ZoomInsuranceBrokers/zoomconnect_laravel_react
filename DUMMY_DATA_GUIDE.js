/**
 * DUMMY DATA STRUCTURE FOR ENROLLMENTS PAGE
 * 
 * This file provides example data showing how enrollments will appear
 * on the Enrollments.jsx component page
 */

// ============================================================================
// QUICK START: How to use this dummy data for testing
// ============================================================================

// Option 1: In your Laravel routes (app/routes/web.php or routes/api.php)
// -----------------------------------------------------------------------
// use Inertia\Inertia;
//
// Route::get('/company-user/enrollments', function () {
//     $dummyData = [
//         'user' => auth()->user(),
//         'enrollments' => [
//             'total' => 12,
//             'from' => 1,
//             'to' => 10,
//             'data' => [
//                 // ... enrollment records
//             ],
//             'links' => [
//                 // ... pagination links
//             ]
//         ],
//         'filters' => ['status' => '']
//     ];
//     return Inertia::render('CompanyUser/Enrollments', $dummyData);
// });


// ============================================================================
// ENROLLMENT OBJECT STRUCTURE
// ============================================================================

/*
{
    id: number,                          // Unique identifier
    enrolment_name: string,              // Internal/system name (e.g., 'gmc_2024')
    corporate_enrolment_name: string,    // Display name for users (e.g., 'General Medical Coverage 2024')
    status: 0 | 1,                       // 0 = Inactive/Archived, 1 = Active
    policy_start_date: string,           // ISO date format (YYYY-MM-DD)
    policy_end_date: string,             // ISO date format (YYYY-MM-DD)
    company: {
        id: number,
        comp_name: string                // Company name
    },
    created_at: string                   // ISO datetime format
}
*/


// ============================================================================
// SAMPLE ENROLLMENT CARDS (10 examples with varying statuses)
// ============================================================================

const sampleEnrollments = [
    {
        id: 1,
        enrolment_name: 'gmc_2024',
        corporate_enrolment_name: 'General Medical Coverage 2024',
        status: 1,  // ✅ ACTIVE - Green badge
        policy_start_date: '2024-01-01',
        policy_end_date: '2024-12-31',
        company: { id: 1, comp_name: 'Tech Solutions Ltd' },
        created_at: '2024-01-01'
    },
    {
        id: 2,
        enrolment_name: 'gpa_2024',
        corporate_enrolment_name: 'Group Personal Accident 2024',
        status: 1,  // ✅ ACTIVE - Green badge
        policy_start_date: '2024-01-01',
        policy_end_date: '2024-12-31',
        company: { id: 1, comp_name: 'Tech Solutions Ltd' },
        created_at: '2024-01-02'
    },
    {
        id: 3,
        enrolment_name: 'gtl_2024',
        corporate_enrolment_name: 'Group Term Life 2024',
        status: 1,  // ✅ ACTIVE - Green badge
        policy_start_date: '2024-01-15',
        policy_end_date: '2025-01-14',
        company: { id: 2, comp_name: 'Global Enterprises Inc' },
        created_at: '2024-01-15'
    },
    {
        id: 4,
        enrolment_name: 'health_plus_2023',
        corporate_enrolment_name: 'Health Plus Premium Coverage 2023',
        status: 0,  // ❌ INACTIVE - Red badge (Archived)
        policy_start_date: '2023-01-01',
        policy_end_date: '2023-12-31',
        company: { id: 1, comp_name: 'Tech Solutions Ltd' },
        created_at: '2023-12-21'
    },
    {
        id: 5,
        enrolment_name: 'wellness_2024',
        corporate_enrolment_name: 'Corporate Wellness Program 2024',
        status: 1,  // ✅ ACTIVE - Green badge
        policy_start_date: '2024-02-01',
        policy_end_date: '2025-01-31',
        company: { id: 3, comp_name: 'Innovation Corp' },
        created_at: '2024-02-01'
    },
    {
        id: 6,
        enrolment_name: 'dental_care_2024',
        corporate_enrolment_name: 'Dental Care Coverage 2024',
        status: 1,  // ✅ ACTIVE - Green badge
        policy_start_date: '2024-03-01',
        policy_end_date: '2025-02-28',
        company: { id: 2, comp_name: 'Global Enterprises Inc' },
        created_at: '2024-03-01'
    },
    {
        id: 7,
        enrolment_name: 'vision_care_2024',
        corporate_enrolment_name: 'Vision Care Enrollment 2024',
        status: 1,  // ✅ ACTIVE - Green badge
        policy_start_date: '2024-04-01',
        policy_end_date: '2025-03-31',
        company: { id: 1, comp_name: 'Tech Solutions Ltd' },
        created_at: '2024-04-01'
    },
    {
        id: 8,
        enrolment_name: 'executive_health_2024',
        corporate_enrolment_name: 'Executive Health Plan 2024',
        status: 1,  // ✅ ACTIVE - Green badge
        policy_start_date: '2024-05-01',
        policy_end_date: '2025-04-30',
        company: { id: 4, comp_name: 'Premier Business Group' },
        created_at: '2024-05-01'
    },
    {
        id: 9,
        enrolment_name: 'maternity_2024',
        corporate_enrolment_name: 'Maternity Benefit Program 2024',
        status: 1,  // ✅ ACTIVE - Green badge
        policy_start_date: '2024-06-01',
        policy_end_date: '2025-05-31',
        company: { id: 3, comp_name: 'Innovation Corp' },
        created_at: '2024-06-01'
    },
    {
        id: 10,
        enrolment_name: 'critical_illness_2023',
        corporate_enrolment_name: 'Critical Illness Coverage 2023',
        status: 0,  // ❌ INACTIVE - Red badge (Archived)
        policy_start_date: '2023-06-01',
        policy_end_date: '2024-05-31',
        company: { id: 4, comp_name: 'Premier Business Group' },
        created_at: '2023-06-01'
    }
];


// ============================================================================
// STATS THAT WILL BE CALCULATED AND DISPLAYED
// ============================================================================

const stats = {
    totalEnrollments: 12,        // Total count from enrollments.total
    activeEnrollments: 8,        // Count where status === 1 (will show in green card)
    inactiveEnrollments: 2       // Count where status === 0 (will show in gray card)
};


// ============================================================================
// PAGE LAYOUT & FEATURES
// ============================================================================

/*
WHAT THE USER WILL SEE:

1️⃣ STATS CARDS (Top Row)
   ┌─────────────────────────────────────────────────────────────┐
   │ Total Enrollments: 12  │ Active: 8  │ Inactive/Archived: 2  │
   │      Purple Card       │ Green Card │    Gray Card          │
   └─────────────────────────────────────────────────────────────┘

2️⃣ SEARCH & FILTER BAR
   ┌─────────────────────────────────────────────────────────────┐
   │ 🔍 Search enrollments by name...        │ Filter Button      │
   └─────────────────────────────────────────────────────────────┘

3️⃣ ENROLLMENT CARDS (70% - Left Side)
   ┌──────────────────────────────────────────────────────────────┐
   │ 💼 General Medical Coverage 2024    ✅ ACTIVE    →           │
   │    gmc_2024                                                   │
   │ ────────────────────────────────────────────────────────────  │
   │ 📅 01 Jan 2024 - 31 Dec 2024  │  Tech Solutions Ltd          │
   └──────────────────────────────────────────────────────────────┘
   
   (Repeats for each enrollment...)

4️⃣ DETAILS PANEL (30% - Right Side)
   ┌──────────────────────────────────────────────────────────────┐
   │ Enrollment Details                                     [Close] │
   │ ────────────────────────────────────────────────────────────  │
   │ Enrollment Name: General Medical Coverage 2024               │
   │ Internal Name: gmc_2024                                      │
   │ Status: ✅ Active                                            │
   │ Policy Period: 01 Jan 2024 to 31 Dec 2024                   │
   │ Company: Tech Solutions Ltd                                  │
   │ [View Enrollment Periods  →]                                 │
   └──────────────────────────────────────────────────────────────┘


5️⃣ MOBILE RESPONSIVE FEATURES:
   • Stats cards: 2 columns on mobile, 3 on desktop
   • Cards stack vertically on small screens
   • Details panel moves below on mobile
   • Touch-friendly button sizes
   • Responsive text scaling
   • Icon sizes adapt to screen size


6️⃣ INTERACTIVE FEATURES:
   ✨ Click on any enrollment card to see details on the right
   ✨ Search by enrollment name or company name
   ✨ Filter by Active/Inactive status
   ✨ Click row to view full enrollment periods
*/


// ============================================================================
// TESTING SCENARIOS
// ============================================================================

// Scenario 1: Empty state (no enrollments)
const emptyState = { data: [], total: 0 };

// Scenario 2: Single enrollment
const singleEnrollment = {
    data: [sampleEnrollments[0]],
    total: 1
};

// Scenario 3: Mixed active/inactive
const mixedState = {
    data: sampleEnrollments,
    total: sampleEnrollments.length
};

// Scenario 4: All active
const allActive = {
    data: sampleEnrollments.filter(e => e.status === 1),
    total: 8
};

// Scenario 5: All inactive
const allInactive = {
    data: sampleEnrollments.filter(e => e.status === 0),
    total: 2
};

export { sampleEnrollments, stats, emptyState, singleEnrollment, mixedState, allActive, allInactive };
