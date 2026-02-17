import React, { useRef, useState } from 'react';
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';
import { router } from '@inertiajs/react';

export default function UploadEnrollmentData({ enrollmentPeriodId }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [jobStatus, setJobStatus] = useState(null);
    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(null);
            setError(null);
        }
    };

    const handleUploadAndValidate = async () => {
        if (!file) {
            setError('Please select a CSV file');
            return;
        }
        setUploading(true);
        setError(null);
        setPreview(null);
        const formData = new FormData();
        formData.append('csv_file', file);
        try {
            const response = await fetch(`/superadmin/policy/upload-enrollment-data/${enrollmentPeriodId}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });
            const result = await response.json();
            if (result.success) {
                setPreview(result.preview);
            } else {
                setError(result.message || 'Validation failed');
            }
        } catch (err) {
            setError('Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleConfirmAndProcess = () => {
        if (!preview) return;
        setProcessing(true);
        setJobStatus(null);
        router.post(
            `/superadmin/policy/process-enrollment-bulk/${enrollmentPeriodId}`,
            {
                uploaded_file_path: preview.uploaded_file_path,
            },
            {
                onSuccess: (page) => {
                    setProcessing(false);
                    const msg = page?.props?.message || 'Bulk upload submitted! Processing in background.';
                    setJobStatus(msg);
                    setPreview(null);
                    setFile(null);
                    // Redirect to bulk actions page after success, passing message as query param
                    window.location.href = `/superadmin/policy/enrollment-bulk-actions/${enrollmentPeriodId}?msg=${encodeURIComponent(msg)}`;
                },
                onError: () => {
                    setProcessing(false);
                    setJobStatus('Failed to submit bulk upload.');
                },
            }
        );
    };

    const downloadSample = () => {
        window.location.href = '/superadmin/download-enrolment-sample-csv';
    };

    return (
        <SuperAdminLayout>
            <div className="p-4 max-w-3xl mx-auto">
                <h1 className="text-lg font-bold mb-4 text-gray-800">Bulk Upload Enrollment Data</h1>
                {jobStatus && (
                    <div className="mb-4 p-3 rounded-md text-sm bg-green-100 border border-green-400 text-green-700">
                        {jobStatus}
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h2 className="text-sm font-semibold text-blue-800 mb-2">Instructions</h2>
                    <ol className="list-decimal list-inside text-xs text-blue-700 space-y-1">
                        <li>Download the sample CSV template below</li>
                        <li>Fill in your enrollment data following the format</li>
                        <li>Upload the completed CSV file</li>
                        <li>Review the validation results and preview</li>
                        <li>Confirm to process the bulk upload</li>
                    </ol>
                    <button
                        onClick={downloadSample}
                        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium"
                    >
                        Download Sample CSV
                    </button>
                </div>

                {/* Upload Section */}
                {!preview && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-md font-semibold text-gray-800 mb-4">Upload CSV File</h2>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                                id="csv-upload"
                                ref={fileInputRef}
                            />
                            <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-sm text-gray-600">Click to select CSV file or drag and drop</p>
                                <p className="text-xs text-gray-500 mt-1">CSV files only (max 10MB)</p>
                            </label>
                        </div>
                        {file && (
                            <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-sm text-gray-700">{file.name}</span>
                                    <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(2)} KB)</span>
                                </div>
                                <button onClick={() => setFile(null)} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                            </div>
                        )}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setFile(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadAndValidate}
                                disabled={!file || uploading}
                                className={`px-4 py-2 rounded-md text-sm text-white ${!file || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#934790] hover:bg-[#7e3d7c]'}`}
                            >
                                {uploading ? 'Validating...' : 'Upload & Validate'}
                            </button>
                        </div>
                        {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
                    </div>
                )}

                {/* Preview Section */}
                {preview && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-md font-semibold text-gray-800 mb-4">Validation Results</h2>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-xs text-blue-600 mb-1">Total Records</p>
                                <p className="text-2xl font-bold text-blue-800">{preview.total}</p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-xs text-green-600 mb-1">Valid Records</p>
                                <p className="text-2xl font-bold text-green-800">{preview.valid}</p>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-xs text-red-600 mb-1">Invalid Records</p>
                                <p className="text-2xl font-bold text-red-800">{preview.invalid}</p>
                            </div>
                        </div>
                        {/* Invalid Records */}
                        {preview.invalid_rows && preview.invalid_rows.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-red-700 mb-3">Invalid Records ({preview.invalid_rows.length})</h3>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                                    {preview.invalid_rows.map((row, index) => (
                                        <div key={index} className="mb-2 pb-2 border-b border-red-200 last:border-0">
                                            <p className="text-xs text-red-800 font-medium">Employee: {row["Employee Code"]} - {row["Email"]}</p>
                                            <p className="text-xs text-red-600 mt-1">{row._error}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Valid Records Preview */}
                        {preview.valid_rows && preview.valid_rows.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-green-700 mb-3">Valid Records (showing first 10)</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs border border-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {preview.headers && preview.headers.map((header, i) => (
                                                    <th key={i} className="px-2 py-1 text-left text-[10px] font-medium text-gray-600 border-b">{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {preview.valid_rows.map((row, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    {preview.headers && preview.headers.map((header, i) => (
                                                        <td key={i} className="px-2 py-1 border-b text-gray-700">{row[header] || '-'}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setPreview(null);
                                    setFile(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Upload Different File
                            </button>
                            <button
                                onClick={handleConfirmAndProcess}
                                disabled={processing || preview.valid === 0}
                                className={`px-4 py-2 rounded-md text-sm text-white ${processing || preview.valid === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                {processing ? 'Processing...' : `Confirm & Process ${preview.valid} Records`}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
