export async function gerarResposta(pergunta: string): Promise<string> {
  const KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
  
  // Vamos tentar o modelo que a Google está forçando agora para novos usuários
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${KEY}`;

  try {
    // Diagnóstico automático: Lista os modelos no console sempre que houver erro
    const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${KEY}` );
    const listData = await listResponse.json();
    console.log("--- MODELOS DISPONÍVEIS NA SUA CHAVE ---");
    console.log(listData);

    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: pergunta }] }]
      }),
    });

    const data: any = await response.json();
    
    if (data.error) {
      return `Erro: ${data.error.message}. Verifique o Console (F12) para ver os modelos permitidos.`;
    }

    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    return "Erro de conexão.";
  }
}
