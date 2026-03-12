// Memória do chat enquanto a página estiver aberta
let historicoChat = [];

// Função para alternar entre as abas principais
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

// Função para abrir e fechar o chat
function toggleChat() {
    const chatWindow = document.getElementById('aiChatWindow');
    if (chatWindow.style.display === 'flex') {
        chatWindow.style.display = 'none';
    } else {
        chatWindow.style.display = 'flex';
    }
}

// Função de envio de mensagem com histórico
async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    const chatMessages = document.getElementById('chatMessages');

    if (message === '') return;

    // 1. Salva a mensagem do usuário no histórico
    historicoChat.push({ role: 'user', text: message });

    // 2. Mostra na tela
    const userDiv = document.createElement('p');
    userDiv.className = 'user-message';
    userDiv.textContent = message;
    chatMessages.appendChild(userDiv);
    input.value = ''; 
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 3. Status de "Pensando..."
    const typingDiv = document.createElement('p');
    typingDiv.className = 'ai-message';
    typingDiv.textContent = 'Pensando...';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // 4. Envia o HISTÓRICO COMPLETO para a Vercel, não apenas a última mensagem
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history: historicoChat })
        });

        const data = await response.json();
        chatMessages.removeChild(typingDiv);

        if (data.reply) {
            // 5. Salva a resposta da IA no histórico
            historicoChat.push({ role: 'model', text: data.reply });

            const aiDiv = document.createElement('p');
            aiDiv.className = 'ai-message';
            aiDiv.innerHTML = data.reply.replace(/\n/g, '<br>');
            chatMessages.appendChild(aiDiv);
        } else {
            throw new Error('Sem resposta');
        }

    } catch (error) {
        chatMessages.removeChild(typingDiv);
        const errorDiv = document.createElement('p');
        errorDiv.className = 'ai-message';
        errorDiv.textContent = 'Erro ao conectar. Tente novamente.';
        chatMessages.appendChild(errorDiv);
        
        // Remove a última mensagem do histórico se der erro, para não bugar a próxima tentativa
        historicoChat.pop(); 
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}
