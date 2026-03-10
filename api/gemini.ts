export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  try {

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        erro: "API KEY não configurada"
      });
    }

    const { prompt } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const texto =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sem resposta da IA";

    return res.status(200).json({
      resposta: texto
    });

  } catch (erro) {

    return res.status(500).json({
      erro: "Erro ao consultar Gemini",
      detalhe: erro.message
    });

  }
}
