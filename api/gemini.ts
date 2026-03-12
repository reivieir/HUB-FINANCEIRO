import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ resposta: "Método não permitido" });
  }

  try {

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        resposta: "Prompt vazio"
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(prompt);

    const texto = result.response.text();

    return res.status(200).json({
      resposta: texto
    });

  } catch (error) {

    console.error("Erro Gemini:", error);

    return res.status(500).json({
      resposta: "Erro ao consultar IA"
    });

  }

}
