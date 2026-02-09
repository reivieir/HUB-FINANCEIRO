const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function gerarResposta(pergunta: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
