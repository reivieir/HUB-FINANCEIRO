import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { gerarResposta } from './services/geminiService'; // Importando a função que criamos

// ... (Mantenha suas interfaces Message e o início do componente App igual)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // 1. Adiciona a mensagem do usuário na tela
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input; // Salva o input atual
    setInput('');
    setIsLoading(true);

    try {
      // 2. Chama a IA (Lógica adicionada aqui)
      const respostaIA = await gerarResposta(currentInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: respostaIA,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      // 3. Tratamento de erro visual
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Ops, tive um problema para responder. Pode tentar de novo?",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

// ... (Todo o restante do seu código JSX/HTML permanece IDENTICO ao original)
