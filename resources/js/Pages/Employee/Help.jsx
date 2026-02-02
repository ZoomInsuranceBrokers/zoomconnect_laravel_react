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
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

export default function Help({ employee }) {
    const [activeTab, setActiveTab] = useState('chatbot');
    const [faqs, setFaqs] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showNewTicketModal, setShowNewTicketModal] = useState(false);
    const [showTicketDetailsModal, setShowTicketDetailsModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketMessages, setTicketMessages] = useState([]);
    const [newTicketForm, setNewTicketForm] = useState({
        subject: '',
        message: ''
    });
    const [newMessage, setNewMessage] = useState('');
    
    // Chatbot states
    const [chatbotMessages, setChatbotMessages] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false);
    const [previousConversations, setPreviousConversations] = useState([]);
    const [showPreviousChats, setShowPreviousChats] = useState(false);
    const chatEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatbotMessages]);

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

    // Start chatbot on load
    useEffect(() => {
        if (activeTab === 'chatbot' && chatbotMessages.length === 0) {
            startNewChatbot();
        }
    }, [activeTab]);

    // Fetch previous conversations
    useEffect(() => {
        if (activeTab === 'chatbot') {
            fetchPreviousConversations();
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

    const fetchPreviousConversations = async () => {
        try {
            const response = await axios.get('/employee/help/chatbot/conversations');
            if (response.data.success) {
                setPreviousConversations(response.data.conversations);
            }
        } catch (error) {
            console.error('Error fetching previous conversations:', error);
        }
    };

    const loadPreviousConversation = async (conversationId) => {
        setLoading(true);
        try {
            const response = await axios.get(`/employee/help/chatbot/conversation/${conversationId}`);
            if (response.data.success) {
                setCurrentConversationId(conversationId);
                
                const formattedMessages = response.data.messages.map(msg => ({
                    sender_type: msg.sender_type,
                    message: msg.message,
                    options: msg.options ? JSON.parse(msg.options) : [],
                    show_thank_you: false
                }));
                
                setChatbotMessages(formattedMessages);
                setShowThankYou(response.data.conversation.is_completed);
                setShowPreviousChats(false);
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/employee/help/tickets', newTicketForm);
            if (response.data.success) {
                setShowNewTicketModal(false);
                setNewTicketForm({ subject: '', message: '' });
                fetchTickets();
                setActiveTab('tickets');
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
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
            'Open': 'bg-blue-100 text-blue-700',
            'In Progress': 'bg-yellow-100 text-yellow-700',
            'Resolved': 'bg-green-100 text-green-700',
        };
        return badges[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <EmployeeLayout user={employee}>
            <Head title="Help & Support" />
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-xl p-6 mb-6">
                        <h1 className="text-2xl font-bold text-white">Help & Support</h1>
                        <p className="text-purple-100 text-sm mt-1">We're here to help you!</p>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-3xl shadow-lg mb-6 p-1">
                        <div className="flex space-x-1">
                            <button
                                onClick={() => setActiveTab('chatbot')}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl transition-all text-sm font-medium ${
                                    activeTab === 'chatbot'
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <SparklesIcon className="w-4 h-4" />
                                <span>AI Assistant</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('faq')}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl transition-all text-sm font-medium ${
                                    activeTab === 'faq'
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <QuestionMarkCircleIcon className="w-4 h-4" />
                                <span>FAQs</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('tickets')}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl transition-all text-sm font-medium ${
                                    activeTab === 'tickets'
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                <span>My Tickets</span>
                            </button>
                        </div>
                    </div>

                    {/* Chatbot Tab */}
                    {activeTab === 'chatbot' && (
                        <div className="bg-white rounded-3xl shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setShowPreviousChats(!showPreviousChats)}
                                        className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-xl text-xs font-medium hover:bg-purple-100 transition-colors"
                                    >
                                        Previous Chats ({previousConversations.length})
                                    </button>
                                    <button
                                        onClick={() => {
                                            setChatbotMessages([]);
                                            setShowThankYou(false);
                                            startNewChatbot();
                                        }}
                                        className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-xs font-medium hover:shadow-md transition-shadow"
                                    >
                                        <ArrowPathIcon className="w-3 h-3 inline mr-1" />
                                        New Chat
                                    </button>
                                </div>
                            </div>

                            {/* Previous Conversations Panel */}
                            {showPreviousChats && (
                                <div className="mb-4 bg-purple-50 rounded-2xl p-4 max-h-60 overflow-y-auto">
                                    <h3 className="text-xs font-semibold text-purple-800 mb-3">Previous Conversations</h3>
                                    {previousConversations.length === 0 ? (
                                        <p className="text-xs text-gray-500 text-center py-4">No previous conversations</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {previousConversations.map((conv) => (
                                                <button
                                                    key={conv.id}
                                                    onClick={() => loadPreviousConversation(conv.conversation_id)}
                                                    className="w-full text-left bg-white rounded-xl p-3 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-xs font-medium text-gray-800">{conv.conversation_id}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{conv.message_count} messages</p>
                                                        </div>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                            conv.is_completed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {conv.is_completed ? 'Completed' : 'Active'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(conv.created_at).toLocaleString()}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Chat Messages */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
                                {chatbotMessages.map((msg, index) => (
                                    <div key={index} className={`mb-3 ${msg.sender_type === 'user' ? 'flex justify-end' : ''}`}>
                                        <div className={`max-w-[80%] ${msg.sender_type === 'user' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white text-gray-800'} rounded-2xl p-3 shadow-sm`}>
                                            <p className="text-sm whitespace-pre-line">{msg.message}</p>
                                            
                                            {/* Options */}
                                            {msg.options && msg.options.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    {msg.options.map((option) => (
                                                        <button
                                                            key={option.id}
                                                            onClick={() => handleChatbotOption(option.id, option.label)}
                                                            disabled={loading}
                                                            className="w-full text-left bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-xl text-xs font-medium hover:shadow-md transition-all disabled:opacity-50"
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
                                    <div className="mt-4 bg-white rounded-2xl p-4 border-2 border-purple-200">
                                        <div className="text-center">
                                            <CheckCircleIcon className="w-10 h-10 text-green-500 mx-auto mb-2" />
                                            <h3 className="text-sm font-semibold text-gray-800 mb-2">Thank you for using our AI Assistant!</h3>
                                            <p className="text-xs text-gray-600 mb-4">Did we resolve your query?</p>
                                            <div className="flex space-x-3 justify-center">
                                                <button
                                                    onClick={() => {
                                                        setChatbotMessages([]);
                                                        setShowThankYou(false);
                                                        startNewChatbot();
                                                    }}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-medium hover:bg-green-600 transition-colors"
                                                >
                                                    Yes, Thank You!
                                                </button>
                                                <button
                                                    onClick={() => setShowNewTicketModal(true)}
                                                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-xs font-medium hover:shadow-md transition-shadow"
                                                >
                                                    No, Create Ticket
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {loading && (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                        </div>
                    )}

                    {/* FAQ Tab */}
                    {activeTab === 'faq' && (
                        <div>
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                                </div>
                            ) : faqs.length === 0 ? (
                                <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
                                    <QuestionMarkCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No FAQs Available</h3>
                                    <p className="text-sm text-gray-500">Check back later for frequently asked questions.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {faqs.map((faq) => (
                                        <div key={faq.id} className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                                        <QuestionMarkCircleIcon className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-semibold text-gray-800 mb-2">{faq.question}</h3>
                                                    <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tickets Tab */}
                    {activeTab === 'tickets' && (
                        <div>
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => setShowNewTicketModal(true)}
                                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-shadow"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    <span>New Ticket</span>
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                                </div>
                            ) : tickets.length === 0 ? (
                                <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
                                    <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Support Tickets</h3>
                                    <p className="text-sm text-gray-500 mb-4">You haven't created any support tickets yet.</p>
                                    <button
                                        onClick={() => setShowNewTicketModal(true)}
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-shadow"
                                    >
                                        Create Your First Ticket
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {tickets.map((ticket) => (
                                        <div
                                            key={ticket.ticket_id}
                                            onClick={() => handleViewTicket(ticket.ticket_id)}
                                            className="bg-white rounded-3xl shadow-lg p-5 hover:shadow-xl transition-shadow cursor-pointer"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-800">{ticket.subject}</h3>
                                                    <p className="text-xs text-gray-500 mt-1">#{ticket.ticket_id}</p>
                                                </div>
                                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>{ticket.message_count} messages</span>
                                                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* New Ticket Modal */}
            {showNewTicketModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 rounded-t-3xl">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-white">Create Support Ticket</h2>
                                <button onClick={() => setShowNewTicketModal(false)} className="text-white hover:bg-white/20 rounded-full p-1">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleCreateTicket} className="p-6">
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={newTicketForm.subject}
                                    onChange={(e) => setNewTicketForm({...newTicketForm, subject: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    placeholder="Brief description of your issue"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-xs font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={newTicketForm.message}
                                    onChange={(e) => setNewTicketForm({...newTicketForm, message: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    placeholder="Please provide details about your issue"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowNewTicketModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-shadow disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Ticket Details Modal */}
            {showTicketDetailsModal && selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 rounded-t-3xl">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-lg font-bold text-white">{selectedTicket.subject}</h2>
                                    <p className="text-purple-100 text-xs mt-1">#{selectedTicket.ticket_id}</p>
                                </div>
                                <button onClick={() => setShowTicketDetailsModal(false)} className="text-white hover:bg-white/20 rounded-full p-1">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                            <div className="space-y-3">
                                {ticketMessages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender_type === 'employee' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] ${msg.sender_type === 'employee' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white text-gray-800'} rounded-2xl p-3 shadow-sm`}>
                                            <p className="text-xs whitespace-pre-line">{msg.message}</p>
                                            <p className={`text-xs mt-1 ${msg.sender_type === 'employee' ? 'text-purple-100' : 'text-gray-400'}`}>
                                                {new Date(msg.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !newMessage.trim()}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50"
                                >
                                    <PaperAirplaneIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </EmployeeLayout>
    );
}
