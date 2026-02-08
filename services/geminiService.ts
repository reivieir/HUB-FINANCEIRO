import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from "../constants";

// O Vite exige o prefixo VITE_ para ler a chave no Vercel
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
  // Alterado para 'gemini-pro', que é o nome mais estável para evitar o erro 404
  const model = genAI.getGenerativeModel({ 
    model: "gemini-pro", 
    systemInstruction: `Você é o Dexco Assist, um assistente especializado do Grupo Dexco. 
    Use a seguinte base de conhecimento para responder dúvidas:
    ${knowledgeBase}
    
    Diretrizes:
    1. Seja sempre formal, educado e direto.
    2. Priorize as informações da base de conhecimento fornecida.
    3. Formate as respostas usando Markdown para melhor leitura.`,
  });
  
  return model.startChat();
};

export const extractDataFromImage = async (base64Image: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  
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
  return response.text() || "Não foi possível extrair os dados.";
};
