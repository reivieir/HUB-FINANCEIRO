import React, { useState, useEffect, useRef } from 'react';
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from './constants';
import { SelectedContent, Origin } from './types';
import ListItem from './components/ListItem';
import PromptModal from './components/PromptModal';
import { createDexcoChat } from './services/geminiService';

const App: React.FC = () => {
  // --- 1. ESTADOS DE ACESSO E NAVEGAÇÃO ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'risco-sacado' | 'gestao-bancos'>('home');
  const SENHA_ACESSO = "Dexco2026";

  // --- 2. ESTADOS DE INTERFACE E CÓPIA ---
  const [selected, setSelected] = useState<SelectedContent | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFields, setModalFields] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [pendingCommand, setPendingCommand] = useState<{index: number, content: string, type: string} | null>(null);

  // --- 3. ESTADOS DE CHAT IA ---
  const [messages, setMessages] = useState<any[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated && !chatSession) {
      createDexcoChat().then(session => setChatSession(session));
    }
  }, [isAuthenticated, chatSession]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading]);

  // --- 4. LÓGICA DE COMANDOS E FORMULÁRIOS (RESTAURADA) ---
  const selectItem = (origin: Origin | 'ranking', index: number) => {
    if (origin === 'faq') {
      const item = PERGUNTAS_FREQUENTES[index];
      setSelected({ title: item.p, body: item.r, origin: 'faq', index });
    } else if (origin === 'ranking') {
      setModalTitle("DADOS DO RANKING");
      setModalFields(["Periodo", "Banco", "Posição", "Volume"]);
      setPendingCommand({ index: -1, content: '', type: 'ranking' });
      setModalOpen(true);
    } else {
      const item = COMANDOS_GEMS[index];
      if (item.t === "Recuperar Acesso" || item.t === "Alterar Email Cadastrado") {
        setModalTitle(item.t === "Recuperar Acesso" ? "INFORMAÇÕES DO USUÁRIO" : "DADOS DA ALTERAÇÃO");
        setModalFields(item.t === "Recuperar Acesso" ? ["Usuário"] : ["Email Antigo", "Novo Email", "Usuário"]);
        setPendingCommand({ index, content: item.c, type: 'command' }); 
        setModalOpen(true);
      } else {
        setSelected({ title: item.t, body: item.c, origin: 'command', index });
      }
    }
  };

  const handleModalSubmit = (values: Record<string, string>) => {
    if (!pendingCommand) return;
    let processedBody = '';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'bom dia' : 'boa tarde';

    if (pendingCommand.type === 'ranking') {
      processedBody = `Prezados, ${greeting}\n\nSegue sua posição no Ranking semanal do período de ${values["Periodo"]}...\n\nBanco: ${values["Banco"]}\nPosição: ${values["Posição"]} lugar...`;
    } else {
      const item = COMANDOS_GEMS[pendingCommand.index];
      processedBody = pendingCommand.content;
      if (item.t === "Recuperar Acesso") {
        processedBody = processedBody.replace(/usuário informado/g, `usuário ${values["Usuário"]}`);
      } else if (item.t === "Alterar Email Cadastrado") {
        processedBody = processedBody.replace("[EMAIL_ANTIGO]", values["Email Antigo"]).replace("[EMAIL_NOVO]", values["Novo Email"]).replace("[USUARIO]", values["Usuário"]);
      }
    }
    setSelected({ title: pendingCommand.type === 'ranking' ? "E-mail Bancos" : COMANDOS_GEMS[pendingCommand.index].t, body: processedBody, origin: 'command', index: pendingCommand.index });
    setModalOpen(false); setPendingCommand(null);
  };

  const handleCopy = () => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.body).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim() || isAiLoading || !chatSession) return;
    const query = aiQuery;
    setAiQuery('');
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setIsAiLoading(true);
    try {
      const result = await chatSession.sendMessage(query);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'model', text: response.text() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Erro na conexão com a base de dados DOCX." }]);
    } finally { setIsAiLoading(false); }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0B0C10]">
        <form onSubmit={(e) => { e.preventDefault(); if(passwordInput === SENHA_ACESSO) setIsAuthenticated(true); else alert("Senha Incorreta"); }} className="bg-white p-10 rounded-[32px] shadow-2xl border-t-[10px] border-[#D4A373] w-[400px] text-center italic">
          <h1 className="text-3xl font-black uppercase text-black mb-1">Dexco <span className="text-[#D4A373]">Assist</span></h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">HUB FINANCEIRO</p>
          <input type="password" placeholder="SENHA" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl mb-4 outline-none text-center font-bold" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
          <button type="submit" className="w-full bg-black text-[#D4A373] py-4 rounded-2xl font-black uppercase text-xs">Entrar no Sistema</button>
        </form>
      </div>
    );
  }

  // --- 5. COMPONENTES DE VISÃO ---

  const renderHome = () => (
    <div className="max-w-5xl mx-auto h-full flex flex-col animate-fade-in">
      {/* GRID DE MÓDULOS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button onClick={() => setCurrentView('risco-sacado')} className="bg-[#121418] border-b-4 border-[#D4A373] p-6 rounded-3xl hover:scale-105 transition-all group italic">
          <p className="text-[10px] font-black text-white uppercase opacity-50 group-hover:opacity-100 italic">Central de Atendimento</p>
          <p className="text-sm font-black text-[#D4A373] uppercase italic">Risco Sacado</p>
        </button>
        <button onClick={() => setCurrentView('gestao-bancos')} className="bg-[#121418] border-b-4 border-green-500 p-6 rounded-3xl hover:scale-105 transition-all group italic">
          <p className="text-[10px] font-black text-white uppercase opacity-50 italic">Módulo Gestão</p>
          <p className="text-sm font-black text-green-500 uppercase italic">Acessos Bancários</p>
        </button>
        <div className="bg-[#121418]/50 border-b-4 border-red-900/30 p-6 rounded-3xl opacity-50 cursor-default italic">
          <p className="text-[9px] font-black text-gray-500 uppercase italic">Base IA Ativa</p>
          <p className="text-sm font-black text-gray-700 uppercase italic">Protestos</p>
        </div>
        <div className="bg-[#121418]/50 border-b-4 border-purple-900/30 p-6 rounded-3xl opacity-50 cursor-default italic">
          <p className="text-[9px] font-black text-gray-500 uppercase italic">Base IA Ativa</p>
          <p className="text-sm font-black text-gray-700 uppercase italic">Conciliação</p>
        </div>
      </div>

      {/* CHAT IA CENTRAL (Conectado via DOCX) */}
      <div className="flex-1 bg-[#121418] rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-gray-800 min-h-[450px]">
        <div className="p-4 bg-black text-center border-b border-[#D4A373]/20 italic">
           <h2 className="text-[#D4A373] font-black uppercase text-[10px] tracking-[0.3em] italic">Assistente Gemini 3 Flash</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#0B0C10] italic">
          {messages.length === 0 && <p className="text-center text-gray-600 font-bold uppercase text-[10px] mt-20 italic">HUB pronto para consulta. Digite sobre Sacado, Bancos ou Protestos...</p>}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-3xl text-sm italic ${msg.role === 'model' ? 'bg-[#1A1D23] text-gray-200 border-l-4 border-[#D4A373]' : 'bg-[#D4A373] text-black font-bold'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isAiLoading && <div className="text-[9px] font-black text-[#D4A373] animate-pulse uppercase italic">Processando base Dexco DOCX...</div>}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleAskAI} className="p-6 bg-black border-t border-gray-800 flex gap-3 italic">
          <input className="flex-1 p-4 bg-[#1A1D23] border border-gray-800 rounded-2xl outline-none focus:border-[#D4A373] text-white font-bold" placeholder="Digite sua dúvida ou comando..." value={aiQuery} onChange={e => setAiQuery(e.target.value)} />
          <button type="submit" className="bg-[#D4A373] text-black px-8 rounded-2xl font-black uppercase text-xs">Enviar</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0C10] p-4 md:p-8 font-sans">
      {/* TÍTULO CORPORATIVO */}
      <header className="flex flex-col items-center mb-10 italic">
        <h1 onClick={() => setCurrentView('home')} className="text-3xl font-black text-[#D4A373] uppercase tracking-tighter cursor-pointer italic">DEXCO ASSIST</h1>
        <p className="text-[10px] font-black text-gray-500 tracking-[0.5em] uppercase italic">HUB DE INTELIGÊNCIA FINANCEIRA</p>
      </header>

      {currentView === 'home' && renderHome()}

      {/* RISCO SACADO (FAQ + COMANDOS) */}
      {currentView === 'risco-sacado' && (
        <div className="max-w-6xl mx-auto animate-slide-up">
          <div className="bg-[#121418] rounded-[40px] p-8 border border-gray-800 shadow-2xl italic">
            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
               <h2 className="text-2xl font-black text-white uppercase italic">Central Risco Sacado</h2>
               <button onClick={() => setCurrentView('home')} className="text-[#D4A373] font-black uppercase text-[10px] border border-[#D4A373] px-6 py-2 rounded-full italic">← HUB</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 italic">
               <div>
                  <h3 className="text-[11px] font-black text-[#D4A373] uppercase mb-4 tracking-widest italic">Perguntas Frequentes (FAQ)</h3>
                  <div className="space-y-1 h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                     {PERGUNTAS_FREQUENTES.map((f, i) => <ListItem key={i} text={f.p} onClick={() => selectItem('faq', PERGUNTAS_FREQUENTES.indexOf(f))} />)}
                  </div>
               </div>
               <div>
                  <h3 className="text-[11px] font-black text-green-500 uppercase mb-4 tracking-widest italic">Comandos Cervello & E-mails</h3>
                  <div className="space-y-1 h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                     {COMANDOS_GEMS.map((c, i) => <ListItem key={i} text={c.t} onClick={() => selectItem('command', COMANDOS_GEMS.indexOf(c))} />)}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'gestao-bancos' && (
        <div className="max-w-4xl mx-auto bg-[#121418] rounded-[40px] p-12 border border-gray-800 text-center italic">
           <h2 className="text-3xl font-black text-white uppercase mb-4 italic">Acessos Bancários</h2>
           <p className="text-gray-500 font-bold uppercase text-xs mb-10 italic">Interface em fase de integração de usuários</p>
           <button onClick={() => setCurrentView('home')} className="bg-[#22c55e] text-black px-12 py-4 rounded-2xl font-black uppercase text-xs italic">Voltar ao HUB</button>
        </div>
      )}

      {/* POP-UP DE RESPOSTA E CÓPIA (O SEU PEDIDO) */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 italic">
           <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-scale-in">
              <div className="p-6 bg-black flex justify-between items-center">
                 <h2 className="text-[#D4A373] font-black uppercase text-xs italic tracking-widest">{selected.title}</h2>
                 <button onClick={() => setSelected(null)} className="text-white hover:text-red-500 transition-all font-black">FECHAR</button>
              </div>
              <div className="p-8">
                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-gray-800 text-lg leading-relaxed whitespace-pre-wrap font-medium shadow-inner mb-6">
                    {selected.body}
                 </div>
                 <div className="flex gap-3">
                    <button onClick={handleCopy} className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs transition-all ${isCopied ? 'bg-green-500 text-white' : 'bg-black text-[#D4A373]'}`}>
                       {isCopied ? 'Copiado com Sucesso!' : 'Copiar Texto para Área de Transferência'}
                    </button>
                    <button onClick={() => setSelected(null)} className="px-8 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase text-[10px]">Sair</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL DE INPUTS (RESTAURADO) */}
      <PromptModal isOpen={modalOpen} onClose={() => {setModalOpen(false); setPendingCommand(null);}} title={modalTitle} fields={modalFields} onSubmit={handleModalSubmit} />
    </div>
  );
};

export default App;
