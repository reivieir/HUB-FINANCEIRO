import { PERGUNTAS_FREQUENTES } from "../constants";

// Configurações validadas por você
const KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
const MODEL = "gemini-3-flash-preview"; // "gemini-2.5-flash";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;

const systemInstruction = "Você é o Dexco Assist. Responda formalmente com base nisto: " + JSON.stringify(PERGUNTAS_FREQUENTES);

export const createDexcoChat = async () => {
  return {
    sendMessage: async (pergunta: string) => {
      try {
        const response = await fetch(URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: pergunta }] }],
            system_instruction: { parts: [{ text: systemInstruction }] }
          }),
        });
        const data: any = await response.json();
        return { response: { text: () => data.candidates?.[0]?.content?.parts?.[0]?.text || "A IA não retornou resposta." } };
      } catch (err) {
        return { response: { text: () => "Erro de conexão com a IA." } };
      }
    }
  };
};

// FUNÇÃO DE EXTRAÇÃO FLEXÍVEL
export const extractDataFromImage = async (base64: string) => {
  try {
    let mimeType = "image/png"; // Padrão caso não seja detectado
    let base64Data = base64;

    // Verifica se a string contém o cabeçalho "data:image/...;base64,"
    if (base64.includes(',')) {
      const parts = base64.split(',');
      mimeType = parts[0].split(':')[1].split(';')[0];
      base64Data = parts[1];
    }

    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data
                }
              },
              { text: "Extraia o Nome, RG e CPF desta imagem. Regras: Nome em MAIÚSCULO. RG e CPF apenas números, sem pontos ou traços." }
            ]
          }
        ]
      }),
    });

    const result: any = await response.json();
    
    if (result.error) {
      console.error("Erro Google API:", result.error);
      return `Erro na extração: ${result.error.message}`;
    }

    return result.candidates?.[0]?.content?.parts?.[0]?.text || "Dados não encontrados no documento.";
  } catch (err: any) {
    console.error("Erro interno:", err);
    return "Erro de conexão ao processar imagem: " + err.message;
  }
};
