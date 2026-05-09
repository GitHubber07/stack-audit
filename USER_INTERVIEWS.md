# User Interviews

> **Note to reviewer:** As a college student, I don't have direct access to Series B executives, so I interviewed three people in my immediate network who manage software spending on a smaller scale: a student founder, a recent grad at a startup, and a freelance developer. I kept the interviews focused on their actual pain points with AI subscriptions.

## Interview 1: Rahul K.
**Role:** Student Founder (Building a SaaS tool for hackathons)
**Company Stage:** Pre-seed (4 student co-founders)

- **Quote 1:** "We are totally bootstrapping. I put the whole team on ChatGPT Plus using my own debit card because we didn't want to deal with OpenAI's corporate team pricing."
- **Quote 2:** "Wait, I didn't even realize Claude Team had a 5-seat minimum. Thanks for telling me, we only have 4 people so that would have been a waste of money."
- **Quote 3:** "I'd use this tool if it was free. I definitely wouldn't put my email in unless it showed me exact dollar amounts first."
- **The most surprising thing they said:** Early stage student founders are sharing passwords or expensing things personally to avoid dealing with "Enterprise" or "Team" tier limits.
- **What it changed about my design:** His comment about the email capture directly influenced my UI flow. I made sure the app shows the exact dollar amount of savings *first*, and only asks for the email *after* proving value.

## Interview 2: Aman S.
**Role:** Junior Frontend Engineer (Recent Alumni)
**Company Stage:** Seed Startup (~15 employees)

- **Quote 1:** "My startup pays for Copilot for everyone, but honestly, three of us just bought Cursor Pro ourselves because we like it better. The CTO doesn't even know."
- **Quote 2:** "No one is keeping track of the overlap. Marketing uses Jasper, we use Copilot, support uses ChatGPT."
- **Quote 3:** "If a tool told me to cancel Cursor, I wouldn't. But if it gave me data to convince my boss to buy Cursor *instead* of Copilot for the team, I'd share it with him immediately."
- **The most surprising thing they said:** Engineers actively *want* stack fragmentation because they prefer different tools, while management wants consolidation. 
- **What it changed about my design:** I realized the tool needs to clearly flag *redundancy* (like having Copilot and Cursor) because that's the easiest thing to cut. I built specific logic in the audit engine to flag when both are present.

## Interview 3: Dev P.
**Role:** Freelance Web Developer / Senior CS Student
**Company Stage:** Works with 3-4 local small business clients

- **Quote 1:** "Every single client I build stuff for is overpaying for software. They sign up for Pro tiers of random AI tools and forget to downgrade when the project is over."
- **Quote 2:** "I wouldn't use this for my own spend, but I would 100% run my clients' tech stacks through it to look like a genius in our update meetings."
- **Quote 3:** "If you can generate a link that I can just drop into a WhatsApp or Slack group for my clients, that's way better than sending a PDF."
- **The most surprising thing they said:** Freelancers are a massive distribution channel. They want tools that make *them* look smart and save their clients money.
- **What it changed about my design:** This entirely shifted my GTM (Go-To-Market) strategy. Instead of marketing to founders directly, I realized marketing to freelancers/consultants is a much faster growth wedge. It's also why I built the `/share/[id]` feature.
