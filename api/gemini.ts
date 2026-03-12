import { GoogleGenerativeAI } from "@google/generative-ai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function (req: VercelRequest, res: VercelResponse) {
  // Habilita CORS se necessário
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ resposta: "Método não permitido" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ resposta: "Prompt vazio" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ resposta: "Configuração ausente: GEMINI_API_KEY não encontrada" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash"
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const texto = response.text();

    return res.status(200).json({ resposta: texto });
  } catch (error: any) {
    console.error("Erro Gemini:", error);
    return res.status(500).json({
      resposta: "Erro ao consultar IA",
      detalhes: error.message
    });
  }
}
