// services/geminiService.ts
// Integração Gemini API para o Dexco Assist

export const createDexcoChat = async () => {

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash";

  if (!API_KEY) {
    throw new Error("API KEY do Gemini não encontrada. Configure VITE_GEMINI_API_KEY.");
  }

  return {
    sendMessage: async (prompt: string) => {

      const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

      try {

        const response = await fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
Você é o Dexco Assist, assistente técnico da Tesouraria da Dexco.

Regras de resposta:
- Responder de forma objetiva e profissional
- Priorizar assuntos de tesouraria, risco sacado e bancos
- Se a pergunta não for relacionada ao tema, informe que está fora do escopo

Pergunta do usuário:
${prompt}
                    `
                  }
                ]
              }
            ]
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error?.message || "Erro na comunicação com Gemini API"
          );
        }

        const text =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Não foi possível gerar resposta.";

        return {
          response: {
            text: () => text
          }
        };

      } catch (error: any) {

        console.error("Erro Gemini:", error);

        throw new Error(
          error.message || "Falha ao consultar a IA."
        );

      }
    }
  };
};
