import { useForm, usePage, Head } from "@inertiajs/react";
import SuperAdminLayout from "../../../../Layouts/SuperAdmin/Layout";
import React from "react";
import Select from "react-select";

export default function Create({ companies = [], insurers = [] }) {
    const { flash, errors } = usePage().props;
    const { data, setData, post, processing } = useForm({
        cd_ac_name: "",
        cd_ac_no: "",
        min_balance: "",
        company_id: "",
        insurance_id: "",
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

    return (
        <SuperAdminLayout>
            <Head title="Add CD Account" />
            <div className="max-w-6xl mx-auto py-8">
                {/* Info Alert */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    <span className="text-xs text-blue-900">
                        Please add accurate information so that you can give access to your customers and run campaigns effectively.
                    </span>
                </div>

                {/* Show all backend errors at the top */}
                {renderAllBackendErrors()}

                {/* Section Heading */}
                <h2 className="text-xl font-bold mb-2">Add CD Account Details</h2>

                {/* Confirmation message */}
                {flash && flash.message && (
                    <div className="mb-4 p-3 rounded bg-green-100 text-green-800 text-center text-sm font-medium">
                        {flash.message}
                    </div>
                )}

                <form onSubmit={e => { e.preventDefault(); post("/superadmin/policy/cd-accounts"); }} className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <label className="block mb-1 font-semibold">
                                CD A/C Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="cd_ac_name"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                value={data.cd_ac_name}
                                onChange={handleChange}
                                placeholder="CD A/C Name"
                            />
                            {errors.cd_ac_name && (
                                <div className="text-red-500 text-xs mt-1">{errors.cd_ac_name}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">
                                CD A/C No. <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="cd_ac_no"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                value={data.cd_ac_no}
                                onChange={handleChange}
                                placeholder="CD A/C No."
                            />
                            {errors.cd_ac_no && (
                                <div className="text-red-500 text-xs mt-1">{errors.cd_ac_no}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Minimum Balance</label>
                            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                                <span className="flex items-center px-3 bg-gray-100 text-gray-700 font-semibold">Rs.</span>
                                <input
                                    type="number"
                                    name="min_balance"
                                    className="w-full px-3 py-2 border-none focus:ring-0 appearance-none"
                                    style={{ MozAppearance: 'textfield' }}
                                    value={data.min_balance}
                                    onChange={handleChange}
                                    placeholder="Enter Amount"
                                    min="0"
                                    step="0.01"
                                />
                                <style>{`
                                    input[type=number]::-webkit-inner-spin-button,
                                    input[type=number]::-webkit-outer-spin-button {
                                        -webkit-appearance: none;
                                        margin: 0;
                                    }
                                `}</style>
                                <span className="flex items-center px-3 bg-gray-100 text-gray-700 font-semibold">.00</span>
                            </div>
                            {errors.min_balance && (
                                <div className="text-red-500 text-xs mt-1">{errors.min_balance}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">
                                Select Company <span className="text-red-500">*</span>
                            </label>
                            <Select
                                options={companyOptions}
                                value={companyOptions.find(opt => opt.value === data.company_id) || null}
                                onChange={opt => setData("company_id", opt ? opt.value : "")}
                                placeholder="Select Company"
                                isClearable
                                classNamePrefix="react-select"
                            />
                            {errors.company_id && (
                                <div className="text-red-500 text-xs mt-1">{errors.company_id}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">
                                Select Insurance Company <span className="text-red-500">*</span>
                            </label>
                            <Select
                                options={insurerOptions}
                                value={insurerOptions.find(opt => opt.value === data.insurance_id) || null}
                                onChange={opt => setData("insurance_id", opt ? opt.value : "")}
                                placeholder="Select Insurance Company"
                                isClearable
                                classNamePrefix="react-select"
                            />
                            {errors.insurance_id && (
                                <div className="text-red-500 text-xs mt-1">{errors.insurance_id}</div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end mt-8">
                        <button
                            type="submit"
                            className="bg-[#934790] hover:bg-[#6A0066] text-white px-8 py-3 rounded-lg font-semibold text-base shadow transition focus:outline-none"
                            style={{ minWidth: 180 }}
                            disabled={processing}
                        >
                            Create CD A/C
                        </button>
                    </div>
                    <style>{`
                        .react-select__input-container input:focus,
                        .react-select__input-container input:active {
                            outline: none !important;
                            box-shadow: none !important;
                            border: none !important;
                        }
                        .react-select__control--is-focused {
                            border-color: #d1d5db !important;
                            box-shadow: none !important;
                        }
                        .react-select__control {
                            box-shadow: none !important;
                        }
                    `}</style>
                </form>
            </div>
        </SuperAdminLayout>
    );
}