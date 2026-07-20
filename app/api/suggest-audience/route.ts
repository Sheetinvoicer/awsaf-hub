import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({ apiKey: "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" });

export async function POST(req: Request) {
  try {
    const { product } = await req.json();

    if (!product) return NextResponse.json({ audiences: [] });

    const prompt = `You are a master market researcher. A user wants to market the product: "${product}". 
    Suggest 5 highly specific, distinct target audiences or focus groups (including geography if relevant) that would be perfect for this product.
    Respond ONLY with a valid JSON object using exactly this key: {"audiences": ["Audience 1", "Audience 2", "Audience 3", "Audience 4", "Audience 5"]}.`;

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
    console.error("SUGGESTION API ERROR:", error);
    return NextResponse.json({ error: "Failed to get suggestions." }, { status: 500 });
  }
}