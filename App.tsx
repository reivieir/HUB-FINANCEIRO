import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
// IMPORTANTE: Verifique se o caminho abaixo está EXATAMENTE igual ao seu arquivo
import { gerarResposta } from './services/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o Dexco Assist. Como posso ajudar?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await gerarResposta(userText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b p-4 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg"><Bot className="text-white" size={24} /></div>
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
        {isLoading && <div className="text-gray-400 text-sm animate-pulse">Dexco está pensando...</div>}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            className="flex-1 bg-gray-100 p-3 rounded-lg outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite algo..."
          />
          <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg">
            <Send size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
}
