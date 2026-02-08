import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from './constants';
import { createDexcoChat } from './services/geminiService';
import ListItem from './components/ListItem';

const App: React.FC = () => {
  const [selected, setSelected] = useState<any>(null);
  const [searchFAQ, setSearchFAQ] = useState('');
  const [searchCommands, setSearchCommands] = useState('');
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
    setAiQuery(''); setChatMode(true);
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setIsAiLoading(true);
    try {
      const result = await chatSession.sendMessage(query);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'model', text: response.text() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Erro na conexão com a IA." }]);
    } finally { setIsAiLoading(false); }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      {/* FAQ Sidebar */}
      <aside className="w-[380px] bg-[#1A1A1A] text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 bg-black border-b border-gray-800">
          <button onClick={() => {setChatMode(true); setSelected(null);}} className="w-full mb-6 p-3 bg-[#D4A373]/10 border border-[#D4A373]/30 rounded-lg text-[#D4A373] text-xs font-black uppercase tracking-widest hover:bg-[#D4A373]/20 transition-all">Novo Chat IA</button>
          <h1 className="text-lg font-black uppercase italic text-center">Principais <span className="text-[#D4A373]">Duvidas</span></h1>
          <input className="w-full mt-4 bg-[#262626] border border-gray-700 rounded-lg p-2 text-xs" placeholder="Buscar..." value={searchFAQ} onChange={e => setSearchFAQ(e.target.value)} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {PERGUNTAS_FREQUENTES.filter(f => f.p.toLowerCase().includes(searchFAQ.toLowerCase())).map((f, i) => (
            <ListItem key={i} text={f.p} isActive={!chatMode && selected?.title === f.p} onClick={() => { setChatMode(false); setSelected({title: f.p, body: f.r, origin: 'faq'}); }} showIndex />
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-8 flex-1 overflow-y-auto">
          {chatMode ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-6 rounded-2xl bg-white border shadow-sm ${msg.role === 'model' ? 'border-l-8 border-[#D4A373]' : ''}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isAiLoading && <div className="animate-pulse text-gray-400">Digitando...</div>}
              <div ref={chatEndRef} />
            </div>
          ) : selected ? (
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-[12px] border-[#D4A373] relative min-h-[550px]">
                <div className="p-10">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <span className="text-[11px] font-black uppercase text-[#D4A373] bg-[#D4A373]/10 px-3 py-1.5 rounded-full">Fluxo Interno Cervello</span>
                      <h2 className="text-4xl font-black text-gray-900 mt-4 uppercase tracking-tighter">{selected.title}</h2>
                    </div>
                    <button onClick={() => handleAskAI(null, `Refinar: ${selected.title}`)} className="p-3 bg-amber-50 text-[#D4A373] rounded-xl font-black uppercase text-[10px]">Refinar com IA</button>
                  </div>
                  <div className="bg-[#F8F9FA] p-10 rounded-3xl border shadow-inner">
                    {/* O 'whitespace-pre-wrap' resolve a formatação dos parágrafos */}
                    <div className="text-gray-800 text-xl leading-relaxed whitespace-pre-wrap">{selected.body}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : <div className="h-full flex items-center justify-center text-gray-300 font-black uppercase">Selecione uma instrução</div>}
        </div>
        <div className="p-8 bg-white border-t">
          <form onSubmit={(e) => handleAskAI(e)} className="max-w-4xl mx-auto flex gap-4">
            <input className="flex-1 p-5 bg-gray-50 rounded-2xl border outline-none" placeholder="Dúvida rápida? Digite aqui..." value={aiQuery} onChange={e => setAiQuery(e.target.value)} />
            <button type="submit" className="bg-black text-[#D4A373] px-10 rounded-2xl font-black uppercase text-xs">Enviar</button>
          </form>
        </div>
      </main>

      {/* Commands Sidebar */}
      <aside className="w-[380px] bg-[#1A1A1A] text-white flex flex-col shadow-2xl">
        <div className="p-6 bg-black border-b border-gray-800">
          <h1 className="text-lg font-black uppercase italic text-center">Atendimento <span className="text-[#D4A373]">Cervello</span></h1>
          <input className="w-full mt-4 bg-[#262626] border border-gray-700 rounded-lg p-2 text-xs" placeholder="Buscar..." value={searchCommands} onChange={e => setSearchCommands(e.target.value)} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {COMANDOS_GEMS.filter(c => c.t.toLowerCase().includes(searchCommands.toLowerCase())).map((c, i) => (
            <ListItem key={i} text={c.t} isActive={!chatMode && selected?.title === c.t} onClick={() => { setChatMode(false); setSelected({title: c.t, body: c.c, origin: 'command'}); }} />
          ))}
        </div>
      </aside>
    </div>
  );
};

export default App;
