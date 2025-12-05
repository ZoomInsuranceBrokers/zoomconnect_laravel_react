import React from 'react';
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';
import { Head, Link } from '@inertiajs/react';

export default function WelcomeMailer({ user, mailers = [] }) {
    return (
        <SuperAdminLayout>
            <Head title="Welcome Mailers" />

            <div className="p-4 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-lg font-semibold">Welcome Mailers</h1>
                        <div className="text-xs text-gray-500">Create and manage welcome mail campaigns</div>
                    </div>
                    <div>
                        <Link href={route('superadmin.marketing.welcome-mailer.create')} className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1.5 rounded-lg text-[13px] font-medium">
                            Create Welcome Mailer
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4">
                    {mailers.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-[14px]">No welcome mailers yet. Create one to get started.</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="text-xs text-gray-500 border-b">
                                <tr>
                                    <th className="py-2 text-left">Name</th>
                                    <th className="py-2 text-left">Companies</th>
                                    <th className="py-2 text-left">Status</th>
                                    <th className="py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mailers.map((m) => (
                                    <tr key={m.id} className="hover:bg-gray-50">
                                        <td className="py-2">{m.name || m.subject || 'Untitled'}</td>
                                        <td className="py-2">{(m.companies || []).length}</td>
                                        <td className="py-2">{m.is_active ? 'Active' : 'Inactive'}</td>
                                        <td className="py-2">
                                            <Link href={route('superadmin.marketing.welcome-mailer.index')} className="text-sm text-[#934790]">View</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </SuperAdminLayout>
    );
}
