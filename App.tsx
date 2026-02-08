const handleAskAI = async (e: React.FormEvent | null, directPrompt?: string) => {
  if (e) e.preventDefault();
  const query = directPrompt || aiQuery;
  if (!query.trim() || !chatSession) return;
  
  setAiQuery('');
  setChatMode(true);
  setMessages(prev => [...prev, { role: 'user', text: query }]);
  setIsAiLoading(true);

  try {
    // ENVIAR APENAS A STRING (QUERY)
    const result = await chatSession.sendMessage(query);
    const response = await result.response;
    const modelText = response.text();
    
    setMessages(prev => [...prev, { role: 'model', text: modelText }]);
  } catch (error) {
    console.error(error);
    setMessages(prev => [...prev, { role: 'model', text: "Erro ao conectar com a IA." }]);
  } finally {
    setIsAiLoading(false);
  }
};
