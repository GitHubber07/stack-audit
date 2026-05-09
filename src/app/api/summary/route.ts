import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { AuditResult } from '@/lib/auditEngine';

// We pivot to Gemini because it has a generous free tier, 
// keeping our MVP costs at absolute zero while still fulfilling the LLM requirement.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

export async function POST(req: NextRequest) {
  try {
    const { teamSize, useCase, auditData }: { teamSize: number | string, useCase: string, auditData: AuditResult } = await req.json();

    // Graceful fallback if no API key is present
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      return NextResponse.json({
        summary: `As a team of ${teamSize} focused on ${useCase}, your AI spend analysis is complete. We found $${auditData.totalAnnualSavings.toLocaleString()} in potential annual savings across your ${auditData.recommendations.length} tools. ${auditData.isOptimal ? 'Your stack is highly optimized.' : 'There are clear opportunities to downgrade or consolidate redundant subscriptions without losing capability.'}`
      });
    }

    const prompt = `You are a senior financial operations partner at a YC startup. You just reviewed an AI tool spend audit for a team of ${teamSize} focused primarily on ${useCase}.

Here is the audit data:
${JSON.stringify(auditData, null, 2)}

Task: Write a concise, 100-word executive summary of their spend efficiency.
Tone: Direct, financial-literate, founder-to-founder, confident.
Rules:
1. Don't greet them or use fluff like "In conclusion".
2. Highlight their biggest area of waste if any exists.
3. If their spend is highly optimal (savings < $100), commend their capital efficiency explicitly.
4. Point out redundant tools (e.g. paying for both Cursor and Copilot).
5. Never invent numbers not in the JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
      }
    });

    const summaryText = response.text || "Summary generation failed.";

    return NextResponse.json({ summary: summaryText });

  } catch (error) {
    console.error("AI Summary Error:", error);
    // Graceful fallback on API failure
    return NextResponse.json({
      summary: "Your audit is complete. Please review the detailed breakdown below for specific recommendations on plan optimization and tool consolidation."
    });
  }
}
