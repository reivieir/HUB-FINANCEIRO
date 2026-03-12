export default async function handler(req, res) {
    // Bloqueia se não for requisição POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { message } = req.body;
    
    // Puxa a chave que você acabou de salvar lá no painel do Vercel
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        return res.status(500).json({ error: 'A chave da API não foi encontrada no servidor.' });
    }

    try {
        // Conexão oficial com a API do Google Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        
        // Verifica se deu algum erro lá no Google
        if (data.error) {
            throw new Error(data.error.message);
        }

        const aiReply = data.candidates[0].content.parts[0].text;

        // Devolve a resposta da IA para o seu chat
        res.status(200).json({ reply: aiReply });
    } catch (error) {
        console.error("Erro na API:", error);
        res.status(500).json({ error: 'Erro ao processar a mensagem na IA.' });
    }
}
