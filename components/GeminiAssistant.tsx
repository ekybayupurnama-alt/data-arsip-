
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  Info,
  HelpCircle
} from 'lucide-react';
import { chatWithArchives } from '../services/geminiService';
import { ArchiveDocument } from '../types';

interface GeminiAssistantProps {
  archives: ArchiveDocument[];
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ archives }) => {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([
    { role: 'ai', content: 'Halo! Saya asisten AI ArsipDigital. Ada yang bisa saya bantu terkait dokumen Anda?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const archiveCtx = JSON.stringify(archives.map(a => ({
        title: a.title,
        desc: a.description,
        cat: a.category,
        summary: a.aiSummary,
        date: a.uploadDate
      })));

      const response = await chatWithArchives(userMsg, archiveCtx);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Maaf, sistem AI sedang sibuk. Silakan coba lagi.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Apa saja laporan dari tahun 2023?",
    "Cari dokumen tentang sewa gedung.",
    "Berapa total file kategori keuangan?",
    "Ringkaskan arsip terbaru saya."
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col animate-fadeIn">
      <div className="bg-indigo-600 p-4 rounded-t-2xl shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3 text-white">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold">Asisten Arsip Cerdas</h3>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-indigo-100">AI Aktif</span>
            </div>
          </div>
        </div>
        <HelpCircle className="w-5 h-5 text-indigo-200 cursor-pointer" />
      </div>

      <div className="flex-1 bg-white shadow-xl border-x border-slate-100 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}>
            <div className={`flex items-start space-x-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`p-2 rounded-xl ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                ? 'bg-indigo-500 text-white rounded-tr-none' 
                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              <span className="text-sm text-slate-500 italic">Berpikir...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 border-t-0 rounded-b-2xl">
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((s, i) => (
            <button 
              key={i} 
              onClick={() => { setInput(s); }}
              className="text-xs bg-white px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>{s}</span>
            </button>
          ))}
        </div>
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text" 
            placeholder="Tanyakan sesuatu tentang arsip Anda..."
            className="w-full pl-4 pr-14 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all ${
              !input.trim() || isLoading 
              ? 'bg-slate-100 text-slate-300' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-90'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="mt-2 flex items-center justify-center space-x-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          <Info className="w-3 h-3" />
          <span>Didukung oleh Google Gemini Flash</span>
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistant;
