import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { step, data } = await req.json();

    if (!userId) {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      let guest = await prisma.guestUsage.upsert({
        where: { ipAddress: ip },
        update: {},
        create: { ipAddress: ip }
      });

      if (guest.lastReset < twentyFourHoursAgo) {
        guest = await prisma.guestUsage.update({
          where: { id: guest.id },
          data: { apiCalls: 0, lastReset: new Date() }
        });
      }

      if (guest.apiCalls >= 5) {
        return NextResponse.json(
          { error: 'GUEST_LIMIT_REACHED', message: 'You have used your free guest analysis. Sign up to generate more reports.' },
          { status: 403 }
        );
      }

      await prisma.guestUsage.update({
        where: { id: guest.id },
        data: { apiCalls: { increment: 1 } }
      });
    }

    let prompt = '';

    if (step === 1) {
      prompt = `You are an expert global market researcher helping a founder launch a product.

PRODUCT: "${data.product}"
TARGET MARKET / GEOGRAPHY: "${data.audience}"

CRITICAL RULES (do not break these):
1. GEOGRAPHY FIRST: The target market "${data.audience}" is the PRIMARY constraint. All suggested audiences, channels, and marketing routes MUST be relevant to that specific geography. If the product name is in a different language (Arabic, Chinese, etc.), DO NOT assume the target market is that language's country — the geography input wins.
2. If the product and the target market seem unrelated (e.g., selling tea to a taxi business), do NOT ignore it. Instead, interpret it intelligently — find the most logical way the product could serve that audience, and explain the angle.
3. Be specific. Name real platforms, real communities, real websites that exist and are used in that geography.
4. Do NOT hallucinate platform names. If unsure, use widely-known ones (Google, Meta, LinkedIn, TikTok, Reddit, X).

Respond ONLY with a valid JSON object using exactly these keys:
{
  "best_route": "The single best marketing platform for THIS product in THIS geography, with a short justification",
  "audience_persona": "A 1-sentence description of the exact person to target (must match the geography)",
  "marketing_angles": ["Angle 1 relevant to this geography", "Angle 2", "Angle 3"],
  "channels_to_check": ["Real website/community 1", "Real website/community 2", "Real website/community 3"]
}`;
    } else if (step === 2) {
      prompt = `You are an elite SEO strategist. Based on the product "${data.product}", the target audience in "${data.audience}", and the chosen marketing route "${data.best_route}", create a targeted SEO plan.
      Respond ONLY with a valid JSON object using exactly these keys:
      {
        "primary_keywords": ["Keyword 1", "Keyword 2", "Keyword 3"],
        "content_strategy": "A 2-sentence strategy on what blog or landing page content to write.",
        "expected_timeline": "How long it will take to rank (e.g., 3-6 months).",
        "blog_titles": ["SEO Blog Title 1", "SEO Blog Title 2"],
        "landing_page_titles": ["High-Converting LP Title 1", "High-Converting LP Title 2"]
      }`;
    } else if (step === 3) {
      prompt = `You are a master media buyer. The user is running ads on "${data.platform}" for their product "${data.product}" in "${data.audience}". They are using an SEO plan targeting keywords like "${data.keywords}".
      Respond ONLY with a valid JSON object using exactly these keys:
      {
        "expected_roas": "A number like 3.5x or 4.2x",
        "expected_cpa": "An estimated dollar amount like $25.00",
        "justification": "A 1-sentence explanation of why this ROAS makes sense given the platform and audience."
      }`;
    } else if (step === 4) {
      prompt = `You are an elite business strategist and analyst. Analyze the market and competition for a product: "${data.product}" targeting "${data.audience}". 
      Respond ONLY with a valid JSON object using exactly these keys:
      {
        "market_size": "Estimated market size or potential",
        "market_trends": ["Trend 1", "Trend 2", "Trend 3"],
        "market_challenges": ["Challenge 1", "Challenge 2"],
        "top_competitors": [
          { "name": "Competitor 1 Name", "strengths": "Their main strength", "weaknesses": "Their main weakness" },
          { "name": "Competitor 2 Name", "strengths": "Their main strength", "weaknesses": "Their main weakness" }
        ]
      }`;
    } else if (step === 5) {
      prompt = `You are a Chief Financial Officer and Operations Director. 
      The user is launching "${data.product}" for "${data.audience}".
      Create a COMPREHENSIVE business budget analysis that covers ALL aspects of the business, not just marketing. 
      - If it is a software/SaaS product, include development costs, cloud infrastructure/hosting, and maintenance.
      - If it is a physical product, include manufacturing, shipping, and inventory costs.
      - Always include Marketing/Ads, Tools/Software, and Operations/Legal costs.
      Respond ONLY with a valid JSON object using exactly these keys:
      {
        "total_min_budget": "$X,XXX",
        "total_max_budget": "$X,XXX",
        "budget_breakdown": [
          { "category": "Development/Production", "min_cost": "$X", "max_cost": "$Y" },
          { "category": "Infrastructure/Hosting", "min_cost": "$X", "max_cost": "$Y" },
          { "category": "Marketing/Ads", "min_cost": "$X", "max_cost": "$Y" },
          { "category": "Operations/Legal", "min_cost": "$X", "max_cost": "$Y" }
        ],
        "launch_phases": [
          { "phase_name": "Phase 1: Foundation & Build (Days 1-7)", "action_items": ["Action 1", "Action 2", "Action 3"] },
          { "phase_name": "Phase 2: Testing & Creative (Days 8-14)", "action_items": ["Action 1", "Action 2", "Action 3"] },
          { "phase_name": "Phase 3: Pre-Launch & Optimization (Days 15-21)", "action_items": ["Action 1", "Action 2", "Action 3"] },
          { "phase_name": "Phase 4: Launch & Scale (Days 22-30)", "action_items": ["Action 1", "Action 2", "Action 3"] }
        ]
      }`;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const aiResult = await model.generateContent(prompt);
    const rawContent = aiResult.response.text();
    let jsonString = rawContent;
    if (rawContent.includes('{')) {
      jsonString = rawContent.substring(rawContent.indexOf('{'), rawContent.lastIndexOf('}') + 1);
    }

    const result = JSON.parse(jsonString);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('GROWTH ENGINE ERROR:', error?.message || error);
    return NextResponse.json({ error: 'Failed to process step.' }, { status: 500 });
  }
}
