<?php

namespace App\Helpers;

use App\Models\PolicyMaster;
use Illuminate\Support\Facades\DB;

class WelcomeMailerHelper
{
    /**
     * Get employee IDs from the correct TPA table or endorsement_data
     */
    public static function getEmployeeIds($policyId, $endorsementId)
    {
        $policy = PolicyMaster::with('tpa')->find($policyId);
        if (!$policy) return [];

        if (isset($policy->is_old) && $policy->is_old == 2) {
            $table = 'endorsement_data';
        } else {
            $table = $policy->tpa->tpa_table_name ?? null;
        }
        if (!$table) return [];

        $rows = DB::table($table)
            ->where('policy_id', $policyId)
            ->where('addition_endorsement_id', $endorsementId)
            ->whereNull('deletion_endorsement_id')
            ->where('relation', 'self')
            ->pluck('emp_id');

        return $rows ? $rows->toArray() : [];
    }
}
