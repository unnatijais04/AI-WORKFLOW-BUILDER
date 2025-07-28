import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader, MessageCircle, User, Bot } from 'lucide-react';
import { chatAPI } from '../services/api';

const ChatModal = ({ isOpen, onClose, onExecuteWorkflow, workflow }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      createChatSession();
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createChatSession = async () => {
    try {
      const session = await chatAPI.createSession();
      setSessionId(session.session_id);
    } catch (error) {
      console.error('Failed to create chat session:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Execute workflow
      const result = await onExecuteWorkflow(userMessage, sessionId);
      
      // Add bot response to chat
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: result?.final_response || 'No response generated',
        timestamp: new Date(),
        executionTime: result?.execution_time_ms,
        success: result?.success
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date(),
        success: false,
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 p-2 rounded-lg text-white">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Chat with Your Workflow</h3>
              <p className="text-sm text-gray-500">
                {workflow.nodes.length} components, {workflow.edges.length} connections
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Ready to Chat!
              </h4>
              <p className="text-gray-600 max-w-sm mx-auto">
                Ask me anything and I'll process your query through the workflow you've built.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'bot' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.error ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <Bot className={`w-4 h-4 ${
                    message.error ? 'text-red-600' : 'text-green-600'
                  }`} />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                <div className={`rounded-lg px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.error
                    ? 'bg-red-50 text-red-900 border border-red-200'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.executionTime && (
                    <div className="text-xs opacity-75 mt-1">
                      Executed in {message.executionTime}ms
                    </div>
                  )}
                </div>
                
                <div className={`text-xs text-gray-500 mt-1 ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-green-600" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-gray-600" />
                  <span className="text-gray-600">Processing your request...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;