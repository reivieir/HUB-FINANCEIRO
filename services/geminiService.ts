import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from './constants';
import { SelectedContent, Origin } from './types';
import ListItem from './components/ListItem';
import PromptModal from './components/PromptModal';
import ImageUploadModal from './components/ImageUploadModal';
import { createDexcoChat, extractDataFromImage } from './services/geminiService';

const App: React.FC = () => {
  const [selected, setSelected] = useState<SelectedContent | null>(null);
  const [searchFAQ, setSearchFAQ] = useState('');
  const [searchCommands, setSearchCommands] = useState('');
  const [isCopied, setIsCopied] = useState(false);
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

  const handleCopy = useCallback((textToCopy?: string) => {
    const text = textToCopy || selected?.body;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [selected]);

  const selectItem = (origin: Origin, index: number) => {
    setChatMode(false);
    const list = origin === 'faq' ? PERGUNTAS_FREQUENTES : COMANDOS_GEMS;
    const item = list[index];
    setSelected({ 
      title: origin === 'faq' ? (item as any).p : (item as any).t, 
      body: origin === 'faq' ? (item as any).r : (item as any).c, 
      origin, 
      index 
    });
  };

  const handleAskAI = async (e: React.FormEvent | null) => {
    if (e) e.preventDefault();
    if (!aiQuery.trim() || !chatSession) return;
    
    const query = aiQuery;
    setAiQuery('');
    setChatMode(true);
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setIsAiLoading(true);

    try {
      // FIX: Enviar apenas a string para evitar erro "t is not iterable"
      const result = await chatSession.sendMessage(query);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'model', text: response.text() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Erro ao conectar com a IA." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      {/* FAQ Sidebar */}
      <aside className="w-[350px] bg-[#1A1A1A] text-white flex flex-col border-r border-gray-800">
        <div className="p-6 bg-black border-b border-gray-800">
          <h1 className="text-lg font-black uppercase tracking-tighter italic">FAQ <span className="text-[#D4A373]">DEXCO</span></h1>
          <input className="w-full mt-4 bg-[#262626] border border-gray-700 rounded-lg p-2 text-xs" placeholder="Buscar..." value={searchFAQ} onChange={e => setSearchFAQ(e.target.value)} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {PERGUNTAS_FREQUENTES.filter(f => f.p.toLowerCase().includes(searchFAQ.toLowerCase())).map((f, i) => (
            <ListItem key={i} text={f.p} isActive={!chatMode && selected?.title === f.p} onClick={() => selectItem('faq', i)} />
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto">
          {chatMode ? (
            <div className="max-w-4xl mx-auto space-y-6 pb-20">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[80%] p-6 rounded-2xl bg-white border shadow-sm">
                    <p className="text-[10px] font-black uppercase opacity-30 mb-2">{msg.role === 'user' ? 'Você' : 'Dexco Assist'}</p>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isAiLoading && <div className="animate-pulse text-gray-400">Digitando...</div>}
              <div ref={chatEndRef} />
            </div>
          ) : selected ? (
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-xl border-t-[12px] border-[#D4A373]">
              <h2 className="text-4xl font-black uppercase text-gray-900 mb-6">{selected.title}</h2>
              <div className="bg-[#F8F9FA] p-8 rounded-2xl border text-xl leading-relaxed">{selected.body}</div>
              <button onClick={() => handleCopy()} className="mt-6 text-[#D4A373] font-bold uppercase text-xs hover:underline">
                {isCopied ? 'Copiado!' : 'Copiar Texto'}
              </button>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-300 font-black uppercase tracking-widest">Selecione uma instrução ou inicie o chat</div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-8 bg-white border-t">
          <form onSubmit={handleAskAI} className="max-w-4xl mx-auto flex gap-4">
            <input className="flex-1 p-5 bg-gray-50 rounded-2xl border outline-none focus:ring-2 focus:ring-[#D4A373]" placeholder="Dúvida rápida? Digite aqui..." value={aiQuery} onChange={e => setAiQuery(e.target.value)} />
            <button type="submit" disabled={isAiLoading} className="bg-black text-[#D4A373] px-10 rounded-2xl font-black uppercase text-xs">Enviar</button>
          </form>
        </div>
      </main>

      {/* Commands Sidebar */}
      <aside className="w-[350px] bg-[#1A1A1A] text-white flex flex-col border-l border-gray-800">
        <div className="p-6 bg-black border-b border-gray-800">
          <h1 className="text-lg font-black uppercase tracking-tighter italic">COMANDOS <span className="text-[#D4A373]">GEMS</span></h1>
          <input className="w-full mt-4 bg-[#262626] border border-gray-700 rounded-lg p-2 text-xs" placeholder="Buscar..." value={searchCommands} onChange={e => setSearchCommands(e.target.value)} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {COMANDOS_GEMS.filter(c => c.t.toLowerCase().includes(searchCommands.toLowerCase())).map((c, i) => (
            <ListItem key={i} text={c.t} isActive={!chatMode && selected?.title === c.t} onClick={() => selectItem('command', i)} />
          ))}
        </div>
      </aside>
    </div>
  );
};

export default App;
