import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERGUNTAS_FREQUENTES } from "../constants";
console.log("API KEY:", import.meta.env.VITE_GEMINI_API_KEY);
/**
 * Validação explícita da API KEY
 */
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "VITE_GEMINI_API_KEY não encontrada. Verifique o arquivo .env na raiz do projeto."
  );
}

/**
 * Instância única do Gemini
 */
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Cria uma sessão de chat contextualizada
 */
export const createDexcoChat = async () => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const chat = await model.startChat({
      history: [],
      systemInstruction: {
        role: "system",
        parts: [
          {
            text: `
Você é o Dexco Assist, um assistente corporativo.
Responda de forma formal, clara e objetiva.
Use como base as informações abaixo (FAQ interno):

${JSON.stringify(PERGUNTAS_FREQUENTES, null, 2)}
            `,
          },
        ],
      },
    });

    return chat;
  } catch (error) {
    console.error("Erro ao inicializar o chat Gemini:", error);
    throw error;
  }
};

/**
 * Extração de dados via imagem (placeholder)
 */
export const extractDataFromImage = async (
  _base64: string
): Promise<string> => {
  return "⚠️ Extração de dados por imagem está temporariamente indisponível.";
};
