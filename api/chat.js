import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        return res.status(500).json({ error: 'A chave da API não foi encontrada no servidor.' });
    }

    try {
        // 1. Encontra o caminho do arquivo conhecimento.txt na raiz do projeto
        const filePath = path.join(process.cwd(), 'conhecimento.txt');
        
        // 2. Lê todo o conteúdo do arquivo de texto
        const baseDeConhecimento = fs.readFileSync(filePath, 'utf8');

        // 3. Envia a leitura do arquivo como instrução (System Prompt) para a IA
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: baseDeConhecimento }]
                },
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const aiReply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply: aiReply });
        
    } catch (error) {
        console.error("Erro na API ou ao ler o arquivo:", error);
        res.status(500).json({ error: 'Erro ao processar a mensagem ou ler a base de conhecimento.' });
    }
}
