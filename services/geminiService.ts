// geminiService.ts - Versão Estabilidade Máxima
export const createDexcoChat = async () => {
  const API_KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
  // Trocamos para o modelo PRO que tem 100% de compatibilidade e evita o erro 404
  const MODEL = "gemini-pro"; 
  
  return {
    sendMessage: async (prompt: string) => {
      // Usamos v1beta com gemini-pro para garantir que o Google aceite a chamada
      const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
      
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: `Você é o Dexco Assist da Tesouraria. Responda como um assistente técnico: ${prompt}` }] 
          }]
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        // Se ainda der erro, o sistema vai nos mostrar o motivo real aqui
        throw new Error(errData.error?.message || "Erro de conexão com o servidor");
      }

      const data = await response.json();
      
      // Retorno formatado para o seu App.tsx
      return {
        response: {
          text: () => data.candidates[0].content.parts[0].text
        }
      };
    }
  };
};
