import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERGUNTAS_FREQUENTES } from "../constants";

// O Vite exige 'import.meta.env' para ler a chave configurada no Vercel
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export const createDexcoChat = async () => {
  if (!API_KEY) {
    console.error("ERRO: Chave API VITE_GEMINI_API_KEY não encontrada no ambiente.");
    return null;
  }

  try {
    // Definimos o modelo de forma explícita
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // Modelo estável
    });

    // Iniciamos o chat passando as instruções de sistema de forma separada
    return model.startChat({
      history: [],
      systemInstruction: {
        role: "system",
        parts: [{ text: "Você é o Dexco Assist. Responda formalmente com base nisto: " + JSON.stringify(PERGUNTAS_FREQUENTES) }]
      }
    });
  } catch (error) {
    console.error("Erro ao inicializar o chat Gemini:", error);
    return null;
  }
};

export const extractDataFromImage = async (base64: string) => "Extração em manutenção.";
