import React from 'react';
import { Head } from '@inertiajs/react';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { DocumentTextIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Claims({ employee }) {
    const claims = [
        { id: 1, type: 'Medical', amount: '$500', status: 'Pending', date: '2026-01-18' },
        { id: 2, type: 'Dental', amount: '$200', status: 'Approved', date: '2026-01-10' },
        { id: 3, type: 'Vision', amount: '$150', status: 'Processing', date: '2026-01-15' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-600';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-600';
            case 'Processing':
                return 'bg-blue-100 text-blue-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <EmployeeLayout employee={employee}>
            <Head title="My Claims" />
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-white rounded-2xl shadow-sm my-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">My Claims</h1>
                        <button className="bg-[rgb(147,71,144)] text-white px-6 py-3 rounded-xl hover:bg-[rgb(106,0,102)] transition-all shadow-md">
                            + New Claim
                        </button>
                    </div>

                    {/* Claims List */}
                    <div className="space-y-4">
                        {claims.map((claim) => (
                            <div
                                key={claim.id}
                                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <DocumentTextIcon className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-lg">{claim.type} Claim</h3>
                                            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                                <ClockIcon className="w-4 h-4" />
                                                {claim.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-gray-800 mb-2">{claim.amount}</p>
                                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(claim.status)}`}>
                                            {claim.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {claims.length === 0 && (
                        <div className="text-center py-16">
                            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No claims found</p>
                            <p className="text-sm text-gray-400 mt-2">Submit your first claim to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </EmployeeLayout>
    );
}
