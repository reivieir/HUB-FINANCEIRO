import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  resposta: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ resposta: "Método não permitido" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ resposta: "Prompt vazio" });

    // Inicializa o cliente
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });

    // Gera resposta
    const result: any = await model.generate({ prompt });

    // Extrai texto de forma segura
    const texto =
      result.output_text ?? result.output?.[0]?.content?.[0]?.text ?? "Sem resposta";

    return res.status(200).json({ resposta: texto });
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    return res.status(500).json({ resposta: "Erro ao consultar IA" });
  }
}
