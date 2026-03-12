import { GoogleGenerativeAI } from "@google/generative-ai";

// Não precisamos importar VercelRequest/VercelResponse se não estivermos usando tipos específicos da Vercel
// A Vercel injeta esses tipos automaticamente no runtime

export default async function handler(req: any, res: any) {
  // Garante que apenas requisições POST sejam aceitas para a lógica principal
  if (req.method !== "POST") {
    return res.status(405).json({ resposta: "Método não permitido" });
  }

  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Valida se o prompt foi fornecido
    if (!prompt) {
      return res.status(400).json({ resposta: "Prompt vazio" });
    }

    // Valida se a chave de API está configurada
    if (!apiKey) {
      return res.status(500).json({ resposta: "Erro: Chave GEMINI_API_KEY não configurada. Verifique seu .env e as variáveis de ambiente da Vercel." });
    }

    // Inicializa a IA com a sua chave de API
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Define o modelo (usa o do .env ou o padrão 'gemini-1.5-flash' como fallback)
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash"
    });

    // Gera o conteúdo baseado no prompt recebido
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Retorna a resposta formatada para o frontend
    return res.status(200).json({
      resposta: text
    });
  } catch (error: any) {
    console.error("Erro API:", error);
    return res.status(500).json({
      resposta: "Erro ao consultar IA. Verifique se sua chave de API é válida e se o modelo está correto.",
      detalhes: error.message // Inclui detalhes do erro para depuração
    });
  }
}
