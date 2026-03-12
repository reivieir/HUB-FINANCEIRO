// Função para alternar entre as abas principais
function showTab(tabId) {
    // Esconde todos os conteúdos
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    // Remove o estilo ativo de todos os botões
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Mostra a aba selecionada
    document.getElementById(tabId).classList.add('active');
    // Encontra o botão clicado e marca como ativo (busca pelo texto correspondente)
    event.currentTarget.classList.add('active');
}

// Funções para a janela do Chat da IA
function toggleChat() {
    const chatWindow = document.getElementById('aiChatWindow');
    if (chatWindow.style.display === 'flex') {
        chatWindow.style.display = 'none';
    } else {
        chatWindow.style.display = 'flex';
    }
}

// Simulador de envio de mensagem (preparando para futura API)
function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message !== '') {
        const chatMessages = document.getElementById('chatMessages');
        
        // Adiciona a mensagem do usuário
        const userDiv = document.createElement('p');
        userDiv.className = 'user-message';
        userDiv.textContent = message;
        chatMessages.appendChild(userDiv);
        
        input.value = '';
        
        // Simulação da resposta da IA (aqui entrará o fetch para a API futuramente)
        setTimeout(() => {
            const aiDiv = document.createElement('p');
            aiDiv.className = 'ai-message';
            aiDiv.textContent = 'Entendido. Estou processando sua dúvida na base de conhecimento. (Integração IA em breve)';
            chatMessages.appendChild(aiDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Rola para o fim
        }, 1000);
    }
}