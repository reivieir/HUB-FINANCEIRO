import fs from 'fs';
import path from 'path';

// Libera o limite do Vercel para aceitar imagens de até 4MB
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
        let baseDeConhecimento = '';
        try {
            const filePath = path.join(process.cwd(), 'conhecimento.txt');
            baseDeConhecimento = fs.readFileSync(filePath, 'utf8');
        } catch (fileErr) {
            console.warn("Aviso: conhecimento.txt não lido no chat-aevee.", fileErr);
        }

        // Mapeia o histórico aceitando textos e imagens
        const formattedContents = history.map(msg => {
            const parts = [];
            
            if (msg.text && msg.text.trim() !== '') {
                parts.push({ text: msg.text });
            }
            
            if (msg.image && msg.image.data) {
                // TRAVA DE SEGURANÇA: Se o formato vier vazio, força ser um PNG
                let finalMimeType = msg.image.mimeType;
                if (!finalMimeType || finalMimeType.trim() === '') {
                    finalMimeType = 'image/png';
                }

                parts.push({
                    inlineData: {
                        mimeType: finalMimeType,
                        data: msg.image.data
                    }
                });
            }

            return {
                role: msg.role, 
                parts: parts
            };
        });

        // Usando a versão 2.5-flash
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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
            
            // TRADUTOR DE ERROS DO GOOGLE PARA OS OPERADORES
            let mensagemErro = data.error?.message || 'Bloqueio na API do Google Gemini.';
            if (mensagemErro.toLowerCase().includes('quota') || mensagemErro.toLowerCase().includes('limit')) {
                mensagemErro = 'Limite de velocidade atingido (Sistema Anti-Spam). Por favor, aguarde 10 segundos e clique em Extrair novamente.';
            }
            
            return res.status(400).json({ error: mensagemErro });
        }

        const aiReply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply: aiReply });
        
    } catch (error) {
        console.error("Erro fatal no chat-aevee.js:", error);
        res.status(500).json({ error: error.message || 'Erro interno no servidor Vercel.' });
    }
}
