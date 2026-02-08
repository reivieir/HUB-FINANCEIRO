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

  const [modalOpen, setModalOpen] = useState(false);
  const [modalFields, setModalFields] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [pendingCommand, setPendingCommand] = useState<{index: number, content: string} | null>(null);
  
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createDexcoChat().then(session => setChatSession(session));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading]);

  const filteredFAQ = PERGUNTAS_FREQUENTES.filter(item => 
    item.p.toLowerCase().includes(searchFAQ.toLowerCase())
  );

  const filteredCommands = COMANDOS_GEMS.filter(item => 
    item.t.toLowerCase().includes(searchCommands.toLowerCase())
  );

  const handleCopy = useCallback((textToCopy?: string) => {
    const text = textToCopy || selected?.body;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [selected]);

  const startNewChat = () => {
    setMessages([{ role: 'model', text: "Olá! Como posso te ajudar hoje?" }]);
    setChatMode(true);
    setSelected(null);
  };

  const selectItem = (origin: Origin, index: number) => {
    setChatMode(false);
    if (origin === 'faq') {
      const item = PERGUNTAS_FREQUENTES[index];
      setSelected({ title: item.p, body: item.r, origin: 'faq', index });
    } else {
      const item = COMANDOS_GEMS[index];
      if (item.t === "Extrair") { setIsImageModalOpen(true); return; }
      setSelected({ title: item.t, body: item.c, origin: 'command', index });
    }
  };

  const handleAskAI = async (e: React.FormEvent | null, directPrompt?: string) => {
    if (e) e.preventDefault();
    const query = directPrompt || aiQuery;
    if (!query.trim() || !chatSession) return;
    
    setAiQuery('');
    setChatMode(true);
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setIsAiLoading(true);

    try {
      // CORREÇÃO: Enviando apenas a string para evitar erro "t is not iterable"
      const result = await chatSession.sendMessage(query);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'model', text: response.text() }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Erro na conexão." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <aside className="w-[380px] bg-[#1A1A1A] text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-gray-800 bg-black">
          <button onClick={startNewChat} className="w-full mb-6 p-3 bg-[#D4A373]/10 border border-[#D4A373]/30 rounded-lg text-[#D4A373] text-xs font-black uppercase">Novo Chat IA</button>
          <input type="text" placeholder="Buscar dúvida..." className="w-full bg-[#262626] border border-gray-700 rounded-lg py-2 px-3 text-xs" value={searchFAQ} onChange={(e) => setSearchFAQ(e.target.value)} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredFAQ.map((item, idx) => (
            <ListItem key={idx} text={item.p} isActive={!chatMode && selected?.origin === 'faq'} onClick={() => selectItem('faq', idx)} />
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-8 flex-1 overflow-y-auto">
          {chatMode ? (
             <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[85%] p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
                      <p className="text-[10px] font-black uppercase mb-2 opacity-40">{msg.role === 'user' ? 'Você' : 'Assistente'}</p>
                      <p className="text-[15px]">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isAiLoading && <div className="text-gray-400 animate-pulse">Pensando...</div>}
                <div ref={chatEndRef} />
             </div>
          ) : selected ? (
            <div className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-xl border-t-[12px] border-[#D4A373]">
              <h2 className="text-4xl font-black uppercase text-gray-900 mb-6">{selected.title}</h2>
              <div className="bg-[#F8F9FA] p-8 rounded-2xl border text-xl">{selected.body}</div>
            </div>
          ) : <div className="h-full flex items-center justify-center text-gray-300 font-black uppercase">Selecione uma opção</div>}
        </div>

        <div className="p-8 bg-white border-t">
          <form onSubmit={handleAskAI} className="max-w-4xl mx-auto flex gap-4">
            <input className="flex-1 p-5 bg-gray-50 rounded-2xl border outline-none" placeholder="Digite sua dúvida..." value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} />
            <button type="submit" disabled={isAiLoading} className="bg-black text-[#D4A373] px-10 rounded-2xl font-black uppercase text-xs">Enviar</button>
          </form>
        </div>
      </main>

      <aside className="w-[380px] bg-[#1A1A1A] text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-800 bg-black">
          <input type="text" placeholder="Buscar comando..." className="w-full bg-[#262626] border border-gray-700 rounded-lg py-2 px-3 text-xs" value={searchCommands} onChange={(e) => setSearchCommands(e.target.value)} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredCommands.map((item, idx) => (
            <ListItem key={idx} text={item.t} onClick={() => selectItem('command', idx)} />
          ))}
        </div>
      </aside>
    </div>
  );
};

export default App;
