import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { useTheme } from '../../../../Context/ThemeContext';

export default function Reports({ surveys = [], selectedIds = [] }) {
    const { darkMode } = useTheme();

    const downloadCSV = () => {
        // Simple CSV export: survey name, description, questions_count
        const rows = [ ['Survey ID','Survey Name','Description','Questions Count'] ];
        surveys.forEach(s => rows.push([s.id, s.name || '', (s.description||'').replace(/\n/g,' '), s.questions?.length || s.questions_count || 0]));
        const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `survey_reports_${selectedIds && selectedIds.length ? selectedIds.join('-') : 'all'}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <SuperAdminLayout>
            <Head title="Survey Reports" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl font-semibold text-gray-900">Survey Reports</h1>
                        <div className="flex items-center gap-2">
                            <Link href={route('superadmin.admin.surveys.index')} className="text-sm text-gray-600 hover:underline">Back to Surveys</Link>
                            <button onClick={downloadCSV} className="px-3 py-2 bg-[#934790] text-white text-sm rounded">Download CSV</button>
                        </div>
                    </div>

                    <div className={`bg-white rounded-lg shadow p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <p className="text-sm text-gray-600 mb-4">This report view shows selected survey summaries. More visualizations (radar/spider charts, question-wise analytics) can be added here and backed by aggregated `survey_responses` data.</p>

                        <div>
                            {surveys && surveys.length ? (
                                <table className="w-full text-sm">
                                    <thead className="text-xs text-gray-500 uppercase">
                                        <tr>
                                            <th className="text-left py-2">ID</th>
                                            <th className="text-left py-2">Name</th>
                                            <th className="text-left py-2">Questions</th>
                                            <th className="text-left py-2">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {surveys.map(s => (
                                            <tr key={s.id} className="border-t">
                                                <td className="py-2">{s.id}</td>
                                                <td className="py-2 font-medium">{s.name}</td>
                                                <td className="py-2">{s.questions?.length || s.questions_count || 0}</td>
                                                <td className="py-2 text-gray-600">{s.description || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500">No surveys selected for reporting.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
