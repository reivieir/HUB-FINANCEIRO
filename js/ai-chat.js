import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { history } = req.body; 
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        return res.status(500).json({ error: 'A chave da API não foi encontrada no servidor.' });
    }

    try {
        const filePath = path.join(process.cwd(), 'conhecimento.txt');
        const baseDeConhecimento = fs.readFileSync(filePath, 'utf8');

        // Formata o histórico recebido suportando agora imagens (inlineData)
        const formattedContents = history.map(msg => {
            const parts = [];
            
            // Se tiver texto na mensagem, adiciona
            if (msg.text && msg.text.trim() !== '') {
                parts.push({ text: msg.text });
            }
            
            // Se tiver imagem na mensagem, converte para o formato do Gemini
            if (msg.image) {
                parts.push({
                    inlineData: {
                        mimeType: msg.image.mimeType,
                        data: msg.image.data
                    }
                });
            }

            return {
                role: msg.role, 
                parts: parts
            };
        });

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: baseDeConhecimento }]
                },
                contents: formattedContents,
                tools: [
                    { googleSearch: {} }
                ]
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
        res.status(500).json({ error: 'Erro ao processar a mensagem com imagem.' });
    }
}
