export function createDexcoChat() {

  return {

    async sendMessage(prompt: string) {

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });

      const data = await response.json();

      const texto = data?.resposta ?? "Sem resposta da IA";

      return {
        response: {
          text() {
            return texto;
          }
        }
      };

    }

  };

}
