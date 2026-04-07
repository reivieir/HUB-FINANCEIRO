import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '5mb',
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
        return res.status(500).json({ error: 'Chave da API não encontrada no servidor.' });
    }

    try {
        let baseDeConhecimento = '';
        try {
            const filePath = path.join(process.cwd(), 'conhecimento.txt');
            baseDeConhecimento = fs.readFileSync(filePath, 'utf8');
        } catch (fileErr) {
            console.warn("Aviso: conhecimento.txt não lido.", fileErr);
        }

        const formattedContents = history.map(msg => {
            const parts = [];
            
            if (msg.text && msg.text.trim() !== '') {
                parts.push({ text: msg.text });
            }
            
            if (msg.image && msg.image.data) {
                parts.push({
                    inlineData: {
                        mimeType: msg.image.mimeType || 'image/jpeg',
                        data: msg.image.data
                    }
                });
            }

            return { role: msg.role, parts: parts };
        });

        // Usando a versão oficial e mais estável garantida
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: baseDeConhecimento }] },
                contents: formattedContents
            })
        });

        const data = await response.json();
        
        if (!response.ok || data.error) {
            // Removemos o tradutor de erros. Agora mostra o ERRO REAL DO GOOGLE!
            const erroReal = data.error?.message || JSON.stringify(data);
            console.error("Erro do Google:", erroReal);
            return res.status(400).json({ error: erroReal });
        }

        const aiReply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply: aiReply });
        
    } catch (error) {
        console.error("Erro fatal no servidor:", error);
        res.status(500).json({ error: error.message || 'Erro interno de servidor.' });
    }
}
