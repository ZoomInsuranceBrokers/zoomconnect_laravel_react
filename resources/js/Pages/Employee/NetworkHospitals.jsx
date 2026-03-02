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

    // Dropdown open states
    const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

    // Search inputs for dropdowns
    const [stateSearchInput, setStateSearchInput] = useState("");
    const [citySearchInput, setCitySearchInput] = useState("");

    useEffect(() => {
        const handleClickOutside = () => {
            setStateDropdownOpen(false);
            setCityDropdownOpen(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

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
            {/* Main Container - full height */}
            <div className="flex flex-col bg-white rounded-2xl shadow-sm mt-2 sm:mt-4 mb-4 lg:overflow-hidden min-h-screen">
                {/* Top Header Bar */}
                <div className="px-4 sm:px-6 py-3  flex-shrink-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between gap-3 sm:gap-0">
                        <button
                            onClick={() => router.visit(`/employee/policy/${btoa(policy.id)}`)}
                            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors group "
                        >
                            <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-semibold text-sm sm:text-base">Back to Policy</span>
                        </button>
                        <div className="flex items-center gap-2 sm:gap-3">
                            {insurance_company.logo && (
                                <img
                                    src={`/${insurance_company.logo}`}
                                    className="h-6 sm:h-8 w-auto object-contain"
                                    alt={insurance_company.name}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:flex-1 lg:overflow-hidden min-h-0">
                    {/* Main Content */}
                    <main className="flex-1 p-4 sm:p-6 lg:overflow-y-auto scrollbar-hide">
                        <div className="max-w-4xl">
                            {/* Attractive Search Section */}
                            <div className="bg-gradient-to-br from-[#ffd4eb4d] via-purple-100/30 to-[#ffd4eb4d] rounded-3xl p-5 shadow-xl border border-purple-100 mb-6 relative ">
                                {/* Decorative background elements */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl z-10">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/60 to-pink-200/20 rounded-full -mr-16 -mt-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-purple-200/60 rounded-full -ml-12 -mb-12"></div>
                                </div>

                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-6 h-6 sm:w-10 sm:h-10 bg-white/80 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg sm:text-2xl">🏥</span>
                                    </div>
                                    <div>
                                        <h1 className="text-sm sm:text-lg font-semibold md:font-bold text-gray-800">Find cashless treatment facilities near you</h1>
                                    </div>
                                </div>

                                <div className="relative z-20">
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
                                                    📍 Pincode *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={pincode}
                                                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                                                    placeholder="Enter 6-digit pincode"
                                                    maxLength="6"
                                                    className="w-full px-3 py-1 md:py-2 text-sm md:text-base rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-white shadow-sm"
                                                />
                                            </div>
                                            <div className="flex gap-2 pt-2 flex-wrap">
                                                <button
                                                    onClick={handleSearch}
                                                    disabled={searching || !pincode || pincode.length !== 6}
                                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-2 md:py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap"
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
                                                        className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                                                    >
                                                        <XMarkIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        /* State/City OR Pincode Search */
                                        <div className="space-y-5">
                                            {/* <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg">🎯</span>
                                                <span className="text-sm font-bold text-purple-800">Flexible Search</span>
                                            </div>
                                            <p className="text-sm text-purple-700">
                                                Search by pincode OR select state and city
                                            </p>
                                        </div> */}

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <label className="block text-xs font-bold text-gray-700">
                                                        📍 Pincode
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={pincode}
                                                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                                                        placeholder="6-digit code"
                                                        maxLength="6"
                                                        disabled={selectedState || selectedCity}
                                                        className="w-full px-3 py-1 md:py-2 text-sm text-base rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed bg-white shadow-sm"
                                                    />
                                                </div>

                                                <div className="space-y-2 relative">
                                                    <label className="block text-xs font-bold text-gray-700">
                                                        🗺️ State
                                                    </label>
                                                    <button
                                                        type="button"
                                                        disabled={!!pincode}
                                                        onClick={(e) => { e.stopPropagation(); setStateDropdownOpen(o => !o); setCityDropdownOpen(false); }}
                                                        className="w-full px-3 py-1 md:py-2 text-sm rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed bg-white shadow-sm flex items-center justify-between"
                                                    >
                                                        <span className={selectedState ? 'text-gray-800' : 'text-gray-400'}>
                                                            {selectedState || 'Select State'}
                                                        </span>
                                                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${stateDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    </button>
                                                    {stateDropdownOpen && (
                                                        <div onClick={(e) => e.stopPropagation()} className="absolute z-50 w-full mt-1 bg-white border border-purple-200 rounded-xl shadow-xl overflow-hidden">
                                                            <div className="p-2 border-b border-gray-200">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search states..."
                                                                    value={stateSearchInput}
                                                                    onChange={(e) => setStateSearchInput(e.target.value.toLowerCase())}
                                                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </div>
                                                            <div className="max-h-52 overflow-y-auto scrollbar-hide">
                                                                <div
                                                                    onClick={() => { setSelectedState(''); setStateDropdownOpen(false); setStateSearchInput(""); }}
                                                                    className="px-4 py-2.5 text-sm text-gray-400 hover:bg-pink-100 cursor-pointer border-b border-gray-100 bg-pink-50"
                                                                >
                                                                    Select State
                                                                </div>
                                                                {searchOptions?.states?.filter(state =>
                                                                    state.state.toLowerCase().includes(stateSearchInput)
                                                                ).sort((a, b) => a.state.localeCompare(b.state)).map((state, index) => (
                                                                    <div
                                                                        key={index}
                                                                        onClick={() => { setSelectedState(state.state); setStateDropdownOpen(false); setStateSearchInput(""); }}
                                                                        className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between hover:bg-pink-100 transition-colors bg-gradient-to-r from-pink-50 to-pink-100 ${selectedState === state.state ? 'text-purple-700 font-semibold' : 'text-gray-700'
                                                                            }`}
                                                                    >
                                                                        <span>{state.state}</span>
                                                                        {selectedState === state.state && <span className="text-purple-500">✓</span>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-2 relative">
                                                    <label className="block text-xs font-bold text-gray-700">
                                                        🏙️ City
                                                    </label>
                                                    <button
                                                        type="button"
                                                        disabled={!!pincode || !selectedState}
                                                        onClick={(e) => { e.stopPropagation(); setCityDropdownOpen(o => !o); setStateDropdownOpen(false); }}
                                                        className="w-full px-3 py-1 md:py-2 text-sm rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed bg-white shadow-sm flex items-center justify-between"
                                                    >
                                                        <span className={selectedCity ? 'text-gray-800' : 'text-gray-400'}>
                                                            {selectedCity || 'Select City'}
                                                        </span>
                                                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    </button>
                                                    {cityDropdownOpen && (
                                                        <div onClick={(e) => e.stopPropagation()} className="absolute z-50 w-full mt-1 bg-white border border-purple-200 rounded-xl shadow-xl overflow-hidden">
                                                            <div className="p-2 border-b border-gray-200">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search cities..."
                                                                    value={citySearchInput}
                                                                    onChange={(e) => setCitySearchInput(e.target.value.toLowerCase())}
                                                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </div>
                                                            <div className="max-h-52 overflow-y-auto scrollbar-hide">
                                                                <div
                                                                    onClick={() => { setSelectedCity(''); setCityDropdownOpen(false); setCitySearchInput(""); }}
                                                                    className="px-4 py-2.5 text-sm text-gray-400 hover:bg-pink-100 cursor-pointer border-b border-gray-100 bg-gradient-to-r from-pink-50 to-pink-100"
                                                                >
                                                                    Select City
                                                                </div>
                                                                {availableCities.filter(city =>
                                                                    city.toLowerCase().includes(citySearchInput)
                                                                ).sort().map((city, index) => (
                                                                    <div
                                                                        key={index}
                                                                        onClick={() => { setSelectedCity(city); setCityDropdownOpen(false); setCitySearchInput(""); }}
                                                                        className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between hover:bg-pink-100 transition-colors bg-pink-50 ${selectedCity === city ? 'text-purple-700 font-semibold' : 'text-gray-700'
                                                                            }`}
                                                                    >
                                                                        <span>{city}</span>
                                                                        {selectedCity === city && <span className="text-purple-500">✓</span>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-2 flex-wrap">
                                                <button
                                                    onClick={handleSearch}
                                                    disabled={searching || (!pincode && !selectedState)}
                                                    className="bg-[#934790] hover:bg-[#571754] disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap"
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
                                                        className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-1"
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
                                        <div className="space-y-3 p-4">
                                            {hospitals.map((hospital, index) => (
                                                <div
                                                    key={index}
                                                    className="group relative bg-gradient-to-br from-[#ffd4eb4d] via-purple-100/30 to-[#ffd4eb4d] rounded-2xl border border-purple-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-5"
                                                >
                                                    {/* Dynamic Left Accent Bar (Shows on Hover) */}
                                                    <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-[#934790] to-[#d75bd2] opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>

                                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">

                                                        {/* LEFT CONTENT */}
                                                        <div className="flex-1 min-w-0 w-full">
                                                            <h4 className="font-bold text-[#b351af] text-lg mb-1 group-hover:text-[#934790] transition-colors line-clamp-2">
                                                                {hospital.hospital_name}
                                                            </h4>

                                                            <div className="flex items-start gap-3">
                                                                {/* <div className="p-1.5 bg-purple-50 rounded-lg flex-shrink-0 mt-0.5">
                                                                    <MapPinIcon className="w-4 h-4 text-purple-600" />
                                                                </div> */}
                                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                                    {[hospital.address_line_1, hospital.address_line_2, hospital.city, hospital.state, hospital.pincode]
                                                                        .filter(Boolean)
                                                                        .join(', ')}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* ACTION BUTTONS */}
                                                        <div className="flex flex-row sm:flex-col items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-50">

                                                            {/* Phone Button */}
                                                            {(hospital.phone || hospital.mobile) && (
                                                                <a
                                                                    href={`tel:${hospital.phone || hospital.mobile}`}
                                                                    className="flex flex-1 sm:flex-none items-center justify-center gap-2 w-full sm:w-9 sm:h-9 px-4 sm:px-0 py-2.5 sm:py-0 rounded-xl bg-red-50 text-red-700 hover:bg-red-500 hover:text-white hover:shadow-md transition-all duration-200"
                                                                    title={hospital.phone || hospital.mobile}
                                                                >
                                                                    <PhoneIcon className="w-5 h-5" />
                                                                    {/* Text only visible on mobile for better tap targets */}
                                                                    <span className="sm:hidden font-medium text-sm">Call Now</span>
                                                                </a>
                                                            )}

                                                            {/* Map Button */}
                                                            <a
                                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                                    [hospital.hospital_name, hospital.address_line_1, hospital.city, hospital.state]
                                                                        .filter(Boolean)
                                                                        .join(', ')
                                                                )}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex flex-1 sm:flex-none items-center justify-center gap-2 w-full sm:w-9 sm:h-9 px-4 sm:px-0 py-2.5 sm:py-0 rounded-xl bg-[#f1dfff] text-purple-700 hover:bg-purple-600 hover:text-white hover:shadow-md transition-all duration-200"
                                                                title="View on Map"
                                                            >
                                                                <MapPinIcon className="w-5 h-5" />
                                                                {/* Text only visible on mobile for better tap targets */}
                                                                <span className="sm:hidden font-medium text-sm">Directions</span>
                                                            </a>
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

                    {/* Sidebar - Visible on all screens */}
                    <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-100 lg:overflow-y-auto scrollbar-hide">
                        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                            {/* Policy Info Card */}
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <DocumentTextIcon className="w-4 h-4 text-orange-600" />
                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Policy Info</span>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">Policy Name</p>
                                        <p className="text-sm font-bold text-gray-800 leading-snug">{policy.policy_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">Policy Number</p>
                                        <p className="text-sm font-semibold text-gray-700">{policy.policy_number}</p>
                                    </div>
                                    <button
                                        onClick={() => router.visit(`/employee/policy/${btoa(policy.id)}`)}
                                        className="w-full mt-1 bg-white hover:bg-orange-50 border-2 border-orange-200 text-orange-600 font-bold py-2 px-4 rounded-xl transition-all text-xs"
                                    >
                                        View Full Details
                                    </button>
                                </div>
                            </div>

                            {/* Claim Insurance Card */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">📋</span>
                                    <span className="font-bold text-gray-800 text-sm">Start a Claim</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-3 leading-relaxed">Found a network hospital? You can initiate a cashless claim directly.</p>
                                <button
                                    onClick={() => router.visit('/employee/claims/initiate')}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
                                >
                                    Start Claim Process
                                </button>
                            </div>
                        </div>
                    </aside>                </div>            </div>
        </EmployeeLayout>
    );
}
