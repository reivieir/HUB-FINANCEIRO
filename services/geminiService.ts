import { PERGUNTAS_FREQUENTES } from "../constants";

// Chave e modelo validados no seu teste [cite: 1, 2]
const KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
const MODEL = "gemini-2.5-flash";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;

// Mantemos a instrução de sistema para que a IA use o seu FAQ 
const systemInstruction = "Você é o Dexco Assist. Responda formalmente com base nisto: " + JSON.stringify(PERGUNTAS_FREQUENTES);

export const createDexcoChat = async () => {
  // Retornamos um objeto que "imita" a biblioteca oficial para não quebrar o App.tsx 
  return {
    sendMessage: async (pergunta: string) => {
      try {
        const response = await fetch(URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: pergunta }]
              }
            ],
            // Injetamos a instrução de sistema no corpo da requisição 
            system_instruction: {
              parts: [{ text: systemInstruction }]
            }
          }),
        });

        const data: any = await response.json();

        if (data.error) {
          throw new Error(data.error.message);
        }

        // Extraímos o texto da resposta conforme a estrutura do JSON [cite: 5]
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "A IA não retornou uma resposta válida.";

        // Devolvemos no formato que o seu App.tsx espera (objeto.response.text())
        return {
          response: {
            text: () => textResponse
          }
        };
      } catch (err: any) {
        console.error("Erro na comunicação com Gemini:", err);
        return {
          response: {
            text: () => "Erro de conexão com a IA: " + err.message
          }
        };
      }
    }
  };
};

export const extractDataFromImage = async (base64: string) => "Extração em manutenção.";
