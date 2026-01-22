import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../hooks/useChat';
import ChatMessage from './ChatMessage';
import { EmptyState } from './EmptyState';

interface AiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiModal: React.FC<AiModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { history, isLoading, sendMessage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    await sendMessage(query);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-sui-gray-950/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-3xl bg-sui-gray-900 border border-sui-gray-800 shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[85vh] rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-sui-gray-800 bg-sui-gray-900/50 backdrop-blur-md">
              <div className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-sui-blue-500/10 rounded-lg text-sui-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                   <span className="font-semibold tracking-wide text-sm">Sui Assistant</span>
                   <span className="text-[10px] text-sui-gray-500 font-mono hidden sm:block">POWERED BY GEMINI</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-sui-gray-800 text-sui-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-6 min-h-[400px] scroll-smooth bg-gradient-to-b from-sui-gray-900 to-sui-gray-950"
            >
              {history.length === 0 && <EmptyState />}

              {history.map((msg, idx) => (
                <ChatMessage key={idx} message={msg} />
              ))}

              {isLoading && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-sui-gray-800/50 rounded-2xl rounded-bl-none px-5 py-4 flex items-center space-x-3 border border-sui-gray-800">
                    <Loader2 className="w-4 h-4 text-sui-blue-400 animate-spin" />
                    <span className="text-sui-gray-400 text-xs font-mono tracking-wider">PROCESSING QUERIES...</span>
                  </div>
                </div>
              )}
              
              {/* Note: In Docusaurus/Vite VITE_ prefix works, but Docusaurus usually uses customFields in config for env vars or process.env if configured. Sticking to import.meta.env for now assuming Vite. */}
              {/* Note: In Docusaurus/Vite VITE_ prefix works if configured, but Docusaurus standard is DOCUSAURUS_. */}
              {!process.env.DOCUSAURUS_GEMINI_API_KEY && history.length > 0 && history[history.length - 1].role === 'user' && !isLoading && (
                 <div className="flex items-center space-x-2 text-amber-400 bg-amber-950/30 p-4 border border-amber-900/50 text-xs mt-4">
                   <AlertCircle className="w-4 h-4 flex-shrink-0" />
                   <span>Warning: API Key not found. Responses will be simulated or fail.</span>
                 </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-5 border-t border-sui-gray-800 bg-sui-gray-900">
              <form onSubmit={handleSearch} className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-sui-blue-500/20 to-cyan-500/20 rounded-lg opacity-0 group-focus-within:opacity-100 transition duration-500 blur"></div>
                
                <div className="relative flex items-center bg-sui-gray-950 border border-sui-gray-800 rounded-lg overflow-hidden focus-within:border-sui-blue-500/50 transition-colors">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask anything about the Sui ecosystem..."
                        className="w-full bg-transparent text-sui-gray-100 pl-4 pr-14 py-4 focus:outline-none placeholder:text-sui-gray-600 text-sm"
                    />
                    <button 
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className="absolute right-2 p-2 bg-sui-blue-600 hover:bg-sui-blue-500 text-white rounded transition-all disabled:opacity-50 disabled:grayscale"
                        aria-label="Send message"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
