import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from "../constants";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const knowledgeBase = `
DADOS DEXCO:
${PERGUNTAS_FREQUENTES.map(f => `P: ${f.p}\nR: ${f.r}`).join('\n')}
`;

export const createDexcoChat = async () => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Você é o Dexco Assist, assistente do Grupo Dexco. Use esta base: " + knowledgeBase
  });
  return model.startChat({ history: [] });
};

export const extractDataFromImage = async (base64: string) => "Extração em manutenção.";
