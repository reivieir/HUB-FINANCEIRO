import { PERGUNTAS_FREQUENTES } from "../constants";

// Configurações da API validadas [cite: 1, 2]
const KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
const MODEL = "gemini-2.5-flash";
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
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "A IA não retornou uma resposta válida.";
        return { response: { text: () => textResponse } };
      } catch (err: any) {
        return { response: { text: () => "Erro de conexão com a IA." } };
      }
    }
  };
};

// FUNÇÃO DE EXTRAÇÃO ATIVADA 
export const extractDataFromImage = async (base64: string) => {
  try {
    // Separa o cabeçalho do conteúdo base64 (ex: data:image/png;base64,...)
    const [header, data] = base64.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';

    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: "Extraia desta imagem o Nome, RG e CPF. Regras: O nome deve estar todo em MAIÚSCULO. O RG e o CPF devem conter apenas números, sem pontos, traços ou formatação." },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: data
                }
              }
            ]
          }
        ]
      }),
    });

    const result: any = await response.json();
    
    if (result.error) {
      return `Erro na extração: ${result.error.message}`;
    }

    return result.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível identificar os dados na imagem.";
  } catch (err) {
    console.error("Erro no processamento da imagem:", err);
    return "Ocorreu um erro ao tentar processar a imagem.";
  }
};
