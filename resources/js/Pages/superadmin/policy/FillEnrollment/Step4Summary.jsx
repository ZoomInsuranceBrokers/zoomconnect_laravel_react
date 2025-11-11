import React, { useState } from 'react';

export default function Step4Summary({ employee, enrollmentDetail, formData, onSubmit, onPrevious }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agreementAccepted, setAgreementAccepted] = useState(false);

    const allMembers = [
        {
            id: 'employee',
            name: employee.full_name,
            relation: 'SELF',
            age: employee.age || calculateAge(employee.date_of_birth),
            gender: employee.gender,
            dob: employee.date_of_birth,
            isEmployee: true
        },
        ...(formData.dependents || []).map(dep => ({
            id: dep.id,
            name: dep.insured_name,
            relation: dep.relation,
            age: dep.age,
            gender: dep.gender,
            dob: dep.dob,
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

    const handleSubmit = async () => {
        if (!agreementAccepted) {
            alert('Please accept the terms and conditions to proceed.');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit();
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getPlanDetails = (planId, planType) => {
        // This would normally come from availablePlans prop, but we'll show basic info
        return {
            id: planId,
            name: `${planType} Plan ${planId}`,
            premium: formData.premiumCalculations?.[`${planType}Premium`] || 0
        };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900">Review & Submit Enrollment</h3>
                <p className="mt-1 text-sm text-gray-600">
                    Please review all your selections carefully before submitting your enrollment.
                </p>
            </div>

            {/* Policy Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Policy Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-blue-700 font-medium">Policy Name</p>
                        <p className="text-blue-900">{enrollmentDetail.corporate_enrolment_name}</p>
                    </div>
                    <div>
                        <p className="text-blue-700 font-medium">Policy Period</p>
                        <p className="text-blue-900">
                            {formatDate(enrollmentDetail.policy_start_date)} - {formatDate(enrollmentDetail.policy_end_date)}
                        </p>
                    </div>
                    <div>
                        <p className="text-blue-700 font-medium">Employee</p>
                        <p className="text-blue-900">{employee.full_name} ({employee.employees_code})</p>
                    </div>
                    <div>
                        <p className="text-blue-700 font-medium">Total Members</p>
                        <p className="text-blue-900">{allMembers.length} (Employee + {formData.dependents?.length || 0} Dependents)</p>
                    </div>
                </div>
            </div>

            {/* Family Members Summary */}
            <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-4 py-3 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">Family Members Enrolled</h4>
                </div>
                <div className="divide-y divide-gray-200">
                    {allMembers.map((member, index) => (
                        <div key={member.id} className="px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <p className="text-sm font-medium text-gray-900">
                                            {member.name}
                                            {member.isEmployee && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Employee
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-600">
                                        <span>Relation: {member.relation}</span>
                                        <span>Age: {member.age}</span>
                                        <span>Gender: {member.gender}</span>
                                        {member.dob && <span>DOB: {formatDate(member.dob)}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected Plans Summary */}
            <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-4 py-3 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">Selected Insurance Plans</h4>
                </div>
                <div className="p-4 space-y-4">
                    {Object.entries(formData.selectedPlans || {}).map(([memberId, memberPlans]) => {
                        const member = allMembers.find(m => m.id === memberId);
                        if (!member) return null;

                        return (
                            <div key={memberId} className="border border-gray-100 rounded-md p-3">
                                <h5 className="font-medium text-gray-900 mb-2">{member.name}</h5>
                                <div className="space-y-2">
                                    {memberPlans.basePlan && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700">Base Plan:</span>
                                            <span className="font-medium">Plan {memberPlans.basePlan}</span>
                                        </div>
                                    )}
                                    {memberPlans.topupPlan && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700">Top-up Plan:</span>
                                            <span className="font-medium">Plan {memberPlans.topupPlan}</span>
                                        </div>
                                    )}
                                    {!memberPlans.basePlan && !memberPlans.topupPlan && (
                                        <p className="text-xs text-gray-500 italic">No plans selected</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Extra Coverage Summary */}
            {formData.extraCoverage && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-900 mb-3">Extra Coverage Selected</h4>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-800">{formData.extraCoverage.plan_name}</p>
                            {formData.extraCoverage.description && (
                                <p className="text-xs text-purple-600 mt-1">{formData.extraCoverage.description}</p>
                            )}
                            {formData.extraCoverage.sum_insured && (
                                <p className="text-xs text-purple-600">
                                    Coverage: {formatCurrency(formData.extraCoverage.sum_insured)}
                                </p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-purple-900">
                                {formatCurrency(formData.extraCoverage.premium || 0)}
                            </p>
                            <p className="text-xs text-purple-600">per year</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Breakdown */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-4">Premium Breakdown</h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700">Base Plan Premium:</span>
                        <span className="font-semibold text-green-900">
                            {formatCurrency(formData.premiumCalculations?.basePremium || 0)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700">Top-up Plan Premium:</span>
                        <span className="font-semibold text-green-900">
                            {formatCurrency(formData.premiumCalculations?.topupPremium || 0)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700">Extra Coverage Premium:</span>
                        <span className="font-semibold text-green-900">
                            {formatCurrency(formData.premiumCalculations?.extraCoveragePremium || 0)}
                        </span>
                    </div>
                    <div className="border-t border-green-300 pt-3">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-medium text-green-900">Total Annual Premium:</span>
                            <span className="text-2xl font-bold text-green-900">
                                {formatCurrency(formData.premiumCalculations?.totalPremium || 0)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Terms & Conditions</h4>
                <div className="space-y-2 text-sm text-gray-700">
                    <p>• I confirm that all the information provided is accurate and complete.</p>
                    <p>• I understand that any false information may result in claim rejection.</p>
                    <p>• I agree to the terms and conditions of the insurance policy.</p>
                    <p>• I understand that premium amounts are subject to applicable taxes.</p>
                    <p>• I acknowledge that coverage will begin as per the policy terms.</p>
                </div>

                <label className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        checked={agreementAccepted}
                        onChange={(e) => setAgreementAccepted(e.target.checked)}
                        className="mr-3 text-[#934790] focus:ring-[#934790] rounded"
                    />
                    <span className="text-sm text-gray-900">
                        I accept all the terms and conditions mentioned above
                        <span className="text-red-500 ml-1">*</span>
                    </span>
                </label>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onPrevious}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                </button>

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!agreementAccepted || isSubmitting}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-[#934790] hover:bg-[#7a3d7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Submit Enrollment
                        </>
                    )}
                </button>
            </div>

            {/* Important Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                    <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="text-sm">
                        <p className="font-medium text-yellow-800">Important Notice</p>
                        <p className="text-yellow-700 mt-1">
                            Once submitted, you will not be able to modify your enrollment selections. Please review all details carefully before proceeding.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
