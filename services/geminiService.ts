import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { PERGUNTAS_FREQUENTES, COMANDOS_GEMS } from "../constants";

// O Vite exige 'import.meta.env' e o prefixo 'VITE_' para ler a chave no Vercel
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
    // Alterado para um modelo estável para evitar erros de versão
    model: 'gemini-1.5-flash', 
    config: {
      systemInstruction: `Você é o Dexco Assist, um assistente especializado do Grupo Dexco. 
      Use a seguinte base de conhecimento para responder dúvidas:
      ${knowledgeBase}
      
      Diretrizes:
      1. Seja sempre formal, educado e direto.
      2. Priorize as informações da base de conhecimento acima.
      3. Se o usuário pedir para gerar um template (como "Cadastro Aprovado"), use exatamente o texto dos comandos fornecidos.
      4. Se a informação não estiver na base, oriente a procurar o comprador parceiro ou a tesouraria.
      5. Formate as respostas usando Markdown para melhor leitura.`,
    },
  });
};

export const extractDataFromImage = async (base64Image: string): Promise<string> => {
  const prompt = `Extraia o Nome completo, o RG e o CPF desta imagem seguindo rigorosamente estas regras:
  
  1. O formato de saída deve ser exatamente:
     Nome: [NOME EM MAIÚSCULO]
     RG: [APENAS NÚMEROS]
     CPF: [APENAS NÚMEROS]
  
  2. NUNCA use asteriscos (*) ou negritos (**).
  3. O Nome deve estar totalmente em MAIÚSCULO.
  4. RG e CPF não devem conter pontos, traços ou espaços.
  5. Retorne apenas as 3 linhas de texto limpo, sem introduções ou conclusões.`;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Image,
            },
          },
        ],
      },
    ],
  });

  const rawText = response.text || "";
  const cleanText = rawText
    .replace(/\*/g, "") 
    .replace(/#/g, "")  
    .replace(/`/g, "")  
    .trim();
  
  return cleanText || "Não foi possível extrair os dados da imagem.";
};
