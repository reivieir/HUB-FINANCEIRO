export async function createDexcoChat() {
  return {
    async sendMessage(prompt: string) {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.resposta || "Erro na consulta");
      }

      return {
        response: {
          text: () => data.resposta
        }
      };
    }
  };
}
