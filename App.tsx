import React, { useState, useEffect, useRef } from 'react';
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from './constants';
import { SelectedContent, Origin } from './types';
import ListItem from './components/ListItem';
import PromptModal from './components/PromptModal';
import ImageUploadModal from './components/ImageUploadModal';
import { createDexcoChat, extractDataFromImage } from './services/geminiService';

const App: React.FC = () => {
  // --- ESTADOS DE AUTENTICAÇÃO ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const SENHA_ACESSO = "Dexco2026";

  // --- ESTADOS DO DASHBOARD ---
  const [selected, setSelected] = useState<SelectedContent | null>(null);
  const [searchFAQ, setSearchFAQ] = useState('');
  const [searchCommands, setSearchCommands] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);

  // --- ESTADOS DE MODAIS ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFields, setModalFields] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [pendingCommand, setPendingCommand] = useState<{index: number, content: string, type: string} | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Inicializa a IA apenas após a autenticação
  useEffect(() => {
    if (isAuthenticated) {
      createDexcoChat().then(session => setChatSession(session));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading]);

  // Lógica de Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === SENHA_ACESSO) {
      setIsAuthenticated(true);
    } else {
      alert("Senha incorreta!");
    }
  };

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

  const handleAskAI = async (e: React.FormEvent | null, directPrompt?: string) => {
    if (e) e.preventDefault();
    const query = directPrompt || aiQuery;
    if (!query.trim() || isAiLoading) return;
    setAiQuery(''); setChatMode(true);
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setIsAiLoading(true);
    try {
      const result = await chatSession.sendMessage(query);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'model', text: response.text() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Erro na conexão. Tente novamente." }]);
    } finally { setIsAiLoading(false); }
  };

  // --- RENDERIZAÇÃO DA TELA DE LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#1A1A1A]">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-[#D4A373] w-96 text-center">
          <h1 className="text-xl font-black uppercase italic mb-6 text-black">Dexco <span className="text-[#D4A373]">Assist</span></h1>
          <p className="text-xs font-bold text-gray-500 uppercase mb-4">Acesso Restrito</p>
          <input 
            type="password" 
            placeholder="Senha de acesso"
            className="w-full p-3 border rounded-xl mb-4 outline-none focus:ring-2 focus:ring-[#D4A373] text-black"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button type="submit" className="w-full bg-black text-[#D4A373] py-3 rounded-xl font-black uppercase text-xs hover:bg-gray-900 transition-all">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // --- RENDERIZAÇÃO DO DASHBOARD (TRIPLE VIEW) ---
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <aside className="w-[380px] bg-[#1A1A1A] text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-gray-800 bg-black text-center">
          <button onClick={() => {setChatMode(true); setSelected(null);}} className="w-full mb-6 p-3 bg-[#D4A373]/10 border border-[#D4A373]/30 rounded-lg text-[#D4A373] text-xs font-black uppercase tracking-widest hover:bg-[#D4A373]/20 transition-all">Novo Chat IA</button>
          <h1 className="text-lg font-black uppercase italic">Principais <span className="text-[#D4A373]">Duvidas</span></h1>
          <input type="text" placeholder="Buscar dúvida..." className="w-full mt-4 bg-[#262626] border border-gray-700 rounded-lg p-2 text-xs outline-none" value={searchFAQ}
