# Innobi OpsCore

Modern ERP-style demo built with React, TypeScript, Vite, Tailwind, and Supabase.

## Getting Started
1) Install dependencies: `npm install` (or `pnpm install`).
2) Copy `.env.example` to `.env.local` (or `.env`) and set:
   - `VITE_SUPABASE_URL=YOUR_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY`
3) Run the dev server: `npm run dev`.

## Supabase Types
- From Supabase Dashboard: Table Editor → Code → TypeScript → copy the generated types into `src/types/supabase.ts` (replace the placeholder Database type).

## Key Areas
- Dashboard with project status and revenue charts.
- CRUD pages for customers, projects, vendors, employees, purchase orders, and invoices.
- Layout with collapsible sidebar and responsive header.

## Next Steps (suggested)
- Add dark/light theme toggle.
- Enable Supabase Auth + RLS policies.
- Improve forms with validation + toasts.
- Add tests (unit + e2e) and CI.
