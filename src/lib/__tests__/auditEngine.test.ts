import { describe, it, expect } from 'vitest';
import { generateAudit } from '../auditEngine';
import { ToolSpend, UseCase } from '@/store/auditStore';

describe('Audit Engine', () => {
  it('identifies Claude Team plan waste for small teams', () => {
    const tools: ToolSpend[] = [
      { id: 'claude', plan: 'team', seats: 2, monthlySpend: 150 } // $30/seat min 5 seats
    ];
    
    const result = generateAudit({ teamSize: 2, useCase: 'coding', tools });
    
    expect(result.recommendations[0].recommendedAction).toBe('DOWNGRADE');
    expect(result.recommendations[0].savingsMonthly).toBe(110); // 150 - (2*20)
    expect(result.totalAnnualSavings).toBe(1320);
  });

  it('recommends consolidation when both Cursor and Copilot are present', () => {
    const tools: ToolSpend[] = [
      { id: 'cursor', plan: 'pro', seats: 5, monthlySpend: 100 },
      { id: 'copilot', plan: 'business', seats: 5, monthlySpend: 95 }
    ];
    
    const result = generateAudit({ teamSize: 5, useCase: 'coding', tools });
    
    const cursorRec = result.recommendations.find(r => r.toolId === 'cursor');
    
    expect(cursorRec?.recommendedAction).toBe('CONSOLIDATE');
    expect(cursorRec?.savingsMonthly).toBe(100);
  });

  it('identifies ChatGPT Team plan waste for 1 user', () => {
    const tools: ToolSpend[] = [
      { id: 'chatgpt', plan: 'team', seats: 1, monthlySpend: 50 } // Minimum 2 seats = $50
    ];
    
    const result = generateAudit({ teamSize: 1, useCase: 'writing', tools });
    
    expect(result.recommendations[0].recommendedAction).toBe('DOWNGRADE');
    expect(result.recommendations[0].savingsMonthly).toBe(30); // 50 - 20 (Plus)
  });

  it('detects high API spend and recommends optimization', () => {
    const tools: ToolSpend[] = [
      { id: 'openai_api', plan: 'payg', seats: 1, monthlySpend: 5000 }
    ];
    
    const result = generateAudit({ teamSize: 10, useCase: 'mixed', tools });
    
    expect(result.recommendations[0].recommendedAction).toBe('OPTIMIZE');
    expect(result.recommendations[0].savingsMonthly).toBe(1000); // 20% of 5000
    expect(result.isHighSavings).toBe(true);
  });

  it('returns KEEP when stack is already optimal', () => {
    const tools: ToolSpend[] = [
      { id: 'windsurf', plan: 'pro', seats: 2, monthlySpend: 30 }
    ];
    
    const result = generateAudit({ teamSize: 2, useCase: 'coding', tools });
    
    expect(result.recommendations[0].recommendedAction).toBe('KEEP');
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.isOptimal).toBe(true);
  });
});
