import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

const openai = new OpenAI({ apiKey: "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" });

export async function POST(req: Request) {
  try {
    const { tool, data, clerkId, email } = await req.json();

    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let prompt = "";
    if (tool === "roas") {
      prompt = `You are an expert marketing analyst. Based on Industry: ${data.industry} and Monthly Ad Budget: $${data.budget}, estimate the ROAS, break-even CPA, and give a 1-sentence advice. Respond ONLY with a valid JSON object using these keys: "roas", "cpa", "advice". Example: {"roas": "4.2x", "cpa": "$35", "advice": "Increase budget by 10%."}`;
    } else if (tool === "influencer") {
      prompt = `You are an influencer marketing expert. Platform: ${data.platform}, Followers: ${data.followers}. Calculate the fair market price for a single sponsored post. Respond ONLY with a valid JSON object using these keys: "price", "advice". Example: {"price": "$1200", "advice": "Negotiate usage rights."}`;
    } else if (tool === "seo") {
      prompt = `You are an SEO expert. Estimate the monthly search volume, difficulty (Low/Medium/High), and average CPC for the keyword: "${data.keyword}". Respond ONLY with a valid JSON object using these keys: "volume", "difficulty", "cpc", "advice".`;
    } else if (tool === "trends") {
      prompt = `You are a US market trend analyst. Identify the top 3 emerging consumer trends in the "${data.category}" category right now. Respond ONLY with a valid JSON object using these keys: "trend1", "trend2", "trend3", "advice".`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const rawContent = completion.choices[0]?.message?.content || "{}";
    let jsonString = rawContent;
    if (rawContent.includes("{")) {
      jsonString = rawContent.substring(rawContent.indexOf("{"), rawContent.lastIndexOf("}") + 1);
    }

    const result = JSON.parse(jsonString);

    // Save to Neon Database using Prisma (Module 8.1)
    await prisma.searchHistory.create({
      data: {
        userId: clerkId,
        tool: tool,
        input: JSON.stringify(data),
        output: JSON.stringify(result)
      }
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("API CRASHED:", error);
    return NextResponse.json({ 
      error: error.message || "Something went wrong on the server."
    }, { status: 500 });
  }
}