export default async function handler(req, res) {

  try {

    const API_KEY = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sem resposta da IA";

    res.status(200).json({ text });

  } catch (error) {

    res.status(500).json({
      error: "Erro no servidor Gemini",
      details: error.message
    });

  }
}
