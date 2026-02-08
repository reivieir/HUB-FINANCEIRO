import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERGUNTAS_FREQUENTES } from "../constants";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export const createDexcoChat = async () => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Você é o Dexco Assist. Responda com base nisto: " + JSON.stringify(PERGUNTAS_FREQUENTES)
  });
  return model.startChat({ history: [] });
};

export const extractDataFromImage = async (base64: string) => "Extração em manutenção.";
