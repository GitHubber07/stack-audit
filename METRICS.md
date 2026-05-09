# Metrics

## The North Star Metric

**North Star:** Qualified Consultations Booked

**Why:** A lead-gen tool has one job: generate revenue pipeline. Tracking "Daily Active Users" (DAU) for an audit tool is a vanity metric; founders audit their stack once a quarter, not daily. Tracking "Audits Completed" is okay, but it doesn't prove the leads are valuable. "Qualified Consultations Booked" proves that the tool is successfully finding startups with real waste (>$500/mo) *and* convincing them that Credex is the solution to fix it.

## The 3 Input Metrics

To drive the North Star, we must monitor the funnel inputs:

1. **Audit Completion Rate (Funnel Health):** 
   - *Formula:* (Audits Completed / Unique Landing Page Visitors)
   - *Why:* If this is below 15%, the form is too long, or the landing page copy isn't convincing enough to start the process.
2. **High-Savings Discovery Rate (Targeting Quality):**
   - *Formula:* (Audits finding >$500 savings / Total Audits Completed)
   - *Why:* If this is <10%, our marketing is attracting the wrong crowd (e.g., solopreneurs or students) rather than Series A/B companies with bloated stacks.
3. **Share URL Generation Rate (Viral Loop):**
   - *Formula:* (Public URLs generated / Total Audits Completed)
   - *Why:* This drives organic top-of-funnel traffic. If founders aren't sharing their "I saved $2k" scorecards, CAC remains high.

## What to Instrument First

Using PostHog or Amplitude, I would instrument:
- `landing_page_viewed`
- `audit_started`
- `audit_step_completed` (with property `step_name`)
- `audit_generated` (with property `total_savings` to track the value we're discovering)
- `lead_captured` (email submitted)
- `share_link_clicked`

## The Pivot Decision

**What number triggers a pivot?**
If **Audit Completion Rate is high (>30%) but Lead Capture Rate is <2% after 500 completed audits.**
This means the product works, the logic is sound, but the *value exchange* is failing. Users see their savings but don't feel compelled to give Credex their email. If this happens, we must pivot from a "passive email capture at the end" to an "email-gated results" model, or radically change the CTA to offer something more immediate (e.g., "Get the exact email template to send your team to cancel these tools").
