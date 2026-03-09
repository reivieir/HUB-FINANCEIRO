export async function gerarResposta(pergunta: string): Promise<string> {
  const KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
  // O modelo exato que vimos no seu console: gemini-2.5-flash
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: pergunta }]
          }
        ]
      } ),
    });

    const data: any = await response.json();
    
    if (data.error) {
      return `Erro da API: ${data.error.message}`;
    }

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    return "A IA não retornou uma resposta válida.";
  } catch (err) {
    return "Erro de conexão com a IA.";
  }
}
