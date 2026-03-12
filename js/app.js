let historicoChat = [];

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

// NOVO: Função para limpar o chat
function novoChat() {
    historicoChat = []; // Zera a memória da IA
    const chatMessages = document.getElementById('chatMessages');
    
    // Limpa a tela e coloca a mensagem inicial de volta
    chatMessages.innerHTML = `
        <p class="ai-message">Olá! Sou o assistente do Hub. O histórico foi limpo. Como posso ajudar agora?</p>
    `;
}

// NOVO: Enviar com a tecla Enter
function enviarComEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    const chatMessages = document.getElementById('chatMessages');

    if (message === '') return;

    historicoChat.push({ role: 'user', text: message });

    const userDiv = document.createElement('p');
    userDiv.className = 'user-message';
    userDiv.textContent = message;
    chatMessages.appendChild(userDiv);
    input.value = ''; 
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const typingDiv = document.createElement('p');
    typingDiv.className = 'ai-message';
    typingDiv.textContent = 'Pensando...';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history: historicoChat })
        });

        const data = await response.json();
        chatMessages.removeChild(typingDiv);

        if (data.reply) {
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
        historicoChat.pop(); 
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}
