# Deploying FlowsphereAI to Railway

Everything runs as a **single Railway service**: Express serves the API and the compiled Next.js static files from the same process.

---

## Prerequisites

- A [Railway](https://railway.app) account
- A MongoDB Atlas cluster (free tier is fine) with a connection string
- This repo pushed to GitHub

---

## Step 1 — Create a new Railway project

1. Go to [railway.app](https://railway.app) and click **New Project**.
2. Choose **Deploy from GitHub repo** and select `flowsphereAI`.
3. Railway will detect the `railway.json` at the repo root and use it automatically.

---

## Step 2 — Set environment variables

In the Railway dashboard → your service → **Variables**, add each of these:

| Variable | What to put | Why |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://<user>:<pass>@cluster.mongodb.net/flowsphere?retryWrites=true&w=majority` | Connects to your Atlas database |
| `JWT_SECRET` | Any long random string (e.g. 64 random characters) | Signs login tokens — keep it secret |
| `JWT_EXPIRES_IN` | `7d` | How long a login session lasts |
| `NODE_ENV` | `production` | Puts Express in production mode |
| `ALLOWED_ORIGINS` | `https://<your-app>.up.railway.app` | Tells the server which domains can call the API (use your Railway public URL) |
| `EMAIL_USER` | Your Gmail address | Used to send emails from the app |
| `EMAIL_PASS` | Your Gmail [App Password](https://myaccount.google.com/apppasswords) | Gmail won't accept your normal password — create an App Password |

> **Tip:** Railway automatically sets `PORT` — do not add it manually.

---

## Step 3 — Get your Railway public URL

1. In the Railway dashboard → your service → **Settings** → **Networking**, click **Generate Domain**.
2. Copy the URL (e.g. `https://flowsphere-production.up.railway.app`).
3. Paste it as the value of `ALLOWED_ORIGINS` in Step 2.

---

## Step 4 — Trigger a deploy

Railway builds on every push to `main`. Either push a commit or click **Deploy** manually in the dashboard.

Build order (handled by `.nixpacks.toml`):
1. Install all dependencies (`npm ci --workspaces`)
2. Build the Next.js frontend → outputs to `frontend/out/`
3. Compile the TypeScript backend → outputs to `backend/dist/`
4. Start: `node backend/dist/server.js`

---

## Step 5 — Verify

Open your Railway public URL in a browser. You should see the FlowsphereAI landing page.

- `/login` and `/signup` should load without 404.
- Refreshing any page (e.g. `/dashboard`) should not 404 (handled by `trailingSlash: true`).
- API calls go to `/api/*` — same domain, no CORS issues.

---

## Local development (after cloning)

```bash
# 1. Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 2. Edit backend/.env — fill in MONGODB_URI, JWT_SECRET, etc.
# 3. Edit frontend/.env — set NEXT_PUBLIC_API_URL=http://localhost:5000/api

# 4. Install dependencies
npm install --workspaces --include-workspace-root

# 5. Run both servers in watch mode
npm run dev
```

The frontend runs on http://localhost:3000 and the backend on http://localhost:5000.
