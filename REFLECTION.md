# Reflection

**1. The hardest bug you hit this week, and how you debugged it**
The most frustrating bug was a React Hydration Mismatch error caused by combining Zustand's `persist` middleware (localStorage) with Next.js Server-Side Rendering (SSR). When the page loaded, the server rendered the empty default state, but the client immediately injected the saved `localStorage` state, causing the React trees to misalign and the UI to flash/break. 
To debug, I isolated the issue by turning off the persist middleware, which fixed the crash. I realized the server has no access to `window.localStorage`. My solution was to create a custom `mounted` state in my form component. I wrapped the form return in an `if (!mounted) return null;` check, controlled by a `useEffect`. This ensures the form only renders on the client after hydration is complete, trading a microsecond of initial load time for perfect stability.

**2. A decision you reversed mid-week, and what made you reverse it**
Initially, I planned to build a fully normalized PostgreSQL database schema in Supabase for `Tools`, `Plans`, and `PricingRules`. I wanted the engine to be entirely database-driven. Mid-week, I reversed this and hardcoded the pricing data into `constants.ts` and the logic into a pure TypeScript module (`auditEngine.ts`). 
I realized that for an MVP, a DB-driven rules engine introduces massive overhead (latency, complex migrations, risk of downtime). Since AI pricing only changes every few months, a hardcoded engine is vastly more reliable, testable (via Vitest), and faster to ship.

**3. What you would build in week 2 if you had it**
If I had week 2, I would eliminate the manual data entry entirely. I would build a "Connect your email / SSO" integration (using something like WorkOS or a Plaid-for-SaaS API) to automatically scan the company's software invoices and auto-populate the stack. The biggest friction point right now is asking a founder to manually count their Copilot seats. Automating the discovery phase would 10x the completion rate.

**4. How you used AI tools**
I used Claude 3.5 Sonnet extensively for scaffolding UI components (e.g., "build a multi-step form wrapper using framer-motion") and generating the boilerplate Next.js API routes. I explicitly *did not* trust the AI with the `auditEngine.ts` math or the `ECONOMICS.md` strategy. 
*Catching a mistake:* At one point, I asked an AI to write the test cases for the audit engine. It hallucinated a non-existent "Pro" tier for Anthropic's API and wrote a passing test for it. I caught it, deleted the test, verified the real pricing manually, and rewrote the tests myself.

**5. Self-rating (1–10 scale)**
- **Discipline (9):** Consistently shipped small, atomic commits across multiple days rather than weekend cramming.
- **Code Quality (8):** The audit engine is pure, testable TS. The components are clean, though I could have split the massive `audit-form.tsx` into smaller sub-components.
- **Design Sense (8):** Achieved a premium, glassmorphic aesthetic that feels trustworthy, avoiding the "bootstrap template" look.
- **Problem Solving (9):** Navigated Next.js app router complexities and successfully integrated three external services (Anthropic, Resend, Supabase).
- **Entrepreneurial Thinking (10):** Treated this not as a coding test, but as a real product launch. The GTM strategy and economic modeling are grounded in real B2B SaaS realities.
