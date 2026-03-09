import { GoogleGenerativeAI } from "@google/generative-ai";

// Busca as informações do seu cofre .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-3-flash";

const genAI = new GoogleGenerativeAI(API_KEY);

export const createDexcoChat = async () => {
  try {
    if (!API_KEY) {
      console.error("ERRO: API Key não encontrada no .env");
      return null;
    }

    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      // Aqui você vai colar o conteúdo do seu DOCX futuramente
      systemInstruction: "Você é o Dexco Assist, assistente técnico da Tesouraria Dexco. Responda de forma executiva e direta."
    });

    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    console.log("SISTEMA: Conexão estabelecida com o modelo", MODEL_NAME);
    return chat;
  } catch (error) {
    console.error("SISTEMA: Falha ao conectar com o Google AI:", error);
    return null;
  }
};
