import { GoogleGenerativeAI } from "@google/generative-ai";

// CHAVE INJETADA DIRETAMENTE
const API_KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
const genAI = new GoogleGenerativeAI(API_KEY);

export const createDexcoChat = async () => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Você é o Dexco Assist, assistente da Tesouraria Dexco. Responda de forma curta."
    });

    // Inicia o chat sem histórico para ser mais rápido
    return model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 1000 },
    });
  } catch (error) {
    console.error("Falha na inicialização:", error);
    return null;
  }
};
