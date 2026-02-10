export async function gerarResposta(pergunta: string): Promise<string> {
  const KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
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
    if (data.error) return `Erro: ${data.error.message}`;
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    return "Erro de conexão com a IA.";
  }
}

// Função de diagnóstico para você ver no Console (F12)
export async function listarModelos() {
  const KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
  const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${KEY}`;
  try {
    const r = await fetch(URL );
    const d = await r.json();
    console.log("Modelos:", d);
  } catch (e) {
    console.error(e);
  }
}
