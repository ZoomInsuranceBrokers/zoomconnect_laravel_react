// Hide number input spinners for all browsers
const numberInputNoSpinner = `
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type=number] {
        -moz-appearance: textfield;
    }
`;

import { useForm, usePage, Head } from "@inertiajs/react";
import Swal from 'sweetalert2';
import { Inertia } from '@inertiajs/inertia';
import SuperAdminLayout from "../../../../Layouts/SuperAdmin/Layout";
import React from "react";
import Select from "react-select";

export default function Details({ cdAccount, companies = [], insurers = [], transactions = [] }) {
    // Delete transaction handler
    const handleDeleteTransaction = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this transaction?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.delete(`/superadmin/policy/cd-accounts/transaction/${id}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.close();
                        window.location.reload();
                    },
                    onError: () => {
                        Swal.fire('Error', 'Failed to delete transaction.', 'error');
                    }
                });
            }
        });
    };
    // Pagination state for transactions
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    const currentItems = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    // Modal state for Add Transaction
    const [showModal, setShowModal] = React.useState(false);
    const [transactionForm, setTransactionForm] = React.useState({
        transaction_name: "",
        transaction_date: "",
        premium: "",
        transaction_type: "",
        cd_balance_remaining: "",
        cd_file: null,
        remarks: ""
    });
    const [transactionErrors, setTransactionErrors] = React.useState({});

    const handleTransactionChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setTransactionForm(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setTransactionForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTransactionSubmit = (e) => {
        e.preventDefault();
        let errors = {};
        if (!transactionForm.transaction_name) errors.transaction_name = "Please enter transaction name";
        if (!transactionForm.transaction_date) errors.transaction_date = "Please enter transaction date";
        if (!transactionForm.premium) errors.premium = "Please enter premium";
        if (!transactionForm.transaction_type) errors.transaction_type = "Please select transaction type";
        if (!transactionForm.cd_balance_remaining) errors.cd_balance_remaining = "Please enter CD balance remaining";
        if (!transactionForm.cd_file) errors.cd_file = "Please upload CD A/C latest statement";
        if (!transactionForm.remarks) errors.remarks = "Please enter remarks";
        setTransactionErrors(errors);
        if (Object.keys(errors).length > 0) return;
        const formData = new FormData();
        Object.entries(transactionForm).forEach(([key, value]) => {
            formData.append(key, value);
        });
        formData.append('cd_ac_id', cdAccount.id);
        formData.append('comp_id', cdAccount.comp_id);
        Inertia.post('/superadmin/policy/cd-accounts/transaction', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                Inertia.visit(`/superadmin/policy/cd-accounts/${cdAccount.id}/cd-details`, { replace: true });
            },
            onError: (err) => {
                setTransactionErrors(err);
            }
        });
    };
    const { flash, errors } = usePage().props;

    // Show success message if transaction added
    React.useEffect(() => {
        if (flash && flash.message) {
            alert(flash.message);
        }
    }, [flash]);
    const { data, setData, put, processing } = useForm({
        cd_ac_name: cdAccount.cd_ac_name || "",
        cd_ac_no: cdAccount.cd_ac_no || "",
        minimum_balance: cdAccount.minimum_balance || "",
        comp_id: cdAccount.comp_id || "",
        ins_id: cdAccount.ins_id || "",
        status: cdAccount.status ?? 1,
        cd_folder: cdAccount.cd_folder || "",
        statement_file: cdAccount.statement_file || "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    // For react-select
    const companyOptions = companies.map(company => ({ value: company.id, label: company.company_name }));
    const insurerOptions = insurers.map(ins => ({ value: ins.id, label: ins.insurance_name }));

    // Show all backend errors at the top
    const renderAllBackendErrors = () => {
        if (!errors) return null;
        return Object.keys(errors).map((key) =>
            Array.isArray(errors[key])
                ? errors[key].map((msg, i) => (
                    <div key={key + i} className="text-red-600 text-sm mb-1 text-center">
                        {msg}
                    </div>
                ))
                : (
                    <div key={key} className="text-red-600 text-sm mb-1 text-center">
                        {errors[key]}
                    </div>
                )
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/superadmin/policy/cd-accounts/${cdAccount.id}`);
    };

    // Find the corporate name from companies list
    const corporateName = companies.find(c => c.id === data.comp_id)?.company_name || "";

    return (
        <SuperAdminLayout>
            <style>{numberInputNoSpinner}</style>
            <Head title="CD Account Details" />
            <div className="max-w-6xl mx-auto py-8">
                {/* Top summary section */}
                <div className="mb-6 p-4 rounded-lg bg-gray-100 border border-gray-300 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="font-bold text-lg text-[#934790]">Corporate Name: <span className="font-normal text-black">{corporateName}</span></div>
                    <div className="font-bold text-lg text-[#934790]">CD A/C Name: <span className="font-normal text-black">{data.cd_ac_name}</span></div>
                    <div className="font-bold text-lg text-[#934790]">CD A/C No.: <span className="font-normal text-black">{data.cd_ac_no}</span></div>
                    <div className="font-bold text-lg text-[#934790]">Minimum CD Balance: <span className="font-normal text-black">{data.minimum_balance}</span></div>
                </div>

                {/* Transaction Table */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <button
                            type="button"
                            className="bg-[#934790] hover:bg-[#6A0066] text-white px-5 py-2 rounded-lg font-semibold text-sm shadow transition focus:outline-none"
                            onClick={() => setShowModal(true)}
                        >
                            + Add New Transaction
                        </button>
                        {/* Add Transaction Modal */}
                        {showModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                                <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl relative border border-gray-200">
                                    <h2 className="text-2xl font-bold mb-6 text-[#934790]">Add New Transaction</h2>
                                    <form onSubmit={handleTransactionSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                            <div>
                                                <label className="block font-semibold mb-2 text-gray-700">Transaction Name <span className="text-red-500">*</span></label>
                                                <input type="text" name="transaction_name" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition" value={transactionForm.transaction_name} onChange={handleTransactionChange} placeholder="Enter transaction name" />
                                                {transactionErrors.transaction_name && <div className="text-red-500 text-xs mt-2">{transactionErrors.transaction_name}</div>}
                                            </div>
                                            <div>
                                                <label className="block font-semibold mb-2 text-gray-700">Transaction Date <span className="text-red-500">*</span></label>
                                                <input type="date" name="transaction_date" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition" value={transactionForm.transaction_date} onChange={handleTransactionChange} placeholder="dd-mm-yyyy" />
                                                {transactionErrors.transaction_date && <div className="text-red-500 text-xs mt-2">{transactionErrors.transaction_date}</div>}
                                            </div>
                                            <div>
                                                <label className="block font-semibold mb-2 text-gray-700">Premium</label>
                                                <input type="number" name="premium" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition" value={transactionForm.premium} onChange={handleTransactionChange} min="0" step="0.01" placeholder="Enter premium" />
                                                {transactionErrors.premium && <div className="text-red-500 text-xs mt-2">{transactionErrors.premium}</div>}
                                            </div>
                                            <div>
                                                <label className="block font-semibold mb-2 text-gray-700">Transaction Type <span className="text-red-500">*</span></label>
                                                <select name="transaction_type" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition" value={transactionForm.transaction_type} onChange={handleTransactionChange}>
                                                    <option value="">Select Type</option>
                                                    <option value="Credit">Credit</option>
                                                    <option value="Debit">Debit</option>
                                                </select>
                                                {transactionErrors.transaction_type && <div className="text-red-500 text-xs mt-2">{transactionErrors.transaction_type}</div>}
                                            </div>
                                            <div>
                                                <label className="block font-semibold mb-2 text-gray-700">CD Balance Remaining</label>
                                                <input type="number" name="cd_balance_remaining" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition" value={transactionForm.cd_balance_remaining} onChange={handleTransactionChange} min="0" step="0.01" placeholder="Enter balance" />
                                                {transactionErrors.cd_balance_remaining && <div className="text-red-500 text-xs mt-2">{transactionErrors.cd_balance_remaining}</div>}
                                            </div>
                                            <div>
                                                <label className="block font-semibold mb-2 text-gray-700">CD A/C Latest Statement <span className="text-red-500">*</span></label>
                                                <input type="file" name="cd_file" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#f3e8f7] file:text-[#934790] hover:file:bg-[#e9d5ec]" onChange={handleTransactionChange} />
                                                {transactionErrors.cd_file && <div className="text-red-500 text-xs mt-2">{transactionErrors.cd_file}</div>}
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block font-semibold mb-2 text-gray-700">Remarks <span className="text-red-500">*</span></label>
                                                <textarea name="remarks" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition min-h-[60px]" value={transactionForm.remarks} onChange={handleTransactionChange} placeholder="Enter remarks" />
                                                {transactionErrors.remarks && <div className="text-red-500 text-xs mt-2">{transactionErrors.remarks}</div>}
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row justify-end gap-4 mt-6">
                                            <button type="submit" className="bg-[#934790] hover:bg-[#6A0066] text-white px-8 py-3 rounded-lg font-semibold shadow transition focus:outline-none w-full md:w-auto">Save Transaction</button>
                                            <button type="button" className="px-8 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 shadow w-full md:w-auto" onClick={() => setShowModal(false)}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        <h3 className="text-lg font-semibold">CD Account Transactions</h3>
                    </div>
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full min-w-[600px] border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200">Date</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200">TXN Name</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200">CD Balance</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200">TXN Amount</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200">TXN Type</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200">Remarks</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200">Documents</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                    currentItems.map((txn, idx) => (
                                        <tr key={txn.id || idx} className="hover:bg-gray-50 even:bg-gray-50/50">
                                            <td className="px-6 py-3 whitespace-nowrap text-[10px]">{
                                                txn.transaction_date
                                                    ? (txn.transaction_date.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || txn.transaction_date)
                                                    : ''
                                            }</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-[10px]">{txn.transaction_name}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-[10px]">{txn.cd_balance_remaining}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-[10px]">{txn.transaction_amt}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-[10px]">
                                                {txn.transaction_side && txn.transaction_side.toLowerCase() === 'debit' ? (
                                                    <span className="text-red-600 font-semibold">Debit</span>
                                                ) : txn.transaction_side && txn.transaction_side.toLowerCase() === 'credit' ? (
                                                    <span className="text-green-600 font-semibold">Credit</span>
                                                ) : (
                                                    txn.transaction_side
                                                )}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-[10px]">{txn.remarks}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-[10px]">
                                                {txn.file_url && <span className="ml-2"><a href={txn.file_url} target="_blank" rel="noopener noreferrer">Latest CD Statement</a></span>}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-[10px] flex gap-2">
                                                <button
                                                    type="button"
                                                    className="text-red-500 hover:text-red-700 p-1 rounded transition-colors duration-200"
                                                    title="Delete"
                                                    onClick={() => handleDeleteTransaction(txn.id)}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12zM10 11v6m4-6v6" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="text-center py-6 text-[10px] text-gray-500">No transactions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Card layout for mobile */}
                    <div className="sm:hidden">
                        {Array.isArray(transactions) && transactions.length === 0 ? (
                            <div className="text-center py-6 text-xs text-gray-500">No transactions found.</div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {transactions.map((txn, idx) => (
                                    <div
                                        key={txn.id || idx}
                                        className="rounded-xl shadow border px-4 py-3 flex flex-row items-center gap-2 bg-white border-gray-200"
                                    >
                                        <span className="flex-1 text-[10px] font-medium text-gray-900">{txn.transaction_name || '-'}</span>
                                        <span className="text-[10px] text-gray-500">{txn.transaction_date || '-'}</span>
                                        <span className="text-[10px] text-gray-500">{txn.cd_balance_remaining || '-'}</span>
                                        <span className="text-[10px] text-gray-500">{txn.transaction_amt || '-'}</span>
                                        <span className="text-[10px] text-gray-500">
                                            {txn.transaction_side === 'debit' ? (
                                                <span className="text-red-600 font-semibold">Debit</span>
                                            ) : txn.transaction_side === 'credit' ? (
                                                <span className="text-green-600 font-semibold">Credit</span>
                                            ) : (
                                                txn.transaction_side
                                            )}
                                        </span>
                                        <span className="text-[10px] text-gray-500">{txn.remarks || '-'}</span>
                                        <span className="text-[10px] text-gray-500">
                                            {txn.file_url && <a href={txn.file_url} target="_blank" rel="noopener noreferrer">Doc</a>}
                                        </span>
                                        <button
                                            type="button"
                                            className="bg-red-500 text-white px-3 py-1 rounded text-[10px]"
                                            onClick={() => handleDeleteTransaction(txn.id)}
                                        >Delete</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls (below table and card layout) */}
                    {transactions.length > 0 && (
                        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-4 py-2 text-[10px] font-medium rounded-md ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]'
                                        }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`ml-3 relative inline-flex items-center px-4 py-2 text-[10px] font-medium rounded-md ${currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center justify-between">
                                <div className="text-left">
                                    <p className="text-[10px] text-gray-500">
                                        Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, transactions.length)}</span> to{' '}
                                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, transactions.length)}</span> of{' '}
                                        <span className="font-medium">{transactions.length}</span> results
                                    </p>
                                </div>
                                <div className="text-right">
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        {/* Previous Page Button */}
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border bg-white text-[11px] md:text-xs font-medium ${currentPage === 1
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        {/* Page Numbers */}
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-[10px] font-medium ${currentPage === i + 1
                                                    ? 'bg-[#934790] text-white z-10'
                                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        {/* Next Page Button */}
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border bg-white text-[11px] md:text-xs font-medium ${currentPage === totalPages
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Confirmation message */}
                {flash && flash.message && (
                    <div className="mb-4 p-3 rounded bg-green-100 text-green-800 text-center text-sm font-medium">
                        {flash.message}
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
