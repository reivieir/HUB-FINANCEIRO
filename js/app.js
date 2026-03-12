// ==========================================
// DADOS E LÓGICA DA TABELA DE CONCILIAÇÃO
// ==========================================
const dadosConciliacao = [
    { empresa: "Empresa Matriz", banco: "Itaú", conta: "12345-6", data: "12/03/2026", saldo: "R$ 150.000,00", status: "Conciliado" },
    { empresa: "Empresa Matriz", banco: "Bradesco", conta: "98765-4", data: "12/03/2026", saldo: "R$ 45.300,00", status: "Pendente" },
    { empresa: "Filial SP", banco: "Itaú", conta: "11111-1", data: "12/03/2026", saldo: "R$ 89.000,00", status: "Conciliado" },
    { empresa: "Filial SP", banco: "Santander", conta: "22222-2", data: "12/03/2026", saldo: "R$ 12.500,00", status: "Pendente" },
    { empresa: "Filial RJ", banco: "Banco do Brasil", conta: "33333-3", data: "12/03/2026", saldo: "R$ 5.400,00", status: "Conciliado" }
];

function carregarTabela(dados) {
    const tbody = document.getElementById('tabelaCorpo');
    if(!tbody) return;
    tbody.innerHTML = ''; 

    dados.forEach(item => {
        const tr = document.createElement('tr');
        const statusClass = item.status === 'Conciliado' ? 'status-ok' : 'status-pendente';
        
        tr.innerHTML = `
            <td>${item.empresa}</td>
            <td><strong>${item.banco}</strong></td>
            <td>${item.conta}</td>
            <td>${item.data}</td>
            <td>${item.saldo}</td>
            <td><span class="${statusClass}">${item.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function popularFiltros() {
    const filtroEmpresa = document.getElementById('filtroEmpresa');
    const filtroBanco = document.getElementById('filtroBanco');
    
    if(!filtroEmpresa || !filtroBanco) return;

    const empresas = [...new Set(dadosConciliacao.map(item => item.empresa))];
    const bancos = [...new Set(dadosConciliacao.map(item => item.banco))];

    empresas.forEach(empresa => {
        filtroEmpresa.innerHTML += `<option value="${empresa}">${empresa}</option>`;
    });

    bancos.forEach(banco => {
        filtroBanco.innerHTML += `<option value="${banco}">${banco}</option>`;
    });
}

function filtrarTabela() {
    const empresaSelecionada = document.getElementById('filtroEmpresa').value;
    const bancoSelecionado = document.getElementById('filtroBanco').value;

    const dadosFiltrados = dadosConciliacao.filter(item => {
        const matchEmpresa = empresaSelecionada === "" || item.empresa === empresaSelecionada;
        const matchBanco = bancoSelecionado === "" || item.banco === bancoSelecionado;
        return matchEmpresa && matchBanco;
    });

    carregarTabela(dadosFiltrados);
}

window.addEventListener('DOMContentLoaded', () => {
    popularFiltros();
    carregarTabela(dadosConciliacao);
});

// ==========================================
// LÓGICA DE NAVEGAÇÃO E CHAT DA IA
// ==========================================
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

function novoChat() {
    historicoChat = []; 
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <p class="ai-message">Olá! Sou o assistente do Hub. O histórico foi limpo. Como posso ajudar agora?</p>
    `;
}

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
