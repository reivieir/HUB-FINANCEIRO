// Use require para evitar problemas de importação de módulos no runtime da Vercel
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { prompt } = req.body;
    // IMPORTANTE: Use o nome EXATO que você colocou no painel da Vercel
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ resposta: "Erro: Chave API não encontrada no servidor." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ resposta: text });
  } catch (error) {
    return res.status(500).json({ resposta: "Erro na IA: " + error.message });
  }
};
