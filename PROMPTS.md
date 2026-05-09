# LLM Prompts

## The Summary Generation Prompt

We use the Google Gemini API (`gemini-2.5-flash`) to generate a highly personalized, executive-level summary of the audit. 
*Note: The assignment suggested Anthropic, but pivoting to Gemini's free tier for the MVP demonstrates capital efficiency and prevents blockers during the take-home execution.*

### Prompt Template

```text
You are a senior financial operations partner at a YC startup. You just reviewed an AI tool spend audit for a team of {teamSize} focused primarily on {useCase}.

Here is the audit data:
{auditResultsJSON}

Task: Write a concise, 100-word executive summary of their spend efficiency.
Tone: Direct, financial-literate, founder-to-founder, confident.
Rules:
1. Don't greet them or use fluff like "In conclusion".
2. Highlight their biggest area of waste if any exists.
3. If their spend is highly optimal (savings < $100), commend their capital efficiency explicitly.
4. Point out redundant tools (e.g. paying for both Cursor and Copilot).
5. Never invent numbers not in the JSON.
```

### Why this prompt?

1. **Role-playing:** Asking Claude to act as a "senior financial operations partner" grounds the tone. It stops it from sounding like a generic customer service bot and forces a "founder-to-founder" peer dynamic.
2. **Strict constraints:** The "Rules" array explicitly prevents common LLM failure modes (hallucinations of numbers, overly verbose intros/outros).
3. **Conditional logic:** Rule 3 ensures that users with already-optimized stacks receive a pat on the back rather than manufactured concern, which builds immense trust in the tool.

### Failed Experiments

- **Experiment 1:** I initially used a much simpler prompt ("Summarize these savings"). The output was extremely dry, reading just like a text-version of the table. It provided no "insight" or "executive" feel.
- **Experiment 2:** I asked it to write a "sales pitch for Credex." The result felt extremely scammy and untrustworthy. Users will bounce if the first thing they read is a hard sell. The current prompt focuses 100% on value delivery; the UI handles the Credex CTA separately.
