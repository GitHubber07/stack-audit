import { AuditState, ToolSpend } from "@/store/auditStore";
import { AI_TOOLS } from "@/lib/constants";

export interface AuditRecommendation {
  toolId: string;
  toolName: string;
  currentSpend: number;
  recommendedAction: "KEEP" | "DOWNGRADE" | "SWITCH" | "CONSOLIDATE" | "CANCEL" | "OPTIMIZE";
  savingsMonthly: number;
  reasoning: string;
}

export interface AuditResult {
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighSavings: boolean; // True if savings > $500/mo
  isOptimal: boolean;     // True if savings < $100/mo
}

export function generateAudit(state: Pick<AuditState, "teamSize" | "useCase" | "tools">): AuditResult {
  const recommendations: AuditRecommendation[] = [];
  let totalMonthlySavings = 0;

  const getToolDef = (id: string) => AI_TOOLS.find(t => t.id === id)!;

  const hasCopilot = state.tools.find(t => t.id === 'copilot');
  const hasCursor = state.tools.find(t => t.id === 'cursor');
  const hasWindsurf = state.tools.find(t => t.id === 'windsurf');
  
  const hasClaude = state.tools.find(t => t.id === 'claude');
  const hasChatGPT = state.tools.find(t => t.id === 'chatgpt');

  state.tools.forEach(tool => {
    const def = getToolDef(tool.id);
    let action: AuditRecommendation["recommendedAction"] = "KEEP";
    let savings = 0;
    let reason = "Your current plan fits your usage.";

    // 1. ChatGPT Optimization
    if (tool.id === "chatgpt") {
      if (tool.plan === "team" && tool.seats < 2) {
        action = "DOWNGRADE";
        savings = tool.monthlySpend - 20; // Plus is 20
        reason = "Team plan requires minimum 2 seats. For 1 seat, Plus ($20) offers identical capabilities.";
      } else if (hasClaude && tool.seats === hasClaude.seats && state.useCase !== 'mixed') {
        action = "CONSOLIDATE";
        savings = tool.monthlySpend;
        reason = `You are paying for both ChatGPT and Claude for a ${state.useCase} team. Standardizing on one saves 100% of the redundant license cost.`;
      }
    }

    // 2. Claude Optimization
    if (tool.id === "claude") {
      if (tool.plan === "team" && tool.seats < 5) {
        action = "DOWNGRADE";
        savings = tool.monthlySpend - (tool.seats * 20); // Pro is 20/user
        reason = "Claude Team enforces a 5-seat minimum ($150/mo). For your team size, individual Pro accounts are mathematically cheaper.";
      }
    }

    // 3. Coding Assistants (Cursor vs Copilot vs Windsurf)
    if (tool.id === "cursor") {
      if (tool.plan === "business" && state.teamSize !== '' && (state.teamSize as number) < 3) {
        action = "DOWNGRADE";
        savings = tool.monthlySpend - (tool.seats * 20);
        reason = "Cursor Business ($40/mo) includes centralized billing and privacy. For very small teams (<3), individual Pro ($20/mo) is more capital efficient.";
      } else if (hasCopilot) {
        action = "CONSOLIDATE";
        savings = tool.monthlySpend;
        reason = "Paying for both Cursor and GitHub Copilot is highly redundant. Standardizing on one developer AI tool immediately halves your IDE spend.";
      }
    }

    if (tool.id === "copilot") {
      if (tool.plan === "enterprise" && state.teamSize !== '' && (state.teamSize as number) < 50) {
        action = "DOWNGRADE";
        savings = tool.monthlySpend - (tool.seats * 19);
        reason = "Copilot Enterprise ($39/user) is designed for large orgs needing custom model fine-tuning. Copilot Business ($19/user) provides full enterprise-grade IP indemnity at half the cost.";
      }
    }

    // 4. API Optimization
    if (tool.id === "openai_api" || tool.id === "anthropic_api") {
      if (tool.monthlySpend > 1000) {
        action = "OPTIMIZE";
        savings = tool.monthlySpend * 0.20; // Estimate 20% savings via credits/commitments
        reason = "At >$1k/mo API spend, you are likely paying retail rates. Credex can source pre-committed credits or provisioned throughput for ~20% savings.";
      }
    }

    if (action !== "KEEP") {
      totalMonthlySavings += savings;
    }

    recommendations.push({
      toolId: tool.id,
      toolName: def.name,
      currentSpend: tool.monthlySpend,
      recommendedAction: action,
      savingsMonthly: savings > 0 ? savings : 0,
      reasoning: reason
    });
  });

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    isHighSavings: totalMonthlySavings > 500,
    isOptimal: totalMonthlySavings < 100
  };
}
