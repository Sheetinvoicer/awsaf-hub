import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { product, audience, industry, keyword, budget, clerkId, email } = await req.json();
    const numBudget = parseFloat(budget);

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prompt = `You are a ruthless, highly practical DTC E-Commerce Growth Master. 
    Stop writing fluffy marketing essays. 
    Create a hard-hitting, immediately actionable 5-Step Execution Plan for a DTC brand launching "${product}" in the "${industry}" space.
    Target Audience: ${audience}.
    Primary SEO Keyword: ${keyword}.
    Monthly Ad Budget: $${budget}.

    Respond ONLY with a valid JSON object using exactly these keys:
    {
      "audit_score": "A single integer from 1 to 100 representing Execution Readiness (e.g. 45)",
      "gap_analysis": "One brutal sentence on what is currently missing from their strategy.",
      "action_plan": [
        "Step 1: [Specific action, e.g., 'Set up Meta Pixel and Conversions API']", 
        "Step 2: [Specific action, e.g., 'Launch 3 ad creatives testing broad targeting']", 
        "Step 3: [Specific action]", 
        "Step 4: [Specific action]", 
        "Step 5: [Specific action]"
      ]
    }`;

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

    const scoreMatch = String(result.audit_score || "").match(/\d+/);
    const cleanScore = scoreMatch ? parseInt(scoreMatch[0]) : 50;

    const dbUser = await prisma.user.upsert({
      where: { clerkId },
      update: { email },
      create: { clerkId, email },
    });

    const strategy = await prisma.strategy.create({
      data: {
        userId: dbUser.id,
        productName: product,
        niche: industry,
        keyword: keyword,
        budget: numBudget,
        readinessScore: cleanScore,
        gapAnalysis: result.gap_analysis || "No gap analysis provided.",
        isPremium: false,
      },
    });

    const createdTasks = await Promise.all(
      result.action_plan.map((step: string, index: number) => {
        return prisma.task.create({
          data: {
            strategyId: strategy.id,
            userId: dbUser.id,
            stepNumber: index + 1,
            description: step,
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          },
        });
      })
    );
    const taskIds = createdTasks.map(task => task.id);

    if (numBudget >= 10000 && process.env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *High-Ticket Lead Alert!*\n*Product:* ${product}\n*Niche:* ${industry}\n*Budget:* $${budget}/mo\n*Readiness Score:* ${cleanScore}/100\n*Email:* ${email}\n*Action:* Claim your free forensic audit.`,
          }),
        });
      } catch (slackError) {
        console.error("Slack alert failed, but strategy saved:", slackError);
      }
    }

    return NextResponse.json({
      ...result,
      audit_score: cleanScore.toString(),
      strategyId: strategy.id,
      taskIds: taskIds,
    });

  } catch (error: any) {
    console.error("STRATEGY API ERROR:", error?.message || error);
    return NextResponse.json({ 
      error: "Failed to generate strategy.",
      audit_score: "Error",
      gap_analysis: "Error",
      action_plan: ["Error"]
    }, { status: 500 });
  }
}
