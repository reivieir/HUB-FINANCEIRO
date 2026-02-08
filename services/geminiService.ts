import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from "../constants";

// O Vite exige 'import.meta.env' e o prefixo 'VITE_' para ler a chave na Vercel
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

const knowledgeBase = `
INFORMAÇÕES DE SUPORTE DEXCO:
FAQs:
${PERGUNTAS_FREQUENTES.map(f => `P: ${f.p}\nR: ${f.r}`).join('\n---\n')}

COMANDOS E TEMPLATES:
${COMANDOS_GEMS.map(c => `Título: ${c.t}\nConteúdo: ${c.c}`).join('\n---\n')}
`;

export const createDexcoChat = () => {
  // Usando o modelo 'gemini-1.5-flash' que é rápido e estável
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `Você é o Dexco Assist, assistente do Grupo Dexco. 
    Use apenas esta base de conhecimento para responder:
    ${knowledgeBase}
    
    Regras:
    1. Seja formal e direto.
    2. Se não souber, oriente a procurar o comprador ou tesouraria.
    3. Use Markdown para formatar a resposta.`
  });

  return model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });
};

export const extractDataFromImage = async (base64Image: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "Extraia Nome completo, RG e CPF desta imagem. Retorne apenas os dados limpos.",
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      },
    ]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Erro na extração:", error);
    return "Não foi possível extrair os dados da imagem.";
  }
};
