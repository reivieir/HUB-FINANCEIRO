import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {

  try {

    const { prompt } = req.body;

    const pastaConhecimento = path.join(process.cwd(), "knowledge");

    let baseConhecimento = "";

    if (fs.existsSync(pastaConhecimento)) {

      const arquivos = fs.readdirSync(pastaConhecimento);

      arquivos.forEach((arquivo) => {

        if (arquivo.endsWith(".txt")) {

          const conteudo = fs.readFileSync(
            path.join(pastaConhecimento, arquivo),
            "utf8"
          );

          baseConhecimento += `\n\nDOCUMENTO: ${arquivo}\n${conteudo}`;

        }

      });

    }

    const pergunta = `
Utilize a base de conhecimento abaixo para responder.

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

    res.status(200).json({ resposta });

  } catch (erro) {

    console.error("ERRO GEMINI:", erro);

    res.status(500).json({
      resposta: "Erro ao consultar a IA."
    });

  }

}
