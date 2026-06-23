Deployment to Vercel — quick guide

Goal
- Deploy the Vite + React app to Vercel and configure Supabase environment variables securely.

Required environment variables (set in Vercel > Project > Settings > Environment Variables):
- VITE_SUPABASE_URL = https://<your-project>.supabase.co
- VITE_SUPABASE_ANON_KEY = <anon/public key>
- VITE_SUPABASE_PUBLISHABLE_KEY = <publishable key> (if used)
- SUPABASE_URL = same as VITE_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY = <service_role_key> (server-only)
- VITE_OG_IMAGE_URL = https://your-domain.com/og-image.png
- NODE_ENV = production

Vercel settings
- Framework Preset: `Vite` or `Other`
- Build Command: `npm run build`
- Output Directory: `dist`

Deployment steps
1. Push the repo to Git.
2. Import the repo in Vercel.
3. Add the environment variables above.
4. Deploy.
5. Open the production URL and test the site.

Admin setup
1. In Supabase SQL Editor, run the role assignment SQL for the account that should be admin.
2. Sign in with that account.
3. Open `/admin`.
4. Approve or reject pending promotions/payments from the admin panel.

Notes
- The app uses `VITE_` variables for client-side config and non-`VITE_` variables for server-only secrets.
- If Supabase environment variables are missing, the app can fall back to a read-only mode locally, but production needs them configured.
