import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { useTheme } from '../../../../Context/ThemeContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Line, Doughnut, Radar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function AssignedReports({ assignment, analytics }) {
    const { darkMode } = useTheme();
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { id: 'rating', label: 'Rating Questions', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
        { id: 'multiple', label: 'Multiple Choice', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
        { id: 'text', label: 'Text Responses', icon: 'M4 6h16M4 12h16M4 18h7' },
        { id: 'checkbox', label: 'Checkbox Questions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    ];

    // normalize analytics payload into local variables
    const ratingData = analytics?.rating_questions || [];
    const multipleChoiceData = analytics?.multiple_choice_questions || [];
    const textResponses = analytics?.text_questions || [];
    const checkboxData = analytics?.checkbox_questions || [];
    const overviewStats = {
        total_responses: analytics?.total_responses || 0,
        total_questions: analytics?.total_questions || 0,
        overall_avg_rating: analytics?.overall_avg_rating || 0,
    };
    const focusAreaAverages = analytics?.focus_area_averages || analytics?.focusAreaAverages || [];

    const downloadCSV = () => {
        const csvData = [];
        csvData.push(['Question Type', 'Question', 'Total Responses', 'Average Rating / Most Common Answer']);

        analytics.rating_questions?.forEach(q => {
            csvData.push(['Rating', q.question_text, q.response_count, q.avg_rating?.toFixed(2) || 'N/A']);
        });

        analytics.multiple_choice_questions?.forEach(q => {
            const topChoice = q.choices?.[0];
            csvData.push(['Multiple Choice', q.question_text, q.response_count, topChoice?.choice + ' (' + topChoice?.count + ')' || 'N/A']);
        });

        analytics.text_questions?.forEach(q => {
            csvData.push(['Text', q.question_text, q.response_count, 'See individual responses']);
        });

        analytics.checkbox_questions?.forEach(q => {
            const topOptions = q.options?.slice(0, 3).map(o => o.option).join(', ');
            csvData.push(['Checkbox', q.question_text, q.response_count, topOptions || 'N/A']);
        });

        const csv = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${assignment.name}_analytics_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };




    // Export to CSV
    const exportToCSV = () => {
        const csvRows = [];
        csvRows.push(['Survey Assignment Report']);
        csvRows.push(['Assignment Name', assignment.name]);
        csvRows.push(['Company', assignment.company?.comp_name || 'N/A']);
        csvRows.push(['Survey', assignment.survey?.name || 'N/A']);
        csvRows.push(['Start Date', new Date(assignment.survey_start_date).toLocaleDateString()]);
        csvRows.push(['End Date', new Date(assignment.survey_end_date).toLocaleDateString()]);
        csvRows.push(['Total Responses', overviewStats.total_responses]);
        csvRows.push([]);

        if (activeTab === 'rating' && ratingData.length > 0) {
            csvRows.push(['Rating Questions']);
            csvRows.push(['Question', 'Focus Area', 'Average Rating', 'Response Count']);
            ratingData.forEach(r => {
                csvRows.push([r.question, r.focus_area || 'N/A', r.avg_rating, r.response_count]);
            });
        } else if (activeTab === 'multiple' && multipleChoiceData.length > 0) {
            csvRows.push(['Multiple Choice Questions']);
            multipleChoiceData.forEach(m => {
                csvRows.push([m.question, `Responses: ${m.response_count}`]);
                Object.entries(m.distribution).forEach(([choice, count]) => {
                    csvRows.push(['', choice, count]);
                });
                csvRows.push([]);
            });
        } else if (activeTab === 'text' && textResponses.length > 0) {
            csvRows.push(['Text Responses']);
            textResponses.forEach(t => {
                csvRows.push([t.question, `Total: ${t.response_count}`]);
                t.responses.forEach((resp, idx) => {
                    csvRows.push([`Response ${idx + 1}`, resp]);
                });
                csvRows.push([]);
            });
        }

        const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `assignment_${assignment.id}_report.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Chart colors
    const chartColors = {
        primary: '#934790',
        secondary: '#6A0066',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
    };

    const getColorPalette = (count) => {
        const palette = [
            chartColors.primary,
            chartColors.info,
            chartColors.success,
            chartColors.warning,
            chartColors.danger,
            '#8b5cf6',
            '#ec4899',
            '#14b8a6',
            '#f97316',
            '#6366f1'
        ];
        return palette.slice(0, count);
    };

    // Overview Tab
    const renderOverview = () => {
        const focusAreaChartData = {
            labels: focusAreaAverages.map(f => f.focus_area),
            datasets: [{
                label: 'Average Rating by Focus Area',
                data: focusAreaAverages.map(f => f.avg_rating),
                backgroundColor: getColorPalette(focusAreaAverages.length).map(c => c + '80'),
                borderColor: getColorPalette(focusAreaAverages.length),
                borderWidth: 2,
                fill: true,
            }]
        };

        const radarOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 2,
                        color: darkMode ? '#9ca3af' : '#6b7280',
                    },
                    grid: {
                        color: darkMode ? '#374151' : '#e5e7eb',
                    },
                    pointLabels: {
                        color: darkMode ? '#d1d5db' : '#374151',
                        font: {
                            size: 11
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: darkMode ? '#d1d5db' : '#374151',
                    }
                }
            }
        };

        return (
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-5 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Responses</p>
                                <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{overviewStats.total_responses}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className={`p-5 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Questions</p>
                                <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{overviewStats.total_questions}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className={`p-5 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date Range</p>
                                <p className={`text-sm font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {new Date(assignment.survey_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(assignment.survey_end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Focus Area Radar Chart */}
                {focusAreaAverages.length > 0 && (
                    <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Average Ratings by Focus Area</h3>
                        <div style={{ height: '400px' }}>
                            <Radar data={focusAreaChartData} options={radarOptions} />
                        </div>
                    </div>
                )}

                {/* Focus Area Table */}
                {focusAreaAverages.length > 0 && (
                    <div className={`rounded-lg shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <table className="w-full">
                            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                <tr>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Focus Area</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Average Rating</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Responses</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {focusAreaAverages.map((fa, idx) => (
                                    <tr key={idx} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fa.focus_area}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                                                    <div className="bg-[#934790] h-2 rounded-full" style={{ width: `${(fa.avg_rating / 10) * 100}%` }}></div>
                                                </div>
                                                <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fa.avg_rating}/10</span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{fa.response_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    // Rating Questions Tab
    const renderRating = () => {
        if (!ratingData || ratingData.length === 0) {
            return <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No rating questions in this survey</div>;
        }

        return (
            <div className="space-y-6">
                {ratingData.map((rating, idx) => {
                    // Create a visual bar chart showing the rating score
                    const ratingValue = parseFloat(rating.avg_rating) || 0;
                    const barData = {
                        labels: ['Average Rating'],
                        datasets: [{
                            label: 'Rating Score (out of 10)',
                            data: [ratingValue],
                            backgroundColor: chartColors.primary + '80',
                            borderColor: chartColors.primary,
                            borderWidth: 2,
                        }]
                    };

                    const barOptions = {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        scales: {
                            x: {
                                beginAtZero: true,
                                max: 10,
                                ticks: {
                                    stepSize: 1,
                                    color: darkMode ? '#9ca3af' : '#6b7280',
                                },
                                grid: {
                                    color: darkMode ? '#374151' : '#e5e7eb',
                                }
                            },
                            y: {
                                ticks: {
                                    color: darkMode ? '#9ca3af' : '#6b7280',
                                },
                                grid: {
                                    display: false
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => `${context.parsed.x} / 10`
                                }
                            }
                        }
                    };

                    return (
                        <div key={idx} className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{rating.question_text}</h4>
                                    {rating.focus_area && (
                                        <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{rating.focus_area}</span>
                                    )}
                                </div>
                                <div className="text-right ml-4">
                                    <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ratingValue.toFixed(2)}</div>
                                    <div className="text-xs text-gray-500">Avg Rating (out of 10)</div>
                                    <div className="text-xs text-gray-500 mt-1">{rating.response_count} responses</div>
                                </div>
                            </div>
                            <div style={{ height: '120px' }}>
                                <Bar data={barData} options={barOptions} />
                            </div>
                            {/* Visual rating stars */}
                            <div className="mt-4 flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-gradient-to-r from-[#934790] to-[#6A0066] h-3 rounded-full transition-all"
                                        style={{ width: `${(ratingValue / 10) * 100}%` }}
                                    ></div>
                                </div>
                                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {((ratingValue / 10) * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Multiple Choice Tab
    const renderMultipleChoice = () => {
        if (!multipleChoiceData || multipleChoiceData.length === 0) {
            return <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No multiple choice questions in this survey</div>;
        }

        return (
            <div className="space-y-6">
                {multipleChoiceData.map((mc, idx) => {
                    // Backend can return either choices array or distribution object
                    let labels = [];
                    let values = [];
                    
                    if (Array.isArray(mc.choices)) {
                        labels = mc.choices.map(c => c.choice);
                        values = mc.choices.map(c => c.count);
                    } else if (mc.distribution && typeof mc.distribution === 'object') {
                        labels = Object.keys(mc.distribution);
                        values = Object.values(mc.distribution);
                    }

                    const totalResponses = values.reduce((sum, v) => sum + v, 0);

                    const doughnutData = {
                        labels,
                        datasets: [{
                            data: values,
                            backgroundColor: getColorPalette(labels.length),
                            borderWidth: 2,
                            borderColor: darkMode ? '#1f2937' : '#ffffff',
                        }]
                    };

                    const doughnutOptions = {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: {
                                    color: darkMode ? '#d1d5db' : '#374151',
                                    padding: 12,
                                    font: {
                                        size: 11
                                    },
                                    boxWidth: 12
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const percentage = ((context.parsed / totalResponses) * 100).toFixed(1);
                                        return `${context.label}: ${context.parsed} (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    };

                    return (
                        <div key={idx} className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{mc.question_text}</h4>
                            <p className="text-xs text-gray-500 mb-4">{mc.response_count} total responses</p>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Doughnut Chart */}
                                <div style={{ height: '280px' }}>
                                    <Doughnut data={doughnutData} options={doughnutOptions} />
                                </div>

                                {/* Data breakdown */}
                                <div className="flex flex-col justify-center">
                                    <div className="space-y-3">
                                        {labels.map((label, lidx) => {
                                            const count = values[lidx];
                                            const percentage = ((count / totalResponses) * 100).toFixed(1);
                                            return (
                                                <div key={lidx} className="flex items-center gap-3">
                                                    <div 
                                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: getColorPalette(labels.length)[lidx] }}
                                                    ></div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`text-xs font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {label}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                                                <div 
                                                                    className="h-1.5 rounded-full"
                                                                    style={{ 
                                                                        width: `${percentage}%`,
                                                                        backgroundColor: getColorPalette(labels.length)[lidx]
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs text-gray-500 font-medium">{percentage}%</span>
                                                        </div>
                                                    </div>
                                                    <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {count}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Text Responses Tab
    const renderTextResponses = () => {
        if (!textResponses || textResponses.length === 0) {
            return <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No text questions in this survey</div>;
        }

        return (
            <div className="space-y-6">
                {textResponses.map((text, idx) => {
                    // Backend returns responses array (may be array of strings or objects with response_text)
                    const responsesList = Array.isArray(text.responses) ? text.responses : [];
                    
                    return (
                        <div key={idx} className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{text.question_text}</h4>
                            <p className="text-xs text-gray-500 mb-4">{text.response_count} total responses (showing first {responsesList.length})</p>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {responsesList.map((resp, ridx) => {
                                    // Handle both string responses and object responses
                                    const responseText = typeof resp === 'string' ? resp : (resp.response_text || '');
                                    
                                    return (
                                        <div key={ridx} className={`p-3 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                            <div className="flex items-start gap-2">
                                                <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>#{ridx + 1}</span>
                                                <p className={`text-xs flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{responseText}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Checkbox Questions Tab
    const renderCheckbox = () => {
        if (!checkboxData || checkboxData.length === 0) {
            return <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No checkbox questions in this survey</div>;
        }

        return (
            <div className="space-y-6">
                {checkboxData.map((cb, idx) => {
                    // Backend returns options array: [{ option: 'Self', count: 74 }, ...]
                    const options = Array.isArray(cb.options) ? cb.options : [];
                    const labels = options.map(o => o.option);
                    const values = options.map(o => o.count);
                    const totalSelections = values.reduce((sum, v) => sum + v, 0);

                    const barData = {
                        labels,
                        datasets: [{
                            label: 'Number of Selections',
                            data: values,
                            backgroundColor: getColorPalette(labels.length).map(c => c + '80'),
                            borderColor: getColorPalette(labels.length),
                            borderWidth: 2,
                        }]
                    };

                    const barOptions = {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        scales: {
                            x: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 1,
                                    color: darkMode ? '#9ca3af' : '#6b7280',
                                },
                                grid: {
                                    color: darkMode ? '#374151' : '#e5e7eb',
                                }
                            },
                            y: {
                                ticks: {
                                    color: darkMode ? '#9ca3af' : '#6b7280',
                                    font: {
                                        size: 11
                                    }
                                },
                                grid: {
                                    display: false
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const percentage = ((context.parsed.x / totalSelections) * 100).toFixed(1);
                                        return `${context.parsed.x} selections (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    };

                    return (
                        <div key={idx} className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cb.question_text}</h4>
                            <p className="text-xs text-gray-500 mb-4">{cb.response_count} responses • {totalSelections} total selections</p>
                            
                            {/* Chart */}
                            <div style={{ height: Math.max(200, labels.length * 50) + 'px' }} className="mb-4">
                                <Bar data={barData} options={barOptions} />
                            </div>

                            {/* Data table */}
                            <div className="mt-4">
                                <table className="w-full text-xs">
                                    <thead className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <tr>
                                            <th className={`text-left py-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Option</th>
                                            <th className={`text-right py-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Count</th>
                                            <th className={`text-right py-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>%</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {options.map((opt, oidx) => (
                                            <tr key={oidx} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                                <td className={`py-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{opt.option}</td>
                                                <td className={`text-right py-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{opt.count}</td>
                                                <td className={`text-right py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {((opt.count / totalSelections) * 100).toFixed(1)}%
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <SuperAdminLayout>
            <Head title={`Reports - ${assignment.name}`} />

            <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route('superadmin.admin.surveys.assign', assignment.survey_id)}
                            className="text-xs text-[#934790] hover:underline mb-2 inline-block font-medium"
                        >
                            ← Back to Assignments
                        </Link>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                            <div>
                                <h1 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {assignment.name}
                                </h1>
                                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {assignment.company?.comp_name} • {assignment.survey?.name}
                                </p>
                            </div>
                            <button
                                onClick={exportToCSV}
                                className="bg-[#934790] hover:bg-[#6A0066] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export CSV
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className={`border-b mb-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex flex-wrap gap-2 md:gap-0">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-3 text-xs md:text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-[#934790] text-[#934790]'
                                            : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                                    }`}
                                >
                                        <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d={tab.icon} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                            {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div>
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'rating' && renderRating()}
                        {activeTab === 'multiple' && renderMultipleChoice()}
                        {activeTab === 'text' && renderTextResponses()}
                        {activeTab === 'checkbox' && renderCheckbox()}
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
