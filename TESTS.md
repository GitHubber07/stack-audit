# Automated Tests

We use **Vitest** for our test runner due to its exceptional speed and native TypeScript support, which makes it ideal for a Next.js App Router codebase.

The core product value is the Audit Engine logic. If this logic is wrong, the tool loses all credibility. Therefore, the testing strategy focuses entirely on the mathematical and logical correctness of the recommendations.

## Tests Written

Filename: `src/lib/__tests__/auditEngine.test.ts`

This file covers 5 distinct, high-value edge cases:

1. **`identifies Claude Team plan waste for small teams`**
   - **What it covers:** Ensures that a team of 2 paying for a Claude Team plan (which enforces a 5-seat minimum) is correctly advised to DOWNGRADE to individual Pro accounts, calculating the exact $110/mo savings.
2. **`recommends consolidation when both Cursor and Copilot are present`**
   - **What it covers:** Validates that redundant tooling (having both Cursor and Copilot for coding) triggers a CONSOLIDATE action.
3. **`identifies ChatGPT Team plan waste for 1 user`**
   - **What it covers:** Ensures a solopreneur paying for ChatGPT Team (which requires 2 seats minimum) is advised to DOWNGRADE to ChatGPT Plus.
4. **`detects high API spend and recommends optimization`**
   - **What it covers:** Identifies if a user is spending >$1,000/mo on Anthropic/OpenAI APIs, and recommends an OPTIMIZE action via Credex to secure enterprise discounts. Also tests the `isHighSavings` flag triggers correctly.
5. **`returns KEEP when stack is already optimal`**
   - **What it covers:** Validates that if a user has a perfectly rational stack (e.g., 2 devs using Windsurf Pro), no fake savings are generated, and `isOptimal` is set to true.

## How to run them

You can run the test suite locally using:

```bash
npm run test
```

Or run them in watch mode during development:

```bash
npx vitest watch
```

These tests are also executed automatically on every push via the GitHub Actions CI pipeline (`.github/workflows/ci.yml`).
