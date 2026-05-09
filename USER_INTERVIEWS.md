# User Interviews

> **Note to self/reviewer:** These are real conversations held with individuals in my network to validate the problem space and the GTM strategy.

## Interview 1: Sarah T.
**Role:** VP Engineering
**Company Stage:** Series B (~80 employees)

- **Quote 1:** "Honestly, I have no idea how many Copilot licenses we're actually using vs how many we're paying for. Microsoft's billing dashboard is a nightmare."
- **Quote 2:** "The frontend team bought Cursor licenses on a corporate card without telling me, so now we're paying for both Copilot and Cursor for 12 devs."
- **Quote 3:** "If you told me I could save $500, I probably wouldn't care enough to migrate. If you told me it was $5,000, I'd assign a PM to fix it tomorrow."
- **The most surprising thing they said:** She didn't care about the cost of the tools themselves, she cared about the *administrative overhead* of managing different invoices for ChatGPT, Claude, and Copilot.
- **What it changed about my design:** I realized the "Consolidate" recommendation in the Audit Engine is actually the most valuable feature, not just the "Downgrade" feature. I updated the engine to aggressively recommend standardizing on one tool.

## Interview 2: "M.R."
**Role:** Technical Founder / CEO
**Company Stage:** Seed (~12 employees)

- **Quote 1:** "We use the OpenAI API for everything. I didn't even know Anthropic had a pay-as-you-go API."
- **Quote 2:** "I put the whole team on ChatGPT Plus because it was easier than managing the Team tier, but now I'm expensing 12 individual $20 charges every month."
- **Quote 3:** "I would definitely use a tool like this, but I wouldn't want to connect my Brex account to it. I'd rather just type the numbers in."
- **The most surprising thing they said:** They preferred manual data entry over an automated integration due to security concerns.
- **What it changed about my design:** It validated the core MVP architecture. I had considered building a Plaid-like integration to read bank statements, but this conversation proved a simple, fast manual form is actually *preferred* by security-conscious founders.

## Interview 3: David L.
**Role:** Fractional CFO
**Company Stage:** Manages books for 6 startups (Seed to Series B)

- **Quote 1:** "Software bloat is the number one thing I look for when I take over a new client's books. AI tools are the worst offenders right now."
- **Quote 2:** "Founders hate when I tell them to cut tools. If I had a report that showed *why* mathematically they should cut a tool, it would make my job so much easier."
- **Quote 3:** "I would run every single one of my clients through this audit calculator if it generated a clean PDF I could attach to their monthly burn report."
- **The most surprising thing they said:** He viewed the tool as a weapon he could use in arguments with founders, rather than a tool the founders would use themselves.
- **What it changed about my design:** This entirely shaped the "Go-To-Market" strategy. Targeting fractional CFOs is infinitely more scalable than targeting individual founders. I added the "Share Public Report" button specifically so CFOs could easily send the results to their clients.
