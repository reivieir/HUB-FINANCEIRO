import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERGUNTAS_FREQUENTES } from "../constants";

// O Vite exige 'import.meta.env' para ler a chave configurada no Vercel
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const createDexcoChat = async () => {
  try {
    // Usamos o modelo 'gemini-1.5-flash' que é o mais rápido e compatível
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Você é o Dexco Assist. Responda formalmente com base nisto: " + JSON.stringify(PERGUNTAS_FREQUENTES)
    });

    // Iniciamos o chat sem histórico para evitar erros de iteração
    return model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
  } catch (error) {
    console.error("Erro ao criar chat:", error);
    return null;
  }
};

export const extractDataFromImage = async (base64: string) => "Extração em manutenção.";
