import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERGUNTAS_FREQUENTES } from "../constants";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const createDexcoChat = async () => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    return model.startChat({
      history: [],
      systemInstruction: {
        role: "system",
        parts: [{ text: "Você é o Dexco Assist. Responda formalmente com base nisto: " + JSON.stringify(PERGUNTAS_FREQUENTES) }]
      }
    });
  } catch (error) {
    console.error("Erro ao carregar Gemini:", error);
    return null;
  }
};

export const extractDataFromImage = async (base64: string) => "Extração em manutenção.";
