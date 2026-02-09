const GEMINI_API_KEY = "AIzaSyCbNHAT5tsSU3gmkX7hAv8FXh6gxIoV2VA";

export async function gerarResposta(pergunta: string): Promise<string> {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: pergunta })
  });

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
