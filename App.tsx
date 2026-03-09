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
  const [currentView, setCurrentView] = useState<'home' | 'bancos'>('home');
  const SENHA_ACESSO = "Dexco2026";

  // --- 2. ESTADOS DE INTERFACE E POP-UP ---
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

  // Inicialização estável da IA conforme seu código original
  useEffect(() => {
    if (isAuthenticated && !chatSession) {
      createDexcoChat().then(session => setChatSession(session)).catch(err => console.error("Erro IA:", err));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading]);

  // --- 4. FUNÇÕES DE SUPORTE ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === SENHA_ACESSO) setIsAuthenticated(true);
    else alert("Senha incorreta!");
  };

  const selectItem = (origin: Origin | 'ranking' | 'ppt', index: number) => {
    if (origin === 'faq') {
      const item = PERGUNTAS_FREQUENTES[index];
      setSelected({ title: item.p, body: item.r, origin: 'faq', index });
    } else if (origin === 'ppt') {
      setSelected({ title: "Painel Desempenho", body: "VIEW_PPT_FRAME", origin: 'command', index: 999 });
    } else if (origin === 'ranking') {
      setModalTitle("DADOS DO RANKING");
      setModalFields(["Periodo", "Banco", "Posição", "Volume"]);
      setPendingCommand({ index: -1, content: '', type: 'ranking' });
      setModalOpen(true);
    } else {
      const item = COMANDOS_GEMS[index];
      if (item.t === "Recuperar Acesso" || item.t === "Alterar Email Cadastrado") {
        setModalTitle(item.t === "Recuperar Acesso" ? "INFORMAÇÕES" : "DADOS ALTERAÇÃO");
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
    let pBody = '';
    let pTitle = '';
    const greeting = new Date().getHours() < 12 ? 'bom dia' : 'boa tarde';

    if (pendingCommand.type === 'ranking') {
      pTitle = "E-mail Bancos";
      pBody = `Prezados, ${greeting}\n\nSegue sua posição no Ranking semanal do período de ${values["Periodo"]}...\n\nBanco: ${values["Banco"]}\nPosição: ${values["Posição"]} lugar...\n\nSe fosse a 1ª você teria processado ${values["Volume"]} mais volume financeiro.\n\nAtenciosamente,\nTesouraria Dexco`;
    } else {
      const item = COMANDOS_GEMS[pendingCommand.index];
      pTitle = item.t;
      pBody = pendingCommand.content.replace(/usuário informado XXXXX/g, `usuário ${values["Usuário"]}`).replace(/usuário informado/g, `usuário ${values["Usuário"]}`).replace("[EMAIL_ANTIGO]", values["Email Antigo"]).replace("[EMAIL_NOVO]", values["Novo Email"]).replace("[USUARIO]", values["Usuário"]);
    }
    setSelected({ title: pTitle, body: pBody, origin: 'command', index: pendingCommand.index });
    setModalOpen(false); setPendingCommand(null);
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim() || isAiLoading || !chatSession) return;
    const query = aiQuery; setAiQuery('');
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setIsAiLoading(true);
    try {
      const result = await chatSession.sendMessage(query);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'model', text: response.text() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "A IA está processando muitas informações. Tente novamente." }]);
    } finally { setIsAiLoading(false); }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0B0C10]">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[32px] shadow-2xl border-t-[10px] border-[#D4A373] w-[380px] text-center italic">
          <h1 className="text-3xl font-black uppercase text-black mb-1">DEXCO <span className="text-[#D4A373]">ASSIST</span></h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">HUB FINANCEIRO</p>
          <input type="password" placeholder="SENHA" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl mb-4 outline-none text-center font-bold" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
          <button type="submit" className="w-full bg-black text-[#D4A373] py-4 rounded-2xl font-black uppercase text-xs">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] p-4 md:p-8 font-sans">
      {/* TÍTULO HUB FINANCEIRO */}
      <header className="flex flex-col items-center mb-8 italic">
        <h1 onClick={() => {setCurrentView('home'); setSelected(null);}} className="text-3xl font-black text-[#D4A373] uppercase tracking-tighter cursor-pointer">DEXCO ASSIST | HUB FINANCEIRO</h1>
        <p className="text-[10px] font-black text-gray-500 tracking-[0.5em] uppercase">INTELIGÊNCIA EM TESOURARIA</p>
      </header>

      {/* TILE NAVIGATION */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 italic">
        <button onClick={() => setCurrentView('home')} className={`p-6 rounded-3xl border-b-4 transition-all hover:scale-105 ${currentView === 'home' ? 'bg-[#D4A373] text-black border-white' : 'bg-[#121418] border-[#D4A373] text-white shadow-xl'}`}>
           <p className="text-sm font-black uppercase">Risco Sacado</p>
        </button>
        <button onClick={() => setCurrentView('bancos')} className={`p-6 rounded-3xl border-b-4 transition-all hover:scale-105 ${currentView === 'bancos' ? 'bg-green-600 text-black border-white' : 'bg-[#121418] border-green-600 text-white shadow-xl'}`}>
           <p className="text-sm font-black uppercase">Gestão Bancos</p>
        </button>
        <div className="bg-[#121418]/40 p-6 rounded-3xl border-b-4 border-gray-800 opacity-30 cursor-default">
           <p className="text-sm font-black text-gray-600 uppercase">Protestos (IA)</p>
        </div>
        <div className="bg-[#121418]/40 p-6 rounded-3xl border-b-4 border-gray-800 opacity-30 cursor-default">
           <p className="text-sm font-black text-gray-600 uppercase">Conciliação (IA)</p>
        </div>
      </div>

      {currentView === 'home' ? (
        <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-fade-in italic">
          {/* CHAT IA CENTRALIZADO */}
          <div className="bg-[#121418] rounded-[40px] shadow-2xl border border-gray-800 flex flex-col min-h-[420px] overflow-hidden">
            <div className="p-4 bg-black text-center border-b border-[#D4A373]/20">
               <h2 className="text-[#D4A373] font-black uppercase text-[10px] tracking-[0.3em]">IA Financeira Ativa</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0B0C10] custom-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                  <p className="font-black text-[9px] uppercase tracking-widest text-gray-500">Aguardando consulta técnica via DOCX...</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl text-sm ${msg.role === 'model' ? 'bg-[#1A1D23] text-gray-200 border-l-4 border-[#D4A373]' : 'bg-[#D4A373] text-black font-bold shadow-lg'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiLoading && <div className="text-[9px] font-black text-[#D4A373] animate-pulse uppercase">Processando base Dexco...</div>}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleAskAI} className="p-6 bg-black border-t border-gray-800 flex gap-3">
              <input className="flex-1 p-4 bg-[#1A1D23] border border-gray-800 rounded-2xl outline-none focus:border-[#D4A373] text-white font-bold" placeholder="Digite sua dúvida sobre Tesouraria..." value={aiQuery} onChange={e => setAiQuery(e.target.value)} />
              <button type="submit" className="bg-[#D4A373] text-black px-10 rounded-2xl font-black uppercase text-xs">Consultar</button>
            </form>
          </div>

          {/* LISTAS OPERACIONAIS RESTAURADAS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 italic">
            <div className="bg-[#121418] rounded-[40px] p-8 border border-gray-800 shadow-xl">
               <h3 className="text-[11px] font-black text-[#D4A373] uppercase mb-6 tracking-widest border-b border-gray-800 pb-2">FAQ Risco Sacado</h3>
               <div className="space-y-1 h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {PERGUNTAS_FREQUENTES.map((f, i) => <ListItem key={i} text={f.p} onClick={() => selectItem('faq', PERGUNTAS_FREQUENTES.indexOf(f))} />)}
               </div>
            </div>
            <div className="bg-[#121418] rounded-[40px] p-8 border border-gray-800 shadow-xl">
               <h3 className="text-[11px] font-black text-green-500 uppercase mb-4 tracking-widest border-b border-gray-800 pb-2">Comandos Cervello & Report</h3>
               <div className="space-y-1 h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {COMANDOS_GEMS.map((c, i) => <ListItem key={i} text={c.t} onClick={() => selectItem('command', COMANDOS_GEMS.indexOf(c))} />)}
                  <div className="mt-4 pt-4 border-t border-gray-800 space-y-1">
                     <ListItem text="Report Semanal Dexco" onClick={() => selectItem('ppt', 0)} />
                     <ListItem text="E-mail Ranking Bancos" onClick={() => selectItem('ranking', 0)} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      ) : (
        /* GESTÃO DE BANCOS */
        <div className="max-w-4xl mx-auto bg-[#121418] rounded-[40px] p-16 border border-gray-800 text-center animate-slide-up italic">
           <h2 className="text-3xl font-black text-white uppercase mb-4">Gestão de Bancos</h2>
           <p className="text-gray-600 font-bold uppercase text-xs mb-12 tracking-widest">Interface em integração...</p>
           <button onClick={() => setCurrentView('home')} className="bg-[#D4A373] text-black px-12 py-4 rounded-2xl font-black uppercase text-xs">Retornar ao Hub</button>
        </div>
      )}

      {/* POP-UP DE CÓPIA (COM SUPORTE A PDF) */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 italic">
           <div className="bg-white w-full max-w-3xl rounded-[32px] overflow-hidden shadow-2xl animate-scale-in">
              <div className="p-6 bg-black flex justify-between items-center">
                 <h2 className="text-[#D4A373] font-black uppercase text-[10px] tracking-widest">{selected.title}</h2>
                 <button onClick={() => setSelected(null)} className="text-white hover:text-red-500 font-black">X</button>
              </div>
              <div className="p-8">
                 {selected.body === "VIEW_PPT_FRAME" ? (
                   <iframe src="/apresentacao_semanal.pdf" className="w-full h-[500px] rounded-2xl border-2 border-gray-100 mb-6" title="PDF Report" />
                 ) : (
                   <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-gray-800 text-lg leading-relaxed whitespace-pre-wrap font-medium shadow-inner mb-8">
                      {selected.body}
                   </div>
                 )}
                 <div className="flex flex-col gap-3">
                    {selected.body !== "VIEW_PPT_FRAME" && (
                      <button onClick={() => { navigator.clipboard.writeText(selected.body); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }} className={`w-full py-5 rounded-2xl font-black uppercase text-sm transition-all ${isCopied ? 'bg-green-600 text-white' : 'bg-black text-[#D4A373]'}`}>
                         {isCopied ? 'TEXTO COPIADO COM SUCESSO!' : 'COPIAR PARA O CERVELLO / E-MAIL'}
                      </button>
                    )}
                    <button onClick={() => setSelected(null)} className="w-full py-3 text-gray-400 font-black uppercase text-[10px]">FECHAR JANELA</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <PromptModal isOpen={modalOpen} onClose={() => {setModalOpen(false); setPendingCommand(null);}} title={modalTitle} fields={modalFields} onSubmit={handleModalSubmit} />
    </div>
  );
};

const container = document.getElementById('root');
if (container) { createRoot(container).render(<App />); }
export default App;
