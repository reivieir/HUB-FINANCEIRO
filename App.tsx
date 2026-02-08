import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from './constants';
import { SelectedContent, Origin } from './types';
import ListItem from './components/ListItem';
import PromptModal from './components/PromptModal';
import ImageUploadModal from './components/ImageUploadModal';
import { createDexcoChat, extractDataFromImage } from './services/geminiService';

// Ajustado para a biblioteca correta que configuramos no package.json
interface Message {
  role: 'user' | 'model';
  text: string;
}

const App: React.FC = () => {
  const [selected, setSelected] = useState<SelectedContent | null>(null);
  const [searchFAQ, setSearchFAQ] = useState('');
  const [searchCommands, setSearchCommands] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  // Chat State
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFields, setModalFields] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [pendingCommand, setPendingCommand] = useState<{index: number, content: string} | null>(null);
  
  // Image Extraction State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Inicializa a sessão de chat
  useEffect(() => {
    const initChat = async () => {
      const session = await createDexcoChat();
      setChatSession(session);
    };
    initChat();
  }, []);

  // Auto-scroll chat
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
    setMessages([{ role: 'model', text: "Olá! Como posso te ajudar com as dúvidas da Dexco hoje?" }]);
    setChatMode(true);
    setSelected(null);
  };

  const refineWithAI = () => {
    if (!selected) return;
    const prompt = `Pode me explicar melhor ou me dar mais detalhes sobre: "${selected.title}"?`;
    handleAskAI(null, prompt);
  };

  const selectItem = (origin: Origin, index: number) => {
    setChatMode(false);
    if (origin === 'faq') {<br>      const item = PERGUNTAS_FREQUENTES[index];<br>      setSelected({<br>        title: item.p,<br>        body: item.r,<br>        origin: 'faq',<br>        index<br>      });<br>    } else {<br>      const item = COMANDOS_GEMS[index];<br>      <br>      if (item.t === "Extrair") {<br>        setIsImageModalOpen(true);<br>        return;<br>      }<br><br>      if (item.t === "Recuperar Acesso") {<br>        setModalTitle("Informações do Usuário");<br>        setModalFields(["Usuário"]);<br>        setPendingCommand({ index, content: item.c });<br>        setModalOpen(true);<br>      } else if (item.t === "Alterar Email Cadastrado") {<br>        setModalTitle("Dados da Alteração");<br>        setModalFields(["Email Antigo", "Novo Email", "Usuário"]);<br>        setPendingCommand({ index, content: item.c });<br>        setModalOpen(true);<br>      } else {<br>        setSelected({<br>          title: item.t,<br>          body: item.c,<br>          origin: 'command',<br>          index<br>        });<br>      }<br>    }
  };

  const handleImageConfirm = async (base64: string) => {
    setIsExtracting(true);
    try {
      const result = await extractDataFromImage(base64);
      setSelected({
        title: "Dados Extraídos da Imagem",
        body: result,
        origin: 'ai'
      });
      setIsImageModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao processar imagem.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleModalSubmit = (values: Record<string, string>) => {
    if (!pendingCommand) return;
    
    let processedBody = pendingCommand.content;
    const item = COMANDOS_GEMS[pendingCommand.index];

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
    setPendingCommand(null);
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
      // AJUSTE CRUCIAL: Passando apenas a string para evitar erro "t is not iterable"
      const result = await chatSession.sendMessage(query);
      const response = await result.response;
      const modelText = response.text() || "Não consegui processar sua dúvida.";
      
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Erro na conexão. Verifique sua chave API no Vercel." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      
      {/* Sidebar Left: FAQ */}
      <aside className="w-[380px] bg-[#1A1A1A] text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-gray-800 bg-black">
          <button 
            onClick={startNewChat}
            className="w-full mb-6 p-3 bg-[#D4A373]/10 border border-[#D4A373]/30 rounded-lg text-[#D4A373] text-xs font-black uppercase tracking-widest hover:bg-[#D4A373]/20 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus"></i> Novo Chat IA
          </button>
          <div className="text-center">
            <h1 className="text-lg font-black tracking-tighter uppercase italic">
              Principais <span className="text-[#D4A373]">Duvidas</span>
            </h1>
            <p className="text-[9px] text-gray-500 uppercase mt-1 font-bold">Perguntas Frequentes</p>
          </div>
          <div className="mt-4 w-full relative">
            <input 
              type="text" 
              placeholder="Buscar dúvida..."
              className="w-full bg-[#262626] border border-gray-700 rounded-lg py-2 px-3 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#D4A373]"
              value={searchFAQ}
              onChange={(e) => setSearchFAQ(e.target.value)}
            />
            <i className="fas fa-search absolute right-3 top-2.5 text-gray-600 text-xs"></i>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredFAQ.map((item, idx) => {
            const originalIndex = PERGUNTAS_FREQUENTES.findIndex(f => f.p === item.p);
            return (
              <ListItem 
                key={idx}
                index={originalIndex}
                text={item.p}
                isActive={!chatMode && selected?.origin === 'faq' && selected?.index === originalIndex}
                onClick={() => selectItem('faq', originalIndex)}
                showIndex
              />
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
          {chatMode ? (
            <div className="max-w-4xl mx-auto space-y-6 pb-12">
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h2 className="text-xl font-black uppercase text-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#D4A373] rounded-full flex items-center justify-center text-black shadow-lg">
                    <i className="fas fa-robot"></i>
                  </div>
                  Dexco Assist
                </h2>
                <button 
                  onClick={() => setChatMode(false)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase text-gray-500 hover:text-[#D4A373] transition-all shadow-sm"
                >
                  <i className="fas fa-times mr-2"></i> Fechar Chat
                </button>
              </div>

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-[85%] p-6 rounded-2xl shadow-md border ${
                    msg.role === 'user' 
                      ? 'bg-white border-gray-200 text-gray-800 rounded-tr-none' 
                      : 'bg-white border-l-8 border-[#D4A373] border-gray-200 text-gray-800 rounded-tl-none'
                  }`}>
                    <div className="text-[10px] font-black uppercase mb-3 tracking-widest opacity-40 flex items-center gap-2">
                      {msg.role === 'user' ? <><i className="fas fa-user"></i> Você</> : <><i className="fas fa-robot"></i> Assistente Dexco</>}
                    </div>
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap text-[15px] leading-relaxed font-medium">
                      {msg.text}
                    </div>
                    {msg.role === 'model' && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4">
                        <button 
                          onClick={() => handleCopy(msg.text)}
                          className="text-[10px] font-bold uppercase text-[#D4A373] hover:text-black transition-colors flex items-center gap-1"
                        >
                          <i className="fas fa-copy"></i> Copiar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isAiLoading && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-gray-100 p-5 rounded-2xl flex items-center gap-3 shadow-inner">
                    <div className="w-2 h-2 bg-[#D4A373] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#D4A373] rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-2 h-2 bg-[#D4A373] rounded-full animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          ) : selected ? (
            <div className="animate-fade-in max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-[12px] border-[#D4A373] relative min-h-[550px] flex flex-col">
                <div className="p-10 flex-1">
                  <div className="mb-10 flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-black uppercase text-[#D4A373] bg-[#D4A373]/10 px-3 py-1.5 rounded-full tracking-tighter">
                        {selected.origin === 'faq' ? 'FAQ - Suporte Fornecedor' : selected.origin === 'ai' ? 'Extração por IA' : 'Fluxo Interno Cervello'}
                      </span>
                      <h2 className="text-4xl font-black text-gray-900 mt-4 uppercase tracking-tighter leading-none">
                        {selected.title}
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={refineWithAI}
                        className="p-3 bg-amber-50 text-[#D4A373] rounded-xl hover:bg-[#D4A373] hover:text-white transition-all shadow-sm flex items-center gap-2 group"
                        title="Refinar ou perguntar sobre este item para a IA"
                      >
                        <i className="fas fa-magic group-hover:rotate-12 transition-transform"></i>
                        <span className="text-[10px] font-black uppercase">Refinar com IA</span>
                      </button>
                      <button 
                        onClick={() => handleCopy()}
                        className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-black transition-all shadow-sm"
                        title="Copiar Texto"
                      >
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
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                    Dexco Assist Triple View &copy; {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-gray-200 shadow-xl mb-8">
                <i className="fas fa-lightbulb text-6xl"></i>
              </div>
              <h2 className="text-3xl font-black text-gray-300 uppercase tracking-tighter max-w-md">
                Selecione uma instrução ou inicie um chat com a IA
              </h2>
              <button 
                onClick={startNewChat}
                className="mt-8 px-10 py-4 bg-[#D4A373] text-black font-black uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                Conversar com Assistente
              </button>
            </div>
          )}
        </div>

        {/* Floating AI Input Bar */}
        <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <form onSubmit={(e) => handleAskAI(e)} className="max-w-4xl mx-auto flex gap-4">
            <div className="flex-1 relative group">
              <input 
                type="text" 
                placeholder="Dúvida rápida? Digite aqui para falar com a IA..."
                className="w-full p-5 pl-14 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4A373] transition-all text-sm font-semibold shadow-inner border border-gray-200 group-hover:border-[#D4A373]/50"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
              />
              <div className="absolute left-5 top-5 text-[#D4A373]">
                <i className="fas fa-wand-sparkles text-lg"></i>
              </div>
            </div>
            <button 
              type="submit"
              disabled={isAiLoading || !aiQuery.trim()}
              className="bg-black text-[#D4A373] font-black px-10 py-5 rounded-2xl transition-all shadow-xl hover:bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 active:scale-95 flex items-center gap-3 uppercase text-xs tracking-widest"
            >
              {isAiLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
              Enviar
            </button>
          </form>
        </div>
      </main>

      {/* Sidebar Right: Commands */}
      <aside className="w-[380px] bg-[#1A1A1A] text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-gray-800 bg-black">
          <div className="text-center">
            <h1 className="text-lg font-black tracking-tighter uppercase italic">
              ATENDIMENTO <span className="text-[#D4A373]">CERVELLO</span>
            </h1>
            <p className="text-[9px] text-gray-500 uppercase mt-1 font-bold">Comandos Internos e Templates</p>
          </div>
          <div className="mt-4 w-full relative">
            <input 
              type="text" 
              placeholder="Buscar comando..."
              className="w-full bg-[#262626] border border-gray-700 rounded-lg py-2 px-3 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#D4A373]"
              value={searchCommands}
              onChange={(e) => setSearchCommands(e.target.value)}
            />
            <i className="fas fa-bolt absolute right-3 top-2.5 text-gray-600 text-xs"></i>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredCommands.map((item, idx) => {
             const originalIndex = COMANDOS_GEMS.findIndex(c => c.t === item.t);
             return (
               <ListItem 
                 key={idx}
                 text={item.t}
                 isActive={!chatMode && selected?.origin === 'command' && selected?.index === originalIndex}
                 onClick={() => selectItem('command', originalIndex)}
               />
             );
          })}
        </div>
      </aside>

      <PromptModal 
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setPendingCommand(null); }}
        title={modalTitle}
        fields={modalFields}
        onSubmit={handleModalSubmit}
      />

      <ImageUploadModal 
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        isLoading={isExtracting}
        onConfirm={handleImageConfirm}
      />
    </div>
  );
};

export default App;
