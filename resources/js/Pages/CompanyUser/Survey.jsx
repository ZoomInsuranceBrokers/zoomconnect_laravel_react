import React, { useState } from 'react';
import CompanyUserLayout from '@/Layouts/CompanyUserLayout';
import {
    FiSearch as Search,
    FiFilter as Filter,
    FiDownload as Download,
    FiEye as Eye,
} from 'react-icons/fi';

export default function Survey({ user, surveys }) {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <CompanyUserLayout user={user} pageTitle="Survey">
            {/* Search and Actions */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search surveys..."
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
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#2e2838] text-white rounded-lg hover:bg-[#3d3647]">
                            Create Survey
                        </button>
                    </div>
                </div>
            </div>

            {/* Surveys Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {surveys?.data?.length > 0 ? (
                    surveys.data.map((survey) => (
                        <div key={survey.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                        {survey.title || survey.survey_title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {survey.description || 'No description available'}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ml-2 ${
                                    survey.is_active 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {survey.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Questions:</span>
                                    <span className="font-semibold text-gray-800">{survey.questions_count || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Responses:</span>
                                    <span className="font-semibold text-gray-800">{survey.responses_count || 0}</span>
                                </div>
                                {survey.response_rate && (
                                    <div className="pt-2">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-gray-600">Response Rate:</span>
                                            <span className="font-semibold text-gray-800">{survey.response_rate}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full" 
                                                style={{ width: `${survey.response_rate}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors">
                                    <Eye className="w-4 h-4" />
                                    <span>View</span>
                                </button>
                                <button className="flex-1 px-4 py-2 bg-[#2e2838] text-white rounded-lg hover:bg-[#3d3647] text-sm transition-colors">
                                    Results
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No surveys found
                    </div>
                )}
            </div>
        </CompanyUserLayout>
    );
}
