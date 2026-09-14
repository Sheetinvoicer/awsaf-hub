import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { industry, budget, roas } = await req.json();

    const prompt = `You are a master marketing strategist. A user in the "${industry}" industry with a $${budget} monthly budget just got a predicted ROAS of ${roas}. 
    Write a highly actionable, 5-step execution playbook to guarantee they hit this ROAS. 
    Respond ONLY with a valid JSON object containing an array of strings under the key "steps". 
    Example: {"steps": ["Step 1: Define your core audience...", "Step 2: Allocate 60% of budget to...", etc.]}`;

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
    console.error("PLAYBOOK API ERROR:", error?.message || error);
    return NextResponse.json({ error: "Failed to generate playbook." }, { status: 500 });
  }
}
