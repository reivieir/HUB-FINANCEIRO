import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash";

const genAI = new GoogleGenerativeAI(API_KEY);

export const createDexcoChat = async () => {
  try {
    if (!API_KEY) return null;

    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      systemInstruction: "Você é o Dexco Assist, assistente da Tesouraria Dexco. Responda de forma curta e técnica."
    });

    return model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 1000, temperature: 0.5 },
    });
  } catch (error) {
    return null;
  }
};
