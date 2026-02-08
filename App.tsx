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
  
  // Chat State
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);

  // Modal States para Comandos Dinâmicos
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

  // Função que detecta se o comando precisa de um pop-up
  const selectItem = (origin: Origin, index: number) => {
    setChatMode(false);
    if (origin === 'faq') {
      const item = PERGUNTAS_FREQUENTES[index];
      setSelected({ title: item.p, body: item.r, origin: 'faq', index });
    } else {
      const item = COMANDOS_GEMS[index];
      
      // Lógica para o comando de Extração por IA
      if (item.t === "Extrair") {
        setIsImageModalOpen(true);
        return;
      }

      // Lógica para o pop-up de "Recuperar Acesso"
      if (item.t === "Recuperar Acesso") {
        setModalTitle("INFORMAÇÕES DO USUÁRIO");
        setModalFields(["Usuário"]);
        setPendingCommand({ index, content: item.c });
        setModalOpen(true);
      } 
      // Lógica para o pop-up de "Alterar Email Cadastrado"
      else if (item.t === "Alterar Email Cadastrado") {
        setModalTitle("DADOS DA ALTERAÇÃO");
        setModalFields(["Email Antigo", "Novo Email", "Usuário"]);
        setPendingCommand({ index, content: item.c });
        setModalOpen(true);
      } 
      // Comandos simples sem pop-up
      else {
        setSelected({ title: item.t, body: item.c, origin: 'command', index });
      }
    }
  };

  // Função que processa os dados do pop-up e gera o texto final
  const handleModalSubmit = (values: Record<string, string>) => {
    if (!pendingCommand) return;
    
    let processedBody = pendingCommand.content;
    const item = COMANDOS_GEMS[pendingCommand.index];

    // Substitui o espaço reservado pelo usuário digitado no pop-up
    if (item.t === "Recuperar Acesso") {
      processedBody = processedBody.replace("XXXXX", values["Usuário"]);
    } else if (item.t === "Alterar Email Cadastrado") {
      processedBody = processedBody
        .replace("[EMAIL_ANTIGO]", values["Email Antigo"])
        .replace("[EMAIL_NOVO]", values["Novo Email"])
        .replace("[USUARIO]", values["Usuário"]);
    }

    setSelected({
      title: item.t,
      body: processedBody,
      origin: 'command',
      index: pendingCommand.index
    });
    setModalOpen(false);
    setPendingCommand(null);
  };

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
      {/* Sidebar Esquerda: FAQ */}
      <aside className="w-[380px] bg-[#1A1A1A] text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-gray-800 bg-black">
          <button onClick={() => {setChatMode(true); setSelected(null);}} className="w-full mb-6 p-3 bg-[#D4A373]/10 border border-[#D4A373]/30 rounded-lg text-[#D4A373] text-xs font-black uppercase tracking-widest hover:bg-[#D4A373]/20 transition-all">
            Novo Chat IA
          </button>
          <div className="text-center">
            <h1 className="text-lg font-black tracking-tighter uppercase italic">Principais <span className="text-[#D4A373]">Duvidas</span></h1>
            <p className="text-[9px] text-gray-500 uppercase mt-1 font-bold">Perguntas Frequentes</p>
          </div>
          <div className="mt-4 w-full relative">
            <input type="text" placeholder="Buscar dúvida..." className="w-full bg-[#262626] border border-gray-700 rounded-lg py-2 px-3 text-xs text-gray-300 outline-none" value={searchFAQ} onChange={(e) => setSearchFAQ(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {PERGUNTAS_FREQUENTES.filter(f => f.p.toLowerCase().includes(searchFAQ.toLowerCase())).map((f, i) => (
            <ListItem key={i} text={f.p} isActive={!chatMode && selected?.title === f.p} onClick={() => selectItem('faq', PERGUNTAS_FREQUENTES.indexOf(f))} showIndex />
          ))}
        </div>
      </aside>

      {/* Main Content: Onde o texto final aparece formatado */}
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
              {isAiLoading && <div className="text-gray-400 animate-pulse">Pensando...</div>}
              <div ref={chatEndRef} />
            </div>
          ) : selected ? (
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-[12px] border-[#D4A373] relative min-h-[550px]">
                <div className="p-10">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <span className="text-[11px] font-black uppercase text-[#D4A373] bg-[#D4A373]/10 px-3 py-1.5 rounded-full">
                        {selected.origin === 'faq' ? 'FAQ - Suporte Fornecedor' : 'Fluxo Interno Cervello'}
                      </span>
                      <h2 className="text-4xl font-black text-gray-900 mt-4 uppercase tracking-tighter leading-none">{selected.title}</h2>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAskAI(null, `Me explique: ${selected.title}`)} className="p-3 bg-amber-50 text-[#D4A373] rounded-xl font-black uppercase text-[10px]">Refinar com IA</button>
                      <button onClick={() => handleCopy()} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-black transition-all">
                        <i className={`fas ${isCopied ? 'fa-check text-green-500' : 'fa-copy'}`}></i>
                      </button>
                    </div>
                  </div>
                  <div className="bg-[#F8F9FA] p-10 rounded-3xl border shadow-inner">
                    {/* Mantendo os parágrafos e variáveis inseridas via pop-up */}
                    <div className="text-gray-800 text-xl leading-relaxed whitespace-pre-wrap">{selected.body}</div>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Dexco Assist Triple View &copy; 2026</p>
                </div>
              </div>
            </div>
          ) : <div className="h-full flex items-center justify-center text-gray-300 font-black uppercase">Selecione uma instrução</div>}
        </div>
        <div className="p-8 bg-white border-t">
          <form onSubmit={(e) => handleAskAI(e)} className="max-w-4xl mx-auto flex gap-4">
            <input className="flex-1 p-5 bg-gray-50 rounded-2xl border outline-none focus:ring-2 focus:ring-[#D4A373]" placeholder="Dúvida rápida? Digite aqui para falar com a IA..." value={aiQuery} onChange={e => setAiQuery(e.target.value)} />
            <button type="submit" className="bg-black text-[#D4A373] px-10 rounded-2xl font-black uppercase text-xs">Enviar</button>
          </form>
        </div>
      </main>

      {/* Sidebar Direita: Comandos Gems */}
      <aside className="w-[380px] bg-[#1A1A1A] text-white flex flex-col shadow-2xl">
        <div className="p-6 bg-black border-b border-gray-800 text-center">
          <h1 className="text-lg font-black uppercase italic">Atendimento <span className="text-[#D4A373]">Cervello</span></h1>
          <p className="text-[9px] text-gray-500 uppercase mt-1 font-bold">Comandos Internos e Templates</p>
          <input className="w-full mt-4 bg-[#262626] border border-gray-700 rounded-lg p-2 text-xs outline-none" placeholder="Buscar comando..." value={searchCommands} onChange={e => setSearchCommands(e.target.value)} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {COMANDOS_GEMS.filter(c => c.t.toLowerCase().includes(searchCommands.toLowerCase())).map((c, i) => (
            <ListItem key={i} text={c.t} isActive={!chatMode && selected?.title === c.t} onClick={() => selectItem('command', COMANDOS_GEMS.indexOf(c))} />
          ))}
        </div>
      </aside>

      {/* O Componente que abre o Pop-up de Usuário */}
      <PromptModal 
        isOpen={modalOpen} 
        onClose={() => {setModalOpen(false); setPendingCommand(null);}} 
        title={modalTitle} 
        fields={modalFields} 
        onSubmit={handleModalSubmit} 
      />
      
      <ImageUploadModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} isLoading={isExtracting} onConfirm={async (b) => { setIsExtracting(true); setSelected({title: "Extração", body: await extractDataFromImage(b), origin: 'ai'}); setIsExtracting(false); setIsImageModalOpen(false); }} />
    </div>
  );
};

export default App;
