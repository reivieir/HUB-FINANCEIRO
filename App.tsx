import React, { useState, useRef, useEffect } from 'react';
import { gerarResposta, listarModelos } from './services/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Olá! Sou o Dexco Assist.', sender: 'ai', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    listarModelos(); // Roda o diagnóstico no console
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setMessages(prev => [...prev, { id: Date.now().toString(), text: userText, sender: 'user', timestamp: new Date() }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await gerarResposta(userText);
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), text: response, sender: 'ai', timestamp: new Date() }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b p-4 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
        </div>
        <h1 className="text-xl font-bold">Dexco Assist</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-blue-600 animate-pulse text-sm">Dexco está pensando...</div>}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input className="flex-1 bg-gray-100 p-3 rounded-xl outline-none" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Digite algo..." />
          <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
      </footer>
    </div>
  );
}
