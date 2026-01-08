import React, { useState, useEffect } from "react";
import PremiumSummary from './PremiumSummary';

export default function Step3ExtraCoverage({
    employee,
    enrollmentDetail,
    extraCoveragePlans = [],
    availablePlans = null,
    formData,
    updateFormData,
    onNext,
    onPrevious,
}) {
    // defensive: ensure we don't read properties from undefined formData
    const fd = formData || {};

    // normalize initial selected extra coverage into an array of ids for the UI (match Step2)
    const initSelectedIds = (() => {
        const sel = fd.selectedPlans?.extraCoverageSelected;
        if (Array.isArray(sel)) return sel.map(String);
        if (sel && typeof sel === 'string') return [sel];
        if (sel && typeof sel === 'object' && sel.id) return [String(sel.id)];
        return [];
    })();

    const [selectedExtraIds, setSelectedExtraIds] = useState(initSelectedIds);

    // Calculate proration factor based on joining date
    const calculateProrationFactor = (emp, enrollmentDetail) => {
        if (!enrollmentDetail?.policy_start_date || !enrollmentDetail?.policy_end_date || !emp?.date_of_joining) {
            console.log('⚠️ Step3 Proration: Missing required dates', {
                policy_start_date: enrollmentDetail?.policy_start_date,
                policy_end_date: enrollmentDetail?.policy_end_date,
                date_of_joining: emp?.date_of_joining
            });
            return { prorationFactor: 1, remainingDays: 0, totalPolicyDays: 0 };
        }

        const joiningDate = new Date(emp.date_of_joining || emp.doj);
        const policyStartDate = new Date(enrollmentDetail.policy_start_date);
        const policyEndDate = new Date(enrollmentDetail.policy_end_date);

        // If dates are invalid or joining <= policy start, no proration
        if (isNaN(joiningDate.getTime()) ||
            isNaN(policyStartDate.getTime()) ||
            isNaN(policyEndDate.getTime()) ||
            joiningDate <= policyStartDate) {
            console.log('ℹ️ Step3 Proration: No proration needed', {
                joiningDate: emp.date_of_joining,
                policyStartDate: enrollmentDetail.policy_start_date,
                joiningBeforeOrOnStart: joiningDate <= policyStartDate
            });
            return { prorationFactor: 1, remainingDays: 0, totalPolicyDays: 0 };
        }

        const totalPolicyDays = Math.max(1, Math.ceil((policyEndDate - policyStartDate) / (1000 * 60 * 60 * 24)));
        const remainingDays = Math.max(0, Math.ceil((policyEndDate - joiningDate) / (1000 * 60 * 60 * 24)));
        const prorationFactor = remainingDays / totalPolicyDays;

        console.log('✅ Step3 Proration calculated:', {
            joiningDate: emp.date_of_joining,
            policyStartDate: enrollmentDetail.policy_start_date,
            policyEndDate: enrollmentDetail.policy_end_date,
            totalPolicyDays,
            remainingDays,
            prorationFactor: prorationFactor.toFixed(4),
            percentage: (prorationFactor * 100).toFixed(2) + '%'
        });

        return {
            prorationFactor,
            remainingDays,
            totalPolicyDays
        };
    };

    // Debug logging
    useEffect(() => {
        try {
            console.log('📊 Step3ExtraCoverage - employee:', employee);
            console.log('📊 Step3ExtraCoverage - enrollmentDetail:', enrollmentDetail);
            console.log('📊 Step3ExtraCoverage - selectedExtraIds:', selectedExtraIds);
            
            if (employee?.date_of_joining && enrollmentDetail?.policy_start_date) {
                const prorationInfo = calculateProrationFactor(employee, enrollmentDetail);
                console.log('📊 Step3 Proration Info:', {
                    shouldProrate: prorationInfo.prorationFactor < 1,
                    prorationFactor: prorationInfo.prorationFactor,
                    remainingDays: prorationInfo.remainingDays,
                    totalPolicyDays: prorationInfo.totalPolicyDays
                });
            }
        } catch (e) {
            console.error('Error in Step3 debug logging:', e);
        }
    }, [employee, enrollmentDetail, selectedExtraIds]);

    // Always use the latest values from formData.premiumCalculations for base/topup
    const [premiumCalculations, setPremiumCalculations] = useState(() => {
        const pc = fd.premiumCalculations || {};
        return {
            basePremium: Number(pc.basePremium || pc.grossPremium || 0) || 0,
            topupPremium: Number(pc.topupPremium || 0) || 0,
            extraCoveragePremium: Number(pc.extraCoveragePremium || 0) || 0,
            totalPremium: Number(pc.totalPremium || 0) || 0,
            grossPremium: Number(pc.grossPremium || 0) || 0,
            gst: Number(pc.gst || 0) || 0,
            grossPlusGst: Number(pc.grossPlusGst || 0) || 0,
            companyContributionAmount: Number(pc.companyContributionAmount || 0) || 0,
            employeePayable: Number(pc.employeePayable || 0) || 0,
        };
    });

    useEffect(() => {
        // keep local state in sync when parent formData updates
        const d = formData || {};
        // sync selected ids
        const sel = d.selectedPlans?.extraCoverageSelected;
        if (Array.isArray(sel)) setSelectedExtraIds(sel.map(String));
        else if (sel && typeof sel === 'string') setSelectedExtraIds([sel]);
        else setSelectedExtraIds([]);
        if (d.premiumCalculations) {
            // always use the latest base/topup/extra from formData
            const pc = d.premiumCalculations;
            const merged = {
                basePremium: Number(pc.basePremium || pc.grossPremium || 0) || 0,
                topupPremium: Number(pc.topupPremium || 0) || 0,
                extraCoveragePremium: Number(pc.extraCoveragePremium || 0) || 0,
                totalPremium: Number(pc.totalPremium || 0) || 0,
                grossPremium: Number(pc.grossPremium || 0) || 0,
                gst: Number(pc.gst || 0) || 0,
                grossPlusGst: Number(pc.grossPlusGst || 0) || 0,
                companyContributionAmount: Number(pc.companyContributionAmount || 0) || 0,
                employeePayable: Number(pc.employeePayable || 0) || 0,
            };
            const cfg = d.availablePlans?.ratingConfig || d.availablePlans?.rating_config || d.ratingConfig || {};
            const withDerived = computeDerived(merged, cfg);
            setPremiumCalculations(withDerived);
        }
    }, [formData]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const computeDerived = (pc, cfg) => {
        const basePremium = Number(pc.basePremium || pc.grossPremium || 0) || 0;
        const topupPremium = Number(pc.topupPremium || 0) || 0;
        const extraPremium = Number(pc.extraCoveragePremium || 0) || 0;
        const total = basePremium + topupPremium + extraPremium;
        const gst = Math.round(total * 0.18) || 0;
        const grossPlusGst = total + gst;
    // ...existing code...
        let companyPerc = 0;
        if (typeof cfg.company_contribution_percentage !== 'undefined' && cfg.company_contribution_percentage !== null) {
            companyPerc = Number(cfg.company_contribution_percentage) || 0;
        } else if (typeof cfg.company_contribution_percent !== 'undefined' && cfg.company_contribution_percent !== null) {
            companyPerc = Number(cfg.company_contribution_percent) || 0;
        }
        // Fallback: try to get from pc if not in cfg
        if (!companyPerc && typeof pc.company_contribution_percentage !== 'undefined') {
            companyPerc = Number(pc.company_contribution_percentage) || 0;
        }
        if (!companyPerc && typeof pc.company_contribution_percent !== 'undefined') {
            companyPerc = Number(pc.company_contribution_percent) || 0;
        }
    // ...existing code...
        const companyContributionAmount = companyPerc > 0 ? Math.round(grossPlusGst * (companyPerc / 100)) : 0;
        const employeePayable = Math.max(0, grossPlusGst - companyContributionAmount);
    // ...existing code...
        return {
            ...pc,
            totalPremium: total,
            gst,
            grossPlusGst,
            companyContributionAmount,
            employeePayable,
        };
    };
    const handleExtraCoverageToggle = (planId) => {
        // if null passed -> clear all selections
        if (planId === null || planId === undefined) {
            setSelectedExtraIds([]);
            // Always use the latest base/topup from formData, not local state
            const pc = formData?.premiumCalculations || {};
            const basePremium = Number(pc.basePremium || pc.grossPremium || 0) || 0;
            const topupPremium = Number(pc.topupPremium || 0) || 0;
            const next = {
                ...pc,
                basePremium,
                topupPremium,
                extraCoveragePremium: 0,
                totalPremium: basePremium + topupPremium,
            };
            const cfg = fd.availablePlans?.ratingConfig || fd.availablePlans?.rating_config || fd.ratingConfig || {};
            const withDerived = computeDerived(next, cfg);
            setPremiumCalculations(withDerived);
            updateFormData({
                selectedPlans: {
                    ...(fd.selectedPlans || {}),
                    extraCoverageSelected: [],
                },
                premiumCalculations: withDerived,
            });
            return;
        }

        setSelectedExtraIds((currentIds) => {
            const s = new Set(currentIds || []);
            const sid = String(planId);
            if (s.has(sid)) s.delete(sid);
            else s.add(sid);
            return Array.from(s);
        });
    };

    // When selectedExtraIds changes (including initial sync), recompute totals and persist
    useEffect(() => {
        const ids = selectedExtraIds || [];
        // always use the latest base/topup from formData
        const pc = formData?.premiumCalculations || {};
        const basePremium = Number(pc.basePremium || pc.grossPremium || 0) || 0;
        const topupPremium = Number(pc.topupPremium || 0) || 0;
        
        // Apply pro-rata to extra coverage premiums
        const prorationData = calculateProrationFactor(employee, enrollmentDetail);
        const extraTotal = ids.reduce((sum, id) => {
            const p = (extraCoveragePlans || []).find(pl => String(pl.id) === String(id));
            const val = Number(p?.employee_contribution ?? p?.premium ?? p?.premium_amount ?? 0) || 0;
            return sum + (val * prorationData.prorationFactor);
        }, 0);

        const next = {
            ...pc,
            basePremium,
            topupPremium,
            extraCoveragePremium: extraTotal,
            totalPremium: basePremium + topupPremium + extraTotal,
        };
        const cfg = fd.availablePlans?.ratingConfig || fd.availablePlans?.rating_config || fd.ratingConfig || {};
        const withDerived = computeDerived(next, cfg);
        setPremiumCalculations(withDerived);

        // Only update if selectedPlans.extraCoverageSelected or premiumCalculations actually changed
        const prevIds = (fd.selectedPlans?.extraCoverageSelected || []).map(String);
        const idsChanged = ids.length !== prevIds.length || ids.some((id, i) => id !== prevIds[i]);
        const prevCalc = fd.premiumCalculations || {};
        const calcChanged = JSON.stringify(withDerived) !== JSON.stringify(prevCalc);
        if (idsChanged || calcChanged) {
            try {
                updateFormData({
                    selectedPlans: {
                        ...(fd.selectedPlans || {}),
                        extraCoverageSelected: ids,
                    },
                    premiumCalculations: withDerived,
                });
            } catch (e) {
                // Optionally log or handle error
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedExtraIds]);

    const handleNext = () => {
        updateFormData({
            selectedPlans: {
                ...(fd.selectedPlans || {}),
                extraCoverageSelected: selectedExtraIds || [],
            },
            premiumCalculations,
        });

        if (typeof onNext === "function") onNext();
    };

    // prepare props for PremiumSummary - prefer availablePlans prop, then fall back to formData
    const calc = premiumCalculations || {};
    // Always prefer availablePlans from props, then from formData, then fallback
    const sourcePlans = availablePlans || fd.availablePlans || {};
    // Always use the ratingConfig from Step2 if present in formData
    let ratingConfig = fd.ratingConfig || sourcePlans?.ratingConfig || sourcePlans?.rating_config || {};
    // If company contribution is missing, try to get from availablePlans
    if (!('company_contribution_percentage' in ratingConfig) && sourcePlans?.ratingConfig && ('company_contribution_percentage' in sourcePlans.ratingConfig)) {
        ratingConfig = { ...ratingConfig, company_contribution_percentage: sourcePlans.ratingConfig.company_contribution_percentage };
    }
    if (!('company_contribution_percent' in ratingConfig) && sourcePlans?.ratingConfig && ('company_contribution_percent' in sourcePlans.ratingConfig)) {
        ratingConfig = { ...ratingConfig, company_contribution_percent: sourcePlans.ratingConfig.company_contribution_percent };
    }
    const selectedPlanObj = fd.selectedPlans?.selectedPlanId
        ? (sourcePlans?.basePlans || []).find(
              (p) => String(p.id) === String(fd.selectedPlans.selectedPlanId)
          ) || null
        : null;
    const baseSI = ratingConfig?.base_sum_insured || null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    Extra Coverage Plans
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                    Choose optional extra coverage plans for enhanced
                    protection. These are completely optional and can be
                    skipped.
                </p>
            </div>

            {/* Premium Summary */}
            <PremiumSummary calc={calc} ratingConfig={ratingConfig} selectedPlanObj={selectedPlanObj} baseSI={baseSI} />

            {/* Extra Coverage Plans */}
            <div className="space-y-4">
                {extraCoveragePlans && extraCoveragePlans.length > 0 ? (
                    <>
                        {/* No Extra Coverage Option */}
                        <label className={`flex items-start p-4 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${selectedExtraIds.length === 0 ? 'border-[#934790] bg-purple-50' : 'border-gray-200'}`}>
                            <input
                                type="checkbox"
                                name="extraCoverage"
                                value=""
                                checked={selectedExtraIds.length === 0}
                                onChange={() => handleExtraCoverageToggle(null)}
                                className="mt-1 mr-4 text-[#934790] focus:ring-[#934790]"
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-medium text-gray-900">
                                            No Extra Coverage
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Continue with basic coverage only
                                        </p>
                                    </div>
                                    <div className="text-right">
                                            <p className="text-xl font-bold text-green-600">
                                            ₹0
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            No additional cost
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </label>

                        {/* Extra Coverage Options */}
                        {extraCoveragePlans.map((plan) => {
                            const prorationData = calculateProrationFactor(employee, enrollmentDetail);
                            const shouldProrate = prorationData.prorationFactor < 1 && prorationData.prorationFactor > 0;
                            const originalPremium = Number(plan.employee_contribution ?? plan.premium ?? plan.premium_amount ?? 0);
                            const proratedPremium = Math.round(originalPremium * prorationData.prorationFactor);
                            
                            return (
                            <label
                                key={plan.id}
                    className={`flex items-start p-4 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedExtraIds.map(String).includes(String(plan.id))
                        ? "border-[#934790] bg-purple-50"
                        : "border-gray-200"
                    }`}
                            >
                                <input
                                    type="checkbox"
                                    name="extraCoverage"
                                    value={plan.id}
                                    checked={selectedExtraIds.map(String).includes(String(plan.id))}
                                    onChange={() => handleExtraCoverageToggle(plan.id)}
                                    className="mt-1 mr-4 text-[#934790] focus:ring-[#934790]"
                                />
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 pr-4">
                                            <p className="text-lg font-medium text-gray-900">
                                                {plan.plan_name}
                                            </p>
                                            {plan.description && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {plan.description}
                                                </p>
                                            )}
                                            {/* Coverage Details */}
                                            <div className="mt-3 space-y-2">
                                                {plan.features &&
                                                    Array.isArray(
                                                        plan.features
                                                    ) && (
                                                        <div className="space-y-1">
                                                            {plan.features
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        feature,
                                                                        idx
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="flex items-center text-sm"
                                                                        >
                                                                            <svg
                                                                                className="w-4 h-4 text-green-500 mr-2"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth="2"
                                                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                                />
                                                                            </svg>
                                                                            <span className="text-gray-700">
                                                                                {
                                                                                    feature
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                )}
                                                            {plan.features
                                                                .length > 3 && (
                                                                <p className="text-xs text-gray-500 ml-6">
                                                                    +
                                                                    {plan
                                                                        .features
                                                                        .length -
                                                                        3}{" "}
                                                                    more
                                                                    features
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xl font-bold text-[#934790]">
                                                {formatCurrency(proratedPremium)}
                                            </p>
                                            {shouldProrate && (
                                                <p className="text-xs text-amber-600 mt-0.5">
                                                    (Original: {formatCurrency(originalPremium)})
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500">
                                                per year
                                            </p>
                                            {shouldProrate && (
                                                <p className="text-xs text-amber-600 font-medium mt-1">
                                                    ⏱️ Pro-rated: {(prorationData.prorationFactor * 100).toFixed(1)}%
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </label>
                            );
                        })}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <svg
                            className="w-12 h-12 mx-auto text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                            />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No Extra Coverage Plans Available
                        </h3>
                        <p className="text-sm text-gray-600">
                            There are no additional coverage plans available at
                            this time. You can proceed with your current
                            selection.
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onPrevious}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]"
                >
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Previous
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#934790] hover:bg-[#7a3d7a]"
                >
                    Next: Review & Submit
                    <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
