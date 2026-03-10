export async function perguntarIA(pergunta: string): Promise<string> {

  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: pergunta
    })
  });

  if (!response.ok) {
    throw new Error("Erro ao consultar IA");
  }

  const data = await response.json();

  return data.resposta as string;
}
