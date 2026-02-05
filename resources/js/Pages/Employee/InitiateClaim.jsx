import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import axios from "axios";
import {
    CheckCircleIcon,
    PhoneIcon,
    XCircleIcon,
    InformationCircleIcon,
    DocumentTextIcon,
    ClockIcon,
    ExclamationCircleIcon,
    ChevronDownIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";

// Indian states and cities data
const INDIAN_STATES = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tezpur"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Bihar Sharif"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
    "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak"],
    "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Palampur"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh"],
    "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Belgaum", "Hubli", "Dharwad"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"],
    "Meghalaya": ["Shillong", "Tura", "Nongstoin", "Jowai"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Puri", "Sambalpur"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur", "Ajmer"],
    "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Darjeeling"],
    "Andaman and Nicobar Islands": ["Port Blair"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
    "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur"],
    "Ladakh": ["Leh", "Kargil"],
    "Lakshadweep": ["Kavaratti"],
    "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
};

export default function InitiateClaim({ employee }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [policies, setPolicies] = useState([]);
    const [dependents, setDependents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [apiError, setApiError] = useState("");

    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [selectedClaimType, setSelectedClaimType] = useState("");
    const [selectedDependent, setSelectedDependent] = useState(null);

    const [claimForm, setClaimForm] = useState({
        date_of_admission: "",
        date_of_discharge: "",
        hospital_name: "",
        hospital_state: "",
        hospital_city: "",
        hospital_pin_code: "",
        diagnosis: "",
        claim_amount: "",
        emergency_contact_name: "",
        file_url: "",
    });

    // Helper to determine if a policy is selected — keeps checks explicit and boolean
    const isPolicySelected = (policy) => Boolean(
        selectedPolicy && (selectedPolicy.policy_id === policy.policy_id || selectedPolicy.id === policy.id)
    );

    // Return an avatar URL for a dependent.
    // Priority: explicit image fields on the dependent -> gendered default -> initials avatar.
    const getDependentAvatar = (dependent) => {
        if (!dependent) return null;
        const custom = (
            dependent.avatar_url ||
            dependent.photo ||
            dependent.profile_image ||
            dependent.member_photo ||
            dependent.insured_photo ||
            dependent.image
        );
        if (custom) return custom;

        const genderRaw = (dependent.gender || dependent.sex || '').toString().toLowerCase();
        // Use DiceBear vector avatars (gender-aware seed) for non-photographic avatars
        const nameSeed = encodeURIComponent(dependent.insured_name || 'user');
       
    };

    const steps = [
        { number: 1, title: "Policy & Claim Type", isActive: currentStep === 1, isCompleted: currentStep > 1 },
        { number: 2, title: "Select Dependent", isActive: currentStep === 2, isCompleted: currentStep > 2 },
        { number: 3, title: "Claim Details", isActive: currentStep === 3, isCompleted: currentStep > 3 },
        { number: 4, title: "Review & Submit", isActive: currentStep === 4, isCompleted: currentStep > 4 },
    ];

    const cities = claimForm.hospital_state ? INDIAN_STATES[claimForm.hospital_state] || [] : [];

    // Reviews for sidebar carousel
    const reviews = [
        {
            text: "Filing a claim was straightforward — the portal guided me step-by-step and I got updates fast.",
            author: "Siddhi Khemka",
            role: "Interior Designer",
        },
        {
            text: "Support helped me through the cashless approval process. Very smooth experience.",
            author: "Rohit Sharma",
            role: "Product Manager",
        },
        {
            text: "I uploaded my documents and received confirmation within hours. Highly recommend.",
            author: "Anita Desai",
            role: "Teacher",
        },
        {
            text: "Quick, clear and reliable — made a stressful situation much easier.",
            author: "Vikram Singh",
            role: "Sales Lead",
        },
    ];

    const [reviewIndex, setReviewIndex] = useState(0);
    const [reviewPaused, setReviewPaused] = useState(false);
    useEffect(() => {
        if (reviewPaused) return;
        const id = setInterval(() => {
            setReviewIndex((i) => (i + 1) % reviews.length);
        }, 4000);
        return () => clearInterval(id);
    }, [reviews.length, reviewPaused]);

    useEffect(() => {
        fetchPolicies();
    }, []);

    // Ensure user must manually select a policy — do not auto-select even if only one policy is available
    useEffect(() => {
        if (Array.isArray(policies)) {
            setSelectedPolicy(null);
        }
    }, [policies]);

    const fetchPolicies = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/employee/claims/active-policies");
            if (response.data.success) {
                setPolicies(response.data.data);
                // Ensure no policy is pre-selected by default — user must explicitly choose
                setSelectedPolicy(null);
            }
        } catch (error) {
            console.error("Error fetching policies:", error);
            setErrorMessage("Failed to load policies. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    };

    const fetchDependents = async (policyId) => {
        setLoading(true);
        setErrorMessage("");
        try {
            const response = await axios.post("/employee/claims/policy-dependents", {
                policy_id: policyId,
            });
            if (response.data.success) {
                setDependents(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching dependents:", error);
            setErrorMessage(error.response?.data?.message || "Failed to fetch dependents. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePolicySelect = (policy) => {
        setSelectedPolicy(policy);
        setErrors({});
    };

    const handleClaimTypeSelect = (type) => {
        setSelectedClaimType(type);
        setErrors({});
    };

    const handleDependentSelect = (dependent) => {
        setSelectedDependent(dependent);
        setErrors({});
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            setErrorMessage("File size should not exceed 10MB");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setClaimForm({ ...claimForm, file_url: "uploaded_file_" + file.name });
            setLoading(false);
        }, 1500);
    };

    const handlePincodeChange = async (pincode) => {
        const cleaned = pincode.replace(/\D/g, '').slice(0, 6);
        setClaimForm({ ...claimForm, hospital_pin_code: cleaned });

        if (cleaned.length === 6) {
            setPincodeLoading(true);
            try {
                const response = await axios.get(`https://api.postalpincode.in/pincode/${cleaned}`);
                if (response.data && response.data[0]?.Status === 'Success') {
                    const postOffice = response.data[0].PostOffice[0];
                    setClaimForm(prev => ({
                        ...prev,
                        hospital_city: postOffice.District || '',
                        hospital_state: postOffice.State || '',
                        hospital_pin_code: cleaned
                    }));
                    setErrors(prev => ({ ...prev, hospital_pin_code: '', hospital_state: '', hospital_city: '' }));
                } else {
                    setErrors(prev => ({ ...prev, hospital_pin_code: 'Invalid PIN code' }));
                }
            } catch (error) {
                console.error('Pincode lookup error:', error);
            } finally {
                setPincodeLoading(false);
            }
        }
    };

    const handleNext = async () => {
        setErrors({});
        setErrorMessage("");

        if (currentStep === 1) {
            if (!selectedPolicy) {
                setErrors({ policy: "Please select a policy" });
                return;
            }
            if (!selectedClaimType) {
                setErrors({ claim_type: "Please select a claim type" });
                return;
            }
            await fetchDependents(selectedPolicy.policy_id || selectedPolicy.id);
        }

        if (currentStep === 2 && !selectedDependent) {
            setErrors({ dependent: "Please select a patient" });
            return;
        }

        if (currentStep === 3) {
            const newErrors = {};
            if (!claimForm.date_of_admission) newErrors.date_of_admission = "Required";
            if (!claimForm.hospital_name) newErrors.hospital_name = "Required";
            if (!claimForm.hospital_state) newErrors.hospital_state = "Required";
            if (!claimForm.hospital_city) newErrors.hospital_city = "Required";
            if (!claimForm.hospital_pin_code) newErrors.hospital_pin_code = "Required";
            if (!claimForm.diagnosis) newErrors.diagnosis = "Required";
            if (!claimForm.claim_amount) newErrors.claim_amount = "Required";

            if (selectedClaimType === "reimbursement" && !claimForm.file_url) {
                newErrors.file_url = "Please upload documents";
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setErrorMessage("Please fill all required fields");
                return;
            }
        }

        setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
        setErrors({});
        setErrorMessage("");
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setErrorMessage("");
        setApiError("");
        try {
            const formData = {
                policy_id: selectedPolicy.policy_id || selectedPolicy.id,
                policy_number: selectedPolicy.policy_number,
                uhid_member_id: selectedDependent.uhid,
                relation_name: selectedDependent.relation || "Self",
                claim_type: selectedClaimType,
                mobile_no: employee?.mobile || "",
                email: employee?.email || "",
                relation_with_patient: selectedDependent.relation || "Self",
                ...claimForm,
            };

            // First, submit to insurer API
            try {
                const insurerResponse = await axios.post("/employee/claims/submit-to-insurer", formData);
                if (!insurerResponse.data.success) {
                    setApiError(insurerResponse.data.message || "Insurer API rejected the claim. Please check details and try again.");
                    setErrorMessage(insurerResponse.data.message || "Failed to submit to insurance company.");
                    return;
                }
            } catch (insurerError) {
                console.error("Insurer API Error:", insurerError);
                setApiError(insurerError.response?.data?.message || "Failed to submit claim to insurance company. Please try again.");
                setErrorMessage(insurerError.response?.data?.message || "Insurance company API error.");
                return;
            }

            // If insurer API succeeds, save to database
            const response = await axios.post("/employee/claims/submit", formData);
            if (response.data.success) {
                setCurrentStep(5); // Success screen
            } else {
                setErrorMessage(response.data.message || "Failed to save claim");
            }
        } catch (error) {
            console.error("Error submitting claim:", error);
            setErrorMessage(error.response?.data?.message || "Failed to submit claim. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <EmployeeLayout>
            <Head title="Initiate Claim" />

            <div className="h-screen bg-gray-50">
                <div className="flex h-full">
                    {/* Left Sidebar */}
                    <div className="w-64 bg-white h-full border-r border-gray-200 p-6 flex flex-col flex-shrink-0 overflow-hidden">
                        {/* Logo Section */}
                        {/* <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-gray-900">File Your Claim</div>
                                    <div className="text-xs text-gray-500">Insurance Claims</div>
                                </div>
                            </div>
                        </div> */}

                        {/* Steps */}
                        <div className="space-y-1 flex-1">
                            {steps.map((step, index) => (
                                <div key={step.number} className="relative">
                                    <div
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${step.isActive
                                                ? "bg-gray-900 text-white"
                                                : step.isCompleted
                                                    ? "bg-purple-50 text-gray-900"
                                                    : "text-gray-400"
                                            }`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${step.isActive
                                                    ? "bg-white text-gray-900"
                                                    : step.isCompleted
                                                        ? "bg-purple-600 text-white"
                                                        : "bg-gray-200 text-gray-500"
                                                }`}
                                        >
                                            {step.isCompleted ? "✓" : step.number}
                                        </div>
                                        <span className={`text-xs font-medium ${step.isActive ? "text-white" : ""}`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="ml-7 h-6 w-0.5 bg-gray-200"></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Support Section */}
                        <div className="mt-auto space-y-4">
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                <div className="flex flex-col items-center gap-2 mb-2 text-center">
                                        <PhoneIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-xs text-gray-700 leading-relaxed">
                                            <div className="font-semibold text-gray-900 mb-1">Need Help?</div>
                                            <div className="text-[11px]">
                                                Email us at <a href="mailto:support@zoomconnect.com" className="text-purple-600 font-medium hover:text-purple-700">support@zoomconnect.com</a>
                                            </div>
                                        </div>
                                    </div>
                            </div>

                            {/* Testimonial carousel */}
                            <div
                                className="p-4 bg-blue-50 rounded-lg border border-blue-100"
                                onMouseEnter={() => setReviewPaused(true)}
                                onMouseLeave={() => setReviewPaused(false)}
                            >
                                <div className="text-xs text-gray-700 leading-relaxed italic mb-3">
                                    "{reviews[reviewIndex].text}"
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-xs font-semibold text-blue-700">
                                        {reviews[reviewIndex].author?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div className="text-xs">
                                        <div className="font-semibold text-gray-900">{reviews[reviewIndex].author}</div>
                                        <div className="text-gray-500">{reviews[reviewIndex].role}</div>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    {reviews.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setReviewIndex(i)}
                                            className={`w-2 h-2 rounded-full ${i === reviewIndex ? 'bg-purple-600' : 'bg-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
                        <style>{`.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                        <div className="max-w-5xl mx-auto">
                            {/* Error Message Banner */}
                            {errorMessage && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                    <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-red-900">{errorMessage}</p>
                                    </div>
                                    <button onClick={() => setErrorMessage("")} className="text-red-600 hover:text-red-700">
                                        <XCircleIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="animate-fadeIn">
                                    {/* Header */}
                                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Select Your Policy & Claim Type</h1>
                                        <div className="flex items-center gap-4 text-sm flex-wrap">
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                                                <span className="text-gray-600">Quick & Easy Process</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                                                <span className="text-gray-600">24/7 Claim Support</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                                                <span className="text-gray-600">Trusted by 50k+ users</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Policy Selection */}
                                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                        <h3 className="text-base font-semibold text-gray-900 mb-4">Select Your Insurance Policy</h3>
                                        {loading ? (
                                            <div className="text-center py-12">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-purple-600 mx-auto"></div>
                                                <p className="text-gray-600 mt-3 text-sm">Loading your policies...</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {policies.map((policy) => (
                                                    <div
                                                        key={policy.id || policy.policy_id}
                                                        onClick={() => handlePolicySelect(policy)}
                                                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${isPolicySelected(policy)
                                                                ? "border-purple-500 bg-purple-50"
                                                                : "border-gray-200 hover:border-purple-300 bg-white"
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <input
                                                                type="radio"
                                                                name="policy"
                                                                checked={isPolicySelected(policy)}
                                                                onChange={() => handlePolicySelect(policy)}
                                                                className="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-500"
                                                            />
                                                            <div className="flex-1">
                                                                <h3 className="text-base font-semibold text-gray-900 mb-1">
                                                                    {policy.policy_name || policy.corporate_policy_name}
                                                                </h3>
                                                                <p className="text-sm text-gray-600 mb-2">{policy.insurance_company_name}</p>
                                                                <div className="flex gap-6 text-sm">
                                                                    <div>
                                                                        <span className="text-gray-500">Policy No: </span>
                                                                        <span className="font-medium text-gray-900">{policy.policy_number}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-500">TPA: </span>
                                                                        <span className="font-medium text-gray-900">{policy.tpa_company_name}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {errors.policy && (
                                            <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                <span>{errors.policy}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Claim Type Selection */}
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <h3 className="text-base font-semibold text-gray-900 mb-4">Choose Claim Type</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div
                                                onClick={() => handleClaimTypeSelect("intimation")}
                                                className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all ${selectedClaimType === "intimation"
                                                        ? "border-indigo-500 bg-indigo-50"
                                                        : "border-gray-200 hover:border-indigo-300 bg-white"
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="radio"
                                                        name="claim_type"
                                                        checked={selectedClaimType === "intimation"}
                                                        onChange={() => handleClaimTypeSelect("intimation")}
                                                        className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <ClockIcon className="w-5 h-5 text-indigo-600" />
                                                            <h4 className="font-semibold text-gray-900">Cashless / Intimation</h4>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-3">
                                                            Get treatment without paying upfront. Insurance settles directly with hospital.
                                                        </p>
                                                        <div className="bg-indigo-100 rounded-lg p-3 space-y-1.5">
                                                            <p className="text-xs font-semibold text-indigo-900 flex items-center gap-1">
                                                                <InformationCircleIcon className="w-3.5 h-3.5" />
                                                                When to use:
                                                            </p>
                                                            <ul className="text-xs text-indigo-800 space-y-1 ml-4 list-disc">
                                                                <li>Planned hospitalizations at network hospitals</li>
                                                                <li>Emergency admissions at network hospitals</li>
                                                                <li>Intimate within 24-48 hours of admission</li>
                                                                <li>Pre-authorization approval in 2-4 hours</li>
                                                            </ul>
                                                        </div>
                                                        <div className="mt-3 flex items-center gap-1 text-xs text-green-700 font-medium">
                                                            <CheckCircleIcon className="w-4 h-4" />
                                                            <span>350+ claims processed securely today</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                onClick={() => handleClaimTypeSelect("reimbursement")}
                                                className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all ${selectedClaimType === "reimbursement"
                                                        ? "border-green-500 bg-green-50"
                                                        : "border-gray-200 hover:border-green-300 bg-white"
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="radio"
                                                        name="claim_type"
                                                        checked={selectedClaimType === "reimbursement"}
                                                        onChange={() => handleClaimTypeSelect("reimbursement")}
                                                        className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <DocumentTextIcon className="w-5 h-5 text-green-600" />
                                                            <h4 className="font-semibold text-gray-900">Reimbursement Claim</h4>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-3">
                                                            Pay yourself and submit bills later to get reimbursed after verification.
                                                        </p>
                                                        <div className="bg-green-100 rounded-lg p-3 space-y-1.5">
                                                            <p className="text-xs font-semibold text-green-900 flex items-center gap-1">
                                                                <InformationCircleIcon className="w-3.5 h-3.5" />
                                                                When to use:
                                                            </p>
                                                            <ul className="text-xs text-green-800 space-y-1 ml-4 list-disc">
                                                                <li>Treatments at non-network hospitals</li>
                                                                <li>When cashless facility is not available</li>
                                                                <li>Submit within 30 days of discharge</li>
                                                                <li>Requires all original bills and documents</li>
                                                            </ul>
                                                        </div>
                                                        <div className="mt-3 flex items-center gap-1 text-xs text-green-700 font-medium">
                                                            <CheckCircleIcon className="w-4 h-4" />
                                                            <span>20+ private rooms booked this week</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {errors.claim_type && (
                                            <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                <span>{errors.claim_type}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end mt-6">
                                        <button
                                            onClick={handleNext}
                                            disabled={!selectedPolicy || !selectedClaimType || loading}
                                            className="px-8 py-3 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="animate-fadeIn">
                                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Select Patient</h1>
                                        <p className="text-sm text-gray-600">Choose the family member for whom you're filing this claim</p>
                                    </div>

                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        {loading ? (
                                            <div className="text-center py-16">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-purple-600 mx-auto"></div>
                                                <p className="text-gray-600 mt-3 text-sm">Loading dependents...</p>
                                            </div>
                                        ) : dependents.length === 0 ? (
                                            <div className="text-center py-16">
                                                <ExclamationCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                <p className="text-gray-600">No dependents found for this policy</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-4">
                                                {dependents.map((dependent, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => handleDependentSelect(dependent)}
                                                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all text-center ${selectedDependent?.uhid === dependent.uhid
                                                                ? "border-purple-500 bg-purple-50"
                                                                : "border-gray-200 hover:border-purple-300 bg-white"
                                                            }`}
                                                    >
                                                        {(() => {
                                                            const avatar = getDependentAvatar(dependent);
                                                            if (avatar) {
                                                                return (
                                                                    <img
                                                                        src={avatar}
                                                                        alt={dependent.insured_name || 'Dependent'}
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            const seed = encodeURIComponent(dependent.insured_name || 'user');
                                                                            e.target.src = `https://avatars.dicebear.com/api/initials/${seed}.svg`;
                                                                        }}
                                                                        className="w-16 h-16 mx-auto mb-3 rounded-full object-cover"
                                                                    />
                                                                );
                                                            }
                                                            return (
                                                                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                                                                    {dependent.insured_name?.charAt(0)?.toUpperCase()}
                                                                </div>
                                                            );
                                                        })()}
                                                        <h3 className="font-semibold text-gray-900 mb-1 text-sm">{dependent.insured_name}</h3>
                                                        <p className="text-xs text-gray-600 mb-2">{dependent.relation || "Self"}</p>
                                                        <p className="text-xs text-gray-500">UHID: {dependent.uhid}</p>
                                                        {selectedDependent?.uhid === dependent.uhid && (
                                                            <div className="mt-3">
                                                                <CheckCircleIcon className="w-5 h-5 text-purple-600 mx-auto" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {errors.dependent && (
                                            <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                <span>{errors.dependent}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between mt-6">
                                        <button
                                            onClick={handlePrevious}
                                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={!selectedDependent}
                                            className="px-8 py-3 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="animate-fadeIn">
                                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Claim Details</h1>
                                        <p className="text-sm text-gray-600">Fill in the details about hospitalization and treatment</p>
                                    </div>

                                    <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
                                        {/* Date Fields */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Date of Admission <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        value={claimForm.date_of_admission}
                                                        onChange={(e) => setClaimForm({ ...claimForm, date_of_admission: e.target.value })}
                                                        max={new Date().toISOString().split('T')[0]}
                                                        className={`w-full px-4 py-3 text-sm border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm cursor-pointer ${errors.date_of_admission ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                                                        style={{ colorScheme: 'light' }}
                                                    />
                                                </div>
                                                {errors.date_of_admission && (
                                                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                        <ExclamationCircleIcon className="w-3.5 h-3.5" />
                                                        {errors.date_of_admission}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Date of Discharge {selectedClaimType === 'reimbursement' && <span className="text-red-500">*</span>}
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        value={claimForm.date_of_discharge}
                                                        onChange={(e) => setClaimForm({ ...claimForm, date_of_discharge: e.target.value })}
                                                        max={new Date().toISOString().split('T')[0]}
                                                        min={claimForm.date_of_admission}
                                                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm hover:border-gray-400 cursor-pointer"
                                                        style={{ colorScheme: 'light' }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Leave empty if still admitted</p>
                                            </div>
                                        </div>

                                        {/* Hospital Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Hospital Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={claimForm.hospital_name}
                                                onChange={(e) => setClaimForm({ ...claimForm, hospital_name: e.target.value })}
                                                placeholder="Enter hospital name"
                                                className={`w-full px-4 py-3 text-sm border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm ${errors.hospital_name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                                            />
                                            {errors.hospital_name && (
                                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                    <ExclamationCircleIcon className="w-3.5 h-3.5" />
                                                    {errors.hospital_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Location */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    State <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={claimForm.hospital_state}
                                                        onChange={(e) => setClaimForm({ ...claimForm, hospital_state: e.target.value, hospital_city: '' })}
                                                        className={`w-full px-4 py-3 text-sm border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition appearance-none shadow-sm ${errors.hospital_state ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                                                    >
                                                        <option value="">Select State</option>
                                                        {Object.keys(INDIAN_STATES).map((state) => (
                                                            <option key={state} value={state}>{state}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                                </div>
                                                {errors.hospital_state && (
                                                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                        <ExclamationCircleIcon className="w-3.5 h-3.5" />
                                                        {errors.hospital_state}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    City <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={claimForm.hospital_city}
                                                        onChange={(e) => setClaimForm({ ...claimForm, hospital_city: e.target.value })}
                                                        placeholder="Enter city name"
                                                        list="cities-list"
                                                        className={`w-full pl-10 pr-3 py-3 text-sm border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm ${errors.hospital_city ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                                                    />
                                                    <datalist id="cities-list">
                                                        {cities.map((city) => (
                                                            <option key={city} value={city} />
                                                        ))}
                                                    </datalist>
                                                </div>
                                                {errors.hospital_city && (
                                                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                        <ExclamationCircleIcon className="w-3.5 h-3.5" />
                                                        {errors.hospital_city}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    PIN Code <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={claimForm.hospital_pin_code}
                                                        onChange={(e) => handlePincodeChange(e.target.value)}
                                                        placeholder="Enter 6-digit PIN"
                                                        maxLength={6}
                                                        className={`w-full px-4 py-3 text-sm border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm ${errors.hospital_pin_code ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                                                    />
                                                    {pincodeLoading && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                            <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                                                        </div>
                                                    )}
                                                </div>
                                                {errors.hospital_pin_code && (
                                                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                        <ExclamationCircleIcon className="w-3.5 h-3.5" />
                                                        {errors.hospital_pin_code}
                                                    </p>
                                                )}
                                                {claimForm.hospital_pin_code.length === 6 && !pincodeLoading && claimForm.hospital_state && (
                                                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                                        <CheckCircleIcon className="w-3.5 h-3.5" />
                                                        Location detected: {claimForm.hospital_city}, {claimForm.hospital_state}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Diagnosis */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Diagnosis / Ailment <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                value={claimForm.diagnosis}
                                                onChange={(e) => setClaimForm({ ...claimForm, diagnosis: e.target.value })}
                                                placeholder="Describe the medical condition and reason for hospitalization"
                                                rows={3}
                                                className={`w-full px-4 py-3 text-sm border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm resize-none ${errors.diagnosis ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                                            />
                                            {errors.diagnosis && (
                                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                    <ExclamationCircleIcon className="w-3.5 h-3.5" />
                                                    {errors.diagnosis}
                                                </p>
                                            )}
                                        </div>

                                        {/* Claim Amount */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Claim Amount (₹) <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">₹</span>
                                                <input
                                                    type="number"
                                                    value={claimForm.claim_amount}
                                                    onChange={(e) => setClaimForm({ ...claimForm, claim_amount: e.target.value })}
                                                    placeholder="Enter estimated/actual amount"
                                                    className={`w-full pl-10 pr-4 py-3 text-sm border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm ${errors.claim_amount ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                                                />
                                            </div>
                                            {errors.claim_amount && (
                                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                    <ExclamationCircleIcon className="w-3.5 h-3.5" />
                                                    {errors.claim_amount}
                                                </p>
                                            )}
                                        </div>

                                        {/* Emergency Contact */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Emergency Contact Name
                                            </label>
                                            <input
                                                type="text"
                                                value={claimForm.emergency_contact_name}
                                                onChange={(e) => setClaimForm({ ...claimForm, emergency_contact_name: e.target.value })}
                                                placeholder="Name of person to contact in case of emergency (Optional)"
                                                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm hover:border-gray-400"
                                            />
                                        </div>

                                        {/* File Upload for Reimbursement */}
                                        {selectedClaimType === 'reimbursement' && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Upload Documents <span className="text-red-500">*</span>
                                                </label>
                                                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition ${errors.file_url ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-400'
                                                    }`}>
                                                    {claimForm.file_url ? (
                                                        <div className="text-green-600">
                                                            <CheckCircleIcon className="w-10 h-10 mx-auto mb-2" />
                                                            <p className="font-medium text-sm">File uploaded successfully</p>
                                                            <p className="text-xs text-gray-600 mt-1">{claimForm.file_url.split('_').pop()}</p>
                                                            <button
                                                                onClick={() => setClaimForm({ ...claimForm, file_url: '' })}
                                                                className="mt-3 text-xs text-red-600 hover:text-red-700 font-medium"
                                                            >
                                                                Remove & Upload Different File
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <DocumentTextIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                                            <p className="text-sm text-gray-600 mb-2">Upload hospital bills, discharge summary, and medical reports</p>
                                                            <p className="text-xs text-gray-500 mb-3">PDF or images (max 10MB per file)</p>
                                                            <label className="inline-block px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-purple-700 transition shadow-sm">
                                                                Choose Files
                                                                <input
                                                                    type="file"
                                                                    onChange={handleFileUpload}
                                                                    className="hidden"
                                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                                />
                                                            </label>
                                                        </>
                                                    )}
                                                </div>
                                                {errors.file_url && (
                                                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                                                        <ExclamationCircleIcon className="w-3.5 h-3.5" />
                                                        {errors.file_url}
                                                    </p>
                                                )}
                                                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                                    <p className="text-xs text-yellow-900 font-semibold mb-1 flex items-center gap-1">
                                                        <InformationCircleIcon className="w-4 h-4" />
                                                        Required Documents:
                                                    </p>
                                                    <ul className="text-xs text-yellow-800 ml-5 list-disc space-y-0.5">
                                                        <li>Discharge summary</li>
                                                        <li>Original bills and receipts</li>
                                                        <li>Investigation reports (blood tests, X-rays, etc.)</li>
                                                        <li>Prescription and medication bills</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between mt-6">
                                        <button
                                            onClick={handlePrevious}
                                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            className="px-8 py-3 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-all shadow-sm"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="animate-fadeIn">
                                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h1>
                                        <p className="text-sm text-gray-600">Please review all details before submitting your claim</p>
                                    </div>

                                    {/* API Error Banner */}
                                    {apiError && (
                                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-lg flex items-start gap-3">
                                            <XCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-red-900 mb-1">Insurance API Error</p>
                                                <p className="text-sm text-red-800">{apiError}</p>
                                            </div>
                                            <button onClick={() => setApiError("")} className="text-red-600 hover:text-red-700">
                                                <XCircleIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                                        <div className="border-b border-gray-200 pb-4">
                                            <h3 className="text-base font-semibold text-gray-900 mb-3">Policy Details</h3>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Policy Name:</span>
                                                    <p className="font-medium text-gray-900 mt-1">{selectedPolicy?.policy_name || selectedPolicy?.corporate_policy_name}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Policy Number:</span>
                                                    <p className="font-medium text-gray-900 mt-1">{selectedPolicy?.policy_number}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Claim Type:</span>
                                                    <p className="font-medium text-gray-900 mt-1 capitalize">{selectedClaimType}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Insurance Company:</span>
                                                    <p className="font-medium text-gray-900 mt-1">{selectedPolicy?.insurance_company_name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-b border-gray-200 pb-4">
                                            <h3 className="text-base font-semibold text-gray-900 mb-3">Patient Details</h3>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Patient Name:</span>
                                                    <p className="font-medium text-gray-900 mt-1">{selectedDependent?.insured_name}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">UHID:</span>
                                                    <p className="font-medium text-gray-900 mt-1">{selectedDependent?.uhid}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Relation:</span>
                                                    <p className="font-medium text-gray-900 mt-1">{selectedDependent?.relation || "Self"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900 mb-3">Claim Details</h3>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Hospital Name:</span>
                                                    <p className="font-medium text-gray-900 mt-1">{claimForm.hospital_name}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Location:</span>
                                                    <p className="font-medium text-gray-900 mt-1">{claimForm.hospital_city}, {claimForm.hospital_state}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Date of Admission:</span>
                                                    <p className="font-medium text-gray-900 mt-1">{new Date(claimForm.date_of_admission).toLocaleDateString()}</p>
                                                </div>
                                                {claimForm.date_of_discharge && (
                                                    <div>
                                                        <span className="text-gray-500">Date of Discharge:</span>
                                                        <p className="font-medium text-gray-900 mt-1">{new Date(claimForm.date_of_discharge).toLocaleDateString()}</p>
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="text-gray-500">Claim Amount:</span>
                                                    <p className="font-medium text-gray-900 mt-1">₹{Number(claimForm.claim_amount).toLocaleString('en-IN')}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-gray-500">Diagnosis:</span>
                                                    <p className="font-medium text-gray-900 mt-1">{claimForm.diagnosis}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-6">
                                        <button
                                            onClick={handlePrevious}
                                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                            className="px-8 py-3 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Claim'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 5 && (
                                <div className="animate-fadeIn">
                                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircleIcon className="w-12 h-12 text-green-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim Submitted Successfully!</h2>
                                        <p className="text-sm text-gray-600 mb-6">Your claim has been submitted successfully. You will receive updates via email and SMS at every step of the process.</p>
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href="/employee/claims"
                                                className="inline-block px-6 py-3 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-all shadow-sm"
                                            >
                                                View My Claims
                                            </Link>
                                            <Link
                                                href="/employee/dashboard"
                                                className="inline-block px-6 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                                            >
                                                Go to Dashboard
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </EmployeeLayout>
    );
}
