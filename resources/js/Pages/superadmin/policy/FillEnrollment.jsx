import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';
import Step1AddDependents from './FillEnrollment/Step1AddDependents';
import Step2ChoosePlans from './FillEnrollment/Step2ChoosePlans';
import Step3ExtraCoverage from './FillEnrollment/Step3ExtraCoverage';
import Step4Summary from './FillEnrollment/Step4Summary';

export default function FillEnrollment({
    enrollmentPeriod,
    enrollmentDetail,
    enrollmentConfig,
    employee,
    familyDefinition,
    availablePlans,
    extraCoveragePlans,
    message,
    messageType
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [showMessage, setShowMessage] = useState(null);
    const [formData, setFormData] = useState({
        employee_id: employee.id,
        enrollment_period_id: enrollmentPeriod.id,
        enrollment_detail_id: enrollmentDetail.id,
        enrollment_config_id: enrollmentConfig?.id,
        dependents: [],
        selectedPlans: {},
        extraCoverage: null,
        premiumCalculations: {
            basePremium: 0,
            topupPremium: 0,
            extraCoveragePremium: 0,
            totalPremium: 0
        }
    });

    const steps = [
        { id: 1, name: 'Add Dependents', description: 'Add family members' },
        { id: 2, name: 'Choose Plans', description: 'Select insurance plans' },
        { id: 3, name: 'Extra Coverage', description: 'Optional coverage' },
        { id: 4, name: 'Summary', description: 'Review & submit' }
    ];

    // Handle success/error messages
    useEffect(() => {
        if (message) {
            setShowMessage({ type: messageType || 'success', text: message });
            const timer = setTimeout(() => setShowMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message, messageType]);

    const handleStepChange = (step) => {
        if (step >= 1 && step <= 4) {
            setCurrentStep(step);
        }
    };

    const handleNextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const updateFormData = (stepData) => {
        setFormData(prev => ({
            ...prev,
            ...stepData
        }));
    };

    const handleSubmit = async () => {
        try {
            router.post('/superadmin/fill-enrollment/submit', formData, {
                onSuccess: () => {
                    setShowMessage({ type: 'success', text: 'Enrollment submitted successfully!' });
                    // Redirect back to live portal after successful submission
                    setTimeout(() => {
                        router.visit(`/superadmin/policy/view-live-portal/${enrollmentPeriod.id}`);
                    }, 2000);
                },
                onError: (errors) => {
                    setShowMessage({ type: 'error', text: 'Failed to submit enrollment. Please try again.' });
                    console.error('Submission errors:', errors);
                }
            });
        } catch (error) {
            setShowMessage({ type: 'error', text: 'An error occurred. Please try again.' });
            console.error('Submit error:', error);
        }
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1AddDependents
                        employee={employee}
                        enrollmentDetail={enrollmentDetail}
                        familyDefinition={familyDefinition}
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={handleNextStep}
                    />
                );
            case 2:
                return (
                    <Step2ChoosePlans
                        employee={employee}
                        availablePlans={availablePlans}
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={handleNextStep}
                        onPrevious={handlePreviousStep}
                    />
                );
            case 3:
                return (
                    <Step3ExtraCoverage
                        extraCoveragePlans={extraCoveragePlans}
<<<<<<< HEAD
=======
                        availablePlans={availablePlans}
>>>>>>> main
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={handleNextStep}
                        onPrevious={handlePreviousStep}
                    />
                );
            case 4:
                return (
                    <Step4Summary
                        employee={employee}
                        enrollmentDetail={enrollmentDetail}
<<<<<<< HEAD
=======
                        availablePlans={availablePlans}
>>>>>>> main
                        formData={formData}
                        onSubmit={handleSubmit}
                        onPrevious={handlePreviousStep}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <SuperAdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Link
                                    href={`/superadmin/policy/view-live-portal/${enrollmentPeriod.id}`}
                                    className="mr-4 p-2 bg-[#934790] hover:bg-[#7a3d7a] text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790] shadow-lg"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </Link>
                                <div className="ml-2">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Fill Enrollment
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Employee: <span className="font-medium text-[#934790]">{employee.full_name}</span> ({employee.employees_code})
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
                            <nav aria-label="Progress">
                                <ol className="flex items-center justify-between relative">
                                    {steps.map((step, stepIdx) => (
                                        <li key={step.id} className="relative flex-1 flex flex-col items-center">
                                            {/* Progress line connecting steps */}
                                            {stepIdx !== steps.length - 1 && (
<<<<<<< HEAD
                                                <div className="absolute top-5 left-1/2 w-full h-1 flex items-center">
                                                    <div className="h-full w-full bg-gray-200 rounded-full relative">
                                                        <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out ${
                                                            currentStep > step.id + 1
                                                                ? 'w-full bg-gradient-to-r from-[#934790] to-[#b967b5]'
                                                                : currentStep === step.id + 1
                                                                ? 'w-1/2 bg-gradient-to-r from-[#934790] to-[#b967b5]'
                                                                : currentStep > step.id
                                                                ? 'w-full bg-gradient-to-r from-[#934790] to-[#b967b5]'
                                                                : 'w-0 bg-gray-200'
                                                        }`}></div>
=======
                                                <div className="absolute top-5 left-full w-full h-1 flex items-center" style={{ left: '50%' }}>
                                                    <div className="h-full w-full bg-gray-200 rounded-full relative">
                                                        <div
                                                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out ${
                                                                currentStep > step.id
                                                                    ? 'w-full bg-gradient-to-r from-[#934790] to-[#b967b5]'
                                                                    : currentStep === step.id + 1
                                                                        ? 'w-1/2 bg-gradient-to-r from-[#934790] to-[#b967b5]'
                                                                        : 'w-0 bg-gray-200'
                                                            }`}
                                                        ></div>
>>>>>>> main
                                                    </div>
                                                </div>
                                            )}

                                            {/* Step circle */}
                                            <button
                                                onClick={() => handleStepChange(step.id)}
                                                className={`relative w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#934790]/20 z-10 bg-white ${
                                                    currentStep === step.id
                                                        ? 'border-[#934790] bg-gradient-to-br from-[#934790] to-[#7a3d7a] text-white shadow-lg scale-110'
                                                        : currentStep > step.id
                                                        ? 'border-[#934790] bg-gradient-to-br from-[#934790] to-[#7a3d7a] text-white shadow-md'
                                                        : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
                                                }`}
                                            >
                                                {currentStep > step.id ? (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <span className="text-sm font-bold">{step.id}</span>
                                                )}
                                            </button>

                                            {/* Step labels - properly centered below circles */}
                                            <div className="mt-4 text-center min-w-0 max-w-32">
                                                <p className={`text-sm font-semibold transition-colors duration-300 ${
                                                    currentStep >= step.id ? 'text-[#934790]' : 'text-gray-500'
                                                }`}>
                                                    {step.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </div>
                    </div>

                    {/* Current Step Content */}
                    <div className="bg-white shadow rounded-lg p-6 min-h-96">
                        {renderCurrentStep()}
                    </div>
                </div>
            </div>

            {/* Success/Error Message */}
            {showMessage && (
                <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 text-sm ${
                    showMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {showMessage.type === 'success' ? (
                            <path d="M9 12l2 2l4-4" />
                        ) : (
                            <path d="M18 6L6 18M6 6l12 12" />
                        )}
                    </svg>
                    <span>{showMessage.text}</span>
                    <button
                        onClick={() => setShowMessage(null)}
                        className="text-gray-500 hover:text-gray-700 ml-2"
                    >
                        &times;
                    </button>
                </div>
            )}
        </SuperAdminLayout>
    );
}
