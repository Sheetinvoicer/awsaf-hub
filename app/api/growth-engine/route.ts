import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({ apiKey: "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" });

export async function POST(req: Request) {
  try {
    const { step, data } = await req.json();

    let prompt = "";

    if (step === 1) {
      prompt = `You are an expert global market researcher. A user wants to market a product: "${data.product}" to the focus group/country: "${data.audience}". 
      Analyze this and find the single best route of marketing suitable for this product in that specific region.
      Also, provide specific channels, websites, or communities where the user can find leads or research this niche.
      Respond ONLY with a valid JSON object using exactly these keys:
      {
        "best_route": "Name of the best marketing platform",
        "audience_persona": "A 1-sentence description of the exact person to target",
        "marketing_angles": ["Angle 1", "Angle 2", "Angle 3"],
        "channels_to_check": ["Specific website/community 1", "Specific website/community 2", "Specific website/community 3"]
      }`;
    } else if (step === 2) {
      prompt = `You are an elite SEO strategist. Based on the product "${data.product}", the target audience in "${data.audience}", and the chosen marketing route "${data.best_route}", create a targeted SEO plan.
      Also, provide concrete examples of Blog Titles and Landing Page Titles optimized for these keywords.
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
      Calculate the expected Return on Ad Spend (ROAS) and Cost Per Acquisition (CPA) for this specific platform.
      Respond ONLY with a valid JSON object using exactly these keys:
      {
        "expected_roas": "A number like 3.5x or 4.2x",
        "expected_cpa": "An estimated dollar amount like $25.00",
        "justification": "A 1-sentence explanation of why this ROAS makes sense given the platform and audience."
      }`;
    }  else if (step === 4) {
      // Business Analysis
      prompt = `You are a elite business strategist and analyst. Analyze the market and competition for a product: "${data.product}" targeting "${data.audience}". 
      Provide a realistic market analysis and identify top competitors.
      Respond ONLY with a valid JSON object using exactly these keys:
      {
        "market_size": "Estimated market size or potential (e.g., '$10B industry, growing 5% YoY')",
        "market_trends": ["Trend 1", "Trend 2", "Trend 3"],
        "market_challenges": ["Challenge 1", "Challenge 2"],
        "top_competitors": [
          {
            "name": "Competitor 1 Name",
            "strengths": "Their main strength",
            "weaknesses": "Their main weakness"
          },
          {
            "name": "Competitor 2 Name",
            "strengths": "Their main strength",
            "weaknesses": "Their main weakness"
          }
        ]
      }`;
          } else if (step === 5) {
      // Accurate Budget Ranges & Launch Roadmap
      prompt = `You are a Chief Financial Officer and Operations Director. 
      The user is launching "${data.product}" for "${data.audience}".
      Create a COMPREHENSIVE, REALISTIC business budget analysis based on actual industry rates. 
      - If it is a software/SaaS product, include development costs, cloud infrastructure/hosting, and maintenance.
      - If it is a physical product, include manufacturing, shipping, and inventory costs.
      - Always include Marketing/Ads, Tools/Software, and Operations/Legal costs.
      
      Provide an accurate Minimum and Maximum cost range for each category to reflect real-world variance (e.g., DIY vs. hiring an agency).
      Then, provide a 30-day launch roadmap from zero to launch that includes product preparation.
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
          {
            "phase_name": "Phase 1: Foundation & Build (Days 1-7)",
            "action_items": ["Action 1", "Action 2", "Action 3"]
          },
          {
            "phase_name": "Phase 2: Testing & Creative (Days 8-14)",
            "action_items": ["Action 1", "Action 2", "Action 3"]
          },
          {
            "phase_name": "Phase 3: Pre-Launch & Optimization (Days 15-21)",
            "action_items": ["Action 1", "Action 2", "Action 3"]
          },
          {
            "phase_name": "Phase 4: Launch & Scale (Days 22-30)",
            "action_items": ["Action 1", "Action 2", "Action 3"]
          }
        ]
      }`;
    }

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
    console.error("GROWTH ENGINE ERROR:", error);
    return NextResponse.json({ error: "Failed to process step." }, { status: 500 });
  }
}