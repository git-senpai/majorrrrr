import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { LocationData } from '../types';
import { chatWithAssistant } from '../services/geminiService';

interface ChatbotProps {
  data: LocationData | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const PREDEFINED_QUESTIONS = [
  "What is the best time to visit this location?",
  "How can I reach there via public transport?",
  "Are there any current safety or crowding concerns?",
  "Where are the main entry/exit points?",
  "Is it family-friendly at this hour?"
];

export const Chatbot: React.FC<ChatbotProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I am your CrowdWatcher AI Assistant. How can I help you analyze this location today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(text, data);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-105 transition-transform"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-full max-w-[380px] h-[600px] max-h-[80vh] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">CrowdWatcher AI</h3>
                  <p className="text-[10px] font-mono text-green-500 uppercase">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-neutral-400" />
                    </div>
                  )}
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                      ? 'bg-white text-black rounded-tr-sm' 
                      : 'bg-neutral-800 text-neutral-200 rounded-tl-sm border border-neutral-700'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-800 text-neutral-200 rounded-tl-sm border border-neutral-700 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                    <span className="text-xs text-neutral-400">Analyzing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Predefined Questions */}
            <div className="p-3 bg-neutral-900 border-t border-neutral-800 overflow-x-auto whitespace-nowrap flex gap-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {PREDEFINED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-full text-[11px] text-neutral-300 transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-neutral-900 border-t border-neutral-800">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about this location..."
                  disabled={isLoading}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-2 bg-white text-black rounded-lg hover:bg-neutral-200 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
