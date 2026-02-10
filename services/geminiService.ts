export async function gerarResposta(pergunta: string): Promise<string> {
  const KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA"; // Usando direto para teste
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;

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
      return `Erro da Google: ${data.error.message}`;
    }

    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    return "Erro de conexão. Verifique se você tem internet ou se o link da API está bloqueado.";
  }
}
