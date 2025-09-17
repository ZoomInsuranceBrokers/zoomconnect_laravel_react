import React from 'react';
import SuperAdminLayout from '../Layouts/SuperAdmin/Layout';
import { useTheme } from '../Context/ThemeContext';
import { Card, CardHeader, CardContent } from '../Components/Card';
import { useColorInversion } from '../Hooks/useColorInversion';

export default function SuperAdminDashboard() {
    const { darkMode } = useTheme();
    const labelClass = useColorInversion('text-xs text-gray-500');
    const valueClass = useColorInversion('text-lg font-bold text-black');
    // Dummy user data; replace with real user if available
    const user = {
        user_name: 'Adaline Lively',
        email: 'adaline@email.com',
    };
    return (
        <SuperAdminLayout user={user}>
            {/* Top Section: Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {[
                    { label: 'Total balance', value: '$15,700.00', change: '↑ 12.1% vs last month', changeColor: 'text-green-500 dark:text-green-400' },
                    { label: 'Income', value: '$8,500.00', change: '↑ 6.3% vs last month', changeColor: 'text-green-500 dark:text-green-400' },
                    { label: 'Expense', value: '$6,222.00', change: '↓ 2.4% vs last month', changeColor: 'text-red-500 dark:text-red-400' },
                    { label: 'Total savings', value: '$32,913.00', change: '↑ 12.1% vs last month', changeColor: 'text-green-500 dark:text-green-400' },
                ].map((card, idx) => (
                    <Card key={card.label} className="gap-2 border-t-4 border-[#934790]">
                        <span className={labelClass}>{card.label}</span>
                        <span className={valueClass}>{card.value}</span>
                        <span className={`${card.changeColor} text-xs`}>{card.change}</span>
                    </Card>
                ))}
            </div>

            {/* Middle Section: Money Flow & Budget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                {/* Money Flow Chart Placeholder */}
                <Card className="lg:col-span-2">
                    <CardHeader>Money flow</CardHeader>
                    <CardContent className="h-48 md:h-64 flex items-center justify-center text-gray-400">[Chart Here]</CardContent>
                </Card>
                {/* Budget Pie Placeholder */}
                <Card>
                    <CardHeader>Budget</CardHeader>
                    <CardContent className="h-48 md:h-64 flex items-center justify-center text-gray-400">[Pie Chart Here]</CardContent>
                </Card>
            </div>

            {/* Bottom Section: Recent Transactions & Saving Goals */}
            <div className="grid grid-cols-3 gap-6">
                {/* Recent Transactions */}
                <Card className="col-span-2">
                    <CardHeader>Recent transactions</CardHeader>
                    <CardContent>
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="text-gray-500 dark:text-gray-300">
                                    <th className="text-left py-2">DATE</th>
                                    <th className="text-left py-2">AMOUNT</th>
                                    <th className="text-left py-2">PAYMENT NAME</th>
                                    <th className="text-left py-2">METHOD</th>
                                    <th className="text-left py-2">CATEGORY</th>
                                </tr>
                            </thead>
                            <tbody className="dark:text-gray-200">
                                <tr className="border-b dark:border-gray-700">
                                    <td className="py-2">25 Jul 12:30</td>
                                    <td className="text-red-500 dark:text-red-400">- $10</td>
                                    <td className="py-2">YouTube</td>
                                    <td className="py-2">VISA *3254</td>
                                    <td className="py-2">Subscription</td>
                                </tr>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="py-2">26 Jul 15:00</td>
                                    <td className="text-red-500 dark:text-red-400">- $150</td>
                                    <td className="py-2">Reserved</td>
                                    <td className="py-2">Mastercard *2154</td>
                                    <td className="py-2">Shopping</td>
                                </tr>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="py-2">27 Jul 9:00</td>
                                    <td className="text-red-500 dark:text-red-400">- $50</td>
                                    <td className="py-2">Yaposhka</td>
                                    <td className="py-2">Mastercard *2154</td>
                                    <td className="py-2">Cafe & Restaurant</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
                {/* Saving Goals */}
                <Card>
                    <CardHeader>Saving goals</CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span>MacBook Pro</span>
                                <span>$1,500</span>
                            </div>
                            <div className="w-full h-2 rounded-full mb-2 bg-gray-200 dark:bg-gray-700">
                                <div className="h-2 bg-[#934790] dark:bg-[#a558a2] rounded-full" style={{ width: '25%' }}></div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span>New car</span>
                                <span>$6,000</span>
                            </div>
                            <div className="w-full h-2 rounded-full mb-2 bg-gray-200 dark:bg-gray-700">
                                <div className="h-2 bg-[#934790] dark:bg-[#a558a2] rounded-full" style={{ width: '42%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>New house</span>
                                <span>$15,000</span>
                            </div>
                            <div className="w-full h-2 rounded-full mb-2 bg-gray-200 dark:bg-gray-700">
                                <div className="h-2 bg-[#934790] dark:bg-[#a558a2] rounded-full" style={{ width: '2%' }}></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SuperAdminLayout>
    );
}
