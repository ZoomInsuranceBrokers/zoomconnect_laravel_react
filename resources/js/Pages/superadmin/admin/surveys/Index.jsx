import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { useTheme } from '../../../../Context/ThemeContext';

export default function Index({ surveys }) {
    const [deleting, setDeleting] = useState(null);
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { darkMode } = useTheme();

    const handleDelete = (surveyId) => {
        if (confirm('Are you sure you want to delete this survey? All questions and assignments will be deleted.')) {
            setDeleting(surveyId);
            router.delete(route('superadmin.admin.surveys.destroy', surveyId), {
                onFinish: () => setDeleting(null),
            });
        }
    };

    return (
        <SuperAdminLayout>
            <Head title="Surveys" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-900">Survey Management</h1>
                        <Link
                            href={route('superadmin.admin.surveys.create')}
                            className="inline-flex items-center px-4 py-2 bg-[#934790] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-[#7a3a77] transition"
                        >
                            Create New Survey
                        </Link>
                    </div>

                    {/* Controls */}
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3 w-full sm:w-1/2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                placeholder="Search surveys..."
                                className="block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-[#934790] focus:ring-[#934790] px-3 py-2"
                            />
                        </div>
                        <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
                            <label className="text-[10px] text-gray-500">Rows:</label>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                className="text-xs rounded border-gray-300 px-2 py-1"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className={`bg-white rounded-lg shadow overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <table className="w-full min-w-max">
                            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
                                <tr>
                                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                                        Logo
                                    </th>
                                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                        Survey Name
                                    </th>
                                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                                        Description
                                    </th>
                                    <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                        Questions
                                    </th>
                                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {surveys && surveys.length > 0 ? (
                                    (() => {
                                        const filtered = surveys.filter((s) => {
                                            const q = (s.name || '') + ' ' + (s.description || '');
                                            return q.toLowerCase().includes(search.toLowerCase());
                                        });
                                        const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
                                        const current = Math.min(currentPage, totalPages);
                                        const start = (current - 1) * itemsPerPage;
                                        const paginated = filtered.slice(start, start + itemsPerPage);
                                        return paginated.map((survey) => (
                                            <tr
                                                key={survey.id}
                                                className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}
                                                onClick={() => {
                                                    setSelectedSurvey(survey);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    {survey.logo ? (
                                                        <img
                                                            src={`/${survey.logo}`}
                                                            alt={survey.name}
                                                            className="h-8 w-8 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-[10px]">
                                                            N/A
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    <div className="text-[10px] font-medium text-gray-900">
                                                        {survey.name}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="text-[10px] text-gray-500 truncate max-w-xs">
                                                        {survey.description || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-center whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-[10px] leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {survey.questions_count || 0}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-[10px]">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setSelectedSurvey(survey); setIsModalOpen(true); }}
                                                            className="flex items-center gap-1 text-[#934790] hover:underline font-medium text-xs"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                            <span>View</span>
                                                        </button>
                                                        <Link href={route('superadmin.admin.surveys.edit', survey.id)} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-blue-600 hover:underline font-medium text-xs">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.414 2.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.414-8.586z"/></svg>
                                                            <span>Edit</span>
                                                        </Link>
                                                        <Link href={route('superadmin.admin.surveys.questions', survey.id)} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[#6d28d9] hover:underline font-medium text-xs">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h8m-8 4h6"/></svg>
                                                            <span>Questions</span>
                                                        </Link>
                                                        <Link href={route('superadmin.admin.surveys.assign', survey.id)} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-green-600 hover:underline font-medium text-xs">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-4-4h-1"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20H4v-2a4 4 0 014-4h1"/><circle cx="12" cy="7" r="4" strokeWidth="2" stroke="currentColor" fill="none"/></svg>
                                                            <span>Assign</span>
                                                        </Link>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(survey.id); }} disabled={deleting === survey.id} className="flex items-center gap-1 text-red-600 hover:underline font-medium text-xs disabled:opacity-50">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a1 1 0 011 1v2H9V4a1 1 0 011-1z"/></svg>
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ));
                                    })()
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500 text-[11px]">
                                            No surveys found. Create your first survey to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="px-4 py-3 bg-white border-t flex items-center justify-between text-xs">
                            <div className="text-gray-600">Showing page {Math.min(currentPage, Math.max(1, Math.ceil((surveys.filter(s => ((s.name||'')+' '+(s.description||'')).toLowerCase().includes(search.toLowerCase())).length)/itemsPerPage)))} </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-2 py-1 bg-gray-100 rounded text-[10px]">Prev</button>
                                <button onClick={() => setCurrentPage(p => p + 1)} className="px-2 py-1 bg-gray-100 rounded text-[10px]">Next</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Modal */}
                {isModalOpen && selectedSurvey && (
                    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-30">
                        <div className="w-[480px] h-full bg-white shadow-xl p-0 overflow-y-auto relative flex flex-col">
                            {/* Close Button */}
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                onClick={() => setIsModalOpen(false)}
                            >
                                &times;
                            </button>

                            {/* Header */}
                            <div className="px-6 pt-6 pb-2 border-b flex items-center justify-between">
                                <h2 className="text-lg font-bold">
                                    {selectedSurvey.name}
                                </h2>
                            </div>

                            {/* Tabs */}
                            <ModalTabs selectedSurvey={selectedSurvey} />
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}

function ModalTabs({ selectedSurvey }) {
    const [activeTab, setActiveTab] = useState('details');

    return (
        <div className="flex flex-col h-full">
            {/* Tab Headers */}
            <div className="flex border-b px-6 pt-2 bg-white">
                <button
                    className={`py-2 px-4 text-sm font-semibold ${
                        activeTab === 'details'
                            ? 'border-b-2 border-[#934790] text-[#934790] bg-white'
                            : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('details')}
                >
                    Survey Details
                </button>
                <button
                    className={`py-2 px-4 text-sm font-semibold ${
                        activeTab === 'questions'
                            ? 'border-b-2 border-[#934790] text-[#934790] bg-white'
                            : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('questions')}
                >
                    Questions ({selectedSurvey.questions?.length || 0})
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 px-6 py-4 bg-white overflow-y-auto">
                {activeTab === 'details' && (
                    <div>
                        <div className="bg-white rounded-xl shadow p-4 mb-4 border">
                            {selectedSurvey.logo && (
                                <div className="mb-4">
                                    <img
                                        src={`/${selectedSurvey.logo}`}
                                        alt={selectedSurvey.name}
                                        className="h-24 w-24 rounded object-cover"
                                    />
                                </div>
                            )}

                            <div className="mb-3">
                                <strong className="text-xs text-gray-600">Survey Name</strong>
                                <div className="text-sm text-gray-900 mt-1">{selectedSurvey.name}</div>
                            </div>

                            <div className="mb-3">
                                <strong className="text-xs text-gray-600">Description</strong>
                                <div className="text-sm text-gray-900 mt-1">{selectedSurvey.description || '-'}</div>
                            </div>

                            <div className="mb-3">
                                <strong className="text-xs text-gray-600">Total Questions</strong>
                                <div className="text-sm text-gray-900 mt-1">{selectedSurvey.questions_count || 0}</div>
                            </div>

                        </div>
                    </div>
                )}

                {activeTab === 'questions' && (
                    <div>
                        {selectedSurvey.questions && selectedSurvey.questions.length > 0 ? (
                            selectedSurvey.questions.map((question, index) => (
                                <div key={question.id} className="bg-white rounded-xl shadow p-4 mb-3 border">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex px-2 py-1 text-[10px] font-semibold rounded bg-purple-100 text-[#934790]">
                                                Q{index + 1}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
                                            </span>
                                        </div>
                                        {question.required && (
                                            <span className="text-[10px] text-red-600 font-semibold">Required</span>
                                        )}
                                    </div>

                                    <div className="text-sm font-semibold text-gray-900 mb-2">
                                        {question.question}
                                    </div>

                                    {question.type === 'multiplechoice' && question.options && (
                                        <div className="ml-4">
                                            {question.options.map((option, idx) => (
                                                <div key={idx} className="text-xs text-gray-600 mb-1">
                                                    • {option}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {question.type === 'checkbox' && question.options && (
                                        <div className="ml-4">
                                            {question.options.map((option, idx) => (
                                                <div key={idx} className="text-xs text-gray-600 mb-1">
                                                    ☐ {option}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {question.type === 'rating' && (
                                        <div className="text-xs text-gray-600">
                                            Rating scale: 1-10
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-xs">No questions added yet.</p>
                                <Link
                                    href={route('superadmin.admin.surveys.questions', selectedSurvey.id)}
                                    className="text-[#934790] hover:underline text-xs font-medium mt-2 inline-block"
                                >
                                    Add Questions
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

