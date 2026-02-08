// Dentro da função handleAskAI, adicione um alerta caso a sessão não exista
const handleAskAI = async (e: React.FormEvent | null, directPrompt?: string) => {
  if (e) e.preventDefault();
  const query = directPrompt || aiQuery;
  
  // Se o chat ainda não carregou a sessão, tentamos recarregar
  if (!chatSession) {
    const session = await createDexcoChat();
    if (session) setChatSession(session);
    else {
      setMessages(prev => [...prev, { role: 'model', text: "Aguarde um momento, a conexão com a IA está sendo estabelecida..." }]);
      return;
    }
  }

  if (!query.trim()) return;
  
  setAiQuery('');
  setChatMode(true);
  setMessages(prev => [...prev, { role: 'user', text: query }]);
  setIsAiLoading(true);

  try {
    // O sendMessage agora deve funcionar sem o erro 404
    const result = await chatSession.sendMessage(query);
    const response = await result.response;
    setMessages(prev => [...prev, { role: 'model', text: response.text() }]);
  } catch (error) {
    console.error(error);
    setMessages(prev => [...prev, { role: 'model', text: "Erro na conexão. Verifique se a sua chave API está correta no painel da Vercel." }]);
  } finally {
    setIsAiLoading(false);
  }
};
