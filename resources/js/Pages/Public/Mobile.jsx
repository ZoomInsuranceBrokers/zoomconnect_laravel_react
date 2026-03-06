import React from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
import { 
    FaShieldAlt, 
    FaFileInvoiceDollar, 
    FaHeartbeat, 
    FaQuestionCircle, 
    FaTachometerAlt,
    FaUsers,
    FaMobileAlt,
    FaCheckCircle,
    FaBell,
    FaClipboardList
} from 'react-icons/fa';

export default function Mobile() {
    const benefits = [
        {
            icon: <FaCheckCircle className="text-2xl text-green-500" />,
            title: "All-in-One Platform",
            description: "Everything you need for employee health benefits in a single app"
        },
        {
            icon: <FaBell className="text-2xl text-blue-500" />,
            title: "Real-Time Updates",
            description: "Get instant notifications for policy changes, claim approvals, and important updates"
        },
        {
            icon: <FaMobileAlt className="text-2xl text-purple-500" />,
            title: "Access Anywhere",
            description: "Manage your benefits on the go from your smartphone or tablet"
        },
        {
            icon: <FaClipboardList className="text-2xl text-orange-500" />,
            title: "Simplified Process",
            description: "No more paperwork - automate repetitive administrative tasks digitally"
        }
    ];

    return (
        <>
            <Header />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Left Content */}
                        <div className="lg:w-1/2 space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                All Your Employee Health Benefits in One Place
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                Raise and track claims, stay updated on policy terms, view active employee benefits and automate repetitive administrative processes - all from a single, intuitive mobile app.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <a 
                                    href="#" 
                                    className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <img 
                                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                                        alt="Get it on Google Play" 
                                        className="h-12"
                                    />
                                </a>
                                <a 
                                    href="#" 
                                    className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <img 
                                        src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                                        alt="Download on the App Store" 
                                        className="h-12"
                                    />
                                </a>
                            </div>

                            <div className="pt-6">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                                    Trusted by Leading Companies
                                </p>
                                <div className="flex items-center gap-6 flex-wrap">
                                    <span className="text-gray-400 text-lg">350+ Tech Teams</span>
                                    <span className="text-gray-400 text-lg">•</span>
                                    <span className="text-gray-400 text-lg">4.0+ Rating</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Mobile Screenshot */}
                        <div className="lg:w-1/2 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                                <img 
                                    src="/uploads/mobile-app-hero.png" 
                                    alt="Employee Benefits Mobile App Interface" 
                                    className="relative z-10 max-w-sm md:max-w-md lg:max-w-lg w-full drop-shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Overview Section */}
            <div className="bg-white py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Our Mobile App?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Experience the convenience of managing all your health benefits from your smartphone
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <div 
                                key={index} 
                                className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100"
                            >
                                <div className="flex justify-center mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need, All in One App
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our comprehensive mobile platform brings together all aspects of your employee health benefits management, making it simple and accessible for every employee.
                        </p>
                    </div>

                    {/* Feature 1 - Dashboard (Image Left) */}
                    <div className="mb-20">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            <div className="lg:w-1/2">
                                <div className="relative max-w-md mx-auto">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-3xl blur-2xl opacity-20"></div>
                                    <img 
                                        src="/uploads/dashboard-screenshot.png" 
                                        alt="Dashboard with all policies overview" 
                                        className="relative z-10 w-full rounded-2xl shadow-2xl"
                                    />
                                </div>
                            </div>
                            <div className="lg:w-1/2 space-y-4">
                                <div className="flex items-center gap-3">
                                    <FaTachometerAlt className="text-4xl text-blue-600" />
                                    <h3 className="text-3xl font-bold text-gray-900">Dashboard</h3>
                                </div>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    View all your active policies at a glance. Get a complete overview of your health insurance coverage, policy details, and important updates in one centralized location. Stay on top of your benefits with real-time updates and quick access to all your important information.
                                </p>
                                <ul className="space-y-2 pt-4">
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">Complete policy overview at a glance</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">Real-time coverage status updates</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">Quick access to important notifications</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 - Policies (Image Right) */}
                    <div className="mb-20">
                        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                            <div className="lg:w-1/2">
                                <div className="relative max-w-md mx-auto">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl blur-2xl opacity-20"></div>
                                    <img 
                                        src="/uploads/policies-screenshot.png" 
                                        alt="Policies page showing health insurance details" 
                                        className="relative z-10 w-full rounded-2xl shadow-2xl"
                                    />
                                </div>
                            </div>
                            <div className="lg:w-1/2 space-y-4">
                                <div className="flex items-center gap-3">
                                    <FaShieldAlt className="text-4xl text-green-600" />
                                    <h3 className="text-3xl font-bold text-gray-900">Policies</h3>
                                </div>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Access detailed information about your group health insurance policies. View coverage limits, policy terms, dependents, and download policy documents anytime, anywhere. Keep track of your sum insured, coverage benefits, and policy validity periods.
                                </p>
                                <ul className="space-y-2 pt-4">
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">Detailed coverage information and limits</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">Download policy documents instantly</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">Manage dependent information</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3 - Claims (Image Left) */}
                    <div className="mb-20">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            <div className="lg:w-1/2">
                                <div className="relative max-w-md mx-auto">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
                                    <img 
                                        src="/uploads/claims-screenshot.png" 
                                        alt="Claims tracking interface" 
                                        className="relative z-10 w-full rounded-2xl shadow-2xl"
                                    />
                                </div>
                            </div>
                            <div className="lg:w-1/2 space-y-4">
                                <div className="flex items-center gap-3">
                                    <FaFileInvoiceDollar className="text-4xl text-purple-600" />
                                    <h3 className="text-3xl font-bold text-gray-900">Claims</h3>
                                </div>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Raise and track claims effortlessly. Submit cashless or reimbursement claims, upload documents, check claim status in real-time, and receive notifications at every step. No more paperwork or long waiting times to know your claim status.
                                </p>
                                <ul className="space-y-2 pt-4">
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-purple-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">Submit claims digitally with ease</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-purple-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">Track claim status in real-time</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-purple-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">Upload documents from your phone</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Feature 4 - Wellness (Image Right) */}
                    <div className="mb-20">
                        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                            <div className="lg:w-1/2">
                                <div className="relative max-w-md mx-auto">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-3xl blur-2xl opacity-20"></div>
                                    <img 
                                        src="/uploads/wellness-screenshot.png" 
                                        alt="Wellness programs and health tips" 
                                        className="relative z-10 w-full rounded-2xl shadow-2xl"
                                    />
                                </div>
                            </div>
                            <div className="lg:w-1/2 space-y-4">
                                <div className="flex items-center gap-3">
                                    <FaHeartbeat className="text-4xl text-red-600" />
                                    <h3 className="text-3xl font-bold text-gray-900">Wellness</h3>
                                </div>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Stay healthy with wellness programs, health tips, hospital network information, and preventive care resources. Access mental health support and wellness webinars. Take charge of your health with personalized wellness content and professional guidance.
                                </p>
                                <ul className="space-y-2 pt-4">
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-red-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">Access wellness programs and webinars</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-red-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">View hospital network information</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-red-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">Mental health support resources</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Feature 5 - Help & Support (Image Left) */}
                    <div>
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            <div className="lg:w-1/2">
                                <div className="relative max-w-md mx-auto">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-3xl blur-2xl opacity-20"></div>
                                    <img 
                                        src="/uploads/help-screenshot.png" 
                                        alt="Help and support section" 
                                        className="relative z-10 w-full rounded-2xl shadow-2xl"
                                    />
                                </div>
                            </div>
                            <div className="lg:w-1/2 space-y-4">
                                <div className="flex items-center gap-3">
                                    <FaQuestionCircle className="text-4xl text-yellow-600" />
                                    <h3 className="text-3xl font-bold text-gray-900">Help & Support</h3>
                                </div>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Get instant assistance through our support section. Raise tickets, chat with support agents, access FAQs, and receive quick resolutions to all your queries. Our dedicated support team is here to help you navigate your benefits with ease.
                                </p>
                                <ul className="space-y-2 pt-4">
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-yellow-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">Raise and track support tickets</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-yellow-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">Live chat with support agents</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-yellow-600 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">Comprehensive FAQ section</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-white py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Simple Steps to Get Started
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Start managing your health benefits in minutes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Download the App
                            </h3>
                            <p className="text-gray-600">
                                Get our app from Google Play Store or Apple App Store
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Sign In Securely
                            </h3>
                            <p className="text-gray-600">
                                Log in using your employee credentials provided by your company
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Start Managing
                            </h3>
                            <p className="text-gray-600">
                                Access your dashboard and manage all your health benefits
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Experience Hassle-Free Benefits Management?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of employees who have simplified their health benefits management with our mobile app
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a 
                            href="#" 
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl font-semibold"
                        >
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                                alt="Get it on Google Play" 
                                className="h-12"
                            />
                        </a>
                        <a 
                            href="#" 
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl font-semibold"
                        >
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                                alt="Download on the App Store" 
                                className="h-12"
                            />
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
