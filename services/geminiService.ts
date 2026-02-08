import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from "../constants";

// O Vite exige o prefixo VITE_ para ler a chave configurada no Vercel
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

const knowledgeBase = `
BASE DE CONHECIMENTO DEXCO:
${PERGUNTAS_FREQUENTES.map(f => `P: ${f.p}\nR: ${f.r}`).join('\n')}
`;

export const createDexcoChat = () => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", // Modelo estável conforme sua imagem
    systemInstruction: "Você é o Dexco Assist. Responda com base nisto: " + knowledgeBase 
  });
  
  return model.startChat({
    history: [], // Começa com o histórico vazio para evitar erros de iteração iniciais
  });
};
