async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    const chatMessages = document.getElementById('chatMessages');

    if (message === '') return;

    // 1. Mostra a mensagem do usuário
    const userDiv = document.createElement('p');
    userDiv.className = 'user-message';
    userDiv.textContent = message;
    chatMessages.appendChild(userDiv);
    input.value = ''; // Limpa o campo
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 2. Mostra status de "Pensando..."
    const typingDiv = document.createElement('p');
    typingDiv.className = 'ai-message';
    typingDiv.textContent = 'Pensando...';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // 3. Envia para o nosso arquivo /api/chat.js na Vercel
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        
        // 4. Remove o "Pensando..."
        chatMessages.removeChild(typingDiv);

        // 5. Exibe a resposta real
        const aiDiv = document.createElement('p');
        aiDiv.className = 'ai-message';
        // Troca as quebras de linha por <br> para ficar formatado
        aiDiv.innerHTML = data.reply ? data.reply.replace(/\n/g, '<br>') : "Erro ao ler a resposta.";
        chatMessages.appendChild(aiDiv);

    } catch (error) {
        typingDiv.textContent = 'Erro ao conectar com a IA. Verifique sua conexão.';
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}
