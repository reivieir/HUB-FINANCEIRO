const handleAskAI = async (e: React.FormEvent | null, directPrompt?: string) => {
    if (e) e.preventDefault();
    const query = directPrompt || aiQuery;
    
    // Verifica se a query é válida e se a sessão existe
    if (!query.trim()) return;

    // Se a sessão falhou na inicialização, tentamos criar uma nova agora
    let session = chatSession;
    if (!session) {
      session = await createDexcoChat();
      if (session) setChatSession(session);
      else {
        setMessages(prev => [...prev, { role: 'model', text: "Não foi possível conectar com a IA. Verifique sua chave API no Vercel." }]);
        return;
      }
    }
    
    setAiQuery('');
    setChatMode(true);
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setIsAiLoading(true);

    try {
      // Envio da mensagem para a API
      const result = await session.sendMessage(query);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { role: 'model', text: text }]);
    } catch (error: any) {
      console.error("Erro na API Gemini:", error);
      // Exibe o erro real para facilitar o diagnóstico no console
      setMessages(prev => [...prev, { role: 'model', text: "Erro na conexão: " + (error.message || "Tente novamente.") }]);
    } finally {
      setIsAiLoading(false);
    }
  };
