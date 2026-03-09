import React, { useState, useEffect, useRef } from 'react';
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from './constants';
import { SelectedContent, Origin } from './types';
import ListItem from './components/ListItem';
import PromptModal from './components/PromptModal';
import { createDexcoChat } from './services/geminiService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const SENHA_ACESSO = "Dexco2026";

  const [selected, setSelected] = useState<SelectedContent | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFields, setModalFields] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [pendingCommand, setPendingCommand] = useState<{index: number, content: string, type: string} | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      createDexcoChat().then(session => setChatSession(session));
    }
  }, [isAuthenticated]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const selectItem = (origin: Origin | 'ranking', index: number) => {
    if (origin === 'faq') {
      const item = PERGUNTAS_FREQUENTES[index];
      setSelected({ title: item.p, body: item.r, origin: 'faq', index });
    } else if (origin === 'ranking') {
      setModalTitle("RANKING BANCÁRIO"); setModalFields(["Periodo", "Banco", "Posição", "Volume"]);
      setPendingCommand({ index: -1, content: '', type: 'ranking' }); setModalOpen(true);
    } else {
      const item = COMANDOS_GEMS[index];
      if (item.t === "Recuperar Acesso") {
        setModalTitle("DADOS USUÁRIO"); setModalFields(["Usuário"]);
        setPendingCommand({ index, content: item.c, type: 'command' }); setModalOpen(true);
      } else {
        setSelected({ title: item.t, body: item.c, origin: 'command', index });
      }
    }
  };

  const handleModalSubmit = (v: Record<string, string>) => {
    let body = pendingCommand?.type === 'ranking' ? `Ranking: ${v.Banco} em ${v.Posição}º` : pendingCommand?.content.replace(/usuário informado/g, v.Usuário || '');
    setSelected({ title: "Resultado", body: body || '', origin: 'command', index: 0 });
    setModalOpen(false);
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim() || isAiLoading || !chatSession) return;
    const query = aiQuery; setAiQuery('');
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setIsAiLoading(true);
    try {
      const result = await chatSession.sendMessage(query);
      setMessages(prev => [...prev, { role: 'model', text: result.response.text() }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Erro: Verifique sua API Key no arquivo .env" }]);
    } finally { setIsAiLoading(false); }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0B0C10]">
        <form onSubmit={(e) => { e.preventDefault(); if(passwordInput === SENHA_ACESSO) setIsAuthenticated(true); }} className="bg-white p-10 rounded-[32px] text-center italic shadow-2xl">
          <h1 className="text-2xl font-black mb-6 italic">DEXCO <span className="text-[#D4A373]">ASSIST</span></h1>
          <input type="password" placeholder="SENHA" className="w-full p-4 border rounded-2xl mb-4 text-center font-bold" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
          <button type="submit" className="w-full bg-black text-[#D4A373] py-4 rounded-2xl font-black uppercase italic">Acessar HUB</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] p-4 md:p-8 italic">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-black text-[#D4A373] uppercase italic">DEXCO ASSIST | HUB FINANCEIRO</h1>
      </header>

      <div className="max-w-6xl mx-auto space-y-8 italic">
        {/* CHAT IA */}
        <div className="bg-[#121418] rounded-[40px] border border-gray-800 flex flex-col h-[400px] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar italic">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'model' ? 'bg-[#1A1D23] text-gray-200 border-l-4 border-[#D4A373]' : 'bg-[#D4A373] text-black font-bold'}`}>{msg.text}</div>
              </div>
            ))}
            {isAiLoading && <p className="text-[#D4A373] animate-pulse text-[10px] font-black uppercase">Processando...</p>}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleAskAI} className="p-4 bg-black flex gap-2">
            <input className="flex-1 p-4 bg-[#1A1D23] rounded-xl text-white outline-none italic" placeholder="Dúvida técnica?" value={aiQuery} onChange={e => setAiQuery(e.target.value)} />
            <button type="submit" className="bg-[#D4A373] px-6 rounded-xl font-black uppercase text-xs italic">Enviar</button>
          </form>
        </div>

        {/* CONTEÚDO RISCO SACADO (RESTAURADO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 italic">
          <div className="bg-[#121418] p-6 rounded-3xl border border-gray-800">
            <h3 className="text-[#D4A373] font-black uppercase text-xs mb-4 italic">Suporte FAQ</h3>
            <div className="space-y-1 h-[300px] overflow-y-auto pr-2 custom-scrollbar italic">
              {PERGUNTAS_FREQUENTES.map((f, i) => <ListItem key={i} text={f.p} onClick={() => selectItem('faq', i)} />)}
            </div>
          </div>
          <div className="bg-[#121418] p-6 rounded-3xl border border-gray-800">
            <h3 className="text-green-500 font-black uppercase text-xs mb-4 italic">Comandos Cervello</h3>
            <div className="space-y-1 h-[300px] overflow-y-auto pr-2 custom-scrollbar italic">
              {COMANDOS_GEMS.map((c, i) => <ListItem key={i} text={c.t} onClick={() => selectItem('command', i)} />)}
              <ListItem text="Ranking Bancos" onClick={() => selectItem('ranking', 0)} />
            </div>
          </div>
        </div>
      </div>

      {/* POP-UP DE CÓPIA */}
      {selected && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 italic">
          <div className="bg-white w-full max-w-xl rounded-3xl p-8 shadow-2xl italic">
            <h2 className="font-black uppercase text-[10px] mb-4 text-gray-400 italic">{selected.title}</h2>
            <div className="bg-gray-50 p-6 rounded-2xl mb-6 whitespace-pre-wrap text-lg italic">{selected.body}</div>
            <button onClick={() => { navigator.clipboard.writeText(selected.body); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }} className={`w-full py-4 rounded-xl font-black uppercase italic ${isCopied ? 'bg-green-600 text-white' : 'bg-black text-[#D4A373]'}`}>
              {isCopied ? 'Copiado!' : 'Copiar Texto'}
            </button>
            <button onClick={() => setSelected(null)} className="w-full mt-2 text-[10px] font-black uppercase text-gray-400 italic">Fechar</button>
          </div>
        </div>
      )}

      <PromptModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} fields={modalFields} onSubmit={handleModalSubmit} />
    </div>
  );
};

export default App;
