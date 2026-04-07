import fs from 'fs';
import path from 'path';

// 1. Aumenta o limite de upload para aceitar imagens maiores (Padrão do Vercel é 1MB)
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb',
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { history } = req.body; 
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        return res.status(500).json({ error: 'Chave da API não encontrada no Vercel.' });
    }

    try {
        // 2. Lê o conhecimento (com proteção caso o arquivo falhe)
        let baseDeConhecimento = '';
        try {
            const filePath = path.join(process.cwd(), 'conhecimento.txt');
            baseDeConhecimento = fs.readFileSync(filePath, 'utf8');
        } catch (fileErr) {
            console.warn("Aviso: conhecimento.txt não lido no chat-aevee.", fileErr);
        }

        // 3. Monta o pacote de texto + imagem para o Google
        const formattedContents = history.map(msg => {
            const parts = [];
            if (msg.text) parts.push({ text: msg.text });
            
            if (msg.image && msg.image.data) {
                parts.push({
                    inlineData: {
                        mimeType: msg.image.mimeType,
                        data: msg.image.data
                    }
                });
            }
            return { role: msg.role, parts: parts };
        });

        // 4. Envia para o modelo oficial 1.5-flash
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: baseDeConhecimento }]
                },
                contents: formattedContents
            })
        });

        const data = await response.json();
        
        if (!response.ok || data.error) {
            console.error("Erro retornado pelo Google Gemini:", data.error);
            return res.status(400).json({ error: data.error?.message || 'Bloqueio na API do Google Gemini.' });
        }

        const aiReply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply: aiReply });
        
    } catch (error) {
        console.error("Erro fatal no chat-aevee.js:", error);
        res.status(500).json({ error: error.message || 'Erro interno no servidor Vercel (Payload muito grande ou falha de rede).' });
    }
}
