export async function createDexcoChat() {

  return {

    async sendMessage(prompt: string) {

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt
        })
      });

      if (!response.ok) {
        throw new Error("Erro ao consultar IA");
      }

      const data = await response.json();

      return {
        response: {
          text() {
            return data.resposta;
          }
        }
      };

    }

  };

}
