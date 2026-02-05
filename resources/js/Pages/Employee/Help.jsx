import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { 
    QuestionMarkCircleIcon, 
    ChatBubbleLeftRightIcon, 
    PlusIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationCircleIcon,
    SparklesIcon,
    ArrowPathIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    ChevronDownIcon,
    ChevronUpIcon
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
    
    // Chatbot states
    const [showChatbot, setShowChatbot] = useState(false);
    const [chatbotMessages, setChatbotMessages] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const chatEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (showChatbot) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatbotMessages, showChatbot]);

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

    const startNewChatbot = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/employee/help/chatbot/start');
            if (response.data.success) {
                setCurrentConversationId(response.data.conversation_id);
                setChatbotMessages([
                    {
                        sender_type: 'bot',
                        message: response.data.message,
                        options: response.data.options,
                        show_thank_you: response.data.show_thank_you
                    }
                ]);
                setShowThankYou(response.data.show_thank_you);
            }
        } catch (error) {
            console.error('Error starting chatbot:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChatbotOption = async (optionId, optionLabel) => {
        // Add user message
        setChatbotMessages(prev => [...prev, {
            sender_type: 'user',
            message: optionLabel
        }]);

        setLoading(true);
        try {
            const response = await axios.post('/employee/help/chatbot/respond', {
                conversation_id: currentConversationId,
                selected_option: optionId
            });

            if (response.data.success) {
                setChatbotMessages(prev => [...prev, {
                    sender_type: 'bot',
                    message: response.data.message,
                    options: response.data.options,
                    show_thank_you: response.data.show_thank_you
                }]);
                setShowThankYou(response.data.show_thank_you);
            }
        } catch (error) {
            console.error('Error responding to chatbot:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendChatMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMessage = chatInput.trim();
        setChatInput('');

        // Add user message
        setChatbotMessages(prev => [...prev, {
            sender_type: 'user',
            message: userMessage
        }]);

        setLoading(true);
        try {
            // If no conversation ID, start a new one
            if (!currentConversationId) {
                const response = await axios.post('/employee/help/chatbot/start');
                if (response.data.success) {
                    setCurrentConversationId(response.data.conversation_id);
                }
            }

            // Send user message to bot
            const response = await axios.post('/employee/help/chatbot/message', {
                conversation_id: currentConversationId,
                message: userMessage
            });

            if (response.data.success) {
                setChatbotMessages(prev => [...prev, {
                    sender_type: 'bot',
                    message: response.data.message,
                    options: response.data.options,
                    show_thank_you: response.data.show_thank_you
                }]);
                setShowThankYou(response.data.show_thank_you);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setChatbotMessages(prev => [...prev, {
                sender_type: 'bot',
                message: 'Sorry, I encountered an error. Please try again or contact support.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicketFromChat = async () => {
        if (chatbotMessages.length === 0) return;

        setLoading(true);
        try {
            // Get the first user message as subject
            const firstUserMessage = chatbotMessages.find(msg => msg.sender_type === 'user');
            const subject = firstUserMessage ? firstUserMessage.message.substring(0, 100) : 'Support Request';
            
            // Combine all messages as ticket description
            const messageHistory = chatbotMessages
                .map(msg => `${msg.sender_type === 'user' ? 'You' : 'Bot'}: ${msg.message}`)
                .join('\n\n');

            const response = await axios.post('/employee/help/tickets', {
                subject: subject,
                message: messageHistory,
                conversation_id: currentConversationId
            });

            if (response.data.success) {
                setShowChatbot(false);
                setChatbotMessages([]);
                setCurrentConversationId(null);
                setShowThankYou(false);
                fetchTickets();
                setActiveTab('tickets');
                alert('Support ticket created successfully!');
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('Failed to create ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
            'Open': 'bg-blue-100 text-blue-600',
            'In Progress': 'bg-amber-100 text-amber-600',
            'Resolved': 'bg-emerald-100 text-emerald-600',
        };
        return badges[status] || 'bg-gray-100 text-gray-600';
    };

    const openChatbot = () => {
        setShowChatbot(true);
        if (chatbotMessages.length === 0) {
            startNewChatbot();
        }
    };

    const closeChatbot = () => {
        setShowChatbot(false);
    };

    const handleNewChat = () => {
        setChatbotMessages([]);
        setShowThankYou(false);
        setCurrentConversationId(null);
        startNewChatbot();
    };

    return (
        <EmployeeLayout user={employee}>
            <Head title="Help & Support" />
            <div className="min-h-screen bg-white p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-b-2 border-gray-200">
                        <h1 className="text-3xl font-bold text-gray-800">Help & Support</h1>
                        <p className="text-gray-600 text-sm mt-1">We're here to assist you!</p>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-2xl shadow-sm mb-6 p-2 border-b-2 border-gray-200">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveTab('faq')}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all text-sm font-medium ${
                                    activeTab === 'faq'
                                        ? 'bg-[rgb(147,71,144)] text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <QuestionMarkCircleIcon className="w-5 h-5" />
                                <span>FAQ & Contact</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('tickets')}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all text-sm font-medium ${
                                    activeTab === 'tickets'
                                        ? 'bg-[rgb(147,71,144)] text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                <span>My Tickets</span>
                            </button>
                        </div>
                    </div>

                    {/* FAQ & Contact Tab */}
                    {activeTab === 'faq' && (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            {/* FAQ Section - 60% */}
                            <div className="lg:col-span-3">
                                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2 border-gray-100">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                            <QuestionMarkCircleIcon className="w-6 h-6 text-[rgb(147,71,144)]" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
                                    </div>

                                    {loading ? (
                                        <div className="flex justify-center items-center h-64">
                                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-[rgb(147,71,144)]"></div>
                                        </div>
                                    ) : faqs.length === 0 ? (
                                        <div className="text-center py-12">
                                            <QuestionMarkCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No FAQs Available</h3>
                                            <p className="text-sm text-gray-500">Check back later for frequently asked questions.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
                                            {faqs.map((faq, index) => (
                                                <div key={faq.id}>
                                                    <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-[rgb(147,71,144)] transition-colors">
                                                        <button
                                                            onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                                            className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-purple-50 transition-colors"
                                                        >
                                                            <span className="font-semibold text-gray-800 text-sm pr-4">{faq.question}</span>
                                                            {expandedFaq === faq.id ? (
                                                                <ChevronUpIcon className="w-5 h-5 text-[rgb(147,71,144)] flex-shrink-0" />
                                                            ) : (
                                                                <ChevronDownIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                            )}
                                                        </button>
                                                        {expandedFaq === faq.id && (
                                                            <div className="p-4 bg-white border-t border-gray-200">
                                                                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {index < faqs.length - 1 && <div className="h-px bg-gray-100 my-3" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact Section - 40% */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2 border-gray-100">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                            <PhoneIcon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">Contact Us</h2>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Phone */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                    <PhoneIcon className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 text-sm mb-1">Phone Support</h3>
                                                    <p className="text-gray-600 text-sm">+1 (800) 123-4567</p>
                                                    <p className="text-xs text-gray-500 mt-1">Mon-Fri: 9AM - 6PM</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-px bg-gray-200" />
                                        {/* Email */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                                    <EnvelopeIcon className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 text-sm mb-1">Email Support</h3>
                                                    <p className="text-gray-600 text-sm break-all">support@zoomconnect.com</p>
                                                    <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-px bg-gray-200" />
                                        {/* Address */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                                                    <MapPinIcon className="w-5 h-5 text-amber-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 text-sm mb-1">Office Address</h3>
                                                    <p className="text-gray-600 text-sm">123 Business Park<br/>Suite 100<br/>New York, NY 10001</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-px bg-gray-200" />
                                        {/* Call to Action */}
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200 text-center">
                                            <SparklesIcon className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                                            <h3 className="font-bold text-gray-800 mb-2">Need Quick Help?</h3>
                                            <p className="text-sm text-gray-600 mb-4">Try our AI Assistant for instant answers!</p>
                                            <button
                                                onClick={openChatbot}
                                                className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 transition-all shadow-md"
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
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">My Support Tickets</h2>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-[rgb(147,71,144)]"></div>
                                </div>
                            ) : tickets.length === 0 ? (
                                <div className="text-center py-16">
                                    <ChatBubbleLeftRightIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Support Tickets</h3>
                                    <p className="text-sm text-gray-500 mb-6">You haven't raised any support tickets yet.</p>
                                    <button
                                        onClick={openChatbot}
                                        className="bg-[rgb(147,71,144)] text-white px-6 py-3 rounded-xl font-medium hover:bg-[rgb(127,51,124)] transition-colors shadow-md inline-flex items-center space-x-2"
                                    >
                                        <SparklesIcon className="w-5 h-5" />
                                        <span>Chat with AI Assistant</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide">
                                    {tickets.map((ticket, index) => (
                                        <div key={ticket.ticket_id}>
                                            <div
                                                onClick={() => handleViewTicket(ticket.ticket_id)}
                                                className="border border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer bg-white group"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-gray-800 text-base mb-2 group-hover:text-[rgb(147,71,144)] transition-colors">{ticket.subject}</h3>
                                                        <p className="text-xs text-gray-500 font-medium">Ticket #{ticket.ticket_id}</p>
                                                    </div>
                                                    <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${getStatusBadge(ticket.status)} shadow-sm`}>
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                                <div className="pt-3 border-t border-gray-100">
                                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                                        <div className="flex items-center space-x-4">
                                                            <span className="flex items-center space-x-1.5 bg-blue-50 px-2.5 py-1.5 rounded-lg">
                                                                <ChatBubbleLeftRightIcon className="w-4 h-4 text-blue-600" />
                                                                <span className="font-medium">{ticket.message_count} messages</span>
                                                            </span>
                                                            <span className="flex items-center space-x-1.5 bg-amber-50 px-2.5 py-1.5 rounded-lg">
                                                                <ClockIcon className="w-4 h-4 text-amber-600" />
                                                                <span className="font-medium">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                                            </span>
                                                        </div>
                                                        <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-[rgb(147,71,144)] transition-colors" />
                                                    </div>
                                                </div>
                                            </div>
                                            {index < tickets.length - 1 && <div className="h-px bg-gray-100 my-3" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Chatbot Button */}
            <button
                onClick={openChatbot}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-2xl flex items-center justify-center hover:from-purple-500 hover:to-pink-500 transition-all hover:scale-110 z-50 group"
                aria-label="Open AI Chatbot"
            >
                <SparklesIcon className="w-8 h-8 text-white" />
                <div className="absolute bottom-full mb-2 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    AI Assistant
                </div>
            </button>

            {/* Chatbot Modal */}
            {showChatbot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl sm:w-full h-[90vh] sm:h-[600px] flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-5 rounded-t-3xl flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <SparklesIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">AI Assistant</h2>
                                    <p className="text-xs text-purple-100">Ask me anything!</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleNewChat}
                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                                    title="New Chat"
                                >
                                    <ArrowPathIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={closeChatbot}
                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-hide">
                            <div className="space-y-4">
                                {chatbotMessages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] ${
                                            msg.sender_type === 'user' 
                                                ? 'bg-gradient-to-br from-purple-400 to-pink-400 text-white' 
                                                : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                                        } rounded-2xl p-4`}>
                                            <p className="text-sm whitespace-pre-line leading-relaxed">{msg.message}</p>
                                            
                                            {/* Options */}
                                            {msg.options && msg.options.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    {msg.options.map((option) => (
                                                        <button
                                                            key={option.id}
                                                            onClick={() => handleChatbotOption(option.id, option.label)}
                                                            disabled={loading}
                                                            className="w-full text-left bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 shadow-md"
                                                        >
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Thank You Message & Ticket Creation */}
                                {showThankYou && (
                                    <div className="bg-white rounded-2xl p-5 border-2 border-purple-200 shadow-md">
                                        <div className="text-center">
                                            <CheckCircleIcon className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                            <h3 className="text-base font-bold text-gray-800 mb-2">Was this helpful?</h3>
                                            <p className="text-sm text-gray-600 mb-5">Did we resolve your query?</p>
                                            <div className="flex space-x-3 justify-center">
                                                <button
                                                    onClick={() => {
                                                        handleNewChat();
                                                    }}
                                                    className="px-5 py-2.5 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-xl text-sm font-medium hover:from-green-500 hover:to-emerald-500 transition-all shadow-md"
                                                >
                                                    Yes, Thank You!
                                                </button>
                                                <button
                                                    onClick={handleCreateTicketFromChat}
                                                    disabled={loading}
                                                    className="px-5 py-2.5 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl text-sm font-medium hover:from-purple-500 hover:to-pink-500 transition-all shadow-md disabled:opacity-50"
                                                >
                                                    {loading ? 'Creating Ticket...' : 'Raise a Ticket'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {loading && (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-200 border-t-[rgb(147,71,144)]"></div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendChatMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-3xl flex-shrink-0">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgb(147,71,144)] focus:border-transparent text-sm"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !chatInput.trim()}
                                    className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-5 py-3 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Ticket Details Modal */}
            {showTicketDetailsModal && selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[rgb(147,71,144)] to-purple-600 p-6 rounded-t-3xl flex-shrink-0">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 pr-4">
                                    <h2 className="text-xl font-bold text-white mb-1">{selectedTicket.subject}</h2>
                                    <p className="text-purple-100 text-sm">Ticket #{selectedTicket.ticket_id}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${getStatusBadge(selectedTicket.status)} bg-white`}>
                                        {selectedTicket.status}
                                    </span>
                                    <button 
                                        onClick={() => setShowTicketDetailsModal(false)} 
                                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors flex-shrink-0"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 scrollbar-hide">
                            <div className="space-y-4">
                                {ticketMessages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender_type === 'employee' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] ${
                                            msg.sender_type === 'employee' 
                                                ? 'bg-gradient-to-br from-purple-400 to-pink-400 text-white' 
                                                : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                                        } rounded-2xl p-4`}>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="text-xs font-semibold">
                                                    {msg.sender_type === 'employee' ? 'You' : 'Support Team'}
                                                </span>
                                            </div>
                                            <p className="text-sm whitespace-pre-line leading-relaxed">{msg.message}</p>
                                            <p className={`text-xs mt-2 ${msg.sender_type === 'employee' ? 'text-purple-200' : 'text-gray-400'}`}>
                                                {new Date(msg.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reply Form */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-3xl flex-shrink-0">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgb(147,71,144)] focus:border-transparent text-sm"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !newMessage.trim()}
                                    className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-5 py-3 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-md disabled:opacity-50"
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
