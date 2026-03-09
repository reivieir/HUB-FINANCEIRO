export async function gerarResposta(pergunta: string): Promise<string> {
  const KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // ADICIONAMOS AQUI O "APRENDIZADO" DO SEU GEM
        systemInstruction: {
          parts: [{ 
            text: "Você é o Dexco Assist. Suas regras são: [COLE AQUI AS REGRAS DO SEU GEM]. Responda sempre de forma profissional e use o contexto da Dexco." 
          }]
        },
        contents: [{ parts: [{ text: pergunta }] }]
      } ),
    });
    // ... restante do código igual ...
