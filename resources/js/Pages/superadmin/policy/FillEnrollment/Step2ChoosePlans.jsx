import React, { useState, useEffect } from 'react';

export default function Step2ChoosePlans({ employee, availablePlans, formData, updateFormData, onNext, onPrevious }) {
    const [selectedPlans, setSelectedPlans] = useState(formData.selectedPlans || {});
    const [premiumCalculations, setPremiumCalculations] = useState(formData.premiumCalculations || {
        basePremium: 0,
        topupPremium: 0,
        extraCoveragePremium: 0,
        totalPremium: 0
    });
    const [errors, setErrors] = useState({});

    // All members including employee and dependents
    const allMembers = [
        {
            id: 'employee',
            name: employee.full_name,
            relation: 'SELF',
            age: employee.age || calculateAge(employee.date_of_birth),
            gender: employee.gender,
            isEmployee: true
        },
        ...(formData.dependents || []).map(dep => ({
            id: dep.id,
            name: dep.insured_name,
            relation: dep.relation,
            age: dep.age,
            gender: dep.gender,
            isEmployee: false
        }))
    ];

    function calculateAge(dateOfBirth) {
        if (!dateOfBirth) return 0;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    // Initialize selected plans
    useEffect(() => {
        setSelectedPlans(formData.selectedPlans || {});
    }, [formData.selectedPlans]);

    // Calculate premiums when plans change
    useEffect(() => {
        calculatePremiums();
    }, [selectedPlans]);

    const calculatePremiums = () => {
        let basePremiumTotal = 0;
        let topupPremiumTotal = 0;

        Object.entries(selectedPlans).forEach(([memberId, memberPlans]) => {
            if (memberPlans.basePlan) {
                const plan = availablePlans.basePlans?.find(p => p.id === memberPlans.basePlan);
                if (plan) {
                    basePremiumTotal += parseFloat(plan.employee_premium || 0);
                }
            }

            if (memberPlans.topupPlan) {
                const plan = availablePlans.topupPlans?.find(p => p.id === memberPlans.topupPlan);
                if (plan) {
                    topupPremiumTotal += parseFloat(plan.employee_premium || 0);
                }
            }
        });

        const newCalculations = {
            basePremium: basePremiumTotal,
            topupPremium: topupPremiumTotal,
            extraCoveragePremium: premiumCalculations.extraCoveragePremium || 0,
            totalPremium: basePremiumTotal + topupPremiumTotal + (premiumCalculations.extraCoveragePremium || 0)
        };

        setPremiumCalculations(newCalculations);
        updateFormData({
            selectedPlans,
            premiumCalculations: newCalculations
        });
    };

    const updateMemberPlan = (memberId, planType, planId) => {
        setSelectedPlans(prev => ({
            ...prev,
            [memberId]: {
                ...prev[memberId],
                [planType]: planId
            }
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Check if at least employee has selected a base plan
        if (!selectedPlans.employee?.basePlan) {
            newErrors.employee_base = 'Employee must select a base plan';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateForm()) {
            onNext();
        }
    };

    const getPlanPremium = (planId, planType) => {
        const planArray = planType === 'basePlan' ? availablePlans.basePlans : availablePlans.topupPlans;
        const plan = planArray?.find(p => p.id === planId);
        return plan ? parseFloat(plan.employee_premium || 0) : 0;
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
                <h3 className="text-lg font-medium text-gray-900">Choose Insurance Plans</h3>
                <p className="mt-1 text-sm text-gray-600">
                    Select insurance plans for each family member. Base plan is mandatory for the employee.
                </p>
            </div>

            {/* Premium Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Premium Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <p className="text-xs text-blue-600">Base Premium</p>
                        <p className="text-lg font-semibold text-blue-900">{formatCurrency(premiumCalculations.basePremium)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-blue-600">Top-up Premium</p>
                        <p className="text-lg font-semibold text-blue-900">{formatCurrency(premiumCalculations.topupPremium)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-blue-600">Extra Coverage</p>
                        <p className="text-lg font-semibold text-blue-900">{formatCurrency(premiumCalculations.extraCoveragePremium)}</p>
                    </div>
                    <div className="text-center border-l border-blue-300">
                        <p className="text-xs text-blue-600">Total Premium</p>
                        <p className="text-xl font-bold text-blue-900">{formatCurrency(premiumCalculations.totalPremium)}</p>
                    </div>
                </div>
            </div>

            {/* Plans Selection */}
            <div className="space-y-6">
                {allMembers.map((member, index) => (
                    <div key={member.id} className={`border rounded-lg p-4 ${member.isEmployee ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h5 className={`font-medium ${member.isEmployee ? 'text-blue-900' : 'text-gray-900'}`}>
                                    {member.name} {member.isEmployee && '(Employee)'}
                                </h5>
                                <p className={`text-xs ${member.isEmployee ? 'text-blue-600' : 'text-gray-600'}`}>
                                    {member.relation} • Age: {member.age} • {member.gender}
                                </p>
                            </div>
                            {member.isEmployee && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Primary Insured
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Base Plan Selection */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Base Plan {member.isEmployee && <span className="text-red-500">*</span>}
                                </label>

                                {availablePlans.basePlans && availablePlans.basePlans.length > 0 ? (
                                    <div className="space-y-2">
                                        {!member.isEmployee && (
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`${member.id}_base`}
                                                    value=""
                                                    checked={!selectedPlans[member.id]?.basePlan}
                                                    onChange={() => updateMemberPlan(member.id, 'basePlan', null)}
                                                    className="mr-2 text-[#934790] focus:ring-[#934790]"
                                                />
                                                <span className="text-sm text-gray-600">No base plan</span>
                                            </label>
                                        )}

                                        {availablePlans.basePlans.map(plan => (
                                            <label key={plan.id} className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`${member.id}_base`}
                                                    value={plan.id}
                                                    checked={selectedPlans[member.id]?.basePlan === plan.id}
                                                    onChange={() => updateMemberPlan(member.id, 'basePlan', plan.id)}
                                                    className="mt-0.5 mr-3 text-[#934790] focus:ring-[#934790]"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-900">{plan.plan_name}</p>
                                                        <p className="text-sm font-semibold text-green-600">
                                                            {formatCurrency(plan.employee_premium || 0)}
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Sum Insured: {formatCurrency(plan.sum_insured || 0)}
                                                    </p>
                                                    {plan.description && (
                                                        <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No base plans available</p>
                                )}

                                {errors[`${member.id}_base`] && (
                                    <p className="text-xs text-red-600">{errors[`${member.id}_base`]}</p>
                                )}
                            </div>

                            {/* Top-up Plan Selection */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Top-up Plan (Optional)</label>

                                {availablePlans.topupPlans && availablePlans.topupPlans.length > 0 ? (
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name={`${member.id}_topup`}
                                                value=""
                                                checked={!selectedPlans[member.id]?.topupPlan}
                                                onChange={() => updateMemberPlan(member.id, 'topupPlan', null)}
                                                className="mr-2 text-[#934790] focus:ring-[#934790]"
                                            />
                                            <span className="text-sm text-gray-600">No top-up plan</span>
                                        </label>

                                        {availablePlans.topupPlans.map(plan => (
                                            <label key={plan.id} className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`${member.id}_topup`}
                                                    value={plan.id}
                                                    checked={selectedPlans[member.id]?.topupPlan === plan.id}
                                                    onChange={() => updateMemberPlan(member.id, 'topupPlan', plan.id)}
                                                    className="mt-0.5 mr-3 text-[#934790] focus:ring-[#934790]"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-900">{plan.plan_name}</p>
                                                        <p className="text-sm font-semibold text-green-600">
                                                            {formatCurrency(plan.employee_premium || 0)}
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Sum Insured: {formatCurrency(plan.sum_insured || 0)}
                                                    </p>
                                                    {plan.description && (
                                                        <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No top-up plans available</p>
                                )}
                            </div>
                        </div>

                        {/* Selected Plans Summary for this member */}
                        {(selectedPlans[member.id]?.basePlan || selectedPlans[member.id]?.topupPlan) && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                <p className="text-xs font-medium text-gray-700 mb-2">Selected for {member.name}:</p>
                                <div className="flex flex-wrap gap-4 text-xs">
                                    {selectedPlans[member.id]?.basePlan && (
                                        <div className="flex items-center">
                                            <span className="text-blue-600">Base: </span>
                                            <span className="ml-1 font-medium">
                                                {availablePlans.basePlans?.find(p => p.id === selectedPlans[member.id].basePlan)?.plan_name}
                                            </span>
                                            <span className="ml-2 text-green-600 font-semibold">
                                                {formatCurrency(getPlanPremium(selectedPlans[member.id].basePlan, 'basePlan'))}
                                            </span>
                                        </div>
                                    )}
                                    {selectedPlans[member.id]?.topupPlan && (
                                        <div className="flex items-center">
                                            <span className="text-purple-600">Top-up: </span>
                                            <span className="ml-1 font-medium">
                                                {availablePlans.topupPlans?.find(p => p.id === selectedPlans[member.id].topupPlan)?.plan_name}
                                            </span>
                                            <span className="ml-2 text-green-600 font-semibold">
                                                {formatCurrency(getPlanPremium(selectedPlans[member.id].topupPlan, 'topupPlan'))}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Error for employee base plan */}
            {errors.employee_base && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{errors.employee_base}</p>
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
                <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#934790] hover:bg-[#7a3d7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]"
                >
                    Next: Extra Coverage
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
