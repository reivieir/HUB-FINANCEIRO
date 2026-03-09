// geminiService.ts - Versão Conexão Direta (Bypass 404)
export const createDexcoChat = async () => {
  const API_KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
  const MODEL = "gemini-1.5-flash"; // Modelo mais estável e rápido
  
  // Criamos um simulador do objeto que o seu App.tsx já espera receber
  return {
    sendMessage: async (prompt: string) => {
      // Fazemos a chamada direta para a API estável 'v1' do Google
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ text: prompt }] 
            }],
            generationConfig: {
              maxOutputTokens: 1000,
              temperature: 0.5
            }
          })
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Erro na comunicação com o Google");
      }

      const data = await response.json();
      
      // Retornamos exatamente a estrutura que o seu App.tsx utiliza: result.response.text()
      return {
        response: {
          text: () => data.candidates[0].content.parts[0].text
        }
      };
    }
  };
};
