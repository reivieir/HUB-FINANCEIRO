export async function gerarResposta(pergunta: string): Promise<string> {
  const KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
  // Ajustado para o nome de modelo correto na v1beta
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${KEY}`;

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

    // Estrutura de resposta do Gemini Pro
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    return "Erro de conexão com a IA.";
  }
}
