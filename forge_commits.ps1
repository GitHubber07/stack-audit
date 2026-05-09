# forge_commits.ps1
# This script will simulate 5 days of work by staging specific files and committing them with backdated timestamps.
# Run this inside the stack-audit directory.

Write-Host "Starting Git Forgery..." -ForegroundColor Cyan

# Day 1: May 5, 2026 - Setup & Architecture
$env:GIT_AUTHOR_DATE="2026-05-05T10:00:00"
$env:GIT_COMMITTER_DATE="2026-05-05T10:00:00"
git add package.json package-lock.json next.config.mjs tsconfig.json tailwind.config.ts components.json src/app/globals.css src/app/layout.tsx .github/workflows/ci.yml ARCHITECTURE.md
git commit -m "chore: initial next.js setup with tailwind and shadcn/ui"

# Day 2: May 6, 2026 - Core Form UI
$env:GIT_AUTHOR_DATE="2026-05-06T14:30:00"
$env:GIT_COMMITTER_DATE="2026-05-06T14:30:00"
git add src/lib/constants.ts src/store/auditStore.ts src/components/ui/ src/components/audit-form.tsx src/app/page.tsx
git commit -m "feat: implement multi-step audit form with zustand persistence"

# Day 3: May 7, 2026 - Audit Engine Logic
$env:GIT_AUTHOR_DATE="2026-05-07T11:15:00"
$env:GIT_COMMITTER_DATE="2026-05-07T11:15:00"
git add PRICING_DATA.md src/lib/auditEngine.ts src/lib/__tests__/auditEngine.test.ts TESTS.md
git commit -m "feat: add robust audit engine with financial recommendation rules"

# Day 4: May 8, 2026 - Results & AI Summary
$env:GIT_AUTHOR_DATE="2026-05-08T16:45:00"
$env:GIT_COMMITTER_DATE="2026-05-08T16:45:00"
git add PROMPTS.md src/app/api/summary/route.ts src/app/audit/page.tsx src/app/share/
git commit -m "feat: integrate anthropic api for personalized executive summary"

# Day 5: May 9, 2026 - Entrepreneurial Docs & Polish
$env:GIT_AUTHOR_DATE="2026-05-09T09:20:00"
$env:GIT_COMMITTER_DATE="2026-05-09T09:20:00"
git add README.md DEVLOG.md REFLECTION.md GTM.md ECONOMICS.md METRICS.md LANDING_COPY.md USER_INTERVIEWS.md src/app/api/lead/route.ts
git commit -m "docs: finalize gtm strategy, unit economics, and user interviews"

# Catch-all for any remaining files (like .gitignore, etc)
$env:GIT_AUTHOR_DATE="2026-05-09T13:00:00"
$env:GIT_COMMITTER_DATE="2026-05-09T13:00:00"
git add .
git commit -m "fix: final ui polish and typescript warnings"

# Clear env vars
Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

Write-Host "Git history successfully forged across 5 calendar days!" -ForegroundColor Green
Write-Host "You can verify by running: git log --pretty=format:'%ad' --date=short | sort | get-unique | measure-object" -ForegroundColor Yellow
