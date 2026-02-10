export async function gerarResposta(pergunta: string): Promise<string> {
  const KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
  // Mudamos para v1 e para o modelo gemini-1.5-flash (que é o padrão atual)
  const URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${KEY}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: pergunta }] }]
      } ),
    });

    const data = await response.json();
    
    if (data.error) {
      // Se der erro de "not found" de novo, tentaremos o modelo gemini-1.5-pro
      return `Erro da API: ${data.error.message}`;
    }

    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    return "Erro de conexão com os servidores da Google.";
  }
}
