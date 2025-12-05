import React from 'react';
import SuperAdminLayout from '../../Layouts/SuperAdmin/Layout';
import { useTheme } from '../../Context/ThemeContext';
import { Card, CardHeader, CardContent } from '../../Components/Card';
import { useColorInversion } from '../../Hooks/useColorInversion';
import CountUp from 'react-countup';

export default function SuperAdminDashboard() {
    const { darkMode } = useTheme();
    const labelClass = useColorInversion('text-xs text-gray-500');
    const valueClass = useColorInversion('text-lg font-bold text-black');

    // Dashboard data based on your attachments
    const dashboardData = {
        keyMetrics: [
            { label: 'Total Lives', value: 525560, change: '', changeColor: '' },
            { label: 'Active Corporates', value: 149, change: '↓ Aug 2025: 8', changeColor: 'text-red-500 dark:text-red-400' },
            { label: 'Active Employees', value: 92677, change: '', changeColor: '' },
            { label: 'App Downloads(iOS & Android)', value: 38970, change: '', changeColor: '' },
            { label: 'App Login', value: 16210, change: '↓ Aug 2025: 557', changeColor: 'text-red-500 dark:text-red-400' },
        ],
        tpaData: [
            { name: 'PHS', value: 194347, percentage: 37 },
            { name: 'Mediassist', value: 109723, percentage: 20.9 },
            { name: 'Safeway', value: 75109, percentage: 14.3 },
            { name: 'Volo', value: 43395, percentage: 8.3 },
            { name: 'ICICI', value: 32880, percentage: 6.3 },
            { name: 'Vidal', value: 32486, percentage: 6.2 },
            { name: 'Health India', value: 29115, percentage: 5.5 },
            { name: 'Care', value: 4934, percentage: 0.9 },
        ],
        topCorporates: [
            { name: 'eClecx Services LLP', employees: 18066 },
            { name: 'GIST(AFFINSEC)', employees: 13702 },
            { name: 'Paytm', employees: 11351 },
            { name: 'UNIT MANAGER', employees: 6791 },
            { name: 'Nobodytech', employees: 6012 },
            { name: 'AKUMS DRUGS & CHEMICALS LTD', employees: 5499 },
            { name: 'Lava International', employees: 4678 },
            { name: 'Resilient Innovation', employees: 3931 },
            { name: 'Apollo Tyres Ltd', employees: 2819 },
            { name: 'Adhired Pipes Pvt', employees: 2665 },
        ],
        genderData: {
            male: { count: 98238, percentage: 82.7 },
            female: { count: 20605, percentage: 17.3 },
            other: { count: 2, percentage: 0.01 }
        }
    };

    // Dummy user data; replace with real user if available
    const user = {
        user_name: 'Super Admin',
        email: 'superadmin@zoominsurancebrokers.com',
    };

    return (
        <SuperAdminLayout user={user}>
            {/* Top Section: Key Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8 pt-4">
                {dashboardData.keyMetrics.map((metric, idx) => (
                    <Card key={metric.label} className="gap-2 border-t-4 border-[#934790]">
                        <span className={labelClass}>{metric.label}</span>
                        <span className={valueClass}>
                            <CountUp end={metric.value} duration={2} separator="," />
                        </span>
                        {metric.change && (
                            <span className={`${metric.changeColor} text-xs`}>{metric.change}</span>
                        )}
                    </Card>
                ))}
            </div>

            {/* Middle Section: TPA Analysis & Corporate Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
                {/* TPA wise Active Lives - Funnel Chart */}
                <Card>
                    <CardHeader>TPA wise Active Lives</CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {dashboardData.tpaData.map((tpa, idx) => (
                                <div key={tpa.name} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div
                                            className="h-4 bg-gradient-to-r from-[#934790] to-[#6A0066] rounded"
                                            style={{
                                                width: `${Math.max(tpa.percentage * 3, 20)}px`,
                                                opacity: 1 - (idx * 0.1)
                                            }}
                                        ></div>
                                        <span className="text-sm font-medium">{tpa.name}</span>
                                        <span className="text-xs text-gray-500">{tpa.percentage}%</span>
                                    </div>
                                    <span className="text-sm font-semibold text-[#934790]">
                                        {tpa.value.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Corporate wise Active Lives - Bar Chart */}
                <Card>
                    <CardHeader>Corporate wise Active Lives</CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-end justify-between space-x-1">
                            {Array.from({length: 15}, (_, i) => {
                                const height = Math.random() * 200 + 20;
                                const isHighlight = i === 5 || i === 8 || i === 12;
                                return (
                                    <div
                                        key={i}
                                        className={`${isHighlight ? 'bg-[#934790]' : 'bg-blue-400'} rounded-t transition-all duration-1000`}
                                        style={{
                                            height: `${height}px`,
                                            width: '100%',
                                            maxWidth: '40px'
                                        }}
                                        title={`Corporate ${i + 1}`}
                                    ></div>
                                );
                            })}
                        </div>
                        <div className="mt-4 text-xs text-gray-500 text-center">
                            Various Corporate Groups
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section: Top Corporates & Gender Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Top 10 Corporates */}
                <Card className="lg:col-span-2">
                    <CardHeader>Top 10 corporates with the count of number of employees</CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {dashboardData.topCorporates.map((corp, idx) => (
                                <div key={corp.name} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 flex-1">
                                        <span className="text-xs font-medium text-gray-500 w-6">
                                            {idx + 1}.
                                        </span>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium truncate max-w-[120px] sm:max-w-[180px] md:max-w-none">{corp.name}</div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                                <div
                                                    className="bg-[#934790] h-2 rounded-full transition-all duration-1000"
                                                    style={{
                                                        width: `${(corp.employees / dashboardData.topCorporates[0].employees) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-[#934790] ml-4">
                                        {corp.employees.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Gender Bifurcation - Donut Chart */}
                <Card>
                    <CardHeader>Active Employees - Gender Bifurcation</CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="relative w-40 h-40 mb-4">
                            {/* Donut Chart using CSS */}
                            <div className="w-40 h-40 rounded-full relative overflow-hidden">
                                {/* Male section */}
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: `conic-gradient(#10B981 0% ${dashboardData.genderData.male.percentage}%, transparent ${dashboardData.genderData.male.percentage}% 100%)`
                                    }}
                                ></div>
                                {/* Female section */}
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: `conic-gradient(transparent 0% ${dashboardData.genderData.male.percentage}%, #3B82F6 ${dashboardData.genderData.male.percentage}% 100%)`
                                    }}
                                ></div>
                                {/* Center hole */}
                                <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-lg font-bold">Total</div>
                                        <div className="text-sm text-gray-500">
                                            {(dashboardData.genderData.male.count + dashboardData.genderData.female.count).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                <span>Female: {dashboardData.genderData.female.count.toLocaleString()} ({dashboardData.genderData.female.percentage}%)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <span>Male: {dashboardData.genderData.male.count.toLocaleString()} ({dashboardData.genderData.male.percentage}%)</span>
                            </div>
                            {dashboardData.genderData.other.count > 0 && (
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                                    <span>Other: {dashboardData.genderData.other.count} ({dashboardData.genderData.other.percentage}%)</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SuperAdminLayout>
    );
}
