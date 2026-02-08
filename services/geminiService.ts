import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from "../constants";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

const knowledgeBase = `
INFORMAÇÕES DE SUPORTE DEXCO:
FAQs:
${PERGUNTAS_FREQUENTES.map(f => `P: ${f.p}\nR: ${f.r}`).join('\n---\n')}

COMANDOS E TEMPLATES:
${COMANDOS_GEMS.map(c => `Título: ${c.t}\nConteúdo: ${c.c}`).join('\n---\n')}
`;

export const createDexcoChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-1.5-flash', 
    config: {
      systemInstruction: `Você é o Dexco Assist, um assistente especializado do Grupo Dexco. 
      Use a seguinte base de conhecimento para responder dúvidas:
      ${knowledgeBase}
      Formate as respostas usando Markdown.`,
    },
  });
};

export const extractDataFromImage = async (base64Image: string): Promise<string> => {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: [{ parts: [{ text: "Extraia Nome, RG e CPF." }, { inlineData: { mimeType: 'image/png', data: base64Image } }] }],
  });
  return response.text || "Erro na extração.";
};
