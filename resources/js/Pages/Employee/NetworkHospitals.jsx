import React, { useState, useEffect } from "react";
import { Head } from '@inertiajs/react';
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import {
    ArrowLeftIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    BuildingOffice2Icon,
    XMarkIcon,
    CheckCircleIcon,
    HeartIcon,
    DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { router } from "@inertiajs/react";
import axios from "axios";

export default function NetworkHospitals({ employee, policy, insurance_company, searchType, searchOptions }) {
    const [searching, setSearching] = useState(false);
    
    // Search filters
    const [pincode, setPincode] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [availableCities, setAvailableCities] = useState([]);
    
    // Results
    const [hospitals, setHospitals] = useState([]);
    const [totalHospitals, setTotalHospitals] = useState(0);
    const [searchPerformed, setSearchPerformed] = useState(false);

    useEffect(() => {
        if (selectedState && searchOptions) {
            const stateData = searchOptions.states.find(s => s.state === selectedState);
            setAvailableCities(stateData ? stateData.cities : []);
            setSelectedCity("");
        }
    }, [selectedState, searchOptions]);

    const handleSearch = async () => {
        if (!pincode && !selectedState && !selectedCity) {
            alert('Please enter pincode or select state/city');
            return;
        }

        if (searchType === 'pincode_only' && !pincode) {
            alert('Please enter pincode to search');
            return;
        }

        setSearching(true);
        setSearchPerformed(true);
        
        try {
            const response = await axios.post('/employee/network-hospitals/search', {
                policy_id: policy.id,
                pincode: pincode || null,
                state: selectedState || null,
                city: selectedCity || null,
            });

            if (response.data.success) {
                setHospitals(response.data.data.hospitals);
                setTotalHospitals(response.data.data.total_hospitals);
            }
        } catch (error) {
            console.error('Error searching hospitals:', error);
            alert('Failed to search hospitals. Please try again.');
        } finally {
            setSearching(false);
        }
    };

    const clearFilters = () => {
        setPincode("");
        setSelectedState("");
        setSelectedCity("");
        setAvailableCities([]);
        setHospitals([]);
        setTotalHospitals(0);
        setSearchPerformed(false);
    };

    return (
        <EmployeeLayout employee={employee}>
            <Head title="Network Hospitals" />
            {/* Top Header Bar */}
            <div className="bg-white rounded-t-2xl px-6 py-3 mt-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.visit(`/employee/policy/${btoa(policy.id)}`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors group"
                    >
                        <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold">Back to Policy</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{policy.policy_number}</span>
                        {insurance_company.logo && (
                            <img
                                src={`/${insurance_company.logo}`}
                                className="h-8 w-auto object-contain"
                                alt={insurance_company.name}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden bg-white rounded-b-2xl shadow-sm mb-4">
                {/* Main Content - 60% */}
                <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    <div className="max-w-4xl">
                        {/* Compact Title Card */}
                        <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100 rounded-3xl p-4 shadow-sm mb-6 relative">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">🏥</span>
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold text-gray-800">Find Network Hospitals</h1>
                                        <p className="text-sm text-gray-600">{policy.policy_name}</p>
                                    </div>
                                </div>
                                <button className="w-8 h-8 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center shadow-md transition-all">
                                    <HeartIcon className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Attractive Search Section */}
                        <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 rounded-3xl p-5 shadow-xl border border-purple-100 mb-6 relative overflow-hidden">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full -ml-12 -mb-12"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-lg">
                                        <MagnifyingGlassIcon className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">🎯 Find cashless treatment facilities near you</h2>
                                        <p className="text-xs text-gray-600">Flexible Search</p>
                                    </div>
                                </div>

                                {searchType === 'pincode_only' ? (
                                    /* Pincode Only Search (PHS TPA) */
                                    <div className="space-y-5">
                                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-4 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg">💡</span>
                                                <span className="text-sm font-bold text-blue-800">Pincode Search</span>
                                            </div>
                                            <p className="text-sm text-blue-700">
                                                Enter your area pincode to find nearby hospitals
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-gray-700">
                                                Pincode *
                                            </label>
                                            <input
                                                type="text"
                                                value={pincode}
                                                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                                                placeholder="Enter 6-digit pincode"
                                                maxLength="6"
                                                className="w-full px-3 py-3 text-base rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-white shadow-sm"
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={handleSearch}
                                                disabled={searching || !pincode || pincode.length !== 6}
                                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 text-sm"
                                            >
                                                {searching ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        <span>Searching...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <MagnifyingGlassIcon className="w-4 h-4" />
                                                        <span>Search Hospitals</span>
                                                    </>
                                                )}
                                            </button>
                                            {pincode && (
                                                <button
                                                    onClick={clearFilters}
                                                    className="px-4 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                                                >
                                                    <XMarkIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* State/City OR Pincode Search */
                                    <div className="space-y-5">
                                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg">🎯</span>
                                                <span className="text-sm font-bold text-purple-800">Flexible Search</span>
                                            </div>
                                            <p className="text-sm text-purple-700">
                                                Search by pincode OR select state and city
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-700">
                                                    Pincode
                                                </label>
                                                <input
                                                    type="text"
                                                    value={pincode}
                                                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                                                    placeholder="6-digit code"
                                                    maxLength="6"
                                                    disabled={selectedState || selectedCity}
                                                    className="w-full px-3 py-3 text-base rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed bg-white shadow-sm"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-700">
                                                    State
                                                </label>
                                                <select
                                                    value={selectedState}
                                                    onChange={(e) => setSelectedState(e.target.value)}
                                                    disabled={pincode}
                                                    className="w-full px-3 py-3 text-base rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white shadow-sm"
                                                >
                                                    <option value="">Select State</option>
                                                    {searchOptions?.states?.map((state, index) => (
                                                        <option key={index} value={state.state}>
                                                            {state.state}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-700">
                                                    City
                                                </label>
                                                <select
                                                    value={selectedCity}
                                                    onChange={(e) => setSelectedCity(e.target.value)}
                                                    disabled={pincode || !selectedState}
                                                    className="w-full px-3 py-3 text-base rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white shadow-sm"
                                                >
                                                    <option value="">Select City</option>
                                                    {availableCities.map((city, index) => (
                                                        <option key={index} value={city}>
                                                            {city}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={handleSearch}
                                                disabled={searching || (!pincode && !selectedState)}
                                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 text-sm"
                                            >
                                                {searching ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        <span>Searching...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <MagnifyingGlassIcon className="w-4 h-4" />
                                                        <span>Search Hospitals</span>
                                                    </>
                                                )}
                                            </button>
                                            {(pincode || selectedState || selectedCity) && (
                                                <button
                                                    onClick={clearFilters}
                                                    className="px-4 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Clear</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Results Section */}
                        {searchPerformed && (
                            <div className="bg-white rounded-2xl border border-gray-100">
                                <div className="p-4 border-b border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-800 uppercase">Results ({totalHospitals})</h3>
                                </div>

                                {hospitals.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {hospitals.map((hospital, index) => (
                                            <div key={index} className="p-4 hover:bg-gray-50 transition-all">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <BuildingOffice2Icon className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-gray-800 text-sm mb-1">{hospital.hospital_name}</h4>
                                                        {hospital.hospital_type && (
                                                            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded mb-2">
                                                                {hospital.hospital_type}
                                                            </span>
                                                        )}
                                                        <div className="space-y-1">
                                                            {(hospital.address_line_1 || hospital.address_line_2) && (
                                                                <p className="text-xs text-gray-600">
                                                                    {[hospital.address_line_1, hospital.address_line_2, hospital.landmark, hospital.location]
                                                                        .filter(Boolean)
                                                                        .join(', ')}
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-gray-800 font-semibold">
                                                                {[hospital.city, hospital.state, hospital.pincode]
                                                                    .filter(Boolean)
                                                                    .join(', ')}
                                                            </p>
                                                            <div className="flex items-center gap-3 text-xs">
                                                                {hospital.phone && (
                                                                    <a href={`tel:${hospital.phone}`} className="text-purple-600 hover:text-purple-700 font-medium">
                                                                        📞 {hospital.phone}
                                                                    </a>
                                                                )}
                                                                {hospital.email && (
                                                                    <a href={`mailto:${hospital.email}`} className="text-purple-600 hover:text-purple-700 font-medium truncate">
                                                                        ✉️ {hospital.email}
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 px-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <BuildingOffice2Icon className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 font-semibold text-sm">No hospitals found</p>
                                        <p className="text-gray-400 text-xs mt-1">Try different search criteria</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Sidebar - 40% */}
                <aside className="hidden xl:block w-96 border-l border-gray-100 overflow-y-auto scrollbar-hide">
                    <div className="p-5">
                        {/* Policy Info Card */}
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <DocumentTextIcon className="w-4 h-4 text-gray-600" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Policy Info</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-xs text-gray-500">Policy Name</p>
                                    <p className="text-sm font-bold text-gray-800">{policy.policy_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Policy Number</p>
                                    <p className="text-sm font-semibold text-gray-700">{policy.policy_number}</p>
                                </div>
                                <button
                                    onClick={() => router.visit(`/employee/policy/${btoa(policy.id)}`)}
                                    className="w-full mt-2 bg-white hover:bg-gray-50 border-2 border-orange-200 text-orange-600 font-bold py-2 px-4 rounded-xl transition-all text-xs"
                                >
                                    View Full Details
                                </button>
                            </div>
                        </div>

                        {/* Claim Insurance Card */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">📋</span>
                                    <span className="font-bold text-gray-800 text-sm">CLAIM</span>
                                </div>
                                <CheckCircleIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            <p className="text-xs text-gray-600 mb-3">Do you want to claim insurance?</p>
                            <button
                                onClick={() => router.visit('/employee/claims')}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
                            >
                                Start Claim Process
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </EmployeeLayout>
    );
}
