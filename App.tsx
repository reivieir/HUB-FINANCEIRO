import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from './constants';
import { createDexcoChat, extractDataFromImage } from './services/geminiService';

const App: React.FC = () => {
  const [selected, setSelected] = useState<any>(null);
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createDexcoChat().then(session => setChatSession(session));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading]);

  const handleAskAI = async (e: React.FormEvent | null, directPrompt?: string) => {
    if (e) e.preventDefault();
    const query = directPrompt || aiQuery;
    if (!query.trim() || !chatSession) return;
    
    setAiQuery('');
    setChatMode(true);
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setIsAiLoading(true);

    try {
      const result = await chatSession.sendMessage(query);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'model', text: response.text() }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Erro ao conectar. Verifique sua chave API." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 flex flex-col p-8 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 pb-20">
          <h1 className="text-2xl font-bold text-gray-800">Dexco Assist</h1>
          {messages.map((msg, i) => (
            <div key={i} className={`p-4 rounded-lg shadow-sm border ${msg.role === 'user' ? 'bg-blue-50 ml-12' : 'bg-white mr-12 border-l-4 border-amber-500'}`}>
              <p className="text-xs font-bold uppercase opacity-50 mb-1">{msg.role === 'user' ? 'Você' : 'IA'}</p>
              <p className="text-sm">{msg.text}</p>
            </div>
          ))}
          {isAiLoading && <div className="animate-pulse text-gray-400">Digitando...</div>}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleAskAI} className="mt-4 flex gap-2">
          <input 
            className="flex-1 p-4 rounded-xl border shadow-inner focus:ring-2 focus:ring-amber-500 outline-none" 
            placeholder="Digite sua dúvida..."
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
          />
          <button type="submit" disabled={isAiLoading} className="bg-black text-amber-500 px-8 py-4 rounded-xl font-bold uppercase text-xs">Enviar</button>
        </form>
      </main>
    </div>
  );
};

export default App;
