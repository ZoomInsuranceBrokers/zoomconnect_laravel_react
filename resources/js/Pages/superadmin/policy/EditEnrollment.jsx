import React, { useState, useEffect } from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";
import SuperAdminLayout from "../../../Layouts/SuperAdmin/Layout";

// Family member avatar icons
const FamilyIcons = {
    self: (
        <div className="flex flex-col items-center">
            <img
                src="/assets/images/enrolment/self.png"
                alt="Self"
                className="w-16 h-16 object-contain"
            />
            <span className="text-xs font-medium text-[#934790] mt-1">Self</span>
        </div>
    ),
    spouse: (
        <div className="flex flex-col items-center">
            <img
                src="/assets/images/enrolment/spouse.png"
                alt="Spouse"
                className="w-16 h-16 object-contain"
            />
            <span className="text-xs font-medium text-[#934790] mt-1">Spouse</span>
        </div>
    ),
    kids: (
        <div className="flex flex-col items-center">
            <img
                src="/assets/images/enrolment/kids.png"
                alt="Kids"
                className="w-16 h-16 object-contain"
            />
            <span className="text-xs font-medium text-[#934790] mt-1">Kids</span>
        </div>
    ),
    parent: (
        <div className="flex flex-col items-center">
            <img
                src="/assets/images/enrolment/parents.png"
                alt="Parents"
                className="w-16 h-16 object-contain"
            />
            <span className="text-xs font-medium text-[#934790] mt-1">Parents</span>
        </div>
    ),
    parent_in_law: (
        <div className="flex flex-col items-center">
            <img
                src="/assets/images/enrolment/parents.png"
                alt="Parent-in-Law"
                className="w-16 h-16 object-contain"
            />
            <span className="text-xs font-medium text-[#934790] mt-1">Parent-in-Law</span>
        </div>
    ),
    sibling: (
        <div className="flex flex-col items-center">
            <img
                src="/assets/images/enrolment/siblings.png"
                alt="Sibling"
                className="w-16 h-16 object-contain"
            />
            <span className="text-xs font-medium text-[#934790] mt-1">Sibling</span>
        </div>
    ),
    partners: (
        <div className="flex flex-col items-center">
            <img
                src="/assets/images/enrolment/spouse.png"
                alt="Partners"
                className="w-16 h-16 object-contain"
            />
            <span className="text-xs font-medium text-[#934790] mt-1">Partners</span>
        </div>
    ),
    others: (
         <div className="flex flex-col items-center">
            <img
                src="/assets/images/enrolment/others.png"
                alt="Others"
                className="w-16 h-16 object-contain"
            />
            <span className="text-xs font-medium text-[#934790] mt-1">Partners</span>
        </div>
    )
};

export default function EditEnrollment({ companies, messageTemplates, enrollment }) {
    const [step, setStep] = useState(1);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [stepErrors, setStepErrors] = useState({});
    const [isValidating, setIsValidating] = useState(false);
    const [message, setMessage] = useState(null);
    const [gradeInputValue, setGradeInputValue] = useState('');

    // Helper function to parse JSON safely
    const parseJSON = (data, fallback = {}) => {
        if (!data) return fallback;
        if (typeof data === 'string') {
            try {
                return JSON.parse(data);
            } catch (e) {
                return fallback;
            }
        }
        return data;
    };

    // Helper function to format date for input field
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';

        // Handle different date formats
        let date;
        if (dateString.includes(' ')) {
            // Format: "2024-10-27 00:00:00" or "2024-10-27 10:30:00"
            date = new Date(dateString.split(' ')[0]);
        } else {
            // Format: "2024-10-27"
            date = new Date(dateString);
        }

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return '';
        }

        // Return in YYYY-MM-DD format for input[type="date"]
        return date.toISOString().split('T')[0];
    };

    const { data, setData, put, processing, errors } = useForm({
        // Basic Details - Auto-filled from enrollment
        cmp_id: enrollment.cmp_id || '',
        enrolment_name: enrollment.enrolment_name || '',
        corporate_enrolment_name: enrollment.corporate_enrolment_name || '',
        policy_start_date: formatDateForInput(enrollment.policy_start_date),
        policy_end_date: formatDateForInput(enrollment.policy_end_date),

        // Family Definition - Auto-filled from enrollment
        family_defination: parseJSON(enrollment.family_defination, {
            self: "1",
            self_no: "1",
            self_min_age: "18",
            self_max_age: "80",
            self_gender: "both",
            spouse: "0",
            spouse_no: "0",
            spouse_min_age: "18",
            spouse_max_age: "99",
            spouse_gender: "both",
            kid: "0",
            kid_no: "0",
            kid_min_age: "0",
            kid_max_age: "25",
            kid_gender: "both",
            parent: "0",
            parent_no: "0",
            parent_min_age: "30",
            parent_max_age: "99",
            parent_gender: "both",
            parent_in_law: "0",
            parent_in_law_no: "0",
            parent_in_law_min_age: "30",
            parent_in_law_max_age: "99",
            parent_in_law_gender: "both",
            sibling: "0",
            sibling_no: "0",
            sibling_min_age: "18",
            sibling_max_age: "99",
            sibling_gender: "both",
            partners: "0",
            partners_no: "0",
            partners_min_age: "18",
            partners_max_age: "99",
            partners_gender: "both",
            others: "0",
            others_no: "0",
            others_min_age: "18",
            others_max_age: "99",
            others_gender: "both",
            spouse_with_same_gender: "null",
            add_both_parent_n_parent_in_law: "either"
        }),

        // Flexible Rating Configuration - Auto-filled from enrollment
        rating_config: parseJSON(enrollment.rating_config, {
            plan_type: 'simple', // 'simple', 'age_based', 'per_life', 'floater_highest_age', 'relation_wise', 'flexi'
            base_sum_insured_type: 'fixed', // 'fixed' or 'grade_wise'
            base_sum_insured: '',
            grade_wise_sum_insured: [
                {
                    id: 1,
                    grade_name: '',
                    sum_insured: ''
                }
            ],
            company_contribution: false,
            company_contribution_percentage: 0,
            plans: [
                {
                    id: 1,
                    plan_name: '',
                    sum_insured: '',
                    premium_amount: '',
                    age_brackets: []
                }
            ],
            relation_wise_config: {
                self: {
                    sum_insured_options: [
                        {
                            id: 1,
                            sum_insured: '',
                            premium_amount: '',
                            age_brackets: []
                        }
                    ]
                },
                spouse: {
                    sum_insured_options: [
                        {
                            id: 1,
                            sum_insured: '',
                            premium_amount: '',
                            age_brackets: []
                        }
                    ]
                },
                kids: {
                    sum_insured_options: [
                        {
                            id: 1,
                            sum_insured: '',
                            premium_amount: '',
                            age_brackets: []
                        }
                    ]
                },
                parent: {
                    sum_insured_options: [
                        {
                            id: 1,
                            sum_insured: '',
                            premium_amount: '',
                            age_brackets: []
                        }
                    ]
                },
                parent_in_law: {
                    sum_insured_options: [
                        {
                            id: 1,
                            sum_insured: '',
                            premium_amount: '',
                            age_brackets: []
                        }
                    ]
                },
                sibling: {
                    sum_insured_options: [
                        {
                            id: 1,
                            sum_insured: '',
                            premium_amount: '',
                            age_brackets: []
                        }
                    ]
                },
                partners: {
                    sum_insured_options: [
                        {
                            id: 1,
                            sum_insured: '',
                            premium_amount: '',
                            age_brackets: []
                        }
                    ]
                },
                others: {
                    sum_insured_options: [
                        {
                            id: 1,
                            sum_insured: '',
                            premium_amount: '',
                            age_brackets: []
                        }
                    ]
                }
            }
        }),

        // Extra Coverage - Auto-filled from enrollment
        extra_coverage_plans: parseJSON(enrollment.extra_coverage_plans, []),

        // Mail Configuration - Auto-filled from enrollment
        mail_configuration: parseJSON(enrollment.mail_configuration, {
            enrollment_mail: {
                template_id: '',
                enabled: true
            },
            reminder_mail: {
                template_id: '',
                enabled: false,
                frequency: 'weekly', // daily, weekly, monthly
                frequency_value: 1 // every X days/weeks/months
            }
        }),

        // Step 6: Additional Settings - Auto-filled from enrollment
        twin_allowed: enrollment.twin_allowed || false,
        is_self_allowed_by_default: enrollment.is_self_allowed_by_default !== undefined ? enrollment.is_self_allowed_by_default : true,
        grade_exclude: Array.isArray(parseJSON(enrollment.grade_exclude, [])) ? parseJSON(enrollment.grade_exclude, []) : [],
        enrollment_statements: (() => {
            const statements = parseJSON(enrollment.enrollment_statements, [
                {
                    id: 1,
                    statement: '',
                    is_required: false
                }
            ]);
            // Ensure each statement has proper structure
            return statements.map(stmt => ({
                id: stmt.id || Date.now(),
                statement: stmt.statement || '',
                is_required: stmt.is_required || false
            }));
        })(),

        status: enrollment.status !== undefined ? enrollment.status : true
    });

    // Auto-hide messages after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    const updateFamilyDefinition = (key, value) => {
        setData('family_defination', {
            ...data.family_defination,
            [key]: value
        });
    };

    const handleFamilyMemberToggle = (memberType, enabled) => {
        const updates = { [memberType]: enabled ? "1" : "0" };

        if (!enabled) {
            // Reset related fields when disabled
            updates[`${memberType}_no`] = "0";
        } else {
            // Set default number when enabled
            updates[`${memberType}_no`] = memberType === 'self' ? "1" : "1";
        }

        setData('family_defination', {
            ...data.family_defination,
            ...updates
        });
    };

    const updateRelationWiseConfig = (relation, field, value) => {
        setData('rating_config', {
            ...data.rating_config,
            relation_wise_config: {
                ...data.rating_config.relation_wise_config,
                [relation]: {
                    ...data.rating_config.relation_wise_config[relation],
                    [field]: value
                }
            }
        });
    };

    // Add new sum insured option for a relation
    const addRelationSumInsuredOption = (relation) => {
        const relationConfig = data.rating_config.relation_wise_config[relation];
        const newOption = {
            id: Date.now(),
            sum_insured: '',
            premium_amount: '',
            age_brackets: []
        };

        updateRelationWiseConfig(relation, 'sum_insured_options', [
            ...(relationConfig.sum_insured_options || []),
            newOption
        ]);
    };

    // Remove sum insured option from a relation
    const removeRelationSumInsuredOption = (relation, optionIndex) => {
        const relationConfig = data.rating_config.relation_wise_config[relation];
        const updatedOptions = relationConfig.sum_insured_options.filter((_, index) => index !== optionIndex);
        updateRelationWiseConfig(relation, 'sum_insured_options', updatedOptions);
    };

    // Update sum insured option field
    const updateRelationSumInsuredOption = (relation, optionIndex, field, value) => {
        const relationConfig = data.rating_config.relation_wise_config[relation];
        const updatedOptions = [...relationConfig.sum_insured_options];
        updatedOptions[optionIndex][field] = value;
        updateRelationWiseConfig(relation, 'sum_insured_options', updatedOptions);
    };

    // Add age bracket to a specific sum insured option
    const addRelationOptionAgeBracket = (relation, optionIndex) => {
        const relationConfig = data.rating_config.relation_wise_config[relation];
        const newBracket = {
            id: Date.now(),
            min_age: '',
            max_age: '',
            premium_amount: ''
        };

        const updatedOptions = [...relationConfig.sum_insured_options];
        updatedOptions[optionIndex].age_brackets = [
            ...(updatedOptions[optionIndex].age_brackets || []),
            newBracket
        ];
        updateRelationWiseConfig(relation, 'sum_insured_options', updatedOptions);
    };

    // Remove age bracket from a specific sum insured option
    const removeRelationOptionAgeBracket = (relation, optionIndex, bracketIndex) => {
        const relationConfig = data.rating_config.relation_wise_config[relation];
        const updatedOptions = [...relationConfig.sum_insured_options];
        updatedOptions[optionIndex].age_brackets = updatedOptions[optionIndex].age_brackets.filter((_, index) => index !== bracketIndex);
        updateRelationWiseConfig(relation, 'sum_insured_options', updatedOptions);
    };

    // Update age bracket in a specific sum insured option
    const updateRelationOptionAgeBracket = (relation, optionIndex, bracketIndex, field, value) => {
        const relationConfig = data.rating_config.relation_wise_config[relation];
        const updatedOptions = [...relationConfig.sum_insured_options];
        updatedOptions[optionIndex].age_brackets[bracketIndex][field] = value;
        updateRelationWiseConfig(relation, 'sum_insured_options', updatedOptions);
    };

    // Legacy functions for backward compatibility (keeping for existing age brackets)
    const addRelationAgeBracket = (relation) => {
        const relationConfig = data.rating_config.relation_wise_config[relation];
        const newBracket = {
            id: Date.now(),
            min_age: '',
            max_age: '',
            premium_amount: ''
        };

        updateRelationWiseConfig(relation, 'age_brackets', [
            ...(relationConfig.age_brackets || []),
            newBracket
        ]);
    };

    const removeRelationAgeBracket = (relation, bracketIndex) => {
        const relationConfig = data.rating_config.relation_wise_config[relation];
        const updatedBrackets = relationConfig.age_brackets.filter((_, index) => index !== bracketIndex);
        updateRelationWiseConfig(relation, 'age_brackets', updatedBrackets);
    };

    const updateRelationAgeBracket = (relation, bracketIndex, field, value) => {
        const relationConfig = data.rating_config.relation_wise_config[relation];
        const updatedBrackets = [...relationConfig.age_brackets];
        updatedBrackets[bracketIndex][field] = value;
        updateRelationWiseConfig(relation, 'age_brackets', updatedBrackets);
    };

    const addGradeWiseSumInsured = () => {
        const newGrade = {
            id: Date.now(),
            grade_name: '',
            sum_insured: ''
        };
        setData('rating_config', {
            ...data.rating_config,
            grade_wise_sum_insured: [...data.rating_config.grade_wise_sum_insured, newGrade]
        });
    };

    const removeGradeWiseSumInsured = (index) => {
        const updatedGrades = data.rating_config.grade_wise_sum_insured.filter((_, i) => i !== index);
        setData('rating_config', {
            ...data.rating_config,
            grade_wise_sum_insured: updatedGrades
        });
    };

    const updateGradeWiseSumInsured = (index, field, value) => {
        const updatedGrades = [...data.rating_config.grade_wise_sum_insured];
        updatedGrades[index][field] = value;
        setData('rating_config', {
            ...data.rating_config,
            grade_wise_sum_insured: updatedGrades
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert objects to JSON strings for backend processing
        const formData = {
            ...data,
            family_defination: JSON.stringify(data.family_defination),
            rating_config: JSON.stringify(data.rating_config),
            extra_coverage_plans: JSON.stringify(data.extra_coverage_plans),
            mail_configuration: JSON.stringify(data.mail_configuration),
            enrollment_statements: JSON.stringify(data.enrollment_statements || []),
            grade_exclude: JSON.stringify(data.grade_exclude || [])
        };

        put(route('superadmin.policy.enrollment-lists.update', enrollment.id), formData, {
            onSuccess: () => {
                // Redirect to enrollment list with success message
                router.visit(route('superadmin.policy.enrollment-lists.index'), {
                    method: 'get',
                    data: {
                        message: `Enrollment "${data.enrolment_name}" updated successfully!`,
                        messageType: 'success'
                    }
                });
            },
            onError: (errors) => {
                setMessage({ type: 'error', text: 'Failed to update enrollment. Please check the form and try again.' });
                console.error('Update errors:', errors);
            }
        });
    };

    // Validation functions for each step
    const validateStep1 = () => {
        const stepErrors = {};

        if (!data.cmp_id) {
            stepErrors.cmp_id = 'Please select a company';
        }

        if (!data.enrolment_name?.trim()) {
            stepErrors.enrolment_name = 'Enrollment name is required';
        } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(data.enrolment_name)) {
            stepErrors.enrolment_name = 'Enrollment name can only contain letters, numbers, spaces, hyphens, and underscores';
        }

        if (!data.corporate_enrolment_name?.trim()) {
            stepErrors.corporate_enrolment_name = 'Corporate enrollment name is required';
        } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(data.corporate_enrolment_name)) {
            stepErrors.corporate_enrolment_name = 'Corporate enrollment name can only contain letters, numbers, spaces, hyphens, and underscores';
        }

        if (!data.policy_start_date) {
            stepErrors.policy_start_date = 'Policy start date is required';
        }

        if (!data.policy_end_date) {
            stepErrors.policy_end_date = 'Policy end date is required';
        } else if (data.policy_start_date && new Date(data.policy_end_date) <= new Date(data.policy_start_date)) {
            stepErrors.policy_end_date = 'Policy end date must be after policy start date';
        }

        return stepErrors;
    };

    const validateStep2 = () => {
        const stepErrors = {};
        const familyDef = data.family_defination;

        // Check if at least one family member is enabled
        const enabledMembers = Object.keys(familyDef).filter(key =>
            key.endsWith('') && !key.includes('_') && familyDef[key] === '1'
        );

        if (enabledMembers.length === 0) {
            stepErrors.family_defination = 'At least one family member type must be enabled';
        }

        // Validate age ranges for enabled members
        enabledMembers.forEach(member => {
            const minAge = parseInt(familyDef[`${member}_min_age`] || 0);
            const maxAge = parseInt(familyDef[`${member}_max_age`] || 0);

            if (maxAge < minAge) {
                stepErrors[`${member}_age_range`] = `Maximum age must be greater than or equal to minimum age for ${member}`;
            }
        });

        return stepErrors;
    };

    const validateStep3 = () => {
        const stepErrors = {};
        const ratingConfig = data.rating_config;

        if (!ratingConfig.plan_type) {
            stepErrors.plan_type = 'Please select a plan type';
        }

        if (!ratingConfig.base_sum_insured_type) {
            stepErrors.base_sum_insured_type = 'Please select base sum insured type';
        }

        if (ratingConfig.base_sum_insured_type === 'fixed') {
            if (ratingConfig.base_sum_insured === '' || ratingConfig.base_sum_insured === null || ratingConfig.base_sum_insured === undefined) {
                stepErrors.base_sum_insured = 'Base sum insured amount is required';
            } else if (ratingConfig.base_sum_insured < 0) {
                stepErrors.base_sum_insured = 'Base sum insured cannot be negative';
            }
        } else if (ratingConfig.base_sum_insured_type === 'grade_wise') {
            if (!ratingConfig.grade_wise_sum_insured || ratingConfig.grade_wise_sum_insured.length === 0) {
                stepErrors.grade_wise_sum_insured = 'At least one grade is required';
            }
        }

        if (ratingConfig.company_contribution && (!ratingConfig.company_contribution_percentage || ratingConfig.company_contribution_percentage < 0 || ratingConfig.company_contribution_percentage > 100)) {
            stepErrors.company_contribution_percentage = 'Company contribution percentage must be between 0 and 100';
        }

        // Validate plans based on plan type
        if (['simple', 'age_based', 'per_life', 'floater_highest_age'].includes(ratingConfig.plan_type)) {
            if (!ratingConfig.plans || ratingConfig.plans.length === 0) {
                stepErrors.plans = 'At least one plan is required';
            } else {
                ratingConfig.plans.forEach((plan, index) => {
                    if (!plan.plan_name?.trim()) {
                        stepErrors[`plan_${index}_name`] = 'Plan name is required';
                    }
                    if (!plan.sum_insured || plan.sum_insured < 1000) {
                        stepErrors[`plan_${index}_sum_insured`] = 'Sum insured must be at least ₹1,000';
                    }
                    if (ratingConfig.plan_type === 'simple' && (!plan.premium_amount || plan.premium_amount < 1)) {
                        stepErrors[`plan_${index}_premium`] = 'Premium amount is required';
                    }
                });
            }
        }

        return stepErrors;
    };

    const validateStep4 = () => {
        const stepErrors = {};
        const extraCoveragePlans = data.extra_coverage_plans;

        // Extra coverage is optional, so only validate if plans exist
        if (extraCoveragePlans && extraCoveragePlans.length > 0) {
            extraCoveragePlans.forEach((plan, index) => {
                if (!plan.plan_name?.trim()) {
                    stepErrors[`extra_plan_${index}_name`] = 'Plan name is required';
                }

                if (plan.premium_amount === '' || plan.premium_amount < 0) {
                    stepErrors[`extra_plan_${index}_premium`] = 'Premium amount must be 0 or greater';
                }

                // Check if at least one coverage is enabled
                const coverages = plan.extra_coverages || {};
                const hasEnabledCoverage = Object.values(coverages).some(coverage => coverage.enabled);

                if (!hasEnabledCoverage) {
                    stepErrors[`extra_plan_${index}_coverage`] = 'At least one coverage type must be enabled';
                }
            });
        }

        return stepErrors;
    };

    const validateStep5 = () => {
        const stepErrors = {};
        const mailConfig = data.mail_configuration;

        if (!mailConfig.enrollment_mail?.template_id) {
            stepErrors.enrollment_mail_template = 'Enrollment mail template is required';
        }

        if (mailConfig.reminder_mail?.enabled) {
            if (!mailConfig.reminder_mail.template_id) {
                stepErrors.reminder_mail_template = 'Reminder mail template is required when reminder mail is enabled';
            }
            if (!mailConfig.reminder_mail.frequency) {
                stepErrors.reminder_frequency = 'Reminder frequency is required when reminder mail is enabled';
            }
            if (!mailConfig.reminder_mail.frequency_value || mailConfig.reminder_mail.frequency_value < 1) {
                stepErrors.reminder_frequency_value = 'Frequency value must be at least 1';
            }
        }

        return stepErrors;
    };

    const validateStep6 = () => {
        const stepErrors = {};
        const statements = data.enrollment_statements || [];

        // Validate enrollment statements
        if (statements && statements.length > 0) {
            statements.forEach((statement, index) => {
                if (statement.statement?.trim()) {
                    // Only validate if statement has content
                    if ((statement.statement || '').length > 500) {
                        stepErrors[`statement_${index}_length`] = 'Statement cannot exceed 500 characters';
                    }
                }
            });

            // Check if there's at least one statement with content
            const hasValidStatements = statements.some(statement => statement.statement?.trim());
            if (!hasValidStatements) {
                // Allow empty statements - they're optional
            }
        }

        return stepErrors;
    };

    const validateCurrentStep = () => {
        let validationErrors = {};

        console.log('Validating step:', step);

        switch(step) {
            case 1:
                validationErrors = validateStep1();
                break;
            case 2:
                validationErrors = validateStep2();
                break;
            case 3:
                validationErrors = validateStep3();
                break;
            case 4:
                validationErrors = validateStep4();
                break;
            case 5:
                validationErrors = validateStep5();
                break;
            case 6:
                validationErrors = validateStep6();
                break;
        }

        console.log('Validation errors for step', step, ':', validationErrors);
        setStepErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const nextStep = () => {
        setIsValidating(true);

        // Clear previous step errors
        setStepErrors({});

        // Validate current step
        setTimeout(() => {
            if (validateCurrentStep()) {
                if (step < 6) {
                    setStep(step + 1);
                    setStepErrors({});
                    // Scroll to top of the form
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
            setIsValidating(false);
        }, 100);
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
            setStepErrors({});
            // Scroll to top of the form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4, 5, 6].map((stepNum) => (
                <React.Fragment key={stepNum}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        step >= stepNum ? 'bg-[#934790] text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                        {stepNum}
                    </div>
                    {stepNum < 6 && (
                        <div className={`w-12 h-1 ${
                            step > stepNum ? 'bg-[#934790]' : 'bg-gray-200'
                        }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <SuperAdminLayout>
            <Head title={`Edit ${enrollment.enrolment_name} - Policy Management`} />

            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 font-montserrat mb-2">
                            Edit Enrollment
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Update enrollment details for <span className="font-semibold">{enrollment.enrolment_name}</span>
                        </p>
                    </div>

                    {/* Success/Error Messages */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg border ${
                            message.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 ${
                                    message.type === 'success' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {message.type === 'success' ? (
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">
                                        {message.text || message}
                                    </p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <button
                                        onClick={() => setMessage(null)}
                                        className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                            message.type === 'success'
                                                ? 'text-green-500 hover:bg-green-100 focus:ring-green-600'
                                                : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                                        }`}
                                    >
                                        <span className="sr-only">Dismiss</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step Indicator */}
                    {renderStepIndicator()}

                    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
                        {/* Step 1: Basic Information */}
                        {step === 1 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Company *
                                        </label>
                                        <select
                                            value={data.cmp_id}
                                            onChange={(e) => setData('cmp_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select Company</option>
                                            {companies.map((company) => (
                                                <option key={company.id} value={company.id}>
                                                    {company.comp_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.cmp_id && <p className="text-red-600 text-sm mt-1">{errors.cmp_id}</p>}
                                        {stepErrors.cmp_id && <p className="text-red-600 text-sm mt-1">{stepErrors.cmp_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Enrollment Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.enrolment_name}
                                            onChange={(e) => setData('enrolment_name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            placeholder="Enter enrollment name"
                                            required
                                        />
                                        {errors.enrolment_name && <p className="text-red-600 text-sm mt-1">{errors.enrolment_name}</p>}
                                        {stepErrors.enrolment_name && <p className="text-red-600 text-sm mt-1">{stepErrors.enrolment_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Corporate Enrollment Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.corporate_enrolment_name}
                                            onChange={(e) => setData('corporate_enrolment_name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            placeholder="Enter corporate enrollment name"
                                            required
                                        />
                                        {errors.corporate_enrolment_name && <p className="text-red-600 text-sm mt-1">{errors.corporate_enrolment_name}</p>}
                                        {stepErrors.corporate_enrolment_name && <p className="text-red-600 text-sm mt-1">{stepErrors.corporate_enrolment_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Policy Start Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.policy_start_date}
                                            onChange={(e) => {
                                                const startDate = e.target.value;
                                                setData('policy_start_date', startDate);

                                                // Automatically set end date to 1 year later minus 1 day
                                                if (startDate) {
                                                    const startDateObj = new Date(startDate);
                                                    const endDateObj = new Date(startDateObj);
                                                    endDateObj.setFullYear(startDateObj.getFullYear() + 1);
                                                    endDateObj.setDate(endDateObj.getDate() - 1); // Subtract 1 day

                                                    // Format as YYYY-MM-DD for date input
                                                    const endDate = endDateObj.toISOString().split('T')[0];
                                                    setData('policy_end_date', endDate);
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            required
                                        />
                                        {errors.policy_start_date && <p className="text-red-600 text-sm mt-1">{errors.policy_start_date}</p>}
                                        {stepErrors.policy_start_date && <p className="text-red-600 text-sm mt-1">{stepErrors.policy_start_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Policy End Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.policy_end_date}
                                            onChange={(e) => setData('policy_end_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            required
                                        />
                                        {errors.policy_end_date && <p className="text-red-600 text-sm mt-1">{errors.policy_end_date}</p>}
                                        {stepErrors.policy_end_date && <p className="text-red-600 text-sm mt-1">{stepErrors.policy_end_date}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Family Definition */}
                        {step === 2 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Family Definition</h2>

                                {stepErrors.family_defination && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm">{stepErrors.family_defination}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.entries(FamilyIcons).map(([memberType, icon]) => {
                                        const isEnabled = data.family_defination[memberType] === "1";
                                        const memberTitle = memberType.charAt(0).toUpperCase() + memberType.slice(1).replace(/_/g, ' ');

                                        return (
                                            <div key={memberType} className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                                                isEnabled ? 'border-[#934790] bg-purple-50' : 'border-gray-200 bg-white'
                                            }`}>
                                                <div className="text-center mb-4">
                                                    {icon}
                                                    <h3 className="text-sm font-medium text-gray-900 mt-2">{memberTitle}</h3>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-center">
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={isEnabled}
                                                                onChange={(e) => handleFamilyMemberToggle(memberType, e.target.checked)}
                                                                className="rounded border-gray-300 text-[#934790] focus:ring-[#934790] focus:ring-offset-0"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">Include</span>
                                                        </label>
                                                    </div>

                                                    {isEnabled && (
                                                        <div className="space-y-2">
                                                            <div>
                                                                <label className="block text-xs text-gray-600 mb-1">Number</label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max="10"
                                                                    value={data.family_defination[`${memberType}_no`]}
                                                                    onChange={(e) => updateFamilyDefinition(`${memberType}_no`, e.target.value)}
                                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790] focus:border-transparent"
                                                                />
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <label className="block text-xs text-gray-600 mb-1">Min Age</label>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        max="100"
                                                                        value={data.family_defination[`${memberType}_min_age`]}
                                                                        onChange={(e) => updateFamilyDefinition(`${memberType}_min_age`, e.target.value)}
                                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790] focus:border-transparent"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs text-gray-600 mb-1">Max Age</label>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        max="100"
                                                                        value={data.family_defination[`${memberType}_max_age`]}
                                                                        onChange={(e) => updateFamilyDefinition(`${memberType}_max_age`, e.target.value)}
                                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790] focus:border-transparent"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="block text-xs text-gray-600 mb-1">Gender</label>
                                                                <select
                                                                    value={data.family_defination[`${memberType}_gender`]}
                                                                    onChange={(e) => updateFamilyDefinition(`${memberType}_gender`, e.target.value)}
                                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790] focus:border-transparent"
                                                                >
                                                                    <option value="both">Both</option>
                                                                    <option value="male">Male</option>
                                                                    <option value="female">Female</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Additional Family Options */}
                                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-900 mb-4">Additional Options</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Spouse with Same Gender
                                            </label>
                                            <select
                                                value={data.family_defination.spouse_with_same_gender}
                                                onChange={(e) => updateFamilyDefinition('spouse_with_same_gender', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            >
                                                <option value="null">Not Allowed</option>
                                                <option value="allowed">Allowed</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Parent & Parent-in-Law
                                            </label>
                                            <select
                                                value={data.family_defination.add_both_parent_n_parent_in_law}
                                                onChange={(e) => updateFamilyDefinition('add_both_parent_n_parent_in_law', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            >
                                                <option value="either">Either</option>
                                                <option value="both">Both Allowed</option>
                                                <option value="none">None</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Flexible Rating Configuration */}
                        {step === 3 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Plan Configuration</h2>

                                {/* Display general step errors */}
                                {Object.keys(stepErrors).length > 0 && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
                                        <ul className="text-red-600 text-sm space-y-1">
                                            {Object.entries(stepErrors).map(([key, error]) => (
                                                <li key={key}>• {error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Plan Type Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Plan Structure Type
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="plan_type"
                                                value="simple"
                                                checked={data.rating_config.plan_type === 'simple'}
                                                onChange={(e) => setData('rating_config', {
                                                    ...data.rating_config,
                                                    plan_type: e.target.value
                                                })}
                                                className="text-[#934790] focus:ring-[#934790]"
                                            />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">Simple Plan</div>
                                                <div className="text-sm text-gray-500">Just Sum Insured & Premium</div>
                                            </div>
                                        </label>

                                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="plan_type"
                                                value="age_based"
                                                checked={data.rating_config.plan_type === 'age_based'}
                                                onChange={(e) => setData('rating_config', {
                                                    ...data.rating_config,
                                                    plan_type: e.target.value
                                                })}
                                                className="text-[#934790] focus:ring-[#934790]"
                                            />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">Age-Based Plan</div>
                                                <div className="text-sm text-gray-500">Different rates by age groups</div>
                                            </div>
                                        </label>

                                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="plan_type"
                                                value="per_life"
                                                checked={data.rating_config.plan_type === 'per_life'}
                                                onChange={(e) => setData('rating_config', {
                                                    ...data.rating_config,
                                                    plan_type: e.target.value
                                                })}
                                                className="text-[#934790] focus:ring-[#934790]"
                                            />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">Per Life</div>
                                                <div className="text-sm text-gray-500">Premium × Number of members</div>
                                            </div>
                                        </label>

                                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="plan_type"
                                                value="floater_highest_age"
                                                checked={data.rating_config.plan_type === 'floater_highest_age'}
                                                onChange={(e) => setData('rating_config', {
                                                    ...data.rating_config,
                                                    plan_type: e.target.value
                                                })}
                                                className="text-[#934790] focus:ring-[#934790]"
                                            />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">Floater (Highest Age)</div>
                                                <div className="text-sm text-gray-500">Premium based on oldest member</div>
                                            </div>
                                        </label>

                                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="plan_type"
                                                value="relation_wise"
                                                checked={data.rating_config.plan_type === 'relation_wise'}
                                                onChange={(e) => setData('rating_config', {
                                                    ...data.rating_config,
                                                    plan_type: e.target.value
                                                })}
                                                className="text-[#934790] focus:ring-[#934790]"
                                            />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">Relation Wise</div>
                                                <div className="text-sm text-gray-500">Different rates per relation</div>
                                            </div>
                                        </label>

                                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="plan_type"
                                                value="flexi"
                                                checked={data.rating_config.plan_type === 'flexi'}
                                                onChange={(e) => setData('rating_config', {
                                                    ...data.rating_config,
                                                    plan_type: e.target.value
                                                })}
                                                className="text-[#934790] focus:ring-[#934790]"
                                            />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">Flexi Plan</div>
                                                <div className="text-sm text-gray-500">Custom Sum Insured options</div>
                                            </div>
                                        </label>
                                    </div>
                                    {stepErrors.plan_type && (
                                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-red-600 text-sm">{stepErrors.plan_type}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Base Sum Insured Configuration */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Base Sum Insured Type
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="base_sum_insured_type"
                                                    value="fixed"
                                                    checked={data.rating_config.base_sum_insured_type === 'fixed'}
                                                    onChange={(e) => setData('rating_config', {
                                                        ...data.rating_config,
                                                        base_sum_insured_type: e.target.value
                                                    })}
                                                    className="text-[#934790] focus:ring-[#934790]"
                                                />
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">Fixed Amount</div>
                                                    <div className="text-sm text-gray-500">Single base sum insured for all</div>
                                                </div>
                                            </label>

                                            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="base_sum_insured_type"
                                                    value="grade_wise"
                                                    checked={data.rating_config.base_sum_insured_type === 'grade_wise'}
                                                    onChange={(e) => setData('rating_config', {
                                                        ...data.rating_config,
                                                        base_sum_insured_type: e.target.value
                                                    })}
                                                    className="text-[#934790] focus:ring-[#934790]"
                                                />
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">Grade Wise</div>
                                                    <div className="text-sm text-gray-500">Different amounts by grade/level</div>
                                                </div>
                                            </label>
                                        </div>
                                        {stepErrors.base_sum_insured_type && (
                                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-red-600 text-sm">{stepErrors.base_sum_insured_type}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Fixed Base Sum Insured */}
                                    {data.rating_config.base_sum_insured_type === 'fixed' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Base Sum Insured (₹)
                                            </label>
                                            <input
                                                type="number"
                                                value={data.rating_config.base_sum_insured}
                                                onChange={(e) => setData('rating_config', {
                                                    ...data.rating_config,
                                                    base_sum_insured: e.target.value
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                placeholder="e.g., 500000"
                                            />
                                            {stepErrors.base_sum_insured && (
                                                <p className="text-red-600 text-sm mt-1">{stepErrors.base_sum_insured}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Grade Wise Sum Insured */}
                                    {data.rating_config.base_sum_insured_type === 'grade_wise' && (
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Grade Wise Sum Insured
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={addGradeWiseSumInsured}
                                                    className="text-sm text-[#934790] hover:text-[#7a3a78] font-medium"
                                                >
                                                    + Add Grade
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                {data.rating_config.grade_wise_sum_insured.map((grade, index) => (
                                                    <div key={grade.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-white rounded border">
                                                        <div>
                                                            <label className="block text-xs text-gray-600 mb-1">Grade/Level Name</label>
                                                            <input
                                                                type="text"
                                                                value={grade.grade_name}
                                                                onChange={(e) => updateGradeWiseSumInsured(index, 'grade_name', e.target.value)}
                                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                placeholder="e.g., Grade A, Manager"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-600 mb-1">Sum Insured (₹)</label>
                                                            <input
                                                                type="number"
                                                                value={grade.sum_insured}
                                                                onChange={(e) => updateGradeWiseSumInsured(index, 'sum_insured', e.target.value)}
                                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                placeholder="e.g., 500000"
                                                            />
                                                        </div>
                                                        <div className="flex items-end">
                                                            {data.rating_config.grade_wise_sum_insured.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeGradeWiseSumInsured(index)}
                                                                    className="px-2 py-1 text-red-600 hover:text-red-800 text-sm"
                                                                >
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {stepErrors.grade_wise_sum_insured && (
                                                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-red-600 text-sm">{stepErrors.grade_wise_sum_insured}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Company Contribution */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center mb-3">
                                        <input
                                            type="checkbox"
                                            id="company_contribution"
                                            checked={data.rating_config.company_contribution}
                                            onChange={(e) => setData('rating_config', {
                                                ...data.rating_config,
                                                company_contribution: e.target.checked
                                            })}
                                            className="rounded border-gray-300 text-[#934790] focus:ring-[#934790] focus:ring-offset-0"
                                        />
                                        <label htmlFor="company_contribution" className="ml-2 text-sm font-medium text-gray-700">
                                            Company Contribution
                                        </label>
                                    </div>

                                    {data.rating_config.company_contribution && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Company Contribution (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={data.rating_config.company_contribution_percentage}
                                                    onChange={(e) => setData('rating_config', {
                                                        ...data.rating_config,
                                                        company_contribution_percentage: e.target.value
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                    placeholder="0-100"
                                                />
                                                {stepErrors.company_contribution_percentage && (
                                                    <p className="text-red-600 text-sm mt-1">{stepErrors.company_contribution_percentage}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Plans Configuration - Hidden for relation_wise, per_life, and floater_highest_age */}
                                {!['relation_wise', 'per_life', 'floater_highest_age'].includes(data.rating_config.plan_type) && (
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-md font-medium text-gray-900">Plan Options</h3>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newPlan = {
                                                    id: Date.now(),
                                                    plan_name: '',
                                                    sum_insured: '',
                                                    premium_amount: '',
                                                    age_brackets: []
                                                };
                                                setData('rating_config', {
                                                    ...data.rating_config,
                                                    plans: [...data.rating_config.plans, newPlan]
                                                });
                                            }}
                                            className="px-4 py-2 bg-[#934790] text-white rounded-lg hover:bg-[#7a3a78] transition-colors"
                                        >
                                            Add Plan
                                        </button>
                                    </div>

                                    {stepErrors.plans && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-red-600 text-sm">{stepErrors.plans}</p>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {data.rating_config.plans.map((plan, index) => (
                                            <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        {plan.plan_name ? `${plan.plan_name}` : `Plan ${index + 1}`}
                                                    </h4>
                                                    {data.rating_config.plans.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updatedPlans = data.rating_config.plans.filter((_, i) => i !== index);
                                                                setData('rating_config', {
                                                                    ...data.rating_config,
                                                                    plans: updatedPlans
                                                                });
                                                            }}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Plan Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={plan.plan_name}
                                                            onChange={(e) => {
                                                                const updatedPlans = [...data.rating_config.plans];
                                                                updatedPlans[index].plan_name = e.target.value;
                                                                setData('rating_config', {
                                                                    ...data.rating_config,
                                                                    plans: updatedPlans
                                                                });
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                            placeholder="e.g., Gold Plan, Basic Plan"
                                                        />
                                                        {stepErrors[`plan_${index}_name`] && (
                                                            <p className="text-red-600 text-sm mt-1">{stepErrors[`plan_${index}_name`]}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Sum Insured (₹)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={plan.sum_insured}
                                                            onChange={(e) => {
                                                                const updatedPlans = [...data.rating_config.plans];
                                                                updatedPlans[index].sum_insured = e.target.value;
                                                                setData('rating_config', {
                                                                    ...data.rating_config,
                                                                    plans: updatedPlans
                                                                });
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                            placeholder="e.g., 500000"
                                                        />
                                                        {stepErrors[`plan_${index}_sum_insured`] && (
                                                            <p className="text-red-600 text-sm mt-1">{stepErrors[`plan_${index}_sum_insured`]}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Base Premium (₹)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={plan.premium_amount}
                                                            onChange={(e) => {
                                                                const updatedPlans = [...data.rating_config.plans];
                                                                updatedPlans[index].premium_amount = e.target.value;
                                                                setData('rating_config', {
                                                                    ...data.rating_config,
                                                                    plans: updatedPlans
                                                                });
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                            placeholder="e.g., 1200.00"
                                                        />
                                                        {stepErrors[`plan_${index}_premium`] && (
                                                            <p className="text-red-600 text-sm mt-1">{stepErrors[`plan_${index}_premium`]}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Age-based configuration */}
                                                {data.rating_config.plan_type === 'age_based' && (
                                                    <div className="mt-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <label className="text-sm font-medium text-gray-700">
                                                                Age-Based Premium Brackets
                                                            </label>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const updatedPlans = [...data.rating_config.plans];
                                                                    if (!updatedPlans[index].age_brackets) {
                                                                        updatedPlans[index].age_brackets = [];
                                                                    }
                                                                    updatedPlans[index].age_brackets.push({
                                                                        id: Date.now(),
                                                                        min_age: '',
                                                                        max_age: '',
                                                                        premium_amount: ''
                                                                    });
                                                                    setData('rating_config', {
                                                                        ...data.rating_config,
                                                                        plans: updatedPlans
                                                                    });
                                                                }}
                                                                className="text-sm text-[#934790] hover:text-[#7a3a78]"
                                                            >
                                                                Add Age Bracket
                                                            </button>
                                                        </div>

                                                        {plan.age_brackets?.map((bracket, bracketIndex) => (
                                                            <div key={bracket.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-gray-50 rounded">
                                                                <div>
                                                                    <label className="block text-xs text-gray-600 mb-1">Min Age</label>
                                                                    <input
                                                                        type="number"
                                                                        placeholder="18"
                                                                        value={bracket.min_age}
                                                                        onChange={(e) => {
                                                                            const updatedPlans = [...data.rating_config.plans];
                                                                            updatedPlans[index].age_brackets[bracketIndex].min_age = e.target.value;
                                                                            setData('rating_config', {
                                                                                ...data.rating_config,
                                                                                plans: updatedPlans
                                                                            });
                                                                        }}
                                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs text-gray-600 mb-1">Max Age</label>
                                                                    <input
                                                                        type="number"
                                                                        placeholder="30"
                                                                        value={bracket.max_age}
                                                                        onChange={(e) => {
                                                                            const updatedPlans = [...data.rating_config.plans];
                                                                            updatedPlans[index].age_brackets[bracketIndex].max_age = e.target.value;
                                                                            setData('rating_config', {
                                                                                ...data.rating_config,
                                                                                plans: updatedPlans
                                                                            });
                                                                        }}
                                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs text-gray-600 mb-1">Premium (₹)</label>
                                                                    <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        placeholder="1200.00"
                                                                        value={bracket.premium_amount}
                                                                        onChange={(e) => {
                                                                            const updatedPlans = [...data.rating_config.plans];
                                                                            updatedPlans[index].age_brackets[bracketIndex].premium_amount = e.target.value;
                                                                            setData('rating_config', {
                                                                                ...data.rating_config,
                                                                                plans: updatedPlans
                                                                            });
                                                                        }}
                                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                    />
                                                                </div>
                                                                <div className="flex items-end">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const updatedPlans = [...data.rating_config.plans];
                                                                            updatedPlans[index].age_brackets = updatedPlans[index].age_brackets.filter((_, bi) => bi !== bracketIndex);
                                                                            setData('rating_config', {
                                                                                ...data.rating_config,
                                                                                plans: updatedPlans
                                                                            });
                                                                        }}
                                                                        className="px-2 py-1 text-red-600 hover:text-red-800 text-sm"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {(!plan.age_brackets || plan.age_brackets.length === 0) && (
                                                            <p className="text-sm text-gray-500 italic">No age brackets configured. Base premium will apply to all ages.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                )}

                                {/* Per Life Configuration */}
                                {data.rating_config.plan_type === 'per_life' && (
                                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Per Life Pricing Configuration</h3>
                                            <p className="text-sm text-gray-600">Configure multiple sum insured options with per-life pricing. Total premium = Premium per person × Number of members covered.</p>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-md font-medium text-gray-900">Per Life Plan Options</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newPlans = [...data.rating_config.plans];
                                                        const newId = Math.max(...newPlans.map(p => p.id)) + 1;
                                                        newPlans.push({
                                                            id: newId,
                                                            plan_name: '',
                                                            sum_insured: '',
                                                            premium_amount: '',
                                                            age_brackets: []
                                                        });
                                                        setData('rating_config', {
                                                            ...data.rating_config,
                                                            plans: newPlans
                                                        });
                                                    }}
                                                    className="px-4 py-2 bg-[#934790] text-white rounded-lg hover:bg-[#7a3a78] transition-colors text-sm"
                                                >
                                                    Add Plan Option
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                {data.rating_config.plans.map((plan, index) => (
                                                    <div key={plan.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h5 className="text-sm font-medium text-gray-900">
                                                                {plan.plan_name ? `${plan.plan_name}` : `Plan Option ${index + 1}`}
                                                            </h5>
                                                            {data.rating_config.plans.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newPlans = data.rating_config.plans.filter(p => p.id !== plan.id);
                                                                        setData('rating_config', {
                                                                            ...data.rating_config,
                                                                            plans: newPlans
                                                                        });
                                                                    }}
                                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                                >
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Plan Name *
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={plan.plan_name}
                                                                    onChange={(e) => {
                                                                        const newPlans = [...data.rating_config.plans];
                                                                        newPlans[index].plan_name = e.target.value;
                                                                        setData('rating_config', {
                                                                            ...data.rating_config,
                                                                            plans: newPlans
                                                                        });
                                                                    }}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                                    placeholder="e.g., Basic, Premium, Gold"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Sum Insured per Life (₹)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    value={plan.sum_insured}
                                                                    onChange={(e) => {
                                                                        const newPlans = [...data.rating_config.plans];
                                                                        newPlans[index].sum_insured = e.target.value;
                                                                        setData('rating_config', {
                                                                            ...data.rating_config,
                                                                            plans: newPlans
                                                                        });
                                                                    }}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                                    placeholder="e.g., 20000"
                                                                />
                                                                <p className="text-xs text-gray-500 mt-1">Per individual member</p>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Premium per Life (₹)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={plan.premium_amount}
                                                                    onChange={(e) => {
                                                                        const newPlans = [...data.rating_config.plans];
                                                                        newPlans[index].premium_amount = e.target.value;
                                                                        setData('rating_config', {
                                                                            ...data.rating_config,
                                                                            plans: newPlans
                                                                        });
                                                                    }}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                                    placeholder="e.g., 1000"
                                                                />
                                                                <p className="text-xs text-gray-500 mt-1">Per individual member</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <h4 className="text-sm font-medium text-blue-800">Example Calculation:</h4>
                                                    <p className="text-sm text-blue-700 mt-1">
                                                        If employee selects ₹20,000 sum insured with ₹1,000 premium per life:<br />
                                                        • 1 Member: ₹1,000 total premium<br />
                                                        • 2 Members: ₹2,000 total premium<br />
                                                        • 3 Members: ₹3,000 total premium<br />
                                                        <strong>Employee can choose from multiple plan options you configure.</strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Floater Highest Age Configuration */}
                                {data.rating_config.plan_type === 'floater_highest_age' && (
                                    <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Floater (Highest Age) Configuration</h3>
                                            <p className="text-sm text-gray-600">Configure multiple family sum insured options with age-based premium brackets. Premium will be determined by the oldest family member's age.</p>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-md font-medium text-gray-900">Floater Plan Options</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newPlans = [...data.rating_config.plans];
                                                        const newId = Math.max(...newPlans.map(p => p.id)) + 1;
                                                        newPlans.push({
                                                            id: newId,
                                                            plan_name: '',
                                                            sum_insured: '',
                                                            premium_amount: '',
                                                            age_brackets: []
                                                        });
                                                        setData('rating_config', {
                                                            ...data.rating_config,
                                                            plans: newPlans
                                                        });
                                                    }}
                                                    className="px-4 py-2 bg-[#934790] text-white rounded-lg hover:bg-[#7a3a78] transition-colors text-sm"
                                                >
                                                    Add Plan Option
                                                </button>
                                            </div>

                                            <div className="space-y-6">
                                                {data.rating_config.plans.map((plan, index) => (
                                                    <div key={plan.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h5 className="text-sm font-medium text-gray-900">
                                                                {plan.plan_name ? `${plan.plan_name}` : `Plan Option ${index + 1}`}
                                                            </h5>
                                                            {data.rating_config.plans.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newPlans = data.rating_config.plans.filter(p => p.id !== plan.id);
                                                                        setData('rating_config', {
                                                                            ...data.rating_config,
                                                                            plans: newPlans
                                                                        });
                                                                    }}
                                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                                >
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Plan Name *
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={plan.plan_name}
                                                                    onChange={(e) => {
                                                                        const newPlans = [...data.rating_config.plans];
                                                                        newPlans[index].plan_name = e.target.value;
                                                                        setData('rating_config', {
                                                                            ...data.rating_config,
                                                                            plans: newPlans
                                                                        });
                                                                    }}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                                    placeholder="e.g., Basic Family, Premium Family"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Total Family Sum Insured (₹)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    value={plan.sum_insured}
                                                                    onChange={(e) => {
                                                                        const newPlans = [...data.rating_config.plans];
                                                                        newPlans[index].sum_insured = e.target.value;
                                                                        setData('rating_config', {
                                                                            ...data.rating_config,
                                                                            plans: newPlans
                                                                        });
                                                                    }}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                                    placeholder="e.g., 500000"
                                                                />
                                                                <p className="text-xs text-gray-500 mt-1">Total sum insured for entire family</p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div className="flex items-center justify-between mb-3">
                                                                <label className="text-sm font-medium text-gray-700">
                                                                    Age-Based Premium Brackets
                                                                </label>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newPlans = [...data.rating_config.plans];
                                                                        if (!newPlans[index].age_brackets) {
                                                                            newPlans[index].age_brackets = [];
                                                                        }
                                                                        newPlans[index].age_brackets.push({
                                                                            id: Date.now(),
                                                                            min_age: '',
                                                                            max_age: '',
                                                                            premium_amount: ''
                                                                        });
                                                                        setData('rating_config', {
                                                                            ...data.rating_config,
                                                                            plans: newPlans
                                                                        });
                                                                    }}
                                                                    className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                                                >
                                                                    Add Age Bracket
                                                                </button>
                                                            </div>

                                                            <div className="space-y-2">
                                                                {plan.age_brackets?.map((bracket, bracketIndex) => (
                                                                    <div key={bracket.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded border">
                                                                        <div>
                                                                            <label className="block text-xs text-gray-600 mb-1">Min Age</label>
                                                                            <input
                                                                                type="number"
                                                                                placeholder="18"
                                                                                value={bracket.min_age}
                                                                                onChange={(e) => {
                                                                                    const newPlans = [...data.rating_config.plans];
                                                                                    newPlans[index].age_brackets[bracketIndex].min_age = e.target.value;
                                                                                    setData('rating_config', {
                                                                                        ...data.rating_config,
                                                                                        plans: newPlans
                                                                                    });
                                                                                }}
                                                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-xs text-gray-600 mb-1">Max Age</label>
                                                                            <input
                                                                                type="number"
                                                                                placeholder="30"
                                                                                value={bracket.max_age}
                                                                                onChange={(e) => {
                                                                                    const newPlans = [...data.rating_config.plans];
                                                                                    newPlans[index].age_brackets[bracketIndex].max_age = e.target.value;
                                                                                    setData('rating_config', {
                                                                                        ...data.rating_config,
                                                                                        plans: newPlans
                                                                                    });
                                                                                }}
                                                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-xs text-gray-600 mb-1">Family Premium (₹)</label>
                                                                            <input
                                                                                type="number"
                                                                                step="0.01"
                                                                                placeholder="5000.00"
                                                                                value={bracket.premium_amount}
                                                                                onChange={(e) => {
                                                                                    const newPlans = [...data.rating_config.plans];
                                                                                    newPlans[index].age_brackets[bracketIndex].premium_amount = e.target.value;
                                                                                    setData('rating_config', {
                                                                                        ...data.rating_config,
                                                                                        plans: newPlans
                                                                                    });
                                                                                }}
                                                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                            />
                                                                        </div>
                                                                        <div className="flex items-end">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const newPlans = [...data.rating_config.plans];
                                                                                    newPlans[index].age_brackets = newPlans[index].age_brackets.filter((_, bi) => bi !== bracketIndex);
                                                                                    setData('rating_config', {
                                                                                        ...data.rating_config,
                                                                                        plans: newPlans
                                                                                    });
                                                                                }}
                                                                                className="px-2 py-1 text-red-600 hover:text-red-800 text-sm"
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {(!plan.age_brackets || plan.age_brackets.length === 0) && (
                                                                    <p className="text-sm text-gray-500 italic text-center py-2">No age brackets configured for this plan.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-green-100 rounded-lg">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <h4 className="text-sm font-medium text-green-800">How It Works:</h4>
                                                    <p className="text-sm text-green-700 mt-1">
                                                        • Employee selects from multiple family sum insured options<br />
                                                        • System identifies the oldest family member<br />
                                                        • Premium is charged based on that member's age bracket<br />
                                                        • All family members share the selected sum insured amount<br />
                                                        • Only one premium payment for the entire family
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Relation Wise Configuration */}
                                {data.rating_config.plan_type === 'relation_wise' && (
                                    <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Relation-Based Pricing Configuration</h3>
                                            <p className="text-sm text-gray-600">Configure multiple sum insured options with different premium amounts and age brackets for each family relation type. Only enabled family members will be shown.</p>
                                        </div>

                                        <div className="space-y-8">
                                            {Object.keys(FamilyIcons).map((relation) => {
                                                // Only show relations that are enabled in family definition
                                                if (data.family_defination[relation] !== "1") return null;

                                                const relationConfig = data.rating_config.relation_wise_config[relation];
                                                const relationLabel = relation.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                                                return (
                                                    <div key={relation} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                                                        <div className="flex items-center justify-between mb-6">
                                                            <div className="flex items-center">
                                                                <div className="mr-4">
                                                                    {FamilyIcons[relation]}
                                                                </div>
                                                                <h4 className="text-lg font-semibold text-gray-800">{relationLabel}</h4>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => addRelationSumInsuredOption(relation)}
                                                                className="px-4 py-2 text-sm bg-[#934790] text-white rounded-lg hover:bg-[#7a3a78] transition-colors"
                                                            >
                                                                + Add Sum Insured Option
                                                            </button>
                                                        </div>

                                                        <div className="space-y-6">
                                                            {relationConfig.sum_insured_options?.map((option, optionIndex) => (
                                                                <div key={option.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <h5 className="text-md font-medium text-gray-700">
                                                                            Sum Insured Option {optionIndex + 1}
                                                                        </h5>
                                                                        {relationConfig.sum_insured_options.length > 1 && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeRelationSumInsuredOption(relation, optionIndex)}
                                                                                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                                                            >
                                                                                Remove Option
                                                                            </button>
                                                                        )}
                                                                    </div>

                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                Sum Insured (₹)
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                value={option.sum_insured}
                                                                                onChange={(e) => updateRelationSumInsuredOption(relation, optionIndex, 'sum_insured', e.target.value)}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                                                placeholder="e.g., 500000"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                Base Premium (₹)
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                step="0.01"
                                                                                value={option.premium_amount}
                                                                                onChange={(e) => updateRelationSumInsuredOption(relation, optionIndex, 'premium_amount', e.target.value)}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                                                placeholder="e.g., 1200.00"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Age Brackets for this sum insured option */}
                                                                    <div className="mt-4">
                                                                        <div className="flex items-center justify-between mb-3">
                                                                            <label className="text-sm font-medium text-gray-700">
                                                                                Age-Based Premium Adjustments
                                                                            </label>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => addRelationOptionAgeBracket(relation, optionIndex)}
                                                                                className="text-sm text-[#934790] hover:text-[#7a3a78] font-medium"
                                                                            >
                                                                                + Add Age Bracket
                                                                            </button>
                                                                        </div>

                                                                        {option.age_brackets?.length > 0 && (
                                                                            <div className="space-y-2">
                                                                                <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-600 px-3">
                                                                                    <div>Min Age</div>
                                                                                    <div>Max Age</div>
                                                                                    <div>Premium (₹)</div>
                                                                                    <div>Action</div>
                                                                                </div>
                                                                                {option.age_brackets.map((bracket, bracketIndex) => (
                                                                                    <div key={bracket.id} className="grid grid-cols-4 gap-2 p-3 bg-white rounded border">
                                                                                        <div>
                                                                                            <input
                                                                                                type="number"
                                                                                                placeholder="Min Age"
                                                                                                value={bracket.min_age}
                                                                                                onChange={(e) => updateRelationOptionAgeBracket(relation, optionIndex, bracketIndex, 'min_age', e.target.value)}
                                                                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                                            />
                                                                                        </div>
                                                                                        <div>
                                                                                            <input
                                                                                                type="number"
                                                                                                placeholder="Max Age"
                                                                                                value={bracket.max_age}
                                                                                                onChange={(e) => updateRelationOptionAgeBracket(relation, optionIndex, bracketIndex, 'max_age', e.target.value)}
                                                                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                                            />
                                                                                        </div>
                                                                                        <div>
                                                                                            <input
                                                                                                type="number"
                                                                                                step="0.01"
                                                                                                placeholder="Premium"
                                                                                                value={bracket.premium_amount}
                                                                                                onChange={(e) => updateRelationOptionAgeBracket(relation, optionIndex, bracketIndex, 'premium_amount', e.target.value)}
                                                                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                                            />
                                                                                        </div>
                                                                                        <div className="flex items-center justify-center">
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => removeRelationOptionAgeBracket(relation, optionIndex, bracketIndex)}
                                                                                                className="px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded text-sm"
                                                                                            >
                                                                                                ✕
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}

                                                                        {(!option.age_brackets || option.age_brackets.length === 0) && (
                                                                            <p className="text-sm text-gray-500 italic bg-white p-3 rounded border">No age brackets configured. Base premium will apply to all ages.</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {(!relationConfig.sum_insured_options || relationConfig.sum_insured_options.length === 0) && (
                                                                <div className="text-center py-6 border border-gray-200 rounded-lg bg-gray-50">
                                                                    <p className="text-gray-500 mb-3">No sum insured options configured for {relationLabel}.</p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addRelationSumInsuredOption(relation)}
                                                                        className="px-4 py-2 text-sm bg-[#934790] text-white rounded-lg hover:bg-[#7a3a78] transition-colors"
                                                                    >
                                                                        Add First Option
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {Object.keys(FamilyIcons).filter(relation => data.family_defination[relation] === "1").length === 0 && (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">No family members enabled. Please go back to Step 2 to enable family members.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 4: Extra Coverage Plans */}
                        {step === 4 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Extra Coverage Plans</h2>

                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm text-gray-600">Configure multiple extra coverage plans with customizable options like Co-Pay, Maternity, and Room Rent.</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newPlans = [...data.extra_coverage_plans];
                                                const newId = newPlans.length > 0 ? Math.max(...newPlans.map(p => p.id)) + 1 : 1;
                                                newPlans.push({
                                                    id: newId,
                                                    plan_name: '',
                                                    premium_amount: '',
                                                    extra_coverages: {
                                                        co_pay: {
                                                            enabled: false,
                                                            name: 'Co-Pay',
                                                            amount: ''
                                                        },
                                                        maternity: {
                                                            enabled: false,
                                                            name: 'Maternity',
                                                            amount: ''
                                                        },
                                                        room_rent: {
                                                            enabled: false,
                                                            name: 'Room Rent',
                                                            amount: ''
                                                        }
                                                    }
                                                });
                                                setData('extra_coverage_plans', newPlans);
                                            }}
                                            className="px-4 py-2 bg-[#934790] text-white rounded-lg hover:bg-[#7a3a78] transition-colors text-sm"
                                        >
                                            Add Extra Coverage Plan
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {data.extra_coverage_plans.length === 0 ? (
                                            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                                <p className="text-gray-500 mb-2">No extra coverage plans added</p>
                                                <p className="text-sm text-gray-400">Extra coverage is optional. You can skip this step or add plans as needed.</p>
                                            </div>
                                        ) : (
                                            data.extra_coverage_plans.map((plan, planIndex) => (
                                            <div key={plan.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {plan.plan_name ? `${plan.plan_name}` : `Extra Coverage Plan ${planIndex + 1}`}
                                                    </h3>
                                                    {data.extra_coverage_plans.length > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newPlans = data.extra_coverage_plans.filter(p => p.id !== plan.id);
                                                                setData('extra_coverage_plans', newPlans);
                                                            }}
                                                            className="text-red-600 hover:text-red-800 text-sm"
                                                        >
                                                            Remove Plan
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Plan Basic Info */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Plan Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={plan.plan_name}
                                                            onChange={(e) => {
                                                                const newPlans = [...data.extra_coverage_plans];
                                                                newPlans[planIndex].plan_name = e.target.value;
                                                                setData('extra_coverage_plans', newPlans);
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                            placeholder="e.g., Basic Extra Cover, Premium Extra Cover"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Base Premium Amount (₹)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={plan.premium_amount}
                                                            onChange={(e) => {
                                                                const newPlans = [...data.extra_coverage_plans];
                                                                newPlans[planIndex].premium_amount = e.target.value;
                                                                setData('extra_coverage_plans', newPlans);
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                            placeholder="e.g., 500.00"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Extra Coverage Options */}
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <h4 className="text-md font-medium text-gray-900 mb-4">Extra Coverage Options</h4>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        {/* Co-Pay Coverage */}
                                                        <div className="border border-gray-200 rounded-lg p-4">
                                                            <div className="flex items-center mb-3">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`co_pay_${plan.id}`}
                                                                    checked={plan.extra_coverages.co_pay.enabled}
                                                                    onChange={(e) => {
                                                                        const newPlans = [...data.extra_coverage_plans];
                                                                        newPlans[planIndex].extra_coverages.co_pay.enabled = e.target.checked;
                                                                        setData('extra_coverage_plans', newPlans);
                                                                    }}
                                                                    className="rounded border-gray-300 text-[#934790] focus:ring-[#934790] focus:ring-offset-0"
                                                                />
                                                                <label htmlFor={`co_pay_${plan.id}`} className="ml-2 text-sm font-medium text-gray-700">
                                                                    Co-Pay
                                                                </label>
                                                            </div>

                                                            {plan.extra_coverages.co_pay.enabled && (
                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                            Coverage Name
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={plan.extra_coverages.co_pay.name}
                                                                            onChange={(e) => {
                                                                                const newPlans = [...data.extra_coverage_plans];
                                                                                newPlans[planIndex].extra_coverages.co_pay.name = e.target.value;
                                                                                setData('extra_coverage_plans', newPlans);
                                                                            }}
                                                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                            placeholder="Co-Pay"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                            Amount (₹)
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            step="0.01"
                                                                            value={plan.extra_coverages.co_pay.amount}
                                                                            onChange={(e) => {
                                                                                const newPlans = [...data.extra_coverage_plans];
                                                                                newPlans[planIndex].extra_coverages.co_pay.amount = e.target.value;
                                                                                setData('extra_coverage_plans', newPlans);
                                                                            }}
                                                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                            placeholder="e.g., 500"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Maternity Coverage */}
                                                        <div className="border border-gray-200 rounded-lg p-4">
                                                            <div className="flex items-center mb-3">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`maternity_${plan.id}`}
                                                                    checked={plan.extra_coverages.maternity.enabled}
                                                                    onChange={(e) => {
                                                                        const newPlans = [...data.extra_coverage_plans];
                                                                        newPlans[planIndex].extra_coverages.maternity.enabled = e.target.checked;
                                                                        setData('extra_coverage_plans', newPlans);
                                                                    }}
                                                                    className="rounded border-gray-300 text-[#934790] focus:ring-[#934790] focus:ring-offset-0"
                                                                />
                                                                <label htmlFor={`maternity_${plan.id}`} className="ml-2 text-sm font-medium text-gray-700">
                                                                    Maternity
                                                                </label>
                                                            </div>

                                                            {plan.extra_coverages.maternity.enabled && (
                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                            Coverage Name
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={plan.extra_coverages.maternity.name}
                                                                            onChange={(e) => {
                                                                                const newPlans = [...data.extra_coverage_plans];
                                                                                newPlans[planIndex].extra_coverages.maternity.name = e.target.value;
                                                                                setData('extra_coverage_plans', newPlans);
                                                                            }}
                                                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                            placeholder="Maternity"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                            Coverage Amount (₹)
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            step="0.01"
                                                                            value={plan.extra_coverages.maternity.amount}
                                                                            onChange={(e) => {
                                                                                const newPlans = [...data.extra_coverage_plans];
                                                                                newPlans[planIndex].extra_coverages.maternity.amount = e.target.value;
                                                                                setData('extra_coverage_plans', newPlans);
                                                                            }}
                                                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                            placeholder="e.g., 50000"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Room Rent Coverage */}
                                                        <div className="border border-gray-200 rounded-lg p-4">
                                                            <div className="flex items-center mb-3">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`room_rent_${plan.id}`}
                                                                    checked={plan.extra_coverages.room_rent.enabled}
                                                                    onChange={(e) => {
                                                                        const newPlans = [...data.extra_coverage_plans];
                                                                        newPlans[planIndex].extra_coverages.room_rent.enabled = e.target.checked;
                                                                        setData('extra_coverage_plans', newPlans);
                                                                    }}
                                                                    className="rounded border-gray-300 text-[#934790] focus:ring-[#934790] focus:ring-offset-0"
                                                                />
                                                                <label htmlFor={`room_rent_${plan.id}`} className="ml-2 text-sm font-medium text-gray-700">
                                                                    Room Rent
                                                                </label>
                                                            </div>

                                                            {plan.extra_coverages.room_rent.enabled && (
                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                            Coverage Name
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={plan.extra_coverages.room_rent.name}
                                                                            onChange={(e) => {
                                                                                const newPlans = [...data.extra_coverage_plans];
                                                                                newPlans[planIndex].extra_coverages.room_rent.name = e.target.value;
                                                                                setData('extra_coverage_plans', newPlans);
                                                                            }}
                                                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                            placeholder="Room Rent"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                            Daily Limit (₹)
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            step="0.01"
                                                                            value={plan.extra_coverages.room_rent.amount}
                                                                            onChange={(e) => {
                                                                                const newPlans = [...data.extra_coverage_plans];
                                                                                newPlans[planIndex].extra_coverages.room_rent.amount = e.target.value;
                                                                                setData('extra_coverage_plans', newPlans);
                                                                            }}
                                                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790]"
                                                                            placeholder="e.g., 2000"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        )}
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="status"
                                            checked={data.status}
                                            onChange={(e) => setData('status', e.target.checked)}
                                            className="rounded border-gray-300 text-[#934790] focus:ring-[#934790] focus:ring-offset-0"
                                        />
                                        <label htmlFor="status" className="ml-2 text-sm font-medium text-gray-700">
                                            Active Enrollment
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 ml-6">
                                        Check to make this enrollment active immediately
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Mail Configuration */}
                        {step === 5 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Mail Configuration</h2>
                                <p className="text-sm text-gray-600 mb-6">Configure email templates for enrollment notifications and reminders.</p>

                                <div className="space-y-8">
                                    {/* Enrollment Mail Template */}
                                    <div className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-medium text-gray-900">Enrollment Notification Mail</h3>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="enrollment_mail_enabled"
                                                    checked={data.mail_configuration.enrollment_mail.enabled}
                                                    onChange={(e) => setData('mail_configuration', {
                                                        ...data.mail_configuration,
                                                        enrollment_mail: {
                                                            ...data.mail_configuration.enrollment_mail,
                                                            enabled: e.target.checked
                                                        }
                                                    })}
                                                    className="rounded border-gray-300 text-[#934790] focus:ring-[#934790] focus:ring-offset-0 mr-2"
                                                />
                                                <label htmlFor="enrollment_mail_enabled" className="text-sm font-medium text-gray-700">
                                                    Enable Enrollment Email
                                                </label>
                                            </div>
                                        </div>

                                        {data.mail_configuration.enrollment_mail.enabled && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Select Email Template *
                                                </label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {messageTemplates && messageTemplates.filter(template => template.status).map((template) => (
                                                        <div
                                                            key={template.id}
                                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                                                data.mail_configuration.enrollment_mail.template_id == template.id
                                                                    ? 'border-[#934790] bg-purple-50'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                            onClick={() => setData('mail_configuration', {
                                                                ...data.mail_configuration,
                                                                enrollment_mail: {
                                                                    ...data.mail_configuration.enrollment_mail,
                                                                    template_id: template.id
                                                                }
                                                            })}
                                                        >
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="text-sm font-medium text-gray-900 truncate">{template.name}</h4>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setPreviewTemplate(template);
                                                                        setShowPreviewModal(true);
                                                                    }}
                                                                    className="text-xs text-[#934790] hover:text-[#7a3a78] font-medium"
                                                                >
                                                                    Preview
                                                                </button>
                                                            </div>
                                                            <p className="text-xs text-gray-600 mb-2">{template.subject}</p>
                                                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                                {template.category}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                {(!messageTemplates || messageTemplates.filter(template => template.status).length === 0) && (
                                                    <p className="text-gray-500 text-sm italic">No active email templates available. Please create templates first.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Reminder Mail Template */}
                                    <div className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-medium text-gray-900">Reminder Mail</h3>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="reminder_mail_enabled"
                                                    checked={data.mail_configuration.reminder_mail.enabled}
                                                    onChange={(e) => setData('mail_configuration', {
                                                        ...data.mail_configuration,
                                                        reminder_mail: {
                                                            ...data.mail_configuration.reminder_mail,
                                                            enabled: e.target.checked
                                                        }
                                                    })}
                                                    className="rounded border-gray-300 text-[#934790] focus:ring-[#934790] focus:ring-offset-0 mr-2"
                                                />
                                                <label htmlFor="reminder_mail_enabled" className="text-sm font-medium text-gray-700">
                                                    Enable Reminder Email
                                                </label>
                                            </div>
                                        </div>

                                        {data.mail_configuration.reminder_mail.enabled && (
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                                        Select Reminder Email Template *
                                                    </label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {messageTemplates && messageTemplates.filter(template => template.status).map((template) => (
                                                            <div
                                                                key={template.id}
                                                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                                                    data.mail_configuration.reminder_mail.template_id == template.id
                                                                        ? 'border-[#934790] bg-purple-50'
                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                                onClick={() => setData('mail_configuration', {
                                                                    ...data.mail_configuration,
                                                                    reminder_mail: {
                                                                        ...data.mail_configuration.reminder_mail,
                                                                        template_id: template.id
                                                                    }
                                                                })}
                                                            >
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h4 className="text-sm font-medium text-gray-900 truncate">{template.name}</h4>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setPreviewTemplate(template);
                                                                            setShowPreviewModal(true);
                                                                        }}
                                                                        className="text-xs text-[#934790] hover:text-[#7a3a78] font-medium"
                                                                    >
                                                                        Preview
                                                                    </button>
                                                                </div>
                                                                <p className="text-xs text-gray-600 mb-2">{template.subject}</p>
                                                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                                    {template.category}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Reminder Frequency */}
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <h4 className="text-md font-medium text-gray-900 mb-4">Reminder Frequency</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Frequency Type
                                                            </label>
                                                            <select
                                                                value={data.mail_configuration.reminder_mail.frequency}
                                                                onChange={(e) => setData('mail_configuration', {
                                                                    ...data.mail_configuration,
                                                                    reminder_mail: {
                                                                        ...data.mail_configuration.reminder_mail,
                                                                        frequency: e.target.value
                                                                    }
                                                                })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                            >
                                                                <option value="daily">Daily</option>
                                                                <option value="weekly">Weekly</option>
                                                                <option value="monthly">Monthly</option>
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Every
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                max="30"
                                                                value={data.mail_configuration.reminder_mail.frequency_value}
                                                                onChange={(e) => setData('mail_configuration', {
                                                                    ...data.mail_configuration,
                                                                    reminder_mail: {
                                                                        ...data.mail_configuration.reminder_mail,
                                                                        frequency_value: parseInt(e.target.value) || 1
                                                                    }
                                                                })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                            />
                                                        </div>

                                                        <div className="flex items-end">
                                                            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                                                                <strong>Summary:</strong> Send reminder every {data.mail_configuration.reminder_mail.frequency_value} {data.mail_configuration.reminder_mail.frequency === 'daily' ? 'day(s)' : data.mail_configuration.reminder_mail.frequency === 'weekly' ? 'week(s)' : 'month(s)'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 6: Additional Settings */}
                        {step === 6 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Additional Settings</h2>

                                {/* Twin Allowance Section */}
                                <div className="mb-6">
                                    <div className="border border-gray-200 rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Twin Policy Settings</h3>

                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <label htmlFor="twin_allowed" className="text-sm font-medium text-gray-700">
                                                    Allow Twins
                                                </label>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Enable this to allow +1 additional child as per family definition
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="twin_allowed"
                                                    checked={data.twin_allowed}
                                                    onChange={(e) => setData('twin_allowed', e.target.checked)}
                                                    className="rounded border-gray-300 text-[#934790] focus:ring-[#934790] focus:ring-offset-0 mr-2"
                                                />
                                                <label htmlFor="twin_allowed" className="text-sm font-medium text-gray-700">
                                                    {data.twin_allowed ? 'Enabled' : 'Disabled'}
                                                </label>
                                            </div>
                                        </div>

                                        {data.twin_allowed && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h4 className="text-sm font-medium text-blue-800">Twin Policy Active</h4>
                                                        <div className="mt-2 text-sm text-blue-700">
                                                            <p>When twins are allowed, families can add one additional child beyond their family definition limits.</p>
                                                            <p className="mt-1"><strong>Example:</strong> If family definition allows 2 children, twin policy allows up to 3 children total.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Self Allowed by Default Section */}
                                <div className="mb-6">
                                    <div className="border border-gray-200 rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Self Enrollment Settings</h3>

                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <label htmlFor="is_self_allowed_by_default" className="text-sm font-medium text-gray-700">
                                                    Self Allowed by Default
                                                </label>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Enable this to automatically include self in enrollment options
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="is_self_allowed_by_default"
                                                    checked={data.is_self_allowed_by_default}
                                                    onChange={(e) => setData('is_self_allowed_by_default', e.target.checked)}
                                                    className="rounded border-gray-300 text-[#934790] focus:ring-[#934790] focus:ring-offset-0 mr-2"
                                                />
                                                <label htmlFor="is_self_allowed_by_default" className="text-sm font-medium text-gray-700">
                                                    {data.is_self_allowed_by_default ? 'Enabled' : 'Disabled'}
                                                </label>
                                            </div>
                                        </div>

                                        {data.is_self_allowed_by_default && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h4 className="text-sm font-medium text-green-800">Self Enrollment Active</h4>
                                                        <p className="mt-2 text-sm text-green-700">
                                                            Self enrollment will be enabled by default for all employees during enrollment process.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Grade Exclude Section */}
                                <div className="mb-6">
                                    <div className="border border-gray-200 rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Grade Exclusion Settings</h3>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Exclude Grades
                                            </label>
                                            <p className="text-sm text-gray-500 mb-3">
                                                Enter grades that should be excluded from this enrollment. You can add multiple grades.
                                            </p>

                                            <div className="flex gap-2 mb-3">
                                                <input
                                                    type="text"
                                                    placeholder="Enter grade to exclude (e.g., A1, B2, Manager)"
                                                    value={gradeInputValue || ''}
                                                    onChange={(e) => setGradeInputValue(e.target.value)}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const trimmedValue = gradeInputValue?.trim();
                                                            const currentGrades = data.grade_exclude || [];
                                                            if (trimmedValue && !currentGrades.includes(trimmedValue)) {
                                                                setData('grade_exclude', [...currentGrades, trimmedValue]);
                                                                setGradeInputValue('');
                                                            }
                                                        }
                                                    }}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const trimmedValue = gradeInputValue?.trim();
                                                        const currentGrades = data.grade_exclude || [];
                                                        if (trimmedValue && !currentGrades.includes(trimmedValue)) {
                                                            setData('grade_exclude', [...currentGrades, trimmedValue]);
                                                            setGradeInputValue('');
                                                        }
                                                    }}
                                                    className="px-4 py-2 bg-[#934790] text-white rounded-lg hover:bg-[#7a3a78] transition-colors text-sm"
                                                >
                                                    Add Grade
                                                </button>
                                            </div>

                                            {(data.grade_exclude || []).length > 0 && (
                                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Excluded Grades:</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(data.grade_exclude || []).map((grade, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-red-100 text-red-800"
                                                            >
                                                                {grade}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newGrades = (data.grade_exclude || []).filter((_, i) => i !== index);
                                                                        setData('grade_exclude', newGrades);
                                                                    }}
                                                                    className="ml-1 inline-flex items-center p-0.5 rounded-full text-red-400 hover:text-red-600"
                                                                >
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        These grades will be excluded from the enrollment process.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Enrollment Statements Section */}
                                <div className="mb-6">
                                    <div className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-medium text-gray-900">Enrollment Statements</h3>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newStatements = [...(data.enrollment_statements || [])];
                                                    const newId = newStatements.length > 0 ? Math.max(...newStatements.map(s => s.id)) + 1 : 1;
                                                    newStatements.push({
                                                        id: newId,
                                                        statement: '',
                                                        is_required: false
                                                    });
                                                    setData('enrollment_statements', newStatements);
                                                }}
                                                className="px-4 py-2 bg-[#934790] text-white rounded-lg hover:bg-[#7a3a78] transition-colors text-sm"
                                            >
                                                Add Statement
                                            </button>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-4">
                                            Add multiple statements that will be displayed to users during enrollment. These can be terms, conditions, or important notices.
                                        </p>

                                        <div className="space-y-4">
                                            {(data.enrollment_statements || []).length === 0 ? (
                                                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                                    <p className="text-gray-500 mb-2">No enrollment statements added</p>
                                                    <p className="text-sm text-gray-400">Enrollment statements are optional but recommended for important notices.</p>
                                                </div>
                                            ) : (
                                                (data.enrollment_statements || []).map((statement, index) => (
                                                    <div key={statement.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <h4 className="text-md font-medium text-gray-900">
                                                                Statement {index + 1}
                                                            </h4>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newStatements = (data.enrollment_statements || []).filter(s => s.id !== statement.id);
                                                                    setData('enrollment_statements', newStatements);
                                                                }}
                                                                className="text-red-600 hover:text-red-800 text-sm"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Statement Text
                                                                </label>
                                                                <textarea
                                                                    value={statement.statement || ''}
                                                                    onChange={(e) => {
                                                                        const newStatements = [...(data.enrollment_statements || [])];
                                                                        const statementIndex = newStatements.findIndex(s => s.id === statement.id);
                                                                        newStatements[statementIndex].statement = e.target.value;
                                                                        setData('enrollment_statements', newStatements);
                                                                    }}
                                                                    rows="3"
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                                    placeholder="Enter your enrollment statement, terms, or important notice..."
                                                                />
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {(statement.statement || '').length}/500 characters
                                                                </p>
                                                                {stepErrors[`statement_${index}_length`] && (
                                                                    <p className="text-red-600 text-xs mt-1">{stepErrors[`statement_${index}_length`]}</p>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`statement_required_${statement.id}`}
                                                                    checked={statement.is_required}
                                                                    onChange={(e) => {
                                                                        const newStatements = [...(data.enrollment_statements || [])];
                                                                        const statementIndex = newStatements.findIndex(s => s.id === statement.id);
                                                                        newStatements[statementIndex].is_required = e.target.checked;
                                                                        setData('enrollment_statements', newStatements);
                                                                    }}
                                                                    className="rounded border-gray-300 text-[#934790] focus:ring-[#934790] focus:ring-offset-0 mr-2"
                                                                />
                                                                <label htmlFor={`statement_required_${statement.id}`} className="text-sm text-gray-700">
                                                                    Require user acknowledgment
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Template Preview Modal */}
                        {showPreviewModal && previewTemplate && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Template Preview: {previewTemplate.name}</h3>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPreviewModal(false);
                                                setPreviewTemplate(null);
                                            }}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                        <div className="mb-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Category:</span>
                                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{previewTemplate.category}</span>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Status:</span>
                                                    <span className={`ml-2 px-2 py-1 text-xs rounded ${previewTemplate.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {previewTemplate.status ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <span className="text-sm font-medium text-gray-700">Subject:</span>
                                                <div className="mt-1 p-3 bg-gray-50 rounded border text-sm">{previewTemplate.subject}</div>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-sm font-medium text-gray-700">Email Body:</span>
                                            <div className="mt-2 p-4 bg-white border rounded-lg">
                                                <div
                                                    className="prose prose-sm max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: previewTemplate.body }}
                                                />
                                            </div>
                                        </div>

                                        {previewTemplate.banner_image && (
                                            <div className="mt-4">
                                                <span className="text-sm font-medium text-gray-700">Banner Image:</span>
                                                <div className="mt-2">
                                                    <img
                                                        src={previewTemplate.banner_image_url}
                                                        alt="Banner"
                                                        className="max-w-full h-auto rounded border"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {previewTemplate.attachment && (
                                            <div className="mt-4">
                                                <span className="text-sm font-medium text-gray-700">Attachment:</span>
                                                <div className="mt-2">
                                                    <a
                                                        href={previewTemplate.attachment_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        View Attachment
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPreviewModal(false);
                                                setPreviewTemplate(null);
                                            }}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Previous
                                </button>
                            ) : (
                                <Link
                                    href={route('superadmin.policy.enrollment-lists.index')}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Back to List
                                </Link>
                            )}

                            {step < 6 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={isValidating}
                                    className="px-4 py-2 bg-[#934790] hover:bg-[#7a3d7a] text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isValidating ? 'Validating...' : 'Next'}
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-[#934790] hover:bg-[#7a3d7a] text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Updating...' : 'Update Enrollment'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
