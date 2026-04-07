import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { history } = req.body; 
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        return res.status(500).json({ error: 'A chave da API não foi encontrada.' });
    }

    try {
        const filePath = path.join(process.cwd(), 'conhecimento.txt');
        const baseDeConhecimento = fs.readFileSync(filePath, 'utf8');

        // Mapeia o histórico aceitando textos e imagens
        const formattedContents = history.map(msg => {
            const parts = [];
            
            if (msg.text && msg.text.trim() !== '') {
                parts.push({ text: msg.text });
            }
            
            if (msg.image && msg.image.data) {
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

        // CORREÇÃO: Usando a versão oficial e estável (1.5-flash)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: baseDeConhecimento }]
                },
                contents: formattedContents
                // Removi a busca na web (tools) para evitar que a IA bloqueie a leitura de CPFs por segurança
            })
        });

        const data = await response.json();
        
        // Se o Google reclamar (ex: imagem borrada ou bloqueio de segurança)
        if (data.error) {
            console.error("Erro retornado pelo Google Gemini:", data.error.message);
            throw new Error(data.error.message);
        }

        const aiReply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply: aiReply });
        
    } catch (error) {
        console.error("Erro fatal no chat-aevee.js:", error);
        res.status(500).json({ error: 'Erro ao processar a mensagem.' });
    }
}
