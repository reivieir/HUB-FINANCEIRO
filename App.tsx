import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { gerarResposta } from './services/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o Dexco Assist. Como posso ajudar você hoje?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // FUNÇÃO DE TESTE COM ALERTA
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Botão clicado! Input:", input);
    
    if (!input.trim()) return;
    if (isLoading) return;

    // Teste visual imediato
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
      console.log("Chamando API...");
      const aiResponseText = await gerarResposta(userText);
      console.log("Resposta recebida:", aiResponseText);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("ERRO DETECTADO:", error);
      alert("Erro na chamada: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg"><Bot className="text-white" size={24} /></div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dexco Assist</h1>
          <p className="text-sm text-green-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span> Online
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.sender === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>
                {message.sender === 'user' ? <User size={18} className="text-blue-600" /> : <Bot size={18} className="text-gray-600" />}
              </div>
              <div className={`p-4 rounded-2xl ${message.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'}`}>
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start"><div className="bg-white border border-gray-200 p-4 rounded-2xl flex items-center gap-2"><Loader2 className="animate-spin text-blue-600" size={18} /><span>Pensando...</span></div></div>}
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite aqui..."
            className="flex-1 bg-gray-100 rounded-xl px-4 py-3 outline-none"
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white p-3 rounded-xl"
            onClick={() => console.log("Clique direto no botão")}
          >
            <Send size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
}

export default App;
