import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from "../constants";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export const createDexcoChat = () => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash" 
  });
  
  // Iniciamos com histórico vazio para evitar o erro de 'not iterable'
  return model.startChat({
    history: [],
  });
};

export const extractDataFromImage = async (base64Image: string) => {
  return "Extração temporariamente desativada para estabilizar o chat.";
};
