import { GoogleGenerativeAI } from "@google/generative-ai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function (req: VercelRequest, res: VercelResponse) {
  // Habilita CORS para permitir requisições de diferentes origens
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Em produção, substitua '*' pelo domínio do seu frontend
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Lida com requisições OPTIONS (preflight requests) para CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Garante que apenas requisições POST sejam aceitas para a lógica principal
  if (req.method !== "POST") {
    return res.status(405).json({ resposta: "Método não permitido" });
  }

  try {
    const { prompt } = req.body;

    // Valida se o prompt foi fornecido
    if (!prompt) {
      return res.status(400).json({ resposta: "Prompt vazio" });
    }

    // Valida se a chave de API está configurada
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ resposta: "Configuração ausente: GEMINI_API_KEY não encontrada. Verifique seu .env e as variáveis de ambiente da Vercel." });
    }

    // Inicializa a IA com a sua chave de API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Define o modelo (usa o do .env ou o padrão 'gemini-1.5-flash' como fallback)
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash"
    });

    // Gera o conteúdo baseado no prompt recebido
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const texto = response.text();

    // Retorna a resposta formatada para o frontend
    return res.status(200).json({
      resposta: texto
    });
  } catch (error: any) {
    console.error("Erro Gemini:", error);
    return res.status(500).json({
      resposta: "Erro ao consultar IA. Verifique se sua chave de API é válida e se o modelo está correto.",
      detalhes: error.message // Inclui detalhes do erro para depuração
    });
  }
}
