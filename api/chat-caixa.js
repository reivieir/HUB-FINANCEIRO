// Arquivo: api/chat-caixa.js
export default async function handler(req, res) {
    // Permite apenas requisições POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { prompt, contexto } = req.body;
    
    // O Vercel vai puxar a chave secreta daqui, ninguém nunca vai ver!
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Chave da API ausente no Vercel' });
    }

    const promptCompleto = `CONTEXTO DO SISTEMA (DADOS REAIS):\n${contexto}\n\nPERGUNTA DO USUÁRIO:\n${prompt}`;

    try {
        // O servidor do Vercel faz a chamada para o Google
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptCompleto }]
                }],
                generationConfig: {
                    temperature: 0.2 
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        if (data.candidates && data.candidates.length > 0) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply });
        } else {
            return res.status(500).json({ error: 'A IA não retornou uma resposta válida.' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Erro de conexão no servidor Vercel.' });
    }
}
