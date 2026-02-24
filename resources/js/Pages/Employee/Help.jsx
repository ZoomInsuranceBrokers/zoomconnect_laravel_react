import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import {
    QuestionMarkCircleIcon,
    ChatBubbleLeftRightIcon,
    XMarkIcon,
    ClockIcon,
    SparklesIcon,
    ArrowLeftIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ChevronRightIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

export default function Help({ employee }) {
    const [activeTab, setActiveTab] = useState('faq');
    const [faqs, setFaqs] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTicketDetailsModal, setShowTicketDetailsModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketMessages, setTicketMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);

    // Fetch FAQs
    useEffect(() => {
        if (activeTab === 'faq') {
            fetchFaqs();
        }
    }, [activeTab]);

    // Fetch Tickets
    useEffect(() => {
        if (activeTab === 'tickets') {
            fetchTickets();
        }
    }, [activeTab]);

    const fetchFaqs = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/employee/help/faqs');
            if (response.data.success) {
                setFaqs(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/employee/help/tickets');
            if (response.data.success) {
                setTickets(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const openChatbot = () => window.dispatchEvent(new CustomEvent('open-chatbot'));

    const handleViewTicket = async (ticketId) => {
        setLoading(true);
        try {
            const response = await axios.get(`/employee/help/tickets/${ticketId}`);
            if (response.data.success) {
                setSelectedTicket(response.data.ticket);
                setTicketMessages(response.data.messages);
                setShowTicketDetailsModal(true);
            }
        } catch (error) {
            console.error('Error fetching ticket details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setLoading(true);
        try {
            const response = await axios.post(`/employee/help/tickets/${selectedTicket.ticket_id}/message`, {
                message: newMessage
            });

            if (response.data.success) {
                setNewMessage('');
                handleViewTicket(selectedTicket.ticket_id);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'open': 'bg-blue-100 text-blue-600',
            'Open': 'bg-blue-100 text-blue-600',
            'in_progress': 'bg-amber-100 text-amber-600',
            'In Progress': 'bg-amber-100 text-amber-600',
            'resolved': 'bg-emerald-100 text-emerald-600',
            'Resolved': 'bg-emerald-100 text-emerald-600',
            'closed': 'bg-gray-100 text-gray-600',
            'Closed': 'bg-gray-100 text-gray-600',
        };
        return badges[status] || 'bg-gray-100 text-gray-600';
    };

    return (
        <EmployeeLayout employee={employee}>
            <Head title="Help & Support" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-2 my-4 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-sm">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button
                                onClick={() => window.history.back()}
                                className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white shadow flex items-center justify-center flex-shrink-0"
                            >
                                <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                            </button>
                            <div>
                                <h1 className="text-base sm:text-2xl font-bold text-gray-900">Help & Support</h1>
                                <p className="text-xs sm:text-xs text-gray-600 mt-1">We're here to assist you!</p>
                            </div>
                        </div>
                        
                        {/* Tabs - Right Side */}
                        <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                            <div className="relative inline-flex bg-white rounded-full p-1 shadow-sm">
                                {/* Sliding Background Indicator */}
                                <div className={`absolute inset-y-1 bg-[rgb(147,71,144)] rounded-full transition-all duration-300 ease-out ${activeTab === 'faq' ? 'left-1 right-[calc(50%+2px)]' : 'left-[calc(50%+2px)] right-1'}`} />
                                
                                <button
                                    onClick={() => setActiveTab('faq')}
                                    className={`flex items-center justify-center space-x-1.5 sm:space-x-2 py-2.5 sm:py-3 px-4 sm:pl-4 sm:pr-8 rounded-full transition-all duration-300 text-xs sm:text-sm font-semibold whitespace-nowrap relative z-10 ${activeTab === 'faq'
                                        ? 'text-white'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <QuestionMarkCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">FAQ & Contact</span>
                                    <span className="sm:hidden">FAQ</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('tickets')}
                                    className={`flex items-center justify-center space-x-1.5 sm:space-x-2 py-2.5 sm:py-3 px-4 sm:px-6 rounded-full transition-all duration-300 text-xs sm:text-sm font-semibold whitespace-nowrap relative z-10 ${activeTab === 'tickets'
                                        ? 'text-white'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">My Tickets</span>
                                    <span className="sm:hidden">Tickets</span>
                                </button>
                            </div>
                        </div>
                    </div>



                    {/* FAQ & Contact Tab */}
                    {activeTab === 'faq' && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 border border-gray-200">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                                {/* FAQ Section - 64% */}
                                <div className="lg:col-span-2">
                                    <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b-2 border-gray-100">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                                            <QuestionMarkCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(147,71,144)]" />
                                        </div>
                                        <h2 className="text-base sm:text-lg md:text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
                                    </div>

                                    {loading ? (
                                        <div className="flex justify-center items-center h-48 sm:h-64">
                                            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-purple-200 border-t-[rgb(147,71,144)]"></div>
                                        </div>
                                    ) : faqs.length === 0 ? (
                                        <div className="text-center py-6 sm:py-12">
                                            <QuestionMarkCircleIcon className="w-10 h-10 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-2 sm:mb-4" />
                                            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">No FAQs Available</h3>
                                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">Check back later for frequently asked questions.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto scrollbar-hide">
                                            {faqs.map((faq, index) => (
                                                <div key={faq.id}>
                                                    <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden hover:border-[rgb(147,71,144)] transition-colors">
                                                        <button
                                                            onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                                            className="w-full flex justify-between items-center p-2.5 sm:p-3 md:p-4 text-left bg-gray-50 hover:bg-purple-50 transition-colors"
                                                        >
                                                            <span className="font-semibold text-gray-800 text-[10px] sm:text-xs md:text-sm pr-2 sm:pr-4">{faq.question}</span>
                                                            {expandedFaq === faq.id ? (
                                                                <ChevronUpIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[rgb(147,71,144)] flex-shrink-0" />
                                                            ) : (
                                                                <ChevronDownIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                                                            )}
                                                        </button>
                                                        {expandedFaq === faq.id && (
                                                            <div className="p-2.5 sm:p-3 md:p-4 bg-white border-t border-gray-200">
                                                                <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {index < faqs.length - 1 && <div className="h-px bg-gray-100 my-2 sm:my-3" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Contact Section - 36% */}
                                <div className="lg:col-span-1 lg:border-l lg:border-gray-200 lg:pl-6">
                                    <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b-2 border-gray-100">
                                        {/* <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                        </div> */}
                                        <h2 className="text-base sm:text-lg md:text-2xl font-bold text-gray-800">Contact Us</h2>
                                    </div>

                                    <div className="space-y-2 sm:space-y-3 md:space-y-4">
                                        {/* Phone */}
                                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border border-gray-200">
                                            <div className="flex items-start space-x-2 sm:space-x-3">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                    <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-gray-800 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">Phone Support</h3>
                                                    <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm">+91 9289695656</p>
                                                    <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mt-0.5 sm:mt-1">Mon-Fri: 9AM - 6PM</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-px bg-gray-200" />
                                        {/* Email */}
                                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border border-gray-200">
                                            <div className="flex items-start space-x-2 sm:space-x-3">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                                    <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-gray-800 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">Email Support</h3>
                                                    <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm break-all">support@zoomconnect.com</p>
                                                    <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mt-0.5 sm:mt-1">Response within 24 hours</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-px bg-gray-200" />
                                        {/* Address */}
                                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border border-gray-200">
                                            <div className="flex items-start space-x-2 sm:space-x-3">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                                                    <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-gray-800 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">Office Address</h3>
                                                    <p className="text-gray-600 text-[10px] sm:text-xs md:text-xs leading-tight">123 Business Park ,Suite 100 ,New York, NY 10001</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-px bg-gray-200" />
                                        {/* Call to Action */}
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-purple-200 text-center">
                                            <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-500 mx-auto mb-2 sm:mb-3" />
                                            <h3 className="font-bold text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">Need Quick Help?</h3>
                                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-2 sm:mb-4">Try our AI Assistant for instant answers!</p>
                                            <button
                                                onClick={openChatbot}
                                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium text-[10px] sm:text-xs md:text-sm hover:from-purple-500 hover:to-pink-500 transition-all shadow-md"
                                            >
                                                Chat with AI Assistant
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tickets Tab */}
                    {activeTab === 'tickets' && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6 pb-3 sm:pb-4 border-b-2 border-gray-100">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <ChatBubbleLeftRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">My Support Tickets</h2>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-48 sm:h-64">
                                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-purple-200 border-t-[rgb(147,71,144)]"></div>
                                </div>
                            ) : tickets.length === 0 ? (
                                <div className="text-center py-8 sm:py-12 md:py-16">
                                    <ChatBubbleLeftRightIcon className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-2 sm:mb-4" />
                                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">No Support Tickets</h3>
                                    <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">You haven't raised any support tickets yet.</p>
                                    <button
                                        onClick={openChatbot}
                                        className="bg-[rgb(147,71,144)] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm hover:bg-[rgb(127,51,124)] transition-colors shadow-md inline-flex items-center space-x-1.5 sm:space-x-2"
                                    >
                                        <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span>Chat with AI</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-h-[600px] overflow-y-auto scrollbar-hide">
                                    {tickets.map((ticket, index) => {
                                        const statusConfig = {
                                            'open': {
                                                badge: 'bg-blue-100',
                                                icon: <ExclamationCircleIcon className="w-6 h-6 text-blue-500" />,
                                                iconBg: 'bg-blue-100'
                                            },
                                            'in_progress': {
                                                badge: 'bg-amber-100',
                                                icon: <ClockIcon className="w-6 h-6 text-amber-500" />,
                                                iconBg: 'bg-amber-100'
                                            },
                                            'resolved': {
                                                badge: 'bg-green-100',
                                                icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
                                                iconBg: 'bg-green-100'
                                            },
                                            'closed': {
                                                badge: 'bg-gray-100',
                                                icon: <CheckCircleIcon className="w-6 h-6 text-gray-500" />,
                                                iconBg: 'bg-gray-100'
                                            }
                                        };

                                        const config = statusConfig[ticket.status] || statusConfig['open'];

                                        return (
                                            <div
                                                key={ticket.ticket_id}
                                                onClick={() => handleViewTicket(ticket.ticket_id)}
                                                className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden border border-gray-100"
                                                    >
                                                        <div className="p-3 sm:p-4">
                                                            {/* Icon Badge (smaller) */}
                                                            <div className="flex justify-center mb-3">
                                                                <div className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center`}>
                                                                    {config.icon}
                                                                </div>
                                                            </div>

                                                            {/* Ticket ID (compact) */}
                                                            <h3 className="text-sm sm:text-base font-bold text-gray-900 text-center mb-1">
                                                                {ticket.ticket_id}
                                                            </h3>

                                                            {/* Subject (compact) */}
                                                            <p className="text-xs sm:text-sm text-gray-600 text-center mb-3 line-clamp-2 min-h-[2rem]">
                                                                {ticket.subject || 'Untitled Ticket'}
                                                            </p>

                                                            {/* Compact Details Row */}
                                                            <div className="bg-gray-50 rounded-xl p-2 mb-3 text-xs text-gray-700">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-500" />
                                                                        <span className="font-medium">{ticket.message_count || 0}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <ClockIcon className="w-4 h-4 text-gray-500" />
                                                                        <span className="font-medium">
                                                                            {new Date(ticket.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Action Button (small) */}
                                                            <button className="w-full bg-gray-900 hover:bg-black text-white py-2 rounded-xl font-semibold text-sm transition-all">
                                                                View Details
                                                            </button>
                                                        </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Ticket Details Modal */}
            {showTicketDetailsModal && selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 flex-shrink-0">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTicket.subject}</h2>
                                    <p className="text-sm text-gray-500">Ticket #{selectedTicket.ticket_id}</p>
                                </div>
                                <button
                                    onClick={() => setShowTicketDetailsModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>
                            
                            {/* Ticket Info */}
                            <div className="mt-6 bg-gray-50 rounded-2xl p-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-500 text-sm">Status</span>
                                    <span className={`text-sm font-semibold capitalize px-3 py-1 rounded-full ${getStatusBadge(selectedTicket.status)}`}>
                                        {selectedTicket.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-500 text-sm">Created</span>
                                    <span className="text-gray-900 font-semibold text-sm">
                                        {new Date(selectedTicket.created_at).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            <div className="space-y-4">
                                {ticketMessages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender_type === 'employee' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] ${msg.sender_type === 'employee'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white text-gray-800 border border-gray-200'
                                            } rounded-2xl p-4 shadow-sm`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-semibold">
                                                    {msg.sender_type === 'employee' ? 'You' : 'Support Team'}
                                                </span>
                                                <span className={`text-xs ${msg.sender_type === 'employee' ? 'text-gray-300' : 'text-gray-400'}`}>
                                                    {new Date(msg.created_at).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-sm whitespace-pre-line leading-relaxed">{msg.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reply Form */}
                        <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-200 bg-white flex-shrink-0">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !newMessage.trim()}
                                    className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </EmployeeLayout>
    );
}
