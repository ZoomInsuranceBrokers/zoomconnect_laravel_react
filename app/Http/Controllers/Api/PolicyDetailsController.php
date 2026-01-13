<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CompanyEmployee;
use App\Models\PolicyMaster;
use App\Models\CompanyMaster;
use App\Services\TpaService;

class PolicyDetailsController extends Controller
{
    /**
     * Return detailed policy information based on policy id and authenticated JWT.
     */
    public function show(Request $request, $policyId)
    {
        $decoded = $request->attributes->get('jwt_user');

        if (empty($decoded->sub)) {
            return ApiResponse::error('Invalid token payload', null, 401);
        }

        $employee = CompanyEmployee::find($decoded->sub);

        if (!$employee) {
            return ApiResponse::error('Employee not found', null, 404);
        }

        $company = CompanyMaster::where('comp_id', $employee->company_id)->first();

        if (!$company) {
            return ApiResponse::error('Company not found', null, 404);
        }

        $policy = PolicyMaster::find($policyId);

        if (!$policy) {
            return ApiResponse::error('Policy not found', null, 404);
        }

        // Only support non-old policies via service handlers; if is_old != 0 handle accordingly
        if ($policy->is_old != 0) {
            return ApiResponse::error('Legacy policy details are not available via this API', null, 400);
        }

        $tpaService = new TpaService();

        // Delegate to TPA-specific handler
        $result = $tpaService->getDetails((int)$policy->tpa_id, $policy, $employee, $company);

        return $result;
    }
}
