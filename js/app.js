// ==========================================
// DADOS EXATOS DA PLANILHA DE CONCILIAÇÃO
// ==========================================
const dadosConciliacao = [
    { empresa: "BRDX", conta: "BB Ag. 1893 - 343329-3", cnpj: "97.837.181/0001-47", banco: "Banco do Brasil", debito: "1111100", credito: "1121100", movimento: "1001100" },
    { empresa: "BRDX", conta: "Banco Nordeste do Brasil Ag.0031 - 55843-6", cnpj: "97.837.181/0001-47", banco: "Banco Nordeste", debito: "1111632", credito: "1121632", movimento: "1001632" },
    { empresa: "BRDX", conta: "Banrisul Ag. 0413 - 60157510-3", cnpj: "97.837.181/0001-47", banco: "Banrisul", debito: "1111592", credito: "1121592", movimento: "1001592" },
    { empresa: "BRDX", conta: "BOFA - 1257775666", cnpj: "97.837.181/0001-47", banco: "BOFA", debito: "1111650", credito: "1121650", movimento: "1001650" },
    { empresa: "BRDX", conta: "Bradesco - Ag 0895 - 76.322-5 CCEE", cnpj: "97.837.181/0001-47", banco: "Bradesco", debito: "1111469", credito: "1121469", movimento: "1001469" },
    { empresa: "BRDX", conta: "CEF - Ag 3337 - 00901098/5", cnpj: "97.837.181/0001-47", banco: "CEF", debito: "1111571", credito: "1121571", movimento: "1001571" },
    { empresa: "BRDX", conta: "Itaú Ag. 0262 - 11079-4", cnpj: "97.837.181/0001-47", banco: "Itaú", debito: "1111049", credito: "1121049", movimento: "1001049" },
    { empresa: "BRDX", conta: "Itaú Ag. 0262 - 17.843-7", cnpj: "97.837.181/0001-47", banco: "Itaú", debito: "1111000", credito: "1121000", movimento: "1001000" },
    { empresa: "BRDX", conta: "Itaú Ag. 0262 - 29.500-9 Siscomex", cnpj: "97.837.181/0001-47", banco: "Itaú", debito: "1111006", credito: "1121006", movimento: "1001006" },
    { empresa: "BRDX", conta: "Itaú - AG 7307 - 50310-7", cnpj: "97.837.181/0001-47", banco: "Itaú", debito: "1111027", credito: "1121027", movimento: "1001027" },
    { empresa: "BRDX", conta: "Safra Ag. 0115 - 000330-5", cnpj: "97.837.181/0001-47", banco: "Safra", debito: "1111300", credito: "1121300", movimento: "1001300" },
    { empresa: "BRDX", conta: "Santander Ag. 2008 - 13000041-3", cnpj: "97.837.181/0001-47", banco: "Santander", debito: "1111525", credito: "1121525", movimento: "1001525" },
    { empresa: "BRDX", conta: "Santander - ag.2147 - 130000066-6", cnpj: "97.837.181/0001-47", banco: "Santander", debito: "1111523", credito: "1121523", movimento: "1001523" },
    { empresa: "BRDX", conta: "Banco XP AG 0001 C.C 65078-0", cnpj: "97.837.181/0001-47", banco: "XP", debito: "1111550", credito: "1121550", movimento: "1001550" },
    { empresa: "BRDX", conta: "TDB Bradesco Ag. 2372-8 - 89.300-5", cnpj: "97.837.181/0001-47", banco: "Bradesco", debito: "1111467", credito: "1121467", movimento: "1001467" },
    { empresa: "BRDX", conta: "ABC Brasil-ag.0001-9-2.331.908-0", cnpj: "97.837.181/0001-47", banco: "ABC", debito: "1111580", credito: "1121580", movimento: "1001580" },
    { empresa: "BRDX", conta: "Daycoval-ag. 0001 - 001516474-0", cnpj: "97.837.181/0001-47", banco: "Daycoval", debito: "1111600", credito: "1121600", movimento: "1001600" },
    { empresa: "BRDX", conta: "Itaú-ag.7307-59362-9", cnpj: "97.837.181/0001-47", banco: "Itaú", debito: "1111035", credito: "1121035", movimento: "1001035" },
    { empresa: "BRDX", conta: "Citibank - ag.001 - 90041146", cnpj: "97.837.181/0001-47", banco: "CITI", debito: "1111352", credito: "1121352", movimento: "1001352" },
    { empresa: "BRDF", conta: "Bradesco - Ag. 2374-4 - 35.500-3", cnpj: "43.059.559/0001-08", banco: "Bradesco", debito: "1111452", credito: "1121452", movimento: "1001452" },
    { empresa: "BRDF", conta: "BB - Ag. 1893-7 - 30001-2", cnpj: "43.059.559/0001-08", banco: "Banco do Brasil", debito: "1111102", credito: "1121102", movimento: "1001610" },
    { empresa: "BRDF", conta: "CEF - Ag. 1679 - 2783-7", cnpj: "43.059.559/0001-08", banco: "CEF", debito: "1111570", credito: "1121570", movimento: "1001570" },
    { empresa: "BRDF", conta: "CEF - Ag. 3337 - 00902783-7", cnpj: "43.059.559/0001-08", banco: "CEF", debito: "1111572", credito: "1121572", movimento: "1001353" },
    { empresa: "BRDF", conta: "Itaú - Ag. 0262 - 17847-8", cnpj: "43.059.559/0001-08", banco: "Itaú", debito: "1111002", credito: "1121002", movimento: "1001034" },
    { empresa: "BRDF", conta: "Itaú - AG 7307 - 50311-5", cnpj: "43.059.559/0001-08", banco: "Itaú", debito: "1111028", credito: "1121028", movimento: "1001028" },
    { empresa: "BRDF", conta: "Itaú - AG 7307 - 50312-3", cnpj: "43.059.559/0001-08", banco: "Itaú", debito: "1111029", credito: "1121029", movimento: "1001029" },
    { empresa: "BRDF", conta: "Safra - Ag. 0115 - 5949-1", cnpj: "43.059.559/0001-08", banco: "Safra", debito: "1111302", credito: "1121302", movimento: "1001308" },
    { empresa: "BRDF", conta: "Santander Ag. 2271 - 13003017-5", cnpj: "43.059.559/0001-08", banco: "Santander", debito: "1111524", credito: "1121524", movimento: "1001524" },
    { empresa: "BRDF", conta: "Banco XP AG 0001 C.C 65084-1", cnpj: "43.059.559/0001-08", banco: "XP", debito: "1111552", credito: "1121552", movimento: "1001552" },
    { empresa: "BRDF", conta: "ABC Brasil-ag.0001-9-2.331.859-9", cnpj: "43.059.559/0001-08", banco: "ABC", debito: "1111581", credito: "1121581", movimento: "1001581" },
    { empresa: "BRDF", conta: "Daycoval-ag. 0001 - 001516477-4", cnpj: "43.059.559/0001-08", banco: "Daycoval", debito: "1111610", credito: "1121610", movimento: "1001610" },
    { empresa: "BRDF", conta: "Itaú-ag.7307-59363-7", cnpj: "43.059.559/0001-08", banco: "Itaú", debito: "1111036", credito: "1121036", movimento: "1001036" },
    { empresa: "BRDF", conta: "Citibank - ag.001 - 90042675", cnpj: "43.059.559/0001-08", banco: "CITI", debito: "1111353", credito: "1121353", movimento: "1001353" },
    { empresa: "BRHY", conta: "BB - Ag. 1893-7 32966-5", cnpj: "62.032.180/0001-40", banco: "Banco do Brasil", debito: "1111108", credito: "1121108", movimento: "1001108" },
    { empresa: "BRHY", conta: "BOFA - 1257775685", cnpj: "62.032.180/0001-40", banco: "BOFA", debito: "1111648", credito: "1121648", movimento: "1001648" },
    { empresa: "BRHY", conta: "Bradesco - Ag. 0895-8 - 135049-8 - CCEE", cnpj: "62.032.180/0001-40", banco: "Bradesco", debito: "1111458", credito: "1121458", movimento: "1001458" },
    { empresa: "BRHY", conta: "Bradesco - Ag. 1231-9 25000-7", cnpj: "62.032.180/0001-74", banco: "Bradesco", debito: "1111455", credito: "1121455", movimento: "1001455" },
    { empresa: "BRHY", conta: "Bradesco - ag.2372 - 38760-6", cnpj: "62.032.180/0001-40", banco: "Bradesco", debito: "1111475", credito: "1121475", movimento: "1001475" },
    { empresa: "BRHY", conta: "Itaú - Ag. 0046 - 15601-4", cnpj: "62.032.180/0001-40", banco: "Itaú", debito: "1111012", credito: "1121012", movimento: "1001012" },
    { empresa: "BRHY", conta: "Itaú - AG 7307 - 53.404-5", cnpj: "62.032.180/0001-40", banco: "Itaú", debito: "1111030", credito: "1121030", movimento: "1001030" },
    { empresa: "BRHY", conta: "Santander - Ag. 0728 - 13000535-6", cnpj: "62.032.180/0001-40", banco: "Santander", debito: "1111527", credito: "1121527", movimento: "1001527" },
    { empresa: "BRHY", conta: "Banco XP AG 0001 C.C 65084-2", cnpj: "62.032.180/0001-40", banco: "XP", debito: "1111551", credito: "1121551", movimento: "1001551" },
    { empresa: "BRCF", conta: "BB - Ag. 1893-7 106406-1", cnpj: "18.842.121/0001-46", banco: "Banco do Brasil", debito: "1111107", credito: "1121107", movimento: "1001107" },
    { empresa: "BRCF", conta: "Banco do Nordeste do Brasil Ag. 0031 - 43626-8", cnpj: "18.842.121/0001-46", banco: "Banco Nordeste", debito: "1111622", credito: "1121622", movimento: "1001622" },
    { empresa: "BRCF", conta: "Itaú - Ag. 7307 - 11112-5", cnpj: "18.842.121/0001-46", banco: "Itaú", debito: "1111018", credito: "1121018", movimento: "1001018" },
    { empresa: "BRCF", conta: "Safra - Ag. 0115 -44941-9", cnpj: "18.842.121/0001-46", banco: "Safra", debito: "1111305", credito: "1121305", movimento: "1001305" },
    { empresa: "BRCF", conta: "Santander - Ag. 2271 - 13020743-0", cnpj: "18.842.121/0001-46", banco: "Santander", debito: "1111521", credito: "1121521", movimento: "1001521" },
    { empresa: "BRBC", conta: "Itaú - Ag. 0262 - 91.486-4", cnpj: "17.856.628/0001-96", banco: "Itaú", debito: "1111050", credito: "1121050", movimento: "1001050" },
    { empresa: "BREM", conta: "Itaú - Ag. 0262 - 17.856-9", cnpj: "44.367.258/0001-04", banco: "Itaú", debito: "1111003", credito: "1121003", movimento: "1001003" },
    { empresa: "BRSF", conta: "Itaú - Ag. 0262 - 04518-0", cnpj: "02.337.290/0001-99", banco: "Itaú", debito: "1111045", credito: "1121045", movimento: "1001045" },
    { empresa: "BRTR", conta: "Itaú - Ag. 7307 - 08.704-4", cnpj: "16.564.523/0001-09", banco: "Itaú", debito: "1111009", credito: "1121009", movimento: "1001009" },
    { empresa: "BRSD", conta: "Bradesco - ag.2372 - 38435-6", cnpj: "51.272.143/0001-93", banco: "Bradesco", debito: "1111474", credito: "1121474", movimento: "1001474" },
    { empresa: "BRSD", conta: "Itaú - ag.7307 - 48718-6", cnpj: "51.272.143/0001-93", banco: "Itaú", debito: "1111031", credito: "1121031", movimento: "1001031" },
    { empresa: "BRCT", conta: "BB - ag.3081 - 6592-7", cnpj: "05.152.138/0001-20", banco: "Banco do Brasil", debito: "", credito: "", movimento: "" },
    { empresa: "BRCT", conta: "Itaú - ag.0030- 67486-5", cnpj: "05.152.138/0001-20", banco: "Itaú", debito: "", credito: "", movimento: "" },
    { empresa: "BRCT", conta: "Santander - ag.0010 - 13.014221-5", cnpj: "05.152.138/0001-20", banco: "Santander", debito: "", credito: "", movimento: "" },
    { empresa: "BRS1", conta: "Itaú- Ag. 7307- 50.645-6", cnpj: "56.971.678/0001-76", banco: "Itaú", debito: "1111034", credito: "1121034", movimento: "1001034" },
    { empresa: "BRS3", conta: "Agência 7307 Conta 60438-4", cnpj: "62.411.116/0001-70", banco: "Itaú", debito: "1111052", credito: "1121052", movimento: "1001052" },
    { empresa: "BRS2", conta: "Agência 7307 Conta 59899-0", cnpj: "61.070.268/0001-94", banco: "Itaú", debito: "1111051", credito: "1121051", movimento: "1001051" },
    { empresa: "BRS2", conta: "ag.0115 - 056629-6", cnpj: "61.070.268/0001-94", banco: "SAFRA", debito: "1111308", credito: "1121308", movimento: "1001308" }
];

// Carrega os dados na tabela HTML
function carregarTabela(dados) {
    const tbody = document.getElementById('tabelaCorpo');
    if(!tbody) return;
    tbody.innerHTML = ''; 

    dados.forEach(item => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td><strong>${item.empresa}</strong></td>
            <td>${item.conta}</td>
            <td>${item.cnpj}</td>
            <td>${item.banco}</td>
            <td>${item.debito}</td>
            <td>${item.credito}</td>
            <td>${item.movimento}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Cria as opções do filtro automaticamente
function popularFiltros() {
    const filtroEmpresa = document.getElementById('filtroEmpresa');
    const filtroBanco = document.getElementById('filtroBanco');
    
    if(!filtroEmpresa || !filtroBanco) return;

    // Pega as empresas e bancos únicos da lista para criar o select
    const empresas = [...new Set(dadosConciliacao.map(item => item.empresa))];
    const bancos = [...new Set(dadosConciliacao.map(item => item.banco))];

    empresas.sort().forEach(empresa => {
        filtroEmpresa.innerHTML += `<option value="${empresa}">${empresa}</option>`;
    });

    bancos.sort().forEach(banco => {
        filtroBanco.innerHTML += `<option value="${banco}">${banco}</option>`;
    });
}

// Função de Filtro Cruzado (Empresa + Banco)
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

// Inicializa a tabela assim que a página carrega
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
