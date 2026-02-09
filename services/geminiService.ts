const GEMINI_API_KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";

export async function gerarResposta(pergunta: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
},
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: pergunta }],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const erro = await response.text();
    throw new Error(erro);
  }

  const data = await response.json();

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "Sem resposta da IA"
  );
}
