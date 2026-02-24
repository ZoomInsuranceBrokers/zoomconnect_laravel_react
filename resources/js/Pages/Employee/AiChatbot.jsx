import React, { useState, useEffect, useRef } from 'react';
import {
    SparklesIcon,
    XMarkIcon,
    ArrowPathIcon,
    PaperAirplaneIcon,
    CheckCircleIcon,
    DocumentArrowUpIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';

export default function AiChatbot() {
    const [showChatbot, setShowChatbot] = useState(false);
    const [chatbotMessages, setChatbotMessages] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false);
    const [showTicketForm, setShowTicketForm] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [ticketQuery, setTicketQuery] = useState('');
    const [ticketDocument, setTicketDocument] = useState(null);
    const [ticketSubmitLoading, setTicketSubmitLoading] = useState(false);
    const [ticketResultModal, setTicketResultModal] = useState({ show: false, success: false, message: '' });
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (showChatbot) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatbotMessages, showChatbot]);

    // Listen for external open event (e.g. from Help.jsx buttons)
    useEffect(() => {
        const handler = () => openChatbot();
        window.addEventListener('open-chatbot', handler);
        return () => window.removeEventListener('open-chatbot', handler);
    }, [chatbotMessages]);

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
                        show_thank_you: response.data.show_thank_you,
                    },
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
        setChatbotMessages(prev => [...prev, { sender_type: 'user', message: optionLabel }]);
        setLoading(true);
        try {
            const response = await axios.post('/employee/help/chatbot/respond', {
                conversation_id: currentConversationId,
                selected_option: optionId,
            });
            if (response.data.success) {
                setChatbotMessages(prev => [
                    ...prev,
                    {
                        sender_type: 'bot',
                        message: response.data.message,
                        options: response.data.options,
                        show_thank_you: response.data.show_thank_you,
                    },
                ]);
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
        setChatbotMessages(prev => [...prev, { sender_type: 'user', message: userMessage }]);

        setLoading(true);
        try {
            let convId = currentConversationId;
            if (!convId) {
                const startRes = await axios.post('/employee/help/chatbot/start');
                if (startRes.data.success) {
                    convId = startRes.data.conversation_id;
                    setCurrentConversationId(convId);
                }
            }

            const response = await axios.post('/employee/help/chatbot/message', {
                conversation_id: convId,
                message: userMessage,
            });

            if (response.data.success) {
                setChatbotMessages(prev => [
                    ...prev,
                    {
                        sender_type: 'bot',
                        message: response.data.message,
                        options: response.data.options,
                        show_thank_you: response.data.show_thank_you,
                    },
                ]);
                setShowThankYou(response.data.show_thank_you);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setChatbotMessages(prev => [
                ...prev,
                { sender_type: 'bot', message: 'Sorry, I encountered an error. Please try again or contact support.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicketFromChat = async () => {
        setShowTicketForm(true);
        setShowThankYou(false);
    };

    const handleSubmitTicket = async (e) => {
        e.preventDefault();
        
        if (!ticketQuery.trim()) {
            setTicketResultModal({
                show: true,
                success: false,
                message: 'Please enter your query'
            });
            return;
        }

        setTicketSubmitLoading(true);
        try {
            const formData = new FormData();
            formData.append('subject', ticketQuery.substring(0, 100));
            formData.append('message', ticketQuery);
            if (currentConversationId) {
                formData.append('conversation_id', currentConversationId);
            }
            if (ticketDocument) {
                formData.append('document', ticketDocument);
            }

            const response = await axios.post('/employee/help/tickets', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success) {
                setShowChatbot(false);
                setChatbotMessages([]);
                setCurrentConversationId(null);
                setShowThankYou(false);
                setShowTicketForm(false);
                setTicketQuery('');
                setTicketDocument(null);
                
                // Show success modal
                setTicketResultModal({
                    show: true,
                    success: true,
                    message: response.data.message || 'Support ticket created successfully! We will get back to you soon.',
                    ticketId: response.data.ticket?.ticket_id
                });
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create ticket. Please try again.';
            setTicketResultModal({
                show: true,
                success: false,
                message: errorMessage
            });
        } finally {
            setTicketSubmitLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setTicketResultModal({
                    show: true,
                    success: false,
                    message: 'File size must be less than 5MB'
                });
                return;
            }
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setTicketResultModal({
                    show: true,
                    success: false,
                    message: 'Only images, PDF, and Word documents are allowed'
                });
                return;
            }
            setTicketDocument(file);
        }
    };

    const removeDocument = () => {
        setTicketDocument(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openChatbot = () => {
        setShowChatbot(true);
        if (chatbotMessages.length === 0) {
            startNewChatbot();
        }
    };

    const closeChatbot = () => setShowChatbot(false);

    const handleNewChat = () => {
        setChatbotMessages([]);
        setShowThankYou(false);
        setCurrentConversationId(null);
        startNewChatbot();
    };

    return (
        <>
            {/* Floating Chatbot Button */}
            <button
                onClick={openChatbot}
                className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full shadow-2xl flex items-center justify-center hover:from-purple-500 hover:to-pink-500 transition-all hover:scale-110 z-50 group"
                aria-label="Open AI Chatbot"
            >
                <SparklesIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                <div className="absolute bottom-full mb-2 right-0 bg-gray-900 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    AI Assistant
                </div>
            </button>

            {/* Chatbot Modal */}
            {showChatbot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-3 sm:p-4 z-50">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-11/12 max-w-md h-[500px] flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[rgb(147,71,144)] to-pink-600 p-3 sm:p-5 rounded-t-2xl sm:rounded-t-3xl flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-base sm:text-lg font-bold text-white">AI Assistant</h2>
                                    <p className="text-[10px] sm:text-xs text-purple-100">Ask me anything!</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                                <button
                                    onClick={handleNewChat}
                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 sm:p-2 transition-colors"
                                    title="New Chat"
                                >
                                    <ArrowPathIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                                <button
                                    onClick={closeChatbot}
                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 sm:p-2 transition-colors"
                                >
                                    <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50 scrollbar-hide">
                            <div className="space-y-3 sm:space-y-4">
                                {chatbotMessages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] sm:max-w-[80%] ${
                                            msg.sender_type === 'user'
                                                ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white'
                                                : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                                        } rounded-xl sm:rounded-2xl p-3 sm:p-3`}>
                                            <p className="text-[10px] sm:text-xs md:text-sm whitespace-pre-line leading-tight">{msg.message}</p>

                                            {/* Options */}
                                            {msg.options && msg.options.length > 0 && (
                                                <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
                                                    {msg.options.map((option) => (
                                                        <button
                                                            key={option.id}
                                                            onClick={() => handleChatbotOption(option.id, option.label)}
                                                            disabled={loading}
                                                            className="w-full text-left bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 shadow-md"
                                                        >
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Thank You & Ticket Creation */}
                                {showThankYou && !showTicketForm && (
                                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border-2 border-purple-200 shadow-md">
                                        <div className="text-center">
                                            <CheckCircleIcon className="w-9 h-9 sm:w-12 sm:h-12 text-emerald-500 mx-auto mb-2 sm:mb-3" />
                                            <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 mb-1 sm:mb-2">Was this helpful?</h3>
                                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-3 sm:mb-5">Did we resolve your query?</p>
                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                                                <button
                                                    onClick={handleNewChat}
                                                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-medium hover:from-green-500 hover:to-emerald-500 transition-all shadow-md"
                                                >
                                                    Yes, Thank You!
                                                </button>
                                                <button
                                                    onClick={handleCreateTicketFromChat}
                                                    disabled={loading}
                                                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-medium hover:from-purple-500 hover:to-pink-500 transition-all shadow-md disabled:opacity-50"
                                                >
                                                    Raise a Ticket
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Ticket Form */}
                                {showTicketForm && (
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-purple-200 shadow-lg">
                                        <form onSubmit={handleSubmitTicket}>
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                                                        <SparklesIcon className="w-5 h-5 text-purple-600" />
                                                        Raise a Support Ticket
                                                    </h3>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setShowTicketForm(false); setShowThankYou(true); }}
                                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        <XMarkIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <p className="text-[10px] sm:text-xs text-gray-600 mb-3">
                                                    Describe your issue and our support team will get back to you shortly.
                                                </p>
                                            </div>

                                            {/* Query Input */}
                                            <div className="mb-4">
                                                <label className="block text-xs font-semibold text-gray-700 mb-2">
                                                    Your Query <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    value={ticketQuery}
                                                    onChange={(e) => setTicketQuery(e.target.value)}
                                                    placeholder="Please describe your issue in detail..."
                                                    rows={4}
                                                    required
                                                    className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm resize-none"
                                                />
                                            </div>

                                            {/* Document Upload (Optional) */}
                                            <div className="mb-4">
                                                <label className="block text-xs font-semibold text-gray-700 mb-2">
                                                    Supporting Document <span className="text-gray-400 font-normal">(Optional)</span>
                                                </label>
                                                
                                                {!ticketDocument ? (
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            onChange={handleFileChange}
                                                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                                            className="hidden"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="w-full px-4 py-3 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-2"
                                                        >
                                                            <DocumentArrowUpIcon className="w-5 h-5 text-purple-500" />
                                                            Click to upload file
                                                        </button>
                                                        <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1 text-center">
                                                            Max 5MB • JPG, PNG, PDF, DOC, DOCX
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 p-3 bg-white border-2 border-purple-200 rounded-lg">
                                                        <DocumentArrowUpIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium text-gray-800 truncate">{ticketDocument.name}</p>
                                                            <p className="text-[10px] text-gray-500">{(ticketDocument.size / 1024).toFixed(1)} KB</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={removeDocument}
                                                            className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Submit Buttons */}
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => { setShowTicketForm(false); setShowThankYou(true); setTicketQuery(''); setTicketDocument(null); }}
                                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={ticketSubmitLoading || !ticketQuery.trim()}
                                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs sm:text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {ticketSubmitLoading ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <PaperAirplaneIcon className="w-4 h-4" />
                                                            Submit Ticket
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
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
                        <form onSubmit={handleSendChatMessage} className="p-3 sm:p-4 border-t border-gray-200 bg-white rounded-b-2xl sm:rounded-b-3xl flex-shrink-0">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[rgb(147,71,144)] focus:border-transparent text-[10px] sm:text-xs md:text-sm placeholder:text-[10px] sm:placeholder:text-xs"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !chatInput.trim()}
                                    className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Ticket Result Modal */}
            {ticketResultModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all overflow-hidden">
                        {ticketResultModal.success ? (
                            <>
                                {/* Success Design - Matches Image */}
                                <div className="p-8 pt-10">
                                    {/* Green Check Badge */}
                                    <div className="flex justify-center mb-6">
                                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircleIcon className="w-12 h-12 text-green-500" strokeWidth={2.5} />
                                        </div>
                                    </div>

                                    {/* Heading */}
                                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8 leading-tight">
                                        Your ticket has been<br />successfully submitted
                                    </h2>

                                    {/* Details Section */}
                                    <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                            <span className="text-gray-500 text-sm">Ticket ID</span>
                                            <span className="text-gray-900 font-semibold text-sm">{ticketResultModal.ticketId || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                            <span className="text-gray-500 text-sm">Status</span>
                                            <span className="text-gray-900 font-semibold text-sm">Open</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-500 text-sm">Date & Time</span>
                                            <span className="text-gray-900 font-semibold text-sm">
                                                {new Date().toLocaleDateString('en-US', { 
                                                    month: '2-digit', 
                                                    day: '2-digit', 
                                                    year: '2-digit' 
                                                })} {new Date().toLocaleTimeString('en-US', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit',
                                                    hour12: false 
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => {
                                            setTicketResultModal({ show: false, success: false, message: '' });
                                            window.location.href = '/employee/help';
                                        }}
                                        className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-semibold text-base transition-all shadow-lg"
                                    >
                                        View My Tickets
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Error Design */}
                                <div className="p-8 pt-10">
                                    {/* Red X Badge */}
                                    <div className="flex justify-center mb-6">
                                        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                                            <XMarkIcon className="w-12 h-12 text-red-500" strokeWidth={2.5} />
                                        </div>
                                    </div>

                                    {/* Heading */}
                                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                                        Something went wrong
                                    </h2>

                                    {/* Error Message */}
                                    <p className="text-gray-600 text-center mb-8 leading-relaxed">
                                        {ticketResultModal.message}
                                    </p>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => setTicketResultModal({ show: false, success: false, message: '' })}
                                        className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-semibold text-base transition-all shadow-lg"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
