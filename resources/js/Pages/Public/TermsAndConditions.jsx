import React from 'react';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';

export default function TermsAndConditions() {
    return (
        <>
            <Header />
            <div className="bg-[#ffe6f3ed] min-h-screen">

                {/* Hero Section with Curved Header */}
                <div className="relative bg-[#f2d7b3] pt-20 pb-12 md:pt-28 md:pb-40 overflow-visible ">
                    <svg className="absolute bottom-0 left-0 w-full h-12 md:h-32 z-10" viewBox="0 0 1200 220" preserveAspectRatio="none" >
                        <path d="M0,110 Q300,30 600,110 T1200,110 L1200,220 L0,220 Z" fill="#ffe6f3ed" />
                    </svg>
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 text-9xl">📋</div>
                        <div className="absolute bottom-10 right-10 text-9xl">✍️</div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-5">📄</div>
                    </div>
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center max-w-4xl mx-auto">
                            <h1 className="text-xl md:text-5xl font-bold mb-2 md:mb-6 text-white drop-shadow-lg">
                                Terms & Conditions
                            </h1>
                            <p className="text-xs md:text-base text-white/95 leading-tight">
                                Please read our terms carefully to understand your rights and responsibilities when using ZoomConnect.
                            </p>

                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-6 py-12 max-w-6xl">
                    <div className="prose prose-sm md:prose-base max-w-none text-gray-800 prose-p:text-base">
                        {/* Welcome Section */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h2 className="text-base md:text-2xl font-semibold text-[#934790] mb-2">Welcome to ZoomConnect!</h2>
                            <p className="text-xs md:text-base">These Terms & Conditions ("Terms") govern your access to and use of the ZoomConnect mobile application and web portal (collectively, the "Platform") operated by Zoom Insurance Brokers Pvt. Ltd. ("Zoom", "we", "us", or "our").</p>
                        </div>

                        {/* Acceptance Section */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-2">Terms & Conditions Acceptance</h3>
                            <p className="text-xs md:text-base">Please read these Terms carefully before accessing or using the Platform. By accessing or using the Platform, you agree to be bound by these Terms and our policies as they may be updated from time to time. If you disagree with any of these Terms, you are not authorized to access or use the Platform.</p>
                        </div>

                        {/* User Accounts Section */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-2">User Accounts</h3>
                            <p className="text-xs md:text-base">Your account ("Account") will be required to create an account to access the features of our Platform. You are responsible for maintaining the confidentiality of your Account credentials and are fully responsible for all activities that occur under your Account. You agree to immediately notify us of any unauthorized use of your Account.</p>
                        </div>

                        {/* Use of Platform Section */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-6">Use of the Platform</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 pl-3 rounded-lg transition-all">
                                    <span className="text-[#934790] font-bold flex-shrink-0">•</span>
                                    <span className="text-xs md:text-base">You agree to use the Platform only for lawful purposes and in accordance with these Terms.</span>
                                </li>
                                <li className="flex items-start gap-3 pl-3  rounded-lg transition-all">
                                    <span className="text-[#934790] font-bold flex-shrink-0">•</span>
                                    <span className="text-xs md:text-base">You agree not to use the Platform in any way that could damage, disable, overburden, or impair the Platform or any connected server or network.</span>
                                </li>
                                <li className="flex items-start gap-3 pl-3  rounded-lg transition-all">
                                    <span className="text-[#934790] font-bold flex-shrink-0">•</span>
                                    <span className="text-xs md:text-base">You agree not to attempt to gain unauthorized access to any parts of the Platform, or any accounts, computer systems, or networks connected to the Platform, by hacking, password mining, or any other means.</span>
                                </li>
                                <li className="flex items-start gap-3 pl-3  rounded-lg transition-all">
                                    <span className="text-[#934790] font-bold flex-shrink-0">•</span>
                                    <span className="text-xs md:text-base">You agree not to interfere with the security of the Platform or any connected server or network.</span>
                                </li>
                                <li className="flex items-start gap-3 pl-3 rounded-lg transition-all">
                                    <span className="text-[#934790] font-bold flex-shrink-0">•</span>
                                    <span className="text-xs md:text-base">You agree not to upload, transmit, or distribute any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, obscene, hateful, or racially or ethnically offensive.</span>
                                </li>
                                <li className="flex items-start gap-3 pl-3 rounded-lg transition-all">
                                    <span className="text-[#934790] font-bold flex-shrink-0">•</span>
                                    <span className="text-xs md:text-base">You agree not to upload, transmit, or distribute any content that infringes on the intellectual property rights of any third party.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Privacy Section */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-2">Privacy</h3>
                            <p className="text-xs md:text-base">Your privacy is a top priority for us. A dedicated Privacy Policy outlines how we collect, manage, process, secure, and store your personal information. The Privacy Policy is considered part of these Terms of Use. You can find the Privacy Policy on our website for further details.</p>
                        </div>

                        {/* Indemnity Section */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-2">Indemnity</h3>
                            <p className="text-xs md:text-base">You agree to indemnify, defend, and hold harmless Zoom Insurance Brokers Pvt. Ltd. ("Zoom"), its directors, officers, Point-of-Sale Persons ("PoSPs"), owners, employees, agents, platform providers, licensors, licensees (collectively, the "Indemnified Parties"), and affiliates from any liability and costs incurred by the indemnified Parties in connection with any claims arising out of this Agreement or the breach of any representations made by you herein. This indemnity will survive the termination of this Agreement. Zoom reserves the right to assume the defense and control of any matter subject to indemnification by you, in which event you will provide us with all reasonable cooperation requested.</p>
                        </div>

                        {/* Promotional Offers Section */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-2">Promotional Offers</h3>
                            <p className="text-xs md:text-base">We may occasionally send announcements about new products and promotional offers to promote ZoomConnect or the services of listed insurance companies ("Promotional Offers"). Promotional Offers are subject to these Terms and conditions and are applicable to all users who access our Platform. Please note that these offers may be limited and we reserve the right to withdraw any offer at any time at our discretion.</p>
                        </div>

                        {/* Electronic Communications Section */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-2">Electronic Communications</h3>
                            <p className="text-xs md:text-base">You agree to receive notices and other communications regarding ZoomConnect products electronically. You are responsible for keeping your account information, such as your email address and contact details, accurate and up to date. ZoomConnect is not liable for non-receipt of notices and communications due to incorrect or outdated information provided by you.</p>
                        </div>

                        {/* Limitation of Warranties Section */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-2">Limitation of Warranties</h3>
                            <p className="text-xs md:text-base mb-2">By using ZoomConnect, you understand and agree that all resources we provide are "as is" and "as available". This means we do not represent or warrant to you that:</p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-3 pl-2 rounded transition-all">
                                    <span className="text-[#FF0066] ">•</span>
                                    <span>Using our resources will meet your needs or requirements.</span>
                                </li>
                                <li className="flex items-start gap-3 pl-2 rounded transition-all">
                                    <span className="text-[#FF0066] ">•</span>
                                    <span>Using our resources will be timely, uninterrupted, secure, or error-free.</span>
                                </li>
                                <li className="flex items-start gap-3 pl-2 rounded transition-all">
                                    <span className="text-[#FF0066] ">•</span>
                                    <span>Information obtained by using our resources will be reliable or accurate.</span>
                                </li>
                                <li className="flex items-start gap-3 pl-2 rounded transition-all">
                                    <span className="text-[#FF0066] ">•</span>
                                    <span>Any defects in the operation or functionality of any resources we provide will be repaired or corrected.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Limitation of Liabilities Section */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-2">Limitation of Liabilities</h3>
                            <p className="text-xs md:text-base">In conjunction with the Limitation of Warranties explained above, you expressly understand and agree that ZoomConnect is provided to you "as is" and "as available". This, without any warranty, Zoom will not be liable to you or any third party for any damages or losses including but not limited to, direct, indirect, incidental, consequential, or punitive damages arising out of or connected with ZoomConnect, even if the claims arise out of our negligence. The disclaimer applies to any damages or injury caused by any failure of performance, error, omission, interruption, deletion, defect, delay in operation or transmission, computer virus, communication line failure, theft, destruction, or unauthorized access to, alteration of, or use of information contained on ZoomConnect.</p>
                        </div>

                        {/* Copyrights and Trademarks Section */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-2">Copyrights and Trademarks</h3>
                            <p className="text-xs md:text-base">All content and materials available on ZoomConnect, including but not limited to trademarks, logos, graphics, website name, code, images, and digital downloads (collectively, "Marks") displayed on ZoomConnect are the exclusive property of Zoom and are protected by applicable copyright laws. You may not use any of the Marks without our prior written consent. Unauthorized use of the Marks is strictly prohibited and may result in civil or criminal penalties.</p>
                        </div>

                        {/* Third-Party Services Section */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-2">Third-Party Services</h3>
                            <p className="text-xs md:text-base">The Platform may contain links to third-party websites or services. We are not responsible for the content or practices of any third-party services linked to or accessed through our Platform. You acknowledge and agree that Zoom is not liable for any loss or damage caused or alleged to be caused by the use of any third-party websites or services you visit.</p>
                        </div>

                        {/* Disclaimers Section */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-2">Disclaimers</h3>
                            <p className="text-xs md:text-base">The Platform is provided "as is" and without warranties of any kind, express or implied. Zoom disclaims all warranties, including the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Platform will be uninterrupted, secure, or error-free. We do not warrant the accuracy or completeness of any content or information provided through the Platform.</p>
                        </div>

                        {/* Termination Section */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-2">Termination</h3>
                            <p className="text-xs md:text-base">Your access to ZoomConnect is directly linked to your continued compliance with these Terms.</p>
                        </div>

                        {/* Governing Law Section */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-2">Governing Law</h3>
                            <p className="text-xs md:text-base">These Terms will be governed by and construed in accordance with the laws of India.</p>
                        </div>

                        {/* Dispute Resolution Section */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-2">Dispute Resolution</h3>
                            <p className="text-xs md:text-base">Any disputes arising under these Terms will be subject to the exclusive jurisdiction of the courts of New Delhi, India.</p>
                        </div>

                        {/* Changes to the Terms Section */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500 mb-8">
                            <h3 className="text-base md:text-2xl font-semibold text-gray-900 mb-2">Changes to the Terms</h3>
                            <p className="text-xs md:text-base">We reserve the right to modify or replace these Terms at any time at our discretion. It is your responsibility to check these Terms periodically for changes. Your continued use of the Platform following the posting of any changes to these Terms will mean you accept those changes.</p>
                        </div>

                        {/* Contact Information Section */}
                        <div className="bg-gradient-to-r from-[#934790]/10 via-[#a855a8]/10 to-[#FF0066]/10 rounded-2xl p-8 text-center relative overflow-hidden mb-8">
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 left-0 text-9xl">📧</div>
                                <div className="absolute bottom-0 right-0 text-9xl">💬</div>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-base md:text-2xl font-bold text-gray-900 mb-2">Contact Information</h3>
                                <p className="text-xs md:text-base text-gray-700 mb-2">If you have any questions about these Terms, please contact us at:</p>
                                <a href="mailto:support@zoomconnect.co.in" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#934790] to-[#FF0066] text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300">
                                    <span className="text-xs md:text-sm">support@zoomconnect.co.in</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}