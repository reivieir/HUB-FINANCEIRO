import { GoogleGenerativeAI } from "@google/generative-ai";

// CHAVE INJETADA DIRETAMENTE (PARA EVITAR ERRO DE .ENV)
const API_KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
const genAI = new GoogleGenerativeAI(API_KEY);

export const createDexcoChat = async () => {
  try {
    // Usando 'gemini-pro' que é o modelo mais estável para bibliotecas antigas
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro" 
    });

    return model.startChat({
      history: [],
      generationConfig: { 
        maxOutputTokens: 1000,
        temperature: 0.5 
      },
    });
  } catch (error) {
    console.error("Erro na inicialização:", error);
    return null;
  }
};
