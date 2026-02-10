import React, { useState, useRef, useEffect } from 'react';
import { gerarResposta } from './services/geminiService';

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Olá! Sou o Dexco Assist.', sender: 'ai' }
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
    setMessages(prev => [...prev, { id: Date.now().toString(), text: userText, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await gerarResposta(userText);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: response, sender: 'ai' }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow">
        <h1 className="text-xl font-bold">Dexco Assist</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-gray-500 text-sm animate-pulse">Digitando...</div>}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input 
            className="flex-1 border p-2 rounded outline-none" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Digite sua dúvida..." 
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400" disabled={isLoading}>
            Enviar
          </button>
        </form>
      </footer>
    </div>
  );
}
