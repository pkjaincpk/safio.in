
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquare, Loader2 } from 'lucide-react';
import { getAIRecommendation } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Hi! I'm Safio Assistant, your screen protection expert. How can I help you today?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    
    const userMsg = query.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    const response = await getAIRecommendation(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: response || 'Sorry, I got disconnected.' }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center gap-2"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="font-bold pr-2">Ask Safio</span>
        </button>
      ) : (
        <div className="bg-white w-80 md:w-96 rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transform transition-all animate-in slide-in-from-bottom-4">
          <div className="bg-red-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <span className="font-bold">Safio Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-red-700 p-1 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 h-96 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-red-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 shadow-sm border rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border rounded-tl-none flex items-center gap-2 text-slate-400 italic text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-red-500" /> Safio is checking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="How do I protect my privacy?"
                className="flex-1 bg-slate-100 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white p-2 rounded-xl transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
