import React, { useState, useEffect, useRef } from 'react';
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from './constants';
import { createDexcoChat } from './services/geminiService';
import ListItem from './components/ListItem';

const App: React.FC = () => {
  // --- 1. ESTADOS DE NAVEGAÇÃO E ACESSO ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'risco-sacado' | 'gestao-bancos'>('home');
  const SENHA_ACESSO = "Dexco2026";

  // --- 2. ESTADOS DE CHAT IA (Conexão Direta Mantida) ---
  const [messages, setMessages] = useState<any[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated && !chatSession) {
      createDexcoChat().then(session => setChatSession(session));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading]);

  // --- 3. LÓGICA DE INTERFACE ---
  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim() || isAiLoading) return;
    const query = aiQuery;
    setAiQuery('');
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setIsAiLoading(true);
    try {
      // A IA já responderá sobre Protestos e Conciliação baseada na fonte DOCX integrada ao serviço
      const result = await chatSession.sendMessage(query);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'model', text: response.text() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Erro na conexão com a base de conhecimento." }]);
    } finally { setIsAiLoading(false); }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0B0C10]">
        <form onSubmit={(e) => { e.preventDefault(); if(passwordInput === SENHA_ACESSO) setIsAuthenticated(true); else alert("Acesso Negado"); }} className="bg-white p-10 rounded-[32px] shadow-2xl border-t-[10px] border-[#D4A373] w-[400px] text-center italic">
          <h1 className="text-3xl font-black uppercase text-black mb-2 italic">Dexco <span className="text-[#D4A373]">Assist</span></h1>
          <input type="password" placeholder="SENHA DE ACESSO" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl mb-4 outline-none text-center font-bold" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
          <button type="submit" className="w-full bg-black text-[#D4A373] py-4 rounded-2xl font-black uppercase text-xs">Entrar no HUB</button>
        </form>
      </div>
    );
  }

  // --- 4. COMPONENTES DE VISÃO ---

  const renderHome = () => (
    <div className="max-w-5xl mx-auto h-full flex flex-col animate-fade-in">
      {/* GRID DE LINKS ATIVOS E CONHECIMENTO IA */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <button onClick={() => setCurrentView('risco-sacado')} className="bg-[#121418] border-b-4 border-[#D4A373] p-6 rounded-3xl hover:scale-105 transition-all group">
          <p className="text-[10px] font-black text-white uppercase group-hover:text-[#D4A373] italic">Atendimento</p>
          <p className="text-sm font-black text-[#D4A373] uppercase italic">Risco Sacado</p>
        </button>
        <button onClick={() => setCurrentView('gestao-bancos')} className="bg-[#121418] border-b-4 border-green-500 p-6 rounded-3xl hover:scale-105 transition-all group">
          <p className="text-[10px] font-black text-white uppercase italic">Módulo</p>
          <p className="text-sm font-black text-green-500 uppercase italic">Gestão de Bancos</p>
        </button>
        {/* Protestos e Conciliação: Apenas Conhecimento para IA */}
        <div className="bg-[#121418]/50 border-b-4 border-gray-700 p-6 rounded-3xl opacity-60 cursor-default">
          <p className="text-[9px] font-black text-gray-500 uppercase italic">Base Ativa IA</p>
          <p className="text-sm font-black text-gray-500 uppercase italic">Protestos</p>
        </div>
        <div className="bg-[#121418]/50 border-b-4 border-gray-700 p-6 rounded-3xl opacity-60 cursor-default">
          <p className="text-[9px] font-black text-gray-500 uppercase italic">Base Ativa IA</p>
          <p className="text-sm font-black text-gray-500 uppercase italic">Conciliação</p>
        </div>
      </div>

      {/* CHAT IA CENTRALIZADO */}
      <div className="flex-1 bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-gray-200 min-h-[500px]">
        <div className="p-6 bg-black text-center border-b border-[#D4A373]/30">
           <h2 className="text-white font-black uppercase text-xs tracking-widest italic">Assistente Unificado de Tesouraria</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 italic">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300">
              <p className="font-black text-xs uppercase tracking-widest">Aguardando comando operacional...</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-3xl text-sm ${msg.role === 'model' ? 'bg-white shadow-md border-l-8 border-[#D4A373] text-black' : 'bg-black text-white'}`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {isAiLoading && <div className="text-[9px] font-black text-[#D4A373] animate-pulse uppercase italic">IA Consultando Base DOCX...</div>}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleAskAI} className="p-6 bg-white border-t flex gap-3 italic">
          <input className="flex-1 p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#D4A373] text-black font-bold" placeholder="Pergunte sobre Risco Sacado, Bancos, Protestos ou Conciliação..." value={aiQuery} onChange={e => setAiQuery(e.target.value)} />
          <button type="submit" className="bg-black text-[#D4A373] px-8 rounded-2xl font-black uppercase text-[10px]">Consultar</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0C10] p-4 md:p-8 font-sans">
      {/* CABEÇALHO PERSONALIZADO */}
      <header className="flex flex-col items-center mb-10 italic">
        <h1 onClick={() => setCurrentView('home')} className="text-4xl font-black text-[#D4A373] uppercase tracking-tighter cursor-pointer">FAMILIA DA ALEGRIA</h1>
        <p className="text-xs font-black text-[#22c55e] tracking-[0.4em] uppercase">NATAL <span className="text-gray-400">BRAGANÇA CITY</span></p>
      </header>

      {/* ROTEADOR DE TELAS */}
      {currentView === 'home' && renderHome()}

      {currentView === 'risco-sacado' && (
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 animate-slide-up">
          <div className="flex-1 bg-white rounded-[40px] p-8 shadow-xl italic">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black uppercase italic">Risco Sacado</h2>
              <button onClick={() => setCurrentView('home')} className="text-[10px] font-black uppercase border border-black px-4 py-2 rounded-full hover:bg-black hover:text-[#D4A373] transition-all italic">← Voltar</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 italic">
              <div>
                <h3 className="text-[10px] font-black text-[#D4A373] uppercase mb-4 tracking-widest italic">Perguntas Frequentes</h3>
                <div className="space-y-2 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                   {PERGUNTAS_FREQUENTES.map((f, i) => <ListItem key={i} text={f.p} onClick={() => alert(f.r)} />)}
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-black text-[#D4A373] uppercase mb-4 tracking-widest italic">Comandos Cervello</h3>
                <div className="space-y-2 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                   {COMANDOS_GEMS.map((c, i) => <ListItem key={i} text={c.t} onClick={() => alert(c.c)} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'gestao-bancos' && (
        <div className="max-w-4xl mx-auto bg-white rounded-[40px] p-10 animate-slide-up italic text-center">
          <h2 className="text-3xl font-black uppercase mb-4 italic">Gestão de Bancos</h2>
          <p className="text-gray-500 uppercase font-black text-xs tracking-widest mb-10 italic">Módulo em Desenvolvimento Operacional</p>
          <button onClick={() => setCurrentView('home')} className="bg-black text-[#D4A373] px-10 py-4 rounded-2xl font-black uppercase text-xs italic">Retornar ao HUB</button>
        </div>
      )}
    </div>
  );
};

export default App;
