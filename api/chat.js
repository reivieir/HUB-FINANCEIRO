import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    // Agora recebemos o histórico inteiro do app.js
    const { history } = req.body; 
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        return res.status(500).json({ error: 'A chave da API não foi encontrada no servidor.' });
    }

    try {
        const filePath = path.join(process.cwd(), 'conhecimento.txt');
        const baseDeConhecimento = fs.readFileSync(filePath, 'utf8');

        // Formata o histórico recebido para o padrão que a API do Gemini entende
        const formattedContents = history.map(msg => ({
            role: msg.role, // 'user' ou 'model'
            parts: [{ text: msg.text }]
        }));

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: baseDeConhecimento }]
                },
                contents: formattedContents // Envia a conversa toda
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const aiReply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply: aiReply });
        
    } catch (error) {
        console.error("Erro na API:", error);
        res.status(500).json({ error: 'Erro ao processar a mensagem.' });
    }
}
