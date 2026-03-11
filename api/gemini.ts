import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const pastaConhecimento = path.join(process.cwd(), "knowledge");

function carregarBaseConhecimento() {

  const arquivos = fs.readdirSync(pastaConhecimento);

  let base = "";

  arquivos.forEach((arquivo) => {

    if (arquivo.endsWith(".txt")) {

      const conteudo = fs.readFileSync(
        path.join(pastaConhecimento, arquivo),
        "utf8"
      );

      base += `\n\nDOCUMENTO: ${arquivo}\n${conteudo}`;
    }

  });

  return base;
}

export default async function handler(req, res) {

  try {

    const { prompt } = req.body;

    const baseConhecimento = carregarBaseConhecimento();

    const pergunta = `
Utilize a base de conhecimento abaixo para responder.

BASE DE CONHECIMENTO:
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

    console.error(erro);

    res.status(500).json({
      resposta: "Erro ao consultar a IA."
    });

  }

}
