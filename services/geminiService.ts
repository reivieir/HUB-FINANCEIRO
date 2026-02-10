const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";

export async function gerarResposta(pergunta: string): Promise<string> {
  console.log("Iniciando chamada para Gemini...");
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: pergunta }]
          }]
        } ),
      }
    );

    const data = await response.json();
    console.log("Resposta bruta da API:", data);

    if (!response.ok) {
      console.error("Erro na API Gemini:", data.error);
      return `Erro da API: ${data.error?.message || 'Erro desconhecido'}`;
    }

    // O Gemini 1.5 Flash/Pro tem essa estrutura de retorno
    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!texto) {
      console.error("Estrutura de resposta inesperada:", data);
      return "A IA respondeu, mas o formato está vazio ou incorreto.";
    }

    return texto;

  } catch (error) {
    console.error("Erro catastrófico no fetch:", error);
    return "Erro de conexão: Não foi possível alcançar os servidores da Google.";
  }
}
