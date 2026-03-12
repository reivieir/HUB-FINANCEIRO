// 1. Função para alternar entre as abas principais (Conciliação, Bancos, etc.)
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// 2. Função para abrir e fechar a janela do Chat da IA
function toggleChat() {
    const chatWindow = document.getElementById('aiChatWindow');
    if (chatWindow.style.display === 'flex') {
        chatWindow.style.display = 'none';
    } else {
        chatWindow.style.display = 'flex';
    }
}

// 3. Função que conecta com a IA na Vercel
async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    const chatMessages = document.getElementById('chatMessages');

    if (message === '') return;

    // Mostra a mensagem do usuário
    const userDiv = document.createElement('p');
    userDiv.className = 'user-message';
    userDiv.textContent = message;
    chatMessages.appendChild(userDiv);
    input.value = ''; // Limpa o campo
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Mostra status de "Pensando..."
    const typingDiv = document.createElement('p');
    typingDiv.className = 'ai-message';
    typingDiv.textContent = 'Pensando...';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // Envia para o nosso arquivo /api/chat.js na Vercel
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        
        // Remove o "Pensando..."
        chatMessages.removeChild(typingDiv);

        // Exibe a resposta real
        const aiDiv = document.createElement('p');
        aiDiv.className = 'ai-message';
        // Troca as quebras de linha por <br> para ficar formatado
        aiDiv.innerHTML = data.reply ? data.reply.replace(/\n/g, '<br>') : "Erro ao ler a resposta.";
        chatMessages.appendChild(aiDiv);

    } catch (error) {
        chatMessages.removeChild(typingDiv);
        const errorDiv = document.createElement('p');
        errorDiv.className = 'ai-message';
        errorDiv.textContent = 'Erro ao conectar com a IA. Verifique sua conexão.';
        chatMessages.appendChild(errorDiv);
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}
