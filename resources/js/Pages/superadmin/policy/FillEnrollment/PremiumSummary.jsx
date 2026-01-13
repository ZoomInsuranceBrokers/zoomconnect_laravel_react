import React from 'react';

export default function PremiumSummary({ calc = {}, ratingConfig = {}, selectedPlanObj = null, baseSI = null }) {
  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(amount || 0));

  const ratorLabel = String(ratingConfig.plan_type || ratingConfig.rator_type || 'simple');
  
  // Extract pro-rata information
  const prorationFactor = calc.prorationFactor || calc.proration_factor || 1;
  const remainingDays = calc.remainingDays || calc.remaining_days || 0;
  const totalPolicyDays = calc.totalPolicyDays || calc.total_policy_days || 0;
  const isProrated = prorationFactor < 1 && remainingDays > 0;

  const infoTitle = (() => {
    const ptype = ratorLabel.toLowerCase();
    if (ptype === 'per_life') return 'Per-life: Premium is applied per insured life (premium × number of lives).';
    if (ptype === 'age_based') return 'Age-based: Premium varies by member age using configured age brackets.';
    if (ptype === 'floater_highest_age') return 'Floater (highest age): Premium is based on the highest age among insured members.';
    if (ptype === 'simple') return 'Simple: Flat premium for the selected plan.';
    return 'Premium is calculated using plan/rating configuration.';
  })();

  // Ensure we have consistent numeric values — compute defaults if missing
  const basePremium = Number(calc.basePremium || calc.grossPremium || 0) || 0;
  const extraCoveragePremium = Number(calc.extraCoveragePremium || 0) || 0;
  const topupPremium = Number(calc.topupPremium || 0) || 0;
  const totalBeforeGst = basePremium + topupPremium + extraCoveragePremium;
  const gst = (calc.gst !== undefined && calc.gst !== null) ? Number(calc.gst) : Math.round(totalBeforeGst * 0.18) || 0;
  const grossPlusGst = totalBeforeGst + gst;
  const companyPerc = Number(ratingConfig.company_contribution_percentage || ratingConfig.company_contribution_percent || 0) || 0;
  // Company contribution is applied on gross+GST total
  const companyContributionAmount = (calc.companyContributionAmount !== undefined && calc.companyContributionAmount !== null)
    ? Number(calc.companyContributionAmount)
    : (companyPerc > 0 ? Math.round(grossPlusGst * (companyPerc / 100)) : 0);
  const employeePayable = (calc.employeePayable !== undefined && calc.employeePayable !== null)
    ? Number(calc.employeePayable)
    : Math.max(0, grossPlusGst - companyContributionAmount);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-blue-900">Premium Summary</h4>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-blue-700">Rator Type: <span className="font-semibold capitalize">{ratorLabel}</span></span>
          <span title={infoTitle} className="inline-block text-xs text-blue-500 border border-blue-400 rounded-full w-5 h-5 text-center leading-5 cursor-help">i</span>
        </div>
      </div>

      {isProrated && (
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-300 rounded-md">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-semibold text-yellow-800">Pro-rata Applied (Mid-year Joining)</p>
          </div>
          <p className="text-xs text-yellow-700">Premium calculated for {remainingDays} days out of {totalPolicyDays} days ({Math.round(prorationFactor * 100)}% of annual premium)</p>
        </div>
      )}

      {selectedPlanObj && (
        <div className="mb-3 pb-2 border-b border-blue-200">
          <p className="text-xs text-blue-700 font-medium">Selected Plan: <span className="text-blue-900">{selectedPlanObj.plan_name}</span> | Sum Insured: <span className="text-blue-900">{formatCurrency(Number(selectedPlanObj.sum_insured || baseSI || 0))}</span></p>
        </div>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-blue-700">Sum Insured Premium</span>
          <span className="font-semibold text-blue-900">{formatCurrency(basePremium)}</span>
        </div>
        {topupPremium > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-blue-700">Top-up Premium</span>
            <span className="font-semibold text-blue-900">{formatCurrency(topupPremium)}</span>
          </div>
        )}
        {/* Extra Coverage Premium row removed as per request */}
        <div className="flex items-center justify-between">
          <span className="text-blue-700">Subtotal (Before GST)</span>
          <span className="font-semibold text-blue-900">{formatCurrency(totalBeforeGst)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-blue-700">GST (18%)</span>
          <span className="font-semibold text-blue-900">{formatCurrency(gst)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-blue-700">Total (with GST)</span>
          <span className="font-semibold text-blue-900">{formatCurrency(grossPlusGst)}</span>
        </div>
        {companyPerc > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-blue-700">Company Contribution ({companyPerc}%)</span>
            <span className="font-semibold text-green-600">-{formatCurrency(companyContributionAmount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-blue-300">
          <span className="text-lg font-medium text-blue-900">Employee Payable</span>
          <span className="text-xl font-bold text-blue-900">{formatCurrency(employeePayable)}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-blue-200 text-xs text-gray-700">
        <p className="font-medium">Calculation: ({formatCurrency(basePremium)} + {formatCurrency(topupPremium)} + {formatCurrency(extraCoveragePremium)}) + GST 18% = {formatCurrency(grossPlusGst)} - Company {companyPerc}% = {formatCurrency(employeePayable)}</p>
      </div>
    </div>
  );
}
