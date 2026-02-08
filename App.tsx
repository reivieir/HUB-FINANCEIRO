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
      {/* Sidebar Esquerda: FAQ */}
      <aside className="w-[380px] bg-[#1A1A1A] text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-gray-800 bg-black">
          <button onClick={() => {setChatMode(true); setSelected(null);}} className="w-full mb-6 p-3 bg-[#D4A373]/10 border border-[#D4A373]/30 rounded-lg text-[#D4A373] text-xs font-black uppercase tracking-widest hover:bg-[#D4A373]/20 transition-all flex items-center justify-center gap-2">
            <i className="fas fa-plus"></i> Novo Chat IA
          </button>
          <div className="text-center">
            <h1 className="text-lg font-black tracking-tighter uppercase italic">Principais <span className="text-[#D4A373]">Duvidas</span></h1>
            <p className="text-[9px] text-gray-500 uppercase mt-1 font-bold">Perguntas Frequentes</p>
          </div>
          <div className="mt-4 w-full relative">
            <input type="text" placeholder="Buscar dúvida..." className="w-full bg-[#262626] border border-gray-700 rounded-lg py-2 px-3 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#D4A373]" value={searchFAQ} onChange={(e) => setSearchFAQ(e.target.value)} />
            <i className="fas fa-search absolute right-3 top-2.5 text-gray-600 text-xs"></i>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {PERGUNTAS_FREQUENTES.filter(f => f.p.toLowerCase().includes(searchFAQ.toLowerCase())).map((item, idx) => (
            <ListItem key={idx} text={item.p} isActive={!chatMode && selected?.origin === 'faq' && selected?.title === item.p} onClick={() => selectItem('faq', PERGUNTAS_FREQUENTES.indexOf(item))} showIndex />
          ))}
        </div>
      </aside>

      {/* Área Central: Card Principal */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
          {chatMode ? (
            <div className="max-w-4xl mx-auto space-y-6 pb-12">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-[85%] p-6 rounded-2xl shadow-md border ${msg.role === 'user' ? 'bg-white border-gray-200 text-gray-800 rounded-tr-none' : 'bg-white border-l-8 border-[#D4A373] border-gray-200 text-gray-800 rounded-tl-none'}`}>
                    <div className="text-[10px] font-black uppercase mb-3 tracking-widest opacity-40 flex items-center gap-2">{msg.role === 'user' ? 'Você' : 'Assistente Dexco'}</div>
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap text-[15px] leading-relaxed font-medium">{msg.text}</div>
                  </div>
                </div>
              ))}
              {isAiLoading && <div className="text-gray-400 animate-pulse">Pensando...</div>}
              <div ref={chatEndRef} />
            </div>
          ) : selected ? (
            <div className="animate-fade-in max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-[12px] border-[#D4A373] relative min-h-[550px] flex flex-col">
                <div className="p-10 flex-1">
                  <div className="mb-10 flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-black uppercase text-[#D4A373] bg-[#D4A373]/10 px-3 py-1.5 rounded-full tracking-tighter">
                        {selected.origin === 'faq' ? 'FAQ - Suporte Fornecedor' : 'Fluxo Interno Cervello'}
                      </span>
                      <h2 className="text-4xl font-black text-gray-900 mt-4 uppercase tracking-tighter leading-none">{selected.title}</h2>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAskAI(null, `Me explique melhor: ${selected.title}`)} className="p-3 bg-amber-50 text-[#D4A373] rounded-xl hover:bg-[#D4A373] hover:text-white transition-all shadow-sm flex items-center gap-2 group">
                        <i className="fas fa-magic group-hover:rotate-12 transition-transform"></i>
                        <span className="text-[10px] font-black uppercase">Refinar com IA</span>
                      </button>
                      <button onClick={() => handleCopy()} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-black transition-all shadow-sm">
                        <i className={`fas ${isCopied ? 'fa-check text-green-500' : 'fa-copy'} text-lg`}></i>
                      </button>
                    </div>
                  </div>
                  <div className="bg-[#F8F9FA] p-10 rounded-3xl border border-gray-100 shadow-inner">
                    <div className="text-gray-800 leading-relaxed text-xl whitespace-pre-wrap font-medium">
                      {selected.body}
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Dexco Assist Triple View &copy; 2026</p>
                </div>
              </div>
            </div>
          ) : <div className="h-full flex items-center justify-center text-gray-300 font-black uppercase">Selecione uma instrução</div>}
        </div>

        {/* Barra de Input Flutuante */}
        <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <form onSubmit={handleAskAI} className="max-w-4xl mx-auto flex gap-4">
            <div className="flex-1 relative group">
              <input type="text" placeholder="Dúvida rápida? Digite aqui para falar com a IA..." className="w-full p-5 pl-14 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4A373] transition-all text-sm font-semibold shadow-inner border border-gray-200" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} />
              <div className="absolute left-5 top-5 text-[#D4A373]"><i className="fas fa-wand-sparkles text-lg"></i></div>
            </div>
            <button type="submit" className="bg-black text-[#D4A373] font-black px-10 py-5 rounded-2xl transition-all shadow-xl hover:bg-gray-900 flex items-center gap-3 uppercase text-xs tracking-widest">
              <i className="fas fa-paper-plane"></i> Enviar
            </button>
          </form>
        </div>
      </main>

      {/* Sidebar Direita: Comandos */}
      <aside className="w-[380px] bg-[#1A1A1A] text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-800 bg-black text-center">
          <h1 className="text-lg font-black uppercase italic">Atendimento <span className="text-[#D4A373]">Cervello</span></h1>
          <p className="text-[9px] text-gray-500 uppercase mt-1 font-bold">Comandos Internos e Templates</p>
          <input type="text" placeholder="Buscar comando..." className="w-full mt-4 bg-[#262626] border border-gray-700 rounded-lg py-2 px-3 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#D4A373]" value={searchCommands} onChange={(e) => setSearchCommands(e.target.value)} />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {COMANDOS_GEMS.filter(c => c.t.toLowerCase().includes(searchCommands.toLowerCase())).map((item, idx) => (
            <ListItem key={idx} text={item.t} isActive={!chatMode && selected?.origin === 'command' && selected?.title === item.t} onClick={() => selectItem('command', COMANDOS_GEMS.indexOf(item))} />
          ))}
        </div>
      </aside>

      <PromptModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} fields={modalFields} onSubmit={() => {}} />
      <ImageUploadModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} isLoading={isExtracting} onConfirm={() => {}} />
    </div>
  );
};

export default App;
