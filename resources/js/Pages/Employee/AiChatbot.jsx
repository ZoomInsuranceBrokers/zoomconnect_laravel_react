import React, { useState, useEffect, useRef } from 'react';
import {
    SparklesIcon,
    XMarkIcon,
    ArrowPathIcon,
    PaperAirplaneIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';

export default function AiChatbot() {
    const [showChatbot, setShowChatbot] = useState(false);
    const [chatbotMessages, setChatbotMessages] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

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
        if (chatbotMessages.length === 0) return;
        setLoading(true);
        try {
            const firstUserMessage = chatbotMessages.find(msg => msg.sender_type === 'user');
            const subject = firstUserMessage ? firstUserMessage.message.substring(0, 100) : 'Support Request';
            const messageHistory = chatbotMessages
                .map(msg => `${msg.sender_type === 'user' ? 'You' : 'Bot'}: ${msg.message}`)
                .join('\n\n');

            const response = await axios.post('/employee/help/tickets', {
                subject,
                message: messageHistory,
                conversation_id: currentConversationId,
            });

            if (response.data.success) {
                setShowChatbot(false);
                setChatbotMessages([]);
                setCurrentConversationId(null);
                setShowThankYou(false);
                alert('Support ticket created successfully!');
                window.location.href = '/employee/help';
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('Failed to create ticket. Please try again.');
        } finally {
            setLoading(false);
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
                                {showThankYou && (
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
        </>
    );
}
