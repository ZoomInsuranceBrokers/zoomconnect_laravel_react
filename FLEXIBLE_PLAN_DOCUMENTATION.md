# 📋 Flexible Plan (Flexi) Rating Type - Complete Documentation


## Overview

The **Flexible Plan (Flexi)** is a rating type in the ZoomConnect enrollment system that provides maximum customization for insurance premium calculations. It empowers employees to choose from multiple pre-configured plan options with different sum insured amounts and premium structures.

### What Makes Flexi Different?

Unlike other rating types that calculate premiums based on fixed formulas (age, relation, per-life), the **Flexi rating type** offers true flexibility by allowing HR administrators to define multiple distinct plan options. Each plan can have:
- Different sum insured amounts
- Different premium structures (flat rate OR age-based)
- Different coverage levels to suit various employee needs

---

## What is a Flexible Plan?

A **Flexible Plan (Flexi Plan)** allows HR administrators to create 2-10 distinct insurance plan options, each with its own sum insured amount and premium structure. Employees choose the single plan that best fits their coverage needs and budget during enrollment.

### Key Features

✅ **Multiple Plan Options**: Configure 2-10 different plan tiers  
✅ **Custom Sum Insured**: Each plan can have a different coverage amount  
✅ **Flexible Premium Structure**: Can use flat rates OR age-based brackets per plan  
✅ **Employee Choice**: Employees select their preferred plan during enrollment  
✅ **Grade-Wise SI Support**: Base sum insured can be fixed or grade-based  
✅ **Company Contribution**: Optional employer subsidy support  
✅ **Pro-rata Calculation**: Automatic mid-year joining adjustments  

---

## How Flexible Plans Work

### System Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. HR Admin Configuration                                  │
│     └─ Creates 3 flexi plans:                               │
│        • Plan A: ₹5L SI @ ₹3,000/year                       │
│        • Plan B: ₹10L SI @ ₹6,000/year                      │
│        • Plan C: ₹15L SI @ ₹9,500/year                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Employee Enrollment                                     │
│     └─ Employee views all 3 options                         │
│     └─ Compares coverage & cost                             │
│     └─ Selects Plan B (₹10L @ ₹6,000)                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. System Calculates Premium                               │
│     └─ Base Premium: ₹6,000                                 │
│     └─ Extra Coverage: +₹500 (optional)                     │
│     └─ GST (18%): +₹1,170                                   │
│     └─ Company Contribution: -₹2,000 (30%)                  │
│     └─ Employee Payable: ₹5,670                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. Enrollment Confirmation                                 │
│     └─ Policy issued with ₹10L coverage                     │
│     └─ Employee pays ₹5,670 (via payroll deduction)        │
└─────────────────────────────────────────────────────────────┘
```

### Employee Experience

1. **View Available Plans**: Employee sees a list of 3-5 plan options
2. **Compare Coverage**: Each plan displays:
   - Sum Insured amount
   - Premium amount (before & after company contribution)
   - GST breakdown
   - Employee's final payable amount
3. **Select Preferred Plan**: Employee chooses one plan
4. **Add Family Members**: Employee can add dependents (covered under selected SI)
5. **Review & Submit**: Final confirmation before enrollment

---

## Configuration Guide

### Step-by-Step Setup

#### Step 1: Create New Enrollment

Navigate to: `Super Admin Dashboard → Enrollments → Create New Enrollment`

#### Step 2: Basic Information
- **Enrollment Name**: "2024 Annual Enrollment"
- **Policy Period**: 01-Apr-2024 to 31-Mar-2025
- **Company Selection**: Choose company

#### Step 3: Family Definition
- Enable family members (Self, Spouse, Kids, Parents, etc.)
- Set age limits and gender restrictions

#### Step 4: Select Rating Type

Choose **"Flexi Plan"** from the rating type options:

```jsx
● Flexi Plan ← SELECT THIS
```

**Note:** This documentation focuses exclusively on the Flexi rating type. Other rating types (Simple, Age-Based, Per Life, Floater, Relation Wise) have different configuration methods.

#### Step 5: Base Sum Insured Configuration

Choose between two options:

**Option A: Fixed Base Sum Insured**
```
Base Sum Insured Type: ● Fixed
Base Sum Insured: ₹500,000
```

**Option B: Grade-Wise Base Sum Insured**
```
Base Sum Insured Type: ● Grade Wise

Grade 1 (Entry Level):     ₹300,000
Grade 2 (Mid Level):       ₹500,000
Grade 3 (Senior Level):    ₹800,000
Grade 4 (Executive):       ₹1,000,000
```

#### Step 6: Create Flexi Plans

Click **"Add Plan"** to create each plan option:

**Example: 3-Tier Configuration**

```javascript
// Plan 1: Basic Coverage
{
  plan_name: "Basic Plan",
  sum_insured: 500000,
  premium_amount: 3000,
  age_brackets: [] // Flat rate
}

// Plan 2: Standard Coverage
{
  plan_name: "Standard Plan",
  sum_insured: 1000000,
  premium_amount: 6500,
  age_brackets: [] // Flat rate
}

// Plan 3: Premium Coverage
{
  plan_name: "Premium Plan",
  sum_insured: 1500000,
  premium_amount: 10000,
  age_brackets: [] // Flat rate
}
```

*
#### Step 7: Company Contribution (Optional)

```
☑ Enable Company Contribution
Contribution Percentage: 30%
```

This means:
- Employee pays: 70% of premium
- Company pays: 30% of premium

#### Step 8: Extra Coverage Plans (Optional)

Add optional add-ons like:
- Maternity Coverage: +₹1,500
- Co-Pay Waiver: +₹800
- Room Rent Upgrade: +₹600

#### Step 9: Save Configuration

Click **"Create Enrollment"** to save all settings.

---


### Calculation Examples

#### Example 1: Simple Flexi Plan (Flat Rate)

**Configuration:**
- Plan: Standard Plan
- Sum Insured: ₹10,00,000
- Premium: ₹6,500/year
- Company Contribution: 30%
- GST: 18%

**Calculation:**
```
Base Premium:              ₹6,500
Proration (full year):     ×1.0 = ₹6,500
Company Contribution:      -30% = -₹1,950
Employee Premium:          = ₹4,550
GST (18%):                 +₹819
─────────────────────────────────
Employee Payable:          ₹5,369
```

#### Example 2: Age-Based Flexi Plan

**Configuration:**
- Plan: Age-Based Premium Plan
- Sum Insured: ₹15,00,000
- Age Brackets:
  - 18-30: ₹8,000
  - 31-45: ₹11,000
  - 46-60: ₹14,500
  - 61+: ₹18,000
- Employee Age: 42
- Company Contribution: 0%

**Calculation:**
```
Employee Age: 42 → Falls in 31-45 bracket
Base Premium:              ₹11,000
Proration (full year):     ×1.0 = ₹11,000
Company Contribution:      0% = ₹0
Employee Premium:          = ₹11,000
GST (18%):                 +₹1,980
─────────────────────────────────
Employee Payable:          ₹12,980
```

#### Example 3: Mid-Year Joining with Proration

**Configuration:**
- Plan: Basic Plan
- Sum Insured: ₹5,00,000
- Premium: ₹3,000/year
- Policy Period: 01-Apr-2024 to 31-Mar-2025 (365 days)
- Joining Date: 01-Oct-2024 (183 days remaining)
- Company Contribution: 50%

**Calculation:**
```
Base Premium:              ₹3,000
Proration Factor:          183/365 = 0.5014
Prorated Premium:          ₹3,000 × 0.5014 = ₹1,504
Company Contribution:      -50% = -₹752
Employee Premium:          = ₹752
GST (18%):                 +₹135
─────────────────────────────────
Employee Payable:          ₹887
```

---

## Frontend Components

### File Structure

```
resources/js/Pages/superadmin/policy/
├── CreateEnrollment.jsx          # Create new enrollment with flexi config
├── EditEnrollment.jsx             # Edit existing enrollment
└── FillEnrollment/
    ├── Step2ChoosePlans.jsx       # Employee selects flexi plan
    ├── Step3ExtraCoverage.jsx     # Optional add-ons
    └── PremiumSummary.jsx         # Premium breakdown display

resources/js/utils/
└── premiumCalculator.js           # Premium calculation engine
```


