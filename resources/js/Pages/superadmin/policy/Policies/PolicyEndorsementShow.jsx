import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';

export default function PolicyEndorsementShow({ endorsement, policy, cd_ac, company }) {
    const { flash } = usePage().props;
    const fileUrl = endorsement?.endorsement_copy
        ? (endorsement.endorsement_copy.startsWith('http') ? endorsement.endorsement_copy : ('/' + endorsement.endorsement_copy.replace(/^\/+/, '')))
        : null;

    return (
        <SuperAdminLayout>
            <Head title={`Endorsement ${endorsement.endorsement_no || endorsement.id}`} />

            <div className="p-4">
                {flash?.success && (
                    <div className="mb-3 p-3 rounded text-sm text-center bg-green-100 text-green-800 border border-green-200">✓ {flash.success}</div>
                )}
                {flash?.error && (
                    <div className="mb-3 p-3 rounded text-sm text-center bg-red-100 text-red-800 border border-red-200">✗ {flash.error}</div>
                )}

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-2">{policy.policy_name || policy.corporate_policy_name} — Endorsement</h2>
                    <div className="text-sm text-gray-600 mb-4">Endorsement No: <strong className="text-gray-800">{endorsement.endorsement_no || '-'}</strong></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-gray-500">Policy Number</div>
                            <div className="font-medium">{policy.policy_number || '-'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">Company</div>
                            <div className="font-medium">{company?.comp_name || '-'}</div>
                        </div>
                        {/* endorsement_type intentionally not shown */}
                        <div>
                            <div className="text-xs text-gray-500">Endorsement Date</div>
                            <div className="font-medium">{endorsement.endorsement_date ? new Date(endorsement.endorsement_date).toLocaleDateString('en-GB') : '-'}</div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="text-xs text-gray-500">CD Account</div>
                        <div className="font-medium">{cd_ac ? (cd_ac.cd_ac_name ?? cd_ac.account_name ?? '-') : '-'}</div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        {fileUrl ? (
                            <a href={fileUrl} target="_blank" rel="noreferrer" download className="px-4 py-2 bg-[#934790] text-white rounded">Download Copy</a>
                        ) : (
                            <span className="text-sm text-gray-500">No document uploaded.</span>
                        )}

                        <a href={route('superadmin.policy.policies.endorsements', policy.id)} className="px-4 py-2 border rounded text-sm">Back to endorsements</a>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
