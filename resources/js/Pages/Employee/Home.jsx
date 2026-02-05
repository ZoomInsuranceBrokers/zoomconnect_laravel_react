import React from 'react';
import { Head } from '@inertiajs/react';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { HomeIcon, ChartBarIcon, CalendarIcon, BellIcon } from '@heroicons/react/24/outline';

export default function Home({ employee }) {
    return (
        <EmployeeLayout employee={employee}>
            <Head title="Home" />
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-white rounded-2xl shadow-sm my-4">
                <div className="max-w-6xl mx-auto">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Welcome back, {employee?.full_name || 'User'}! 👋
                        </h1>
                        <p className="text-gray-600">
                            Here's what's happening with your benefits today.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-600 font-medium mb-1">Active Policies</p>
                                    <p className="text-3xl font-bold text-purple-700">3</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                                    <HomeIcon className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 font-medium mb-1">Pending Claims</p>
                                    <p className="text-3xl font-bold text-blue-700">1</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                                    <ChartBarIcon className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 font-medium mb-1">Wellness Points</p>
                                    <p className="text-3xl font-bold text-green-700">1021</p>
                                </div>
                                <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                                    <CalendarIcon className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <BellIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">Claim Submitted</p>
                                    <p className="text-sm text-gray-600">Your medical claim has been submitted for review</p>
                                    <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                                </div>
                                <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">Pending</span>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <BellIcon className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">Wellness Activity Completed</p>
                                    <p className="text-sm text-gray-600">You earned 50 points for completing your daily workout</p>
                                    <p className="text-xs text-gray-500 mt-1">5 days ago</p>
                                </div>
                                <span className="text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">+50 pts</span>
                            </div>
                        </div>
                    </div>

                    {/* Company Info */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Your Company</h3>
                        <p className="text-gray-700 font-medium">{employee?.company_name}</p>
                        <p className="text-sm text-gray-600 mt-1">Employee ID: {employee?.employee_code}</p>
                    </div>
                </div>
            </div>
        </EmployeeLayout>
    );
}
