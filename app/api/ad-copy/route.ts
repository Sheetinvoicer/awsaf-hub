import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { product, platform } = await req.json();

    if (!product || !platform) {
      return NextResponse.json({ error: "Missing product or platform" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `You are an expert direct-response copywriter for ${platform}. 
Write ad copy for a DTC product: "${product}". 
Respond ONLY with a valid JSON object using exactly these keys:
{
  "headlines": ["Headline 1", "Headline 2", "Headline 3"],
  "bodyTexts": ["Body text 1...", "Body text 2..."],
  "cta": "Shop Now"
}`;

    console.log("Calling Gemini with gemini-3.6-flash...");

    const result = await model.generateContent(prompt);
    const rawContent = result.response.text();

    let jsonString = rawContent;
    if (rawContent.includes("{")) {
      jsonString = rawContent.substring(rawContent.indexOf("{"), rawContent.lastIndexOf("}") + 1);
    }

    const parsed = JSON.parse(jsonString);

    console.log("Gemini response:", parsed);

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("AD COPY API ERROR:", error?.message || error);
    return NextResponse.json({
      error: "Failed to generate ad copy.",
      details: error?.message || "Unknown error"
    }, { status: 500 });
  }
}
