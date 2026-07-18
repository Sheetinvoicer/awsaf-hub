import { NextResponse } from 'next/server';
import OpenAI from 'openai';
export const dynamic = 'force-dynamic';

// Key hardcoded for testing (Change this later!)
const openai = new OpenAI({ apiKey: "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" });

export async function POST(req: Request) {
  try {
    const { industry, budget, roas } = await req.json();

    const prompt = `You are a master marketing strategist. A user in the "${industry}" industry with a $${budget} monthly budget just got a predicted ROAS of ${roas}. 
    Write a highly actionable, 5-step execution playbook to guarantee they hit this ROAS. 
    Respond ONLY with a valid JSON object containing an array of strings under the key "steps". 
    Example: {"steps": ["Step 1: Define your core audience...", "Step 2: Allocate 60% of budget to...", etc.]}`;

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
    console.error("PLAYBOOK API ERROR:", error);
    return NextResponse.json({ error: "Failed to generate playbook." }, { status: 500 });
  }
}