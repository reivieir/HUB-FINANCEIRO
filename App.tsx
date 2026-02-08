const handleAskAI = async (e: React.FormEvent | null, directPrompt?: string) => {
    if (e) e.preventDefault();
    const query = directPrompt || aiQuery;
    if (!query.trim() || !chatSession) return;
    
    setAiQuery('');
    setChatMode(true);
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setIsAiLoading(true);

    try {
      // Passando apenas a string resolve o erro de iteração
      const result = await chatSession.sendMessage(query);
      const response = await result.response;
      const modelText = response.text() || "Não consegui processar sua dúvida.";
      
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Erro na conexão. Verifique sua chave API." }]);
    } finally {
      setIsAiLoading(false);
    }
  };
