import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { product } = await req.json();

    if (!product) return NextResponse.json({ audiences: [] });

    const prompt = `You are a master market researcher. A user wants to market the product: "${product}". 
    Suggest 5 highly specific, distinct target audiences or focus groups (including geography if relevant) that would be perfect for this product.
    Respond ONLY with a valid JSON object using exactly this key: {"audiences": ["Audience 1", "Audience 2", "Audience 3", "Audience 4", "Audience 5"]}.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const aiResult = await model.generateContent(prompt);
    const rawContent = aiResult.response.text();
    let jsonString = rawContent;
    if (rawContent.includes("{")) {
      jsonString = rawContent.substring(rawContent.indexOf("{"), rawContent.lastIndexOf("}") + 1);
    }

    const result = JSON.parse(jsonString);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("SUGGESTION API ERROR:", error?.message || error);
    return NextResponse.json({ error: "Failed to get suggestions." }, { status: 500 });
  }
}
