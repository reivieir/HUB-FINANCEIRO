// Usando variável de ambiente para segurança (Vite)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";

export async function gerarResposta(pergunta: string): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: pergunta }],
            },
          ],
        } ),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Erro na API");
    }

    const data = await response.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Desculpe, não consegui gerar uma resposta."
    );
  } catch (error) {
    console.error("Erro no GeminiService:", error);
    return "Ocorreu um erro ao conectar com a IA. Verifique sua conexão ou chave de API.";
  }
}
