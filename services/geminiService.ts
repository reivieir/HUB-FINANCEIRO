export async function createDexcoChat() {
  return {
    async sendMessage(prompt: string) {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.resposta || "Erro ao consultar IA");
      }

      const data = await response.json();
      
      // Retorna no formato esperado pelo componente AssistenteIA
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
