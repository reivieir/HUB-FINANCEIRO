import { GoogleGenerativeAI } from "@google/generative-ai";

// CHAVE ATIVA
const API_KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
const genAI = new GoogleGenerativeAI(API_KEY);

export const createDexcoChat = async () => {
  try {
    // Trocamos para o ID mais estável que evita o erro 404
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    return model.startChat({
      history: [],
      generationConfig: { 
        maxOutputTokens: 1000,
        temperature: 0.4 
      },
    });
  } catch (error) {
    console.error("Erro na inicialização:", error);
    return null;
  }
};
