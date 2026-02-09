import React, { useState, useEffect, useRef } from 'react';
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
  const [pendingCommand, setPendingCommand] =
    useState<{ index: number; content: string; type: string } | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createDexcoChat().then(session => setChatSession(session));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading]);

  /* ======================================================
     🔹 ADIÇÃO ÚNICA E NECESSÁRIA – CHAT COM GEMINI
     ====================================================== */
  const handleAskAI = async (
    e?: React.FormEvent | null,
    predefinedQuestion?: string
  ) => {
    if (e) e.preventDefault();

    const question = predefinedQuestion || aiQuery;
    if (!question || !chatSession) return;

    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setAiQuery('');
    setIsAiLoading(true);

    try {
      const result = await chatSession.sendMessage(question);
      const responseText = result.response.text();

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'model', text: 'Erro ao consultar a IA.' },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };
  /* ====================================================== */

  const handleCopy = (textToCopy?: string) => {
    const text = textToCopy || selected?.body;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const selectItem = (origin: Origin | 'ranking', index: number) => {
    setChatMode(false);
    if (origin === 'faq') {
      const item = PERGUNTAS_FREQUENTES[index];
      setSelected({ title: item.p, body: item.r, origin: 'faq', index });
    } else if (origin === 'ranking') {
      setModalTitle('DADOS DO RANKING');
      setModalFields(['Periodo', 'Banco', 'Posição', 'Volume']);
      setPendingCommand({ index: -1, content: '', type: 'ranking' });
      setModalOpen(true);
    } else {
      const item = COMANDOS_GEMS[index];
      if (item.t === 'Extrair') {
        setIsImageModalOpen(true);
        return;
      }
      setSelected({ title: item.t, body: item.c, origin: 'command', index });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-8 flex-1 overflow-y-auto">
          {chatMode ? (
            <div className="max-w-4xl mx-auto space-y-6 pb-12">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className="max-w-[85%] p-6 rounded-2xl bg-white border">
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="text-xs text-gray-400">IA pensando...</div>
              )}
              <div ref={chatEndRef} />
            </div>
          ) : null}
        </div>

        <div className="p-8 bg-white border-t">
          <form
            onSubmit={e => handleAskAI(e)}
            className="max-w-4xl mx-auto flex gap-4"
          >
            <input
              className="flex-1 p-5 bg-gray-50 rounded-2xl border"
              placeholder="Digite sua pergunta para a IA..."
              value={aiQuery}
              onChange={e => setAiQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-black text-[#D4A373] px-10 rounded-2xl font-black uppercase text-xs"
            >
              Enviar
            </button>
          </form>
        </div>
      </main>

      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        isLoading={isExtracting}
        onConfirm={async b => {
          setIsExtracting(true);
          setSelected({
            title: 'Extração',
            body: await extractDataFromImage(b),
            origin: 'ai',
            index: 0,
          });
          setIsExtracting(false);
          setIsImageModalOpen(false);
        }}
      />
    </div>
  );
};

export default App;
