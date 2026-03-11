import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ Export default handler compatível com App Router
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt) {
      return NextResponse.json({ resposta: "Prompt vazio" }, { status: 400 });
    }

    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = client.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });

    const result: any = await model.generate({ prompt });

    const texto =
      result.output_text ?? result.output?.[0]?.content?.[0]?.text ?? "Sem resposta";

    return NextResponse.json({ resposta: texto });
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    return NextResponse.json({ resposta: "Erro ao consultar IA" }, { status: 500 });
  }
}
