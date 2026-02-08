import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from "../constants";

// Lê a chave configurada no painel da Vercel
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

const knowledgeBase = `
BASE DE CONHECIMENTO DEXCO:
${PERGUNTAS_FREQUENTES.map(f => `P: ${f.p}\nR: ${f.r}`).join('\n')}
`;

export const createDexcoChat = () => {
  // 'gemini-1.5-flash' é o modelo atual. Se der 404, use 'gemini-pro'
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Você é o Dexco Assist. Use esta base: " + knowledgeBase 
  });
  return model.startChat();
};

// Função simplificada para evitar erros de compilação iniciais
export const extractDataFromImage = async (base64Image: string) => {
  return "Função de imagem em manutenção. Use o chat por enquanto.";
};
