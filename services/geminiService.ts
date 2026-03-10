export const createDexcoChat = async () => {

  return {
    sendMessage: async (prompt: string) => {

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      });

      const data = await response.json();

      const text = data?.text || "Sem resposta da IA";

      return {
        response: {
          text: () => text
        }
      };
    }
  };
};
