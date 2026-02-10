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
  
  // Chat & AI State
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFields, setModalFields] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [pendingCommand, setPendingCommand] = useState<{index: number, content: string, type: string} | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createDexcoChat().then(session => setChatSession(session));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading]);

  const handleCopy = (textToCopy?: string) => {
    const text = textToCopy || selected?.body;
    if (!text) return;
    const performCopy = (txt: string) => {
      const textArea = document.createElement("textarea");
      textArea.value = txt;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) { console.error('Erro ao copiar:', err); }
      document.body.removeChild(textArea);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(() => performCopy(text));
    } else { performCopy(text); }
  };

  const selectItem = (origin: Origin | 'ranking', index: number) => {
    setChatMode(false);
    if (origin === 'faq') {
      const item = PERGUNTAS_FREQUENTES[index];
      setSelected({ title: item.p, body: item.r, origin: 'faq', index });
    } else if (origin === 'ranking') {
      // Lógica para o novo menu Ranking Bancos
      setModalTitle("DADOS DO RANKING");
      setModalFields(["Periodo", "Banco", "Posição", "Volume"]);
      setPendingCommand({ index: -1, content: '', type: 'ranking' });
      setModalOpen(true);
    } else {
      const item = COMANDOS_GEMS[index];
      if (item.t === "Extrair") { setIsImageModalOpen(true); return; }
      if (item.t === "Recuperar Acesso") {
        setModalTitle("INFORMAÇÕES DO USUÁRIO"); setModalFields(["Usuário"]);
        setPendingCommand({ index, content: item.c, type: 'command' }); setModalOpen(true);
      } else if (item.t === "Alterar Email Cadastrado") {
        setModalTitle("DADOS DA ALTERAÇÃO"); setModalFields(["Email Antigo", "Novo Email", "Usuário"]);
        setPendingCommand({ index, content: item.c, type: 'command' }); setModalOpen(true);
      } else {
        setSelected({ title: item.t, body: item.c, origin: 'command', index });
      }
    }
  };

  const handleModalSubmit = (values: Record<string, string>) => {
    if (!pendingCommand) return;
    
    let processedBody = '';
    let processedTitle = '';

    // Lógica de saudação baseada no horário atual
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'bom dia' : 'boa tarde';

    if (pendingCommand.type === 'ranking') {
      processedTitle = "E-mail Bancos";
      processedBody = `Prezados, ${greeting}\n\nSegue sua posição no Ranking semanal do período de ${values["Periodo"]} do Portal de Fornecedores Dexco.\n\nDas 6 posições do ranking, a sua instituição ocupa:\n\nBanco: ${values["Banco"]}\nPosição Semanal: ${values["Posição"]} lugar\n\nSe sua posição fosse a 1ª você teria processado ${values["Volume"]} mais volume financeiro.\n\n(O ranking considera indicadores internos de competitividade e performance no portal. As métricas detalhadas não são divulgadas individualmente.)\n\nAtenciosamente,\nEquipe de Tesouraria – Dexco`;
    } else {
      const item = COMANDOS_GEMS[pendingCommand.index];
      processedTitle = item.t;
      processedBody = pendingCommand.content;
      if (item.t === "Recuperar Acesso") {
        processedBody = processedBody.replace(/usuário informado XXXXX/g, `usuário ${values["Usuário"]}`).replace(/usuário informado 123/g, `usuário ${values["Usuário"]}`).replace(/usuário informado/g, `usuário ${values["Usuário"]}`);
      } else if (item.t === "Alterar Email Cadastrado") {
        processedBody = processedBody.replace("[EMAIL_ANTIGO]", values["Email Antigo"]).replace("[EMAIL_NOVO]", values["Novo Email"]).replace("[USUARIO]", values["Usuário"]);
      }
    }

    setSelected({ title: processedTitle, body: processedBody, origin: 'command', index: pendingCommand.index });
    setModalOpen(false); setPendingCommand(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      {/* Sidebar Esquerda */}
      <aside className="w-[380px] bg-[#1A1A1A] text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-gray-800 bg-black text-center">
          <button onClick={() => {setChatMode(true); setSelected(null);}} className="w-full mb-6 p-3 bg-[#D4A373]/10 border border-[#D4A373]/30 rounded-lg text-[#D4A373] text-xs font-black uppercase tracking-widest hover:bg-[#D4A373]/20 transition-all">Novo Chat IA</button>
          <h1 className="text-lg font-black uppercase italic">Principais <span className="text-[#D4A373]">Duvidas</span></h1>
          <p className="text-[9px] text-gray-500 uppercase mt-1 font-bold">Perguntas Frequentes</p>
          <input type="text" placeholder="Buscar dúvida..." className="w-full mt-4 bg-[#262626] border border-gray-700 rounded-lg p-2 text-xs outline-none" value={searchFAQ} onChange={(e) => setSearchFAQ(e.target.value)} />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {PERGUNTAS_FREQUENTES.filter(f => f.p.toLowerCase().includes(searchFAQ.toLowerCase())).map((f, i) => (
            <ListItem key={i} text={f.p} isActive={!chatMode && selected?.title === f.p} onClick={() => selectItem('faq', PERGUNTAS_FREQUENTES.indexOf(f))} showIndex />
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
          {chatMode ? (
            <div className="max-w-4xl mx-auto space-y-6 pb-12">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-6 rounded-2xl bg-white border shadow-sm ${msg.role === 'model' ? 'border-l-8 border-[#D4A373]' : ''}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isAiLoading && <div className="text-gray-400 animate-pulse text-xs font-bold uppercase tracking-widest mt-4">IA pensando...</div>}
              <div ref={chatEndRef} />
            </div>
          ) : selected ? (
            <div className="animate-fade-in max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-[12px] border-[#D4A373] relative min-h-[550px]">
                <div className="p-10">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <span className="text-[11px] font-black uppercase text-[#D4A373] bg-[#D4A373]/10 px-3 py-1.5 rounded-full tracking-tighter">Fluxo Interno Cervello</span>
                      <h2 className="text-4xl font-black text-gray-900 mt-4 uppercase tracking-tighter leading-none">{selected.title}</h2>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAskAI(null, `Me explique: ${selected.title}`)} className="px-4 py-2 bg-amber-50 text-[#D4A373] rounded-xl font-black uppercase text-[10px] flex items-center gap-2 hover:bg-[#D4A373] hover:text-white transition-all shadow-sm"><i className="fas fa-magic"></i> Refinar com IA</button>
                      <button onClick={() => handleCopy()} className={`min-w-[40px] h-10 px-3 bg-white border rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm ${isCopied ? 'border-green-500 text-green-600 bg-green-50' : 'border-gray-200 text-gray-400 hover:text-black'}`}><i className={`fas ${isCopied ? 'fa-check' : 'fa-copy'} text-lg`}></i><span className="text-[10px] font-bold uppercase">{isCopied ? 'OK' : 'Copiar'}</span></button>
                    </div>
                  </div>
                  <div className="bg-[#F8F9FA] p-10 rounded-3xl border border-gray-100 shadow-inner text-gray-800 text-xl leading-relaxed whitespace-pre-wrap">{selected.body}</div>
                </div>
              </div>
            </div>
          ) : <div className="h-full flex items-center justify-center text-gray-300 font-black uppercase tracking-widest">Selecione uma instrução</div>}
        </div>
        <div className="p-8 bg-white border-t">
          <form onSubmit={(e) => handleAskAI(e)} className="max-w-4xl mx-auto flex gap-4">
            <input className="flex-1 p-5 bg-gray-50 rounded-2xl border outline-none focus:ring-2 focus:ring-[#D4A373]" placeholder="Dúvida rápida? Digite aqui para falar com a IA..." value={aiQuery} onChange={e => setAiQuery(e.target.value)} />
            <button type="submit" className="bg-black text-[#D4A373] px-10 rounded-2xl font-black uppercase text-xs">Enviar</button>
          </form>
        </div>
      </main>

      {/* Sidebar Direita: Comandos e Ranking */}
      <aside className="w-[380px] bg-[#1A1A1A] text-white flex flex-col shadow-2xl">
        <div className="p-6 bg-black border-b border-gray-800 text-center">
          <h1 className="text-lg font-black uppercase italic">Atendimento <span className="text-[#D4A373]">Cervello</span></h1>
          <p className="text-[9px] text-gray-500 uppercase mt-1 font-bold">Comandos Internos e Templates</p>
          <input type="text" placeholder="Buscar comando..." className="w-full mt-4 bg-[#262626] border border-gray-700 rounded-lg p-2 text-xs outline-none" value={searchCommands} onChange={(e) => setSearchCommands(e.target.value)} />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {COMANDOS_GEMS.filter(c => c.t.toLowerCase().includes(searchCommands.toLowerCase())).map((c, i) => (
            <ListItem key={i} text={c.t} isActive={!chatMode && selected?.title === c.t} onClick={() => selectItem('command', COMANDOS_GEMS.indexOf(c))} />
          ))}
          
          {/* Nova Seção: Ranking Bancos */}
          <div className="mt-8 px-6 py-4 bg-black/50 border-y border-gray-800">
            <h2 className="text-[11px] font-black uppercase text-[#D4A373] tracking-widest">Ranking Bancos</h2>
          </div>
          <ListItem text="E-mail Bancos" isActive={!chatMode && selected?.title === "E-mail Bancos"} onClick={() => selectItem('ranking', 0)} />
        </div>
      </aside>

      <PromptModal isOpen={modalOpen} onClose={() => {setModalOpen(false); setPendingCommand(null);}} title={modalTitle} fields={modalFields} onSubmit={handleModalSubmit} />
      <ImageUploadModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} isLoading={isExtracting} onConfirm={async (b) => { setIsExtracting(true); setSelected({title: "Extração", body: await extractDataFromImage(b), origin: 'ai', index: 0}); setIsExtracting(false); setIsImageModalOpen(false); }} />
    </div>
  );
};
export default App;
