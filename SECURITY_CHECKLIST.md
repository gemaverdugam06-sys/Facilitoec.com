Security Checklist — FACILITOEC

Purpose: quick, printable checklist to verify deployment security and resilience before and after publishing.

1) Secrets & repo
- [ ] Confirm `.env` removed from repo and listed in `.gitignore`.
- [ ] Rotate any Supabase keys if they were ever committed publicly.
- [ ] Ensure `SUPABASE_SERVICE_ROLE_KEY` is NOT present in client code.

2) Environment variables (Vercel)
- [ ] Add client envs (VITE_*) in Vercel Project Settings (Preview/Production as needed).
- [ ] Add server-only envs (no VITE_ prefix) as "Secret": `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`.
- [ ] Verify `NODE_ENV=production` is set.

3) Database security
- [ ] Review Row Level Security (RLS) for all tables with sensitive data.
- [ ] Ensure RPCs (Postgres functions) validate caller roles and user IDs.
- [ ] Test SELECT/INSERT/UPDATE/DELETE as ordinary user and admin.

4) Authentication flows
- [ ] Test signup, signin, password recovery, phone verification flows.
- [ ] Confirm `onAuthStateChange` handlers work and no sensitive data leaks to client.

5) Client-side security
- [ ] Audit all uses of `dangerouslySetInnerHTML` — ensure input is sanitized or only internal data used.
- [ ] Search and remove any `eval`, `new Function`, `document.write` usages.
- [ ] Verify no private keys or secrets stored in `localStorage` or cookies.
- [ ] Add/verify Content Security Policy (CSP) in headers.

6) Server-side security
- [ ] Confirm `supabaseAdmin` client is used only in server-side code.
- [ ] Validate server routes/middlewares check user identity and roles.
- [ ] Enforce HTTPS and HSTS at hosting level.

7) Resilience & fallback
- [ ] Confirm fallback/banner appears when Supabase is unreachable (`localStorage.supabase_down`).
- [ ] Test read-only UX (what pages remain usable) when backend fails.
- [ ] Cache critical data or use SSR for essential pages if needed.

8) Monitoring & operations
- [ ] Enable Supabase usage/quotas alerts.
- [ ] Set up Sentry or error logging for server and client.
- [ ] Schedule regular backups and test restore.

9) Deployment checklist
- [ ] Build locally: `npm run build` (or `pnpm build`).
- [ ] Set Vercel build command (`npm run build`) and Output Dir (`dist`).
- [ ] Deploy preview → test flows → promote to production.

10) Post-deploy verification
- [ ] Confirm site served over HTTPS.
- [ ] Test auth flows and admin endpoints in production.
- [ ] Simulate Supabase outage: `localStorage.setItem('supabase_down','1')` and verify banner + navigation.

Notes
- If you need, I can run a more thorough RLS/RPC audit or help configure monitoring/alerts.
