import { PERGUNTAS_FREQUENTES } from "../constants";

// Configurações extraídas do seu código funcional [cite: 1, 2]
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
        return { response: { text: () => data.candidates?.[0]?.content?.parts?.[0]?.text || "A IA não retornou resposta." } };
      } catch (err) {
        return { response: { text: () => "Erro de conexão com a IA." } };
      }
    }
  };
};

// FUNÇÃO DE EXTRAÇÃO REVISADA 
export const extractDataFromImage = async (base64: string) => {
  try {
    // Garante a extração limpa do Base64 e do MimeType 
    const parts = base64.split(',');
    if (parts.length < 2) return "Erro: Arquivo de imagem corrompido.";
    
    const mimeType = parts[0].split(':')[1].split(';')[0];
    const base64Data = parts[1];

    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                // Inverti a ordem: Primeiro a imagem, depois a instrução (melhora a leitura da IA)
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
    
    // Tratamento de erro detalhado vindo do Google [cite: 4, 7]
    if (result.error) {
      console.error("Erro Google API:", result.error);
      return `Erro na extração: ${result.error.message}. Tente uma imagem mais nítida ou em formato JPG/PNG.`;
    }

    return result.candidates?.[0]?.content?.parts?.[0]?.text || "Dados não encontrados no documento.";
  } catch (err) {
    console.error("Erro interno:", err);
    return "Erro de conexão ao processar imagem.";
  }
};
