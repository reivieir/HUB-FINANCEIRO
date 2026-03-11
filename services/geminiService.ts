import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ resposta: "Método não permitido" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ resposta: "Prompt vazio" });
    }

    // ⚠️ Verifique se a variável do .env é realmente GEMINI_API_KEY
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Dependendo da versão do SDK, pode ser generate ou generateContent
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generate({
      prompt: prompt
    });

    // Extração segura do texto
    const texto = result.output_text ?? result.output?.[0]?.content?.[0]?.text ?? "Sem resposta";

    return res.status(200).json({
      resposta: texto
    });
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    return res.status(500).json({
      resposta: "Erro ao consultar IA"
    });
  }
}
