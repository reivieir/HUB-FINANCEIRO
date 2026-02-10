export async function gerarResposta(pergunta: string): Promise<string> {
  // Use VITE_ para variáveis de ambiente ou a string direta para teste
  const KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA"; 
  
  // A URL correta para a versão v1beta com o modelo gemini-pro
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

    // Retorna o texto da resposta
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    return "Erro de conexão: Verifique sua internet ou se a API Key é válida.";
  }
}
