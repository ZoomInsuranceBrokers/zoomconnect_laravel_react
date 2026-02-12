import React, { useState } from 'react';
import CompanyUserLayout from '@/Layouts/CompanyUserLayout';
import {
    FiSearch as Search,
    FiFilter as Filter,
    FiDownload as Download,
    FiFileText as FileText,
} from 'react-icons/fi';

export default function Policies({ user, policies }) {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <CompanyUserLayout user={user} pageTitle="Policies">
            {/* Search and Actions */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search policies..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Policies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies?.data?.length > 0 ? (
                    policies.data.map((policy) => (
                        <div key={policy.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                    policy.is_active 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {policy.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {policy.policy_name}
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex justify-between">
                                    <span>Policy Number</span>
                                    <span className="font-medium">{policy.policy_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Insurance</span>
                                    <span className="font-medium">{policy.insurance?.insurance_name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>TPA</span>
                                    <span className="font-medium">{policy.tpa?.tpa_name || 'N/A'}</span>
                                </div>
                            </div>
                            <button className="w-full bg-[#2e2838] text-white py-2 rounded-lg hover:bg-[#3d3647] transition-colors">
                                View Details
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No policies found
                    </div>
                )}
            </div>
        </CompanyUserLayout>
    );
}
