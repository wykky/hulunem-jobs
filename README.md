# Hulunem Jobs

Ethiopian jobs board — Next.js 15 + Tailwind + Google Sheets backend.

## Setup

```bash
npm install
cp .env.example .env.local
# fill in SHEET_JOBS_URL, SHEET_SKILLS_URL, WEBHOOK_URL, WEBHOOK_SECRET
npm run dev
```

## Sheet schema

- **Jobs**: posted | title | company | sector | location | type | expires | url | source | slug | summary
- **Submissions**: timestamp | title | company | sector | location | type | expires | url | contact_name | contact_email | summary | status
- **Skills**: added | category | title | url | summary

## Routes

- `/` — latest jobs + skills sidebar
- `/jobs/[slug]` — detail
- `/submit` — employer submission form (POSTs to Submissions tab via webhook)
- `/skills` — curated learning resources

## Deploy

Push to GitHub → connect to Vercel → set env vars → assign `jobs.hulunem.com` domain.
