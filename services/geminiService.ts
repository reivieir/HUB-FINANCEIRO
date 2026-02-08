import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from "../constants";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

const knowledgeBase = `
BASE DE CONHECIMENTO DEXCO:
${PERGUNTAS_FREQUENTES.map(f => `P: ${f.p}\nR: ${f.r}`).join('\n')}
`;

export const createDexcoChat = () => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash" 
  });
  
  return model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Você é o Dexco Assist. Responda com base nisto: " + knowledgeBase }],
      },
      {
        role: "model",
        parts: [{ text: "Entendido. Sou o Dexco Assist e estou pronto para ajudar." }],
      },
    ],
  });
};

export const extractDataFromImage = async (base64Image: string) => {
  return "Função em manutenção.";
};
