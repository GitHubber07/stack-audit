# StackAudit by Credex

StackAudit is a free, finance-literate web application designed to help startup founders and engineering leaders identify waste in their AI tool stack. It instantly audits subscriptions (Cursor, Copilot, Claude, ChatGPT, etc.) against current pricing data, recommending downgrades or consolidations, and acting as a lead-generation funnel for Credex.

Check out the live deployment here: **[Link to Vercel/Netlify deployment here]**

![StackAudit Screenshot](placeholder_for_screenshot.png)

## Quick Start

### Installation
1. Clone the repository: `git clone <repo-url>`
2. Navigate to the project: `cd stack-audit`
3. Install dependencies: `npm install`
4. Set up environment variables in a `.env.local` file:
   ```env
   ANTHROPIC_API_KEY=your_key_here
   RESEND_API_KEY=your_key_here
   SUPABASE_URL=your_url_here
   SUPABASE_ANON_KEY=your_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
5. Run the development server: `npm run dev`

### Running Tests
We use Vitest to ensure the financial logic of the audit engine is rock solid.
```bash
npm run test
```

## Decisions & Trade-offs

1. **Next.js App Router over Single Page App (SPA):** I chose Next.js primarily for the "Viral Loop" requirement. To have unique, shareable URLs (`/share/[id]`) with dynamic Open Graph tags (Twitter cards), Server-Side Rendering is mandatory. A standard React SPA would have failed this business requirement.
2. **Hardcoded Pricing Engine over Database:** I explicitly chose to hardcode the pricing rules and vendor data in `src/lib/auditEngine.ts` and `constants.ts` rather than fetching it from Supabase. Trade-off: Code deployments are required for pricing updates. Reason: At this MVP stage, reliability and speed > dynamic configuration. Pricing rarely changes more than once a quarter.
3. **Zustand + LocalStorage for Form State:** Instead of keeping the multi-step form state in React Context or passing props, I used Zustand with the `persist` middleware. This ensures that if a founder accidentally refreshes the page while hunting down their credit card statements, they don't lose their inputted stack data.
4. **Resend for Transactional Email:** I chose Resend over SendGrid/SES. Trade-off: Slightly higher cost at extreme scale. Reason: Developer experience is 10x better, React Email integration is seamless, and deliverability out-of-the-box is much higher, ensuring our leads actually get their reports.
5. **No Auth Required for Core Value:** I deliberately chose *not* to gate the audit tool behind a login screen. Users only provide an email *after* seeing the results if they want to save them. Trade-off: We collect fewer emails overall. Reason: The friction of a forced login drastically reduces top-of-funnel conversion. By providing value first, the emails we *do* collect are higher-intent.
