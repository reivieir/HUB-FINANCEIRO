import { GoogleGenerativeAI } from "@google/generative-ai";

// Injetando a chave diretamente para ignorar falhas de leitura do .env
const API_KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
const MODEL_NAME = "gemini-1.5-flash"; // ID técnico estável para o Google

const genAI = new GoogleGenerativeAI(API_KEY);

export const createDexcoChat = async () => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      systemInstruction: "Você é o Dexco Assist, assistente técnico da Tesouraria Dexco. Responda de forma executiva, direta e curta."
    });

    return model.startChat({
      history: [],
      generationConfig: { 
        maxOutputTokens: 1000, 
        temperature: 0.5 
      },
    });
  } catch (error) {
    console.error("Erro interno na conexão Google:", error);
    return null;
  }
};
