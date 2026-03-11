import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {

  try {

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        resposta: "Pergunta não enviada."
      });
    }

    // -------------------------
    // CARREGAR BASE DE CONHECIMENTO
    // -------------------------

    let baseConhecimento = "";

    try {

      const pasta = path.join(process.cwd(), "knowledge");

      if (fs.existsSync(pasta)) {

        const arquivos = fs.readdirSync(pasta);

        for (const arquivo of arquivos) {

          if (arquivo.endsWith(".txt")) {

            const conteudo = fs.readFileSync(
              path.join(pasta, arquivo),
              "utf8"
            );

            baseConhecimento += `\n\nDOCUMENTO: ${arquivo}\n${conteudo}`;

          }

        }

      }

    } catch (erro) {

      console.error("Erro lendo base de conhecimento:", erro);

    }

    // -------------------------
    // PERGUNTA PARA IA
    // -------------------------

    const pergunta = `
Use a base de conhecimento abaixo para responder a pergunta.

BASE:
${baseConhecimento}

PERGUNTA:
${prompt}
`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(pergunta);

    const resposta = result.response.text();

    return res.status(200).json({ resposta });

  } catch (erro) {

    console.error("Erro na API Gemini:", erro);

    return res.status(500).json({
      resposta: "Erro ao consultar a IA."
    });

  }

}
