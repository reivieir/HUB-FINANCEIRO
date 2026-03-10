export const createDexcoChat = async () => {

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-pro";

  return {
    sendMessage: async (prompt: string) => {

      const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

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
                  text: `Você é o Dexco Assist da Tesouraria. Responda tecnicamente: ${prompt}`
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Erro na API Gemini");
      }

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sem resposta da IA.";

      return {
        response: {
          text: () => text
        }
      };
    }
  };
};
