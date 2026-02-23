import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import {
    DocumentTextIcon,
    ClockIcon,
    UserCircleIcon,
    ArrowLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function Claims({ employee }) {
    const claims = []; // empty state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState('process'); // 'process' | 'file' | 'connect'
    const [processTab, setProcessTab] = useState('intimation'); // 'intimation' | 'reimbursement'
    const [fileForm, setFileForm] = useState({ policy: '', policyNumber: '', name: '', mobile: '', email: '' });
    const [fileSubmitted, setFileSubmitted] = useState(false);

    function openDrawer(mode = 'process'){
        setDrawerMode(mode);
        // don't force-reset the process tab every time — preserve user's last tab selection
        if(mode === 'process') setProcessTab(prev => prev || 'intimation');
        setFileSubmitted(false);
        setDrawerOpen(true);
    }

    function closeDrawer(){
        setDrawerOpen(false);
    }

    function submitFileForm(e){
        e.preventDefault();
        // In real app submit to backend. Here show success state.
        setFileSubmitted(true);
    }


    return (
        <EmployeeLayout employee={employee}>
            <Head title="My Claims" />

            {/* Page wrapper */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-6 md:px-8 py-4 sm:py-8 scrollbar-hide rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 mt-2 sm:mt-4">
                <div className="max-w-7xl mx-auto">

                    {/* Header with top-right button */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => window.history.back()}
                                className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white shadow flex items-center justify-center flex-shrink-0"
                            >
                                <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                            </button>
                            <div>
                                <h1 className="text-base sm:text-2xl font-bold text-gray-900">
                                    My Claims
                                </h1>
                                <p className="text-xs sm:text-xs text-gray-500">
                                    File claims and track your existing ones
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/employee/claims/initiate"
                            className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg bg-purple-600 text-white font-medium text-xs sm:text-sm shadow hover:bg-purple-700 transition whitespace-nowrap"
                        >
                            Initiate Claim
                        </Link>
                    </div>

                    {/* Gradient background container */}
                    <div id="claims-section" className="claims-section ">

                            {/* Inner white card */}
                            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 min-h-[auto] md:min-h-[470px]">

                            {/* Left section */}
                            <div className="w-full md:w-3/5 flex items-center justify-center">
                                {claims.length === 0 && (
                                    <div className="bg-gray-50 rounded-xl sm:rounded-2xl w-full h-full flex flex-col items-center justify-center text-center px-3 sm:px-6 py-6 sm:py-10">

                                        {/* Illustration image */}
                                        <div className="w-40 h-28 sm:w-56 sm:h-56 md:w-64 md:h-40 flex items-center justify-center mb-3 sm:mb-4">
                                            <img src="/assets/images/claimNotFound.png" alt="No claims" className="w-32 h-44 sm:w-40 sm:h-56 object-contain" />
                                        </div>

                                        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                                            No claims yet
                                        </h2>
                                            <p className="text-xs text-gray-500 mt-2 max-w-xs">
                                            Well that’s a sign of you living a healthy life.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Right section */}
                            <div className="w-full md:w-2/5">
                                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-6">
                                    Need help?
                                </h3>

                                <div className="space-y-2 sm:space-y-4">

                                    {/* Help item */}
                                    <button onClick={() => openDrawer('file')} className="w-full flex items-center justify-between rounded-lg sm:rounded-xl border border-gray-100 px-3 sm:px-4 py-2 sm:py-3 hover:shadow-md transition bg-white">
                                        <div className="flex items-center gap-2 sm:gap-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                                                <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                            </div>
                                            <p className="font-medium text-xs sm:text-sm text-gray-800">
                                                How to file a claim?
                                            </p>
                                        </div>
                                        <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                                    </button>

                                    <button onClick={() => openDrawer('process')} className="w-full flex items-center justify-between rounded-lg sm:rounded-xl border border-gray-100 px-3 sm:px-4 py-2 sm:py-3 hover:shadow-md transition bg-white">
                                        <div className="flex items-center gap-2 sm:gap-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                                                <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                            </div>
                                            <p className="font-medium text-xs sm:text-sm text-gray-800">
                                                Know about claim process
                                            </p>
                                        </div>
                                        <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                                    </button>

                                    <button onClick={() => openDrawer('connect')} className="w-full flex items-center justify-between rounded-lg sm:rounded-xl border border-gray-100 px-3 sm:px-4 py-2 sm:py-3 hover:shadow-md transition bg-white">
                                        <div className="flex items-center gap-2 sm:gap-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                                                <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                            </div>
                                            <p className="font-medium text-xs sm:text-sm text-gray-800 text-left">
                                                Connect with claim representative
                                            </p>
                                        </div>
                                        <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                                    </button>

                                </div>
                            </div>

                            </div>
                    </div>
                </div>
                {/* Drawer / Right-side modal */}
                {drawerOpen && (
                  <div aria-hidden={!drawerOpen} className="fixed inset-0 z-40">
                    {/* backdrop */}
                    <div onClick={closeDrawer} className="absolute inset-0 bg-black transition-opacity opacity-30" />

                    <aside className="fixed bottom-16 sm:bottom-auto left-0 right-0 sm:absolute sm:left-auto sm:right-0 sm:top-0 h-3/4 sm:h-full bg-white shadow-xl transform transition-transform duration-300 translate-x-0 rounded-t-3xl sm:rounded-none" style={{ width: 'auto', maxWidth: 420 }}>
                        <style>{`.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                        <div className="p-4 sm:p-6 h-full flex flex-col text-xs sm:text-sm">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <h4 className="font-semibold text-sm sm:text-base text-gray-900">{drawerMode === 'process' ? 'Claim process' : drawerMode === 'file' ? 'File a claim' : 'Connect with representative'}</h4>
                                <button onClick={closeDrawer} className="text-gray-500 hover:text-gray-800 font-bold text-lg">✕</button>
                            </div>

                            {drawerMode === 'process' && (
                                <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
                                    <div className="flex gap-2 mb-4 flex-wrap">
                                        <button onClick={() => setProcessTab('intimation')} className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap ${processTab==='intimation' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Intimation</button>
                                        <button onClick={() => setProcessTab('reimbursement')} className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap ${processTab==='reimbursement' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Reimbursement</button>
                                    </div>

                                    {processTab === 'intimation' && (
                                        <div className="space-y-2 sm:space-y-3 text-xs text-gray-700 leading-snug md:leading-relaxed">
                                            <h5 className="font-semibold text-xs sm:text-sm">What are Cashless Claims ?</h5>
                                            <p>Cashless claims facility assures that hospitalisation expenses are borne by insurers. It is a specialized service provided by an insurance company or a third-party administrator (TPA), where the payment for the cost of treatment undergone by the policyholder is directly made by the insurer to the network provider in accordance with the policy terms and conditions.</p>
                                            <p>If an insured person undergoes treatment at any of the network hospitals, there is no need for the person to pay the hospital bills. Please check your network hospitals here.</p>

                                            <h6 className="font-semibold mt-2">How to claim ?</h6>
                                            <ol className="list-decimal ml-5 space-y-2">
                                                <li>Go to the hospital's TPA desk with the patient's health ID card.</li>
                                                <li>You may be required to make a refundable deposit of Rs. 10,000 or more (varies).</li>
                                                <li>Submit the following document(s) to avail the cashless facility :</li>
                                            </ol>
                                            <ul className="list-disc ml-6 space-y-1">
                                                <li>Patient's Health ID Card</li>
                                                <li>Patient's Identity card (Aadhar Card/Passport)</li>
                                                <li>A first consultation paper issued by your doctor (if issued).</li>
                                                <li>Hospitalization advice issued by your doctor (if issued).</li>
                                                <li>All supporting lab medical reports. (e.g. Blood reports/X-Ray/USG/CT Scan/MRI etc)</li>
                                                <li>The Hospital's TPA desk will receive a pre-authorization approval from the Ins. Co/TPA within 2 hours.</li>
                                                <li>Similarly, during discharge, final authorization approval will be received from the Ins. Co/TPA within 2 hours.</li>
                                            </ul>
                                            <p className="mt-2">Your work is done. Now wait for some time as the approval usually takes up to 4 hrs.</p>
                                        </div>
                                    )}

                                    {processTab === 'reimbursement' && (
                                        <div className="space-y-2 sm:space-y-3 text-xs text-gray-700 leading-snug md:leading-relaxed">
                                            <h5 className="font-semibold text-xs sm:text-sm">Reimbursement</h5>
                                            <p>A reimbursement claim means settling the hospital bill out-of-pocket and then applying for reimbursement from the insurance company.</p>
                                            <h6 className="font-semibold mt-2">How to claim ?</h6>
                                            <ol className="list-decimal ml-5 space-y-2">
                                                <li>During your stay in the hospital, you must pay for your own expenses. The insurance company will reimburse the hospitalisation and post-hospitalization charges.</li>
                                                <li>Claim step 2 text</li>
                                                <li>Claim step 3 text</li>
                                                <li>For this, you will need to submit these document(s) :-</li>
                                            </ol>
                                            <ul className="list-disc ml-6 space-y-1">
                                                <li>Claim form (download empty claim form)</li>
                                                <li>Your original Discharge Card</li>
                                                <li>Your original Final Bill</li>
                                                <li>Your original Paid Receipt</li>
                                                <li>First Consultation Paper issued by your GD/MD/MS</li>
                                                <li>Hospitalization Advice issued by your GD/MD/MS</li>
                                                <li>Your Investigation Reports (Blood/Radiology)</li>
                                                <li>Your Medical Bills (pharmacy)</li>
                                                <li>Your Indoor Case Papers (ICP) duly attested by the hospital</li>
                                                <li>Your Cancelled Cheque with printed name, account number and IFSC Code</li>
                                                <li>Your Corporate ID Card</li>
                                                <li>Your KYC (Aadhar Card/Passport)</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {drawerMode === 'file' && (
                                <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
                                    <div className="space-y-2 sm:space-y-3 text-xs text-gray-700 leading-snug md:leading-relaxed">
                                        <h5 className="font-semibold text-base sm:text-lg text-purple-700 mb-2">How to file a claim</h5>
                                        <ol className="list-decimal ml-5 space-y-2">
                                            <li>Contact your TPA or insurance provider as soon as possible after hospitalization.</li>
                                            <li>Collect and fill out the claim form provided by your insurer.</li>
                                            <li>Gather all required documents (discharge summary, bills, reports, ID proof, etc.).</li>
                                            <li>Submit the claim form and documents to the insurer/TPA via their portal, email, or in person.</li>
                                            <li>Wait for verification and approval. The TPA/insurer will contact you if more information is needed.</li>
                                            <li>Once approved, the claim amount will be processed and paid as per policy terms.</li>
                                        </ol>
                                        <div className="mt-4 text-center">
                                            <button onClick={closeDrawer} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 text-white rounded text-xs sm:text-sm font-medium">Close</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {drawerMode === 'connect' && (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 w-full max-w-sm text-xs sm:text-sm text-gray-700 border border-gray-100">
                                        <h5 className="font-semibold text-sm sm:text-lg text-center mb-3 sm:mb-4 text-purple-700">Connect with Claim Representative</h5>
                                        <p className="mb-3 sm:mb-4 text-center text-xs sm:text-sm">To connect with a claim representative, open your policy details and click <span className="font-medium">Connect</span>.</p>
                                        <button onClick={() => window.location.href = '/employee/policy'} className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 text-white rounded text-xs sm:text-sm font-semibold shadow">Go to Policy Details</button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </aside>
                  </div>
                )}
            </div>
        </EmployeeLayout>
    );
}
