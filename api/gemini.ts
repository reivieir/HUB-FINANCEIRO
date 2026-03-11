import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {

  try {

    const { prompt } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-pro"
    });

    const result = await model.generateContent(prompt);

    const resposta = result.response.text();

    res.status(200).json({ resposta });

  } catch (erro) {

    console.error("ERRO GEMINI:", erro);

    res.status(500).json({
      resposta: "Erro ao consultar a IA."
    });

  }

}
