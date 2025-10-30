import React, { useState, useEffect } from 'react';

export default function Step3ExtraCoverage({ extraCoveragePlans, formData, updateFormData, onNext, onPrevious }) {
    const [selectedExtraCoverage, setSelectedExtraCoverage] = useState(formData.extraCoverage || null);
    const [premiumCalculations, setPremiumCalculations] = useState(formData.premiumCalculations || {
        basePremium: 0,
        topupPremium: 0,
        extraCoveragePremium: 0,
        totalPremium: 0
    });

    // Initialize from formData
    useEffect(() => {
        setSelectedExtraCoverage(formData.extraCoverage || null);
        setPremiumCalculations(formData.premiumCalculations || {
            basePremium: 0,
            topupPremium: 0,
            extraCoveragePremium: 0,
            totalPremium: 0
        });
    }, [formData]);

    // Update premium calculations when extra coverage changes
    useEffect(() => {
        const extraPremium = selectedExtraCoverage ? parseFloat(selectedExtraCoverage.premium || 0) : 0;
        const newCalculations = {
            ...premiumCalculations,
            extraCoveragePremium: extraPremium,
            totalPremium: premiumCalculations.basePremium + premiumCalculations.topupPremium + extraPremium
        };

        setPremiumCalculations(newCalculations);
        updateFormData({
            extraCoverage: selectedExtraCoverage,
            premiumCalculations: newCalculations
        });
    }, [selectedExtraCoverage]);

    const handleExtraCoverageSelection = (plan) => {
        setSelectedExtraCoverage(plan);
    };

    const handleSkip = () => {
        setSelectedExtraCoverage(null);
        const newCalculations = {
            ...premiumCalculations,
            extraCoveragePremium: 0,
            totalPremium: premiumCalculations.basePremium + premiumCalculations.topupPremium
        };
        setPremiumCalculations(newCalculations);
        updateFormData({
            extraCoverage: null,
            premiumCalculations: newCalculations
        });
        onNext();
    };

    const handleNext = () => {
        onNext();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900">Extra Coverage Plans</h3>
                <p className="mt-1 text-sm text-gray-600">
                    Choose optional extra coverage plans for enhanced protection. These are completely optional and can be skipped.
                </p>
            </div>

            {/* Premium Summary Update */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3">Updated Premium Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <p className="text-xs text-green-600">Base Premium</p>
                        <p className="text-lg font-semibold text-green-900">{formatCurrency(premiumCalculations.basePremium)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-green-600">Top-up Premium</p>
                        <p className="text-lg font-semibold text-green-900">{formatCurrency(premiumCalculations.topupPremium)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-green-600">Extra Coverage</p>
                        <p className="text-lg font-semibold text-green-900">{formatCurrency(premiumCalculations.extraCoveragePremium)}</p>
                    </div>
                    <div className="text-center border-l border-green-300">
                        <p className="text-xs text-green-600">Total Premium</p>
                        <p className="text-xl font-bold text-green-900">{formatCurrency(premiumCalculations.totalPremium)}</p>
                    </div>
                </div>
            </div>

            {/* Extra Coverage Plans */}
            <div className="space-y-4">
                {extraCoveragePlans && extraCoveragePlans.length > 0 ? (
                    <>
                        {/* No Extra Coverage Option */}
                        <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                                type="radio"
                                name="extraCoverage"
                                value=""
                                checked={!selectedExtraCoverage}
                                onChange={() => handleExtraCoverageSelection(null)}
                                className="mt-1 mr-4 text-[#934790] focus:ring-[#934790]"
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-medium text-gray-900">No Extra Coverage</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Continue with basic coverage only
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-green-600">₹0</p>
                                        <p className="text-xs text-gray-500">No additional cost</p>
                                    </div>
                                </div>
                            </div>
                        </label>

                        {/* Extra Coverage Plan Options */}
                        {extraCoveragePlans.map((plan, index) => (
                            <label
                                key={plan.id || index}
                                className={`flex items-start p-4 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                                    selectedExtraCoverage?.id === plan.id
                                        ? 'border-[#934790] bg-purple-50'
                                        : 'border-gray-200'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="extraCoverage"
                                    value={plan.id}
                                    checked={selectedExtraCoverage?.id === plan.id}
                                    onChange={() => handleExtraCoverageSelection(plan)}
                                    className="mt-1 mr-4 text-[#934790] focus:ring-[#934790]"
                                />
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 pr-4">
                                            <p className="text-lg font-medium text-gray-900">{plan.plan_name}</p>

                                            {plan.description && (
                                                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                                            )}

                                            {/* Coverage Details */}
                                            <div className="mt-3 space-y-2">
                                                {plan.sum_insured && (
                                                    <div className="flex items-center text-sm">
                                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-gray-700">Coverage: {formatCurrency(plan.sum_insured)}</span>
                                                    </div>
                                                )}

                                                {plan.features && Array.isArray(plan.features) && (
                                                    <div className="space-y-1">
                                                        {plan.features.slice(0, 3).map((feature, idx) => (
                                                            <div key={idx} className="flex items-center text-sm">
                                                                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span className="text-gray-700">{feature}</span>
                                                            </div>
                                                        ))}
                                                        {plan.features.length > 3 && (
                                                            <p className="text-xs text-gray-500 ml-6">
                                                                +{plan.features.length - 3} more features
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {plan.coverage_type && (
                                                    <div className="flex items-center text-sm">
                                                        <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-gray-700">Type: {plan.coverage_type}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xl font-bold text-[#934790]">{formatCurrency(plan.premium || 0)}</p>
                                            <p className="text-xs text-gray-500">per year</p>

                                            {plan.employee_contribution && (
                                                <p className="text-xs text-gray-600 mt-1">
                                                    Employee pays: {formatCurrency(plan.employee_contribution)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Additional Plan Details (if selected) */}
                                    {selectedExtraCoverage?.id === plan.id && (
                                        <div className="mt-4 p-3 bg-white border border-purple-200 rounded-md">
                                            <h5 className="text-sm font-medium text-gray-900 mb-2">Plan Highlights:</h5>
                                            <div className="space-y-1 text-xs text-gray-600">
                                                {plan.waiting_period && (
                                                    <p>• Waiting Period: {plan.waiting_period}</p>
                                                )}
                                                {plan.pre_existing_coverage && (
                                                    <p>• Pre-existing Diseases: {plan.pre_existing_coverage}</p>
                                                )}
                                                {plan.cashless_hospitals && (
                                                    <p>• Cashless Hospitals: {plan.cashless_hospitals}+</p>
                                                )}
                                                {plan.claim_settlement_ratio && (
                                                    <p>• Claim Settlement Ratio: {plan.claim_settlement_ratio}%</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </label>
                        ))}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Extra Coverage Plans Available</h3>
                        <p className="text-sm text-gray-600">
                            There are no additional coverage plans available at this time. You can proceed with your current selection.
                        </p>
                    </div>
                )}
            </div>

            {/* Selected Extra Coverage Summary */}
            {selectedExtraCoverage && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-900 mb-2">Selected Extra Coverage</h4>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-800">{selectedExtraCoverage.plan_name}</p>
                            <p className="text-xs text-purple-600">
                                Coverage: {formatCurrency(selectedExtraCoverage.sum_insured || 0)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-purple-900">
                                {formatCurrency(selectedExtraCoverage.premium || 0)}
                            </p>
                            <p className="text-xs text-purple-600">additional premium</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onPrevious}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                </button>

                <div className="flex space-x-3">
                    <button
                        type="button"
                        onClick={handleSkip}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Skip Extra Coverage
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#934790] hover:bg-[#7a3d7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]"
                    >
                        Next: Review & Submit
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
