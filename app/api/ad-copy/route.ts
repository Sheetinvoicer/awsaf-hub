import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { product, platform } = await req.json();

    const prompt = `You are an expert direct-response copywriter for ${platform}. 
    Write ad copy for a DTC product: "${product}". 
    Respond ONLY with a valid JSON object using exactly these keys:
    {
      "headlines": ["Headline 1", "Headline 2", "Headline 3"],
      "bodyTexts": ["Body text 1...", "Body text 2..."],
      "cta": "Shop Now"
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const rawContent = completion.choices[0]?.message?.content || "{}";
    let jsonString = rawContent;
    if (rawContent.includes("{")) {
      jsonString = rawContent.substring(rawContent.indexOf("{"), rawContent.lastIndexOf("}") + 1);
    }

    const result = JSON.parse(jsonString);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("AD COPY API ERROR:", error);
    return NextResponse.json({ error: "Failed to generate ad copy." }, { status: 500 });
  }
}