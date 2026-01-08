<?php

/**
 * Enrollment Helper Functions
 * 
 * This file contains helper functions for enrollment submission process
 */

use App\Jobs\SendEnrollmentConfirmationJob;
use App\Mail\EnrollmentConfirmation;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

if (!function_exists('send_enrollment_confirmation')) {
    /**
     * Send enrollment confirmation email (Synchronous)
     * 
     * @param object $employee Employee model instance
     * @param array $enrollmentData Enrollment data array
     * @return void
     */
    function send_enrollment_confirmation($employee, $enrollmentData)
    {
        try {
            Mail::to($employee->email)->send(new EnrollmentConfirmation($enrollmentData));
            
            Log::info('📧 Enrollment confirmation email sent', [
                'employee_id' => $employee->id,
                'email' => $employee->email
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send enrollment confirmation: ' . $e->getMessage());
        }
    }
}

if (!function_exists('queue_enrollment_confirmation')) {
    /**
     * Queue enrollment confirmation email (Asynchronous)
     * Recommended for production use
     * 
     * @param object $employee Employee model instance
     * @param array $enrollmentData Enrollment data array
     * @return void
     */
    function queue_enrollment_confirmation($employee, $enrollmentData)
    {
        try {
            SendEnrollmentConfirmationJob::dispatch($employee, $enrollmentData);
            
            Log::info('📨 Enrollment confirmation email queued', [
                'employee_id' => $employee->id,
                'email' => $employee->email
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to queue enrollment confirmation: ' . $e->getMessage());
        }
    }
}

if (!function_exists('calculate_topup_premium')) {
    /**
     * Calculate topup premium based on sum insured
     * 
     * @param float $topupSumInsured Topup sum insured amount
     * @return float Topup premium amount
     */
    function calculate_topup_premium($topupSumInsured)
    {
        $premiumRates = [
            500000 => 3877,
            1000000 => 7355,
        ];

        return $premiumRates[$topupSumInsured] ?? 0;
    }
}

if (!function_exists('get_created_by_identifier')) {
    /**
     * Get the 'created_by' identifier based on current user
     * 
     * @return string Created by identifier (e.g., 'SA-1', 'E-123', 'H-456')
     */
    function get_created_by_identifier()
    {
        // SuperAdmin
        if (auth()->check() && auth()->user()->hasRole('superadmin')) {
            return 'SA-' . auth()->id();
        }
        
        // HR/Company User
        if (session()->has('comp_user_id')) {
            return 'H-' . session('comp_user_id');
        }
        
        // Employee
        if (session()->has('emp_id')) {
            return 'E-' . session('emp_id');
        }
        
        return 'SYSTEM';
    }
}

if (!function_exists('format_enrollment_data_for_save')) {
    /**
     * Format enrollment data for database insertion
     * 
     * @param object $employee Employee model instance
     * @param array $dependent Dependent data array
     * @param array $enrollmentInfo Enrollment information
     * @param string $relation Relation type
     * @return array Formatted data array
     */
    function format_enrollment_data_for_save($employee, $dependent, $enrollmentInfo, $relation = 'self')
    {
        $createdBy = get_created_by_identifier();
        $isSelf = strtolower($relation) === 'self';
        
        $data = [
            'emp_id' => $employee->id,
            'cmp_id' => $employee->company_id,
            'enrolment_id' => $enrollmentInfo['enrolment_id'],
            'enrolment_portal_id' => $enrollmentInfo['enrolment_portal_id'],
            'enrolment_mapping_id' => $enrollmentInfo['enrolment_mapping_id'] ?? null,
            'created_by' => $createdBy,
            'updated_by' => $createdBy,
        ];
        
        if ($isSelf) {
            // Employee data
            $data['relation'] = 'self';
            $data['detailed_relation'] = 'Self';
            $data['insured_name'] = strtoupper($employee->full_name);
            $data['gender'] = strtoupper($employee->gender);
            $data['dob'] = $dependent['dob'] ?? $employee->date_of_birth;
            $data['date_of_joining'] = $employee->date_of_joining;
            
            // Coverage for employee
            $data['base_sum_insured'] = $enrollmentInfo['base_sum_insured'] ?? 500000;
            $data['base_plan_name'] = 'Base Plan';
            
            if (!empty($enrollmentInfo['topup_sum_insured'])) {
                $data['extra_coverage_plan_name'] = 'Top-up Coverage';
                $data['extra_coverage_premium_on_employee'] = calculate_topup_premium($enrollmentInfo['topup_sum_insured']);
            }
        } else {
            // Dependent data
            $data['relation'] = $dependent['relation'];
            $data['detailed_relation'] = $dependent['detailed_relation'] ?? $dependent['relation'];
            $data['insured_name'] = strtoupper($dependent['name'] ?? $dependent['insured_name'] ?? '');
            $data['gender'] = strtoupper($dependent['gender'] ?? '');
            $data['dob'] = $dependent['dob'] ?? null;
            $data['date_of_joining'] = $employee->date_of_joining;
            
            // No coverage for dependents
            $data['base_sum_insured'] = 0;
            $data['base_premium_on_company'] = 0;
            $data['base_premium_on_employee'] = 0;
        }
        
        $data['is_delete'] = $dependent['is_delete'] ?? 0;
        
        return $data;
    }
}

if (!function_exists('update_enrollment_mapping_status')) {
    /**
     * Update enrollment mapping master status after successful submission
     * 
     * @param int $mappingId Mapping ID
     * @param int $employeeId Employee ID
     * @param int $enrollmentId Enrollment ID
     * @param int $periodId Period ID
     * @param int $companyId Company ID
     * @return bool Success status
     */
    function update_enrollment_mapping_status($mappingId, $employeeId, $enrollmentId, $periodId, $companyId)
    {
        try {
            $updated = DB::table('enrolment_mapping_master')
                ->where('id', $mappingId)
                ->where('emp_id', $employeeId)
                ->where('enrolment_id', $enrollmentId)
                ->where('enrolment_period_id', $periodId)
                ->where('cmp_id', $companyId)
                ->update([
                    'submit_status' => 1,
                    'use_status' => 1,
                    'view_status' => 1,
                    'edit_option' => 0,
                    'updated_at' => now()
                ]);
            
            Log::info('📊 Enrollment mapping status updated', [
                'mapping_id' => $mappingId,
                'employee_id' => $employeeId,
                'updated' => $updated
            ]);
            
            return $updated > 0;
        } catch (\Exception $e) {
            Log::error('Failed to update enrollment mapping status: ' . $e->getMessage());
            return false;
        }
    }
}

if (!function_exists('is_enrollment_already_submitted')) {
    /**
     * Check if enrollment is already submitted
     * 
     * @param int $mappingId Mapping ID
     * @return bool True if already submitted, false otherwise
     */
    function is_enrollment_already_submitted($mappingId)
    {
        if (!$mappingId) {
            return false;
        }
        
        $mapping = DB::table('enrolment_mapping_master')
            ->where('id', $mappingId)
            ->where('status', 1)
            ->first();
        
        return $mapping && $mapping->submit_status == 1;
    }
}
