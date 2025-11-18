import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { useTheme } from '../../../../Context/ThemeContext';

const QUESTION_TYPES = [
    { value: 'text', label: 'Text Answer' },
    { value: 'multiplechoice', label: 'Multiple Choice (Single)' },
    { value: 'checkbox', label: 'Checkboxes (Multiple)' },
    { value: 'rating', label: 'Rating Scale' },
];

export default function Questions({ survey }) {
    const [questions, setQuestions] = useState(
        survey.questions?.length > 0
            ? survey.questions.map((q, idx) => ({
                  id: idx,
                  question: q.question,
                  type: q.type,
                  options: q.options || [],
                  focus_area: q.focus_area,
              }))
            : [{ id: 0, question: '', type: 'text', options: [], focus_area: '' }]
    );

    const { data, setData, post, processing, errors } = useForm({
        questions: questions,
    });

    const { darkMode } = useTheme();

    const addQuestion = () => {
        const newQuestion = {
            id: Date.now(),
            question: '',
            type: 'text',
            options: [],
            focus_area: '',
        };
        const updatedQuestions = [...questions, newQuestion];
        setQuestions(updatedQuestions);
        setData('questions', updatedQuestions);
    };

    const removeQuestion = (id) => {
        const updatedQuestions = questions.filter((q) => q.id !== id);
        setQuestions(updatedQuestions);
        setData('questions', updatedQuestions);
    };

    const updateQuestion = (id, field, value) => {
        const updatedQuestions = questions.map((q) =>
            q.id === id ? { ...q, [field]: value } : q
        );
        setQuestions(updatedQuestions);
        setData('questions', updatedQuestions);
    };

    const addOption = (questionId) => {
        const updatedQuestions = questions.map((q) => {
            if (q.id === questionId) {
                return { ...q, options: [...q.options, ''] };
            }
            return q;
        });
        setQuestions(updatedQuestions);
        setData('questions', updatedQuestions);
    };

    const removeOption = (questionId, optionIndex) => {
        const updatedQuestions = questions.map((q) => {
            if (q.id === questionId) {
                const newOptions = q.options.filter((_, idx) => idx !== optionIndex);
                return { ...q, options: newOptions };
            }
            return q;
        });
        setQuestions(updatedQuestions);
        setData('questions', updatedQuestions);
    };

    const updateOption = (questionId, optionIndex, value) => {
        const updatedQuestions = questions.map((q) => {
            if (q.id === questionId) {
                const newOptions = [...q.options];
                newOptions[optionIndex] = value;
                return { ...q, options: newOptions };
            }
            return q;
        });
        setQuestions(updatedQuestions);
        setData('questions', updatedQuestions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('superadmin.admin.surveys.questions.store', survey.id));
    };

    return (
        <SuperAdminLayout>
            <Head title={`Questions - ${survey.name}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route('superadmin.admin.surveys.index')}
                            className="text-xs text-[#934790] hover:underline mb-2 inline-block font-medium"
                        >
                            ← Back to Surveys
                        </Link>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Manage Questions: {survey.name}
                        </h1>
                        <p className="mt-1 text-xs text-gray-600">
                            Add and manage questions for this survey
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Questions */}
                        {questions.map((question, qIndex) => (
                            <div
                                key={question.id}
                                className="bg-white shadow rounded-lg p-5 border-l-4 border-[#934790]"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Question {qIndex + 1}
                                    </h3>
                                    {questions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(question.id)}
                                            className="text-red-600 hover:text-red-800 text-xs"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {/* Question Text */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">
                                            Question <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={question.question}
                                            onChange={(e) =>
                                                updateQuestion(question.id, 'question', e.target.value)
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#934790] focus:ring-[#934790] text-sm"
                                            placeholder="Enter your question..."
                                            required
                                        />
                                        {errors[`questions.${qIndex}.question`] && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors[`questions.${qIndex}.question`]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Question Type */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">
                                            Question Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={question.type}
                                            onChange={(e) =>
                                                updateQuestion(question.id, 'type', e.target.value)
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#934790] focus:ring-[#934790] text-sm"
                                            required
                                        >
                                            {QUESTION_TYPES.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Options (for choice-based questions) */}
                                    {(question.type === 'multiplechoice' || question.type === 'checkbox') && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                                Options
                                            </label>
                                            <div className="space-y-2">
                                                {question.options.map((option, optIdx) => (
                                                    <div key={optIdx} className="flex items-center space-x-2">
                                                        <span className="text-xs text-gray-500 w-8">
                                                            {optIdx + 1}.
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) =>
                                                                updateOption(
                                                                    question.id,
                                                                    optIdx,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                            placeholder="Enter option..."
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeOption(question.id, optIdx)}
                                                            className="text-red-600 hover:text-red-800 text-xs font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => addOption(question.id)}
                                                    className="inline-flex items-center text-xs text-[#934790] hover:underline font-medium"
                                                >
                                                    + Add Option
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Focus Area */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">
                                            Focus Area <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={question.focus_area}
                                            onChange={(e) =>
                                                updateQuestion(question.id, 'focus_area', e.target.value)
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#934790] focus:ring-[#934790] text-sm"
                                            placeholder="e.g., Health & Wellness, Work-Life Balance"
                                            required
                                        />
                                        {errors[`questions.${qIndex}.focus_area`] && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors[`questions.${qIndex}.focus_area`]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add Question Button */}
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="w-full flex justify-center items-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:border-[#934790] hover:text-[#934790] transition"
                        >
                            + Add Another Question
                        </button>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <Link
                                href={route('superadmin.admin.surveys.index')}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-[#934790] hover:bg-[#7a3a77] disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Questions'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
                </SuperAdminLayout>
    );
}
