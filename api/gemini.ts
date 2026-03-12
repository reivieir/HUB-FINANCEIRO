import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Garante que apenas requisições POST sejam aceitas
  if (req.method !== "POST") {
    return res.status(405).json({ resposta: "Método não permitido" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ resposta: "Prompt vazio" });
    }

    // Inicializa a IA com a sua chave de API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Define o modelo (usa o do .env ou o padrão flash)
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
  } catch (error) {
    console.error("Erro Gemini:", error);
    return res.status(500).json({
      resposta: "Erro ao consultar IA. Verifique se sua chave de API é válida."
    });
  }
}
