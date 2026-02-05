import React from 'react';
import { Link } from '@inertiajs/react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

export default function PrivacyPolicy() {
    return (
        <>
            <Header />
            <div className="bg-[#ffe6f3ed] min-h-screen ">
                
                {/* Hero Section with Curved Header */}
                <div className="relative bg-gradient-to-b from-[#6b2a6c] to-[#934790] pt-28 pb-32 overflow-visible">
                    <svg className="absolute bottom-0 left-0 w-full h-24" viewBox="0 0 1200 100" preserveAspectRatio="none" style={{ filter: 'drop-shadow(0 -2px 4px rgba(0,0,0,0.1))' }}>
                        <path d="M0,40 Q300,0 600,40 T1200,40 L1200,100 L0,100 Z" fill="#ffe6f3ed"/>
                    </svg>
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 text-9xl">🔒</div>
                        <div className="absolute bottom-10 right-10 text-9xl">🛡️</div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-5">📄</div>
                    </div>
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center max-w-4xl mx-auto">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
                                Privacy Policy
                            </h1>
                            <p className="text-lg md:text-base text-white/95 leading-relaxed">
                                Your privacy is important to us. Learn how we collect, use, and protect your personal information.
                            </p>
                    
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-6 py-12 max-w-6xl">
                    {/* Introduction */}
                    <section className="mb-12">
                        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500">
                            <div className="mb-2">
                                <h2 className="text-base md:text-2xl font-semibold text-gray-900">Introduction</h2>
                            </div>
                            <p className="text-xs md:text-base text-gray-700 leading-normal">
                                Zoom Insurance Brokers Pvt. Ltd. ("Zoom", "we", "us" or "our") respects your privacy and is committed to protecting your personal information in accordance with the Information Technology Act, 2000 (IT Act) and its amendments, including the reasonable security practices and procedures and sensitive personal data or information rules, 2011 (SPDI Rules). This privacy policy describes how we collect, use, and disclose your information when you use our mobile application and web portal, ZoomConnect ("the Platform").
                            </p>
                        </div>
                    </section>

                    {/* Information We Collect */}
                    <section className="mb-12">
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-base md:text-2xl font-semibold text-gray-900">Information We Collect</h2>
                            </div>
                            <p className="text-xs md:text-base text-gray-700 leading-relaxed mb-5">
                                We collect information from you in several ways when you use the Platform, including:
                            </p>
                            
                            <div className="space-y-6">
                                <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                                    <p className="text-xs md:text-base text-gray-600 leading-tight">
                                        This may include your name, email address, phone number, date of birth, gender (optional), employment information (if applicable), and other information you provide when you create an account, access certain features, or submit requests through the Platform (e.g., adding dependents, filing claims, downloading e-cards). We will clearly identify any mandatory fields and obtain your consent for collection of sensitive personal data like health information.
                                    </p>
                                </div>
                                <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Policy Information</h3>
                                    <p className="text-xs md:text-base text-gray-600 leading-tight">
                                        We receive details related to your insurance policy, including policy number, coverage details, and exclusions, directly from your corporate employer (the policyholder) or their chosen insurance company, with your consent.
                                    </p>
                                </div>
                                <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Data</h3>
                                    <p className="text-xs md:text-base text-gray-600 leading-tight">
                                        We collect information about how you interact with the Platform, such as the features you use, the pages you visit, the searches you perform, your device information, and how you navigate through the Platform.
                                    </p>
                                </div>
                                <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Health Information (SPDI)</h3>
                                    <p className="text-xs md:text-base text-gray-600 leading-tight">
                                        In some cases, limited health information may be required to process claims or access certain wellness features. We will only collect this information with your explicit consent and in strict compliance with the SPDI Rules. We will implement robust security measures to protect the confidentiality and integrity of your health information.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How We Collect Information */}
                    <section className="mb-12">
                        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500">
                            <div className="mb-4">
                                <h2 className="text-base md:text-2xl font-semibold text-gray-900">How We Collect Your Information</h2>
                            </div>
                            <p className="text-xs md:text-base text-gray-700 leading-relaxed mb-8">
                                ZoomConnect offers a variety of features to simplify your insurance experience. To provide these services, we collect your information through several methods:
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-[#934790]/10 to-[#934790]/5 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">From Our Clients</h3>
                                    <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                                        When Zoom acts as a broker for your corporate employer, your personal information is typically provided to us by your employer during the insurance setup process.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-[#FF0066]/10 to-[#FF0066]/5 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Third-Party Sources</h3>
                                    <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                                        To ensure accurate information and facilitate services like claims processing, we may collect additional information from third parties with your employer's consent.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-[#934790]/10 to-[#934790]/5 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">ZoomConnect Events & Webinars</h3>
                                    <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                                        When you participate in ZoomConnect-hosted events or webinars, you may directly provide your information during registration.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-[#FF0066]/10 to-[#FF0066]/5 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">ZoomConnect Platform</h3>
                                    <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                                        We collect information when you interact with the platform, such as filling out forms, making transactions, or subscribing to newsletters.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Information */}
                    <section className="mb-12">
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-base md:text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
                            </div>
                            <p className="text-xs md:text-base text-gray-700 leading-relaxed mb-4">
                                We use the information we collect for various purposes, including:
                            </p>

                            <div className="space-y-2">
                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl  transition-all duration-300">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#ff4c94] rounded-full flex items-center justify-center">
                                        <span className="text-lg">✓</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">To provide and improve the Platform</h3>
                                        <p className="text-xs md:text-base text-gray-600 leading-tight">
                                            We use your information to operate, maintain, and improve the Platform, including processing your claims, managing your dependents, enabling access to e-cards, and providing customer support.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl  transition-all duration-300">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#934790] rounded-full flex items-center justify-center">
                                        <span className="text-lg">✓</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">To personalize your experience</h3>
                                        <p className="text-xs md:text-base text-gray-600">
                                            We may use your information to personalize your experience with the Platform, such as providing targeted information about your policy coverage and recommending relevant wellness programs.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl  transition-all duration-300">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#ff4c94] rounded-full flex items-center justify-center">
                                        <span className="text-lg">✓</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">To communicate with you</h3>
                                        <p className="text-xs md:text-base text-gray-600">
                                            We may use your information to communicate with you about the Platform, such as sending you important updates, policy renewal reminders, or customer service messages.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl transition-all duration-300">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#934790] rounded-full flex items-center justify-center">
                                        <span className="text-lg">✓</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">To comply with the law</h3>
                                        <p className="text-xs md:text-base text-gray-600">
                                            We may use your information to comply with applicable laws and regulations, such as responding to court orders or subpoenas.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sharing Information */}
                    <section className="mb-12">
                        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500">
                            <div className="mb-4">
                                <h2 className="text-base md:text-2xl font-semibold text-gray-900">Sharing Your Information</h2>
                            </div>
                            <p className="text-xs md:text-base text-gray-700 leading-relaxed mb-6">
                                We may share your information with third-party service providers who help us operate and improve the Platform. These service providers are obligated by contract to maintain the confidentiality and security of your information.
                            </p>
                            
                            <div className="bg-gradient-to-r from-[#934790]/10 to-[#FF0066]/10 rounded-2xl p-6 mb-6">
                                <h3 className="font-semibold text-gray-900 mb-4">
                                    We may share your information with:
                                </h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#FF0066]">•</span>
                                        Your corporate employer (the policyholder)
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#934790]">•</span>
                                        Your chosen insurance company
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#FF0066]">•</span>
                                        Network hospitals or healthcare providers involved in your care
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#934790]">•</span>
                                        Third-party administrators (TPAs) handling your claims
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-yellow-50 p-3 rounded-lg">
                                <p className="text-xs md:text-base text-gray-700 font-medium">
                                    We will not share your information with any other third-party for marketing purposes without your explicit consent.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Data Security */}
                    <section className="mb-12">
                        <div className="bg-[#934790] rounded-3xl shadow-lg p-8 md:p-8 hover:shadow-2xl transition-all duration-500">
                            <div className="mb-2">
                                <h2 className="text-base md:text-2xl font-semibold text-white">Data Security</h2>
                            </div>
                            <p className="text-xs md:text-base text-white leading-relaxed">
                                We take reasonable steps to protect your information from unauthorized access, disclosure, alteration, or destruction, in accordance with the SPDI Rules. This includes implementing industry-standard security measures and maintaining appropriate physical, electronic, and procedural safeguards. However, no internet or electronic storage system is 100% secure.
                            </p>
                        </div>
                    </section>

                    {/* Additional Sections Grid */}
                    <div className="mb-12 space-y-8">
                        {/* Log Files */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500">
                            <div className="mb-2">
                                <h2 className="text-2xl font-semibold text-gray-900">Log Files</h2>
                            </div>
                            <p className="text-xs md:text-base text-gray-700 leading-relaxed mb-4">
                                ZoomConnect utilizes log files to analyze trends, administer the platform, and understand user behavior. This information may include:
                            </p>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#FF0066] ">•</span>
                                    <span>Internet Protocol (IP) addresses</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#934790] ">•</span>
                                    <span>Browser type and ISP</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#FF0066] ">•</span>
                                    <span>Referring/exit pages</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#934790] ">•</span>
                                    <span>Platform type and date/time stamp</span>
                                </li>
                            </ul>
                        </div>

                        {/* Email Opt-Out */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500">
                            <div className="mb-2">
                                <h2 className="text-2xl font-semibold text-gray-900">Email Opt-Out</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                We respect your right to control your information. If you no longer wish to receive marketing emails from ZoomConnect, you can easily unsubscribe through a link provided in every email communication.
                            </p>
                        </div>

                        {/* Cookies */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500">
                            <div className="mb-2">
                                <h2 className="text-2xl font-semibold text-gray-900">Cookies</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                ZoomConnect utilizes cookies to enhance your user experience. These can be categorized as:
                            </p>
                            <div className="space-y-2">
                                <div className="bg-[#934790]/5 rounded-lg p-3">
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Session ID Cookies</h4>
                                    <p className="text-xs md:text-base text-gray-600">
                                        Temporary cookies erased when you close your browser or log out.
                                    </p>
                                </div>
                                <div className="bg-[#FF0066]/5 rounded-lg p-3">
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Persistent Cookies</h4>
                                    <p className="text-xs md:text-base text-gray-600">
                                        Remain on your device for a longer period to remember your preferences.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Links to Other Websites */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500">
                            <div className="mb-2">
                                <h2 className="text-2xl font-semibold text-gray-900">Links to Other Websites</h2>
                            </div>
                            <p className="text-xs md:text-base text-gray-700 leading-relaxed">
                                ZoomConnect may contain links to other websites or affiliated portals. These external sites have separate privacy practices, and we encourage you to review them when you visit those sites. We are not responsible for the content or data collection practices of any linked websites.
                            </p>
                        </div>
                    </div>

                    {/* Acceptance & Changes */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-8 ">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-base md:text-2xl font-semibold">Acceptance of Privacy Policy</h2>
                            </div>
                            <p className="text-xs md:text-base  leading-relaxed">
                                By using ZoomConnect (mobile app or web version), you acknowledge and agree to the terms of this Privacy Policy. If you do not agree with these terms, please refrain from using ZoomConnect. Your continued use of ZoomConnect following any updates to this Privacy Policy constitutes your acceptance of the changes.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-8 border-2 border-gray-200  hover:shadow-2xl transition-all duration-500">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-base md:text-2xl font-semibold text-gray-900">Changes to Our Privacy Policy</h2>
                            </div>
                            <p className="text-xs md:text-base text-gray-700 leading-relaxed">
                                We reserve the right to modify this Privacy Policy at any time. Any significant changes in how we use, store, or share your personal information will be communicated by posting an update on this webpage. We encourage you to review this Privacy Policy regularly to stay informed.
                            </p>
                        </div>
                    </div>


                </div>
            </div>
            <Footer />
        </>
    );
}
