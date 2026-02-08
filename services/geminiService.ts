import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERGUNTAS_FREQUENTES } from "../constants";

// Pega a chave do ambiente configurada no Vercel
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export const createDexcoChat = async () => {
  if (!API_KEY) {
    console.error("Chave API (VITE_GEMINI_API_KEY) não encontrada!");
    return null;
  }

  try {
    // Definimos o modelo e a instrução de sistema de forma explícita
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // Nome estável do modelo
    });

    // Iniciamos o chat com a instrução de sistema separada para maior estabilidade
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
