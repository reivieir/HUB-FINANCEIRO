import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function createDexcoChat() {

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  return {

    async sendMessage(prompt: string) {

      const result = await model.generateContent(prompt);

      const texto = result.response.text();

      return {
        response: {
          text() {
            return texto;
          }
        }
      };

    }

  };

}
