# Project Specs — FlowsphereAI Railway Deployment

## What the app does
FlowsphereAI is a premium task-management SaaS. The Next.js frontend is built as a static export
(`output: 'export'`) into `frontend/out/`. The Express backend serves those static files directly
AND handles all API routes under `/api/`. Everything ships as **one process** on Railway.

## Who uses it
End-users who manage projects and tasks. Deployed as a single Railway service.

## Tech stack
| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (static export → `frontend/out/`) |
| Backend | Express + TypeScript, compiled to `backend/dist/` |
| Database | MongoDB (external Atlas URI via env) |
| Auth | JWT (stored in localStorage) |
| Hosting | Railway (single service) |
| Package manager | npm workspaces (root `package.json`) |

## Pages / user flows
- `/` → landing page
- `/login`, `/signup` → auth pages
- `/dashboard/*` → protected task/project management pages

## Data models
Defined in backend Mongoose models (not changed in this task).

## Third-party services
- MongoDB Atlas (via `MONGODB_URI`)
- SMTP email (via `EMAIL_USER` / `EMAIL_PASS`)

## What "done" looks like for this task
All 8 files listed below are changed so that `git push` to Railway builds and starts the app
with zero manual steps beyond setting env variables in the Railway dashboard.

---

## Files to change

### 1. `railway.json` (NEW — repo root)
Tells Railway how to build and start the app.
```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "buildCommand": "npm run build",
    "startCommand": "node backend/dist/server.js"
  }
}
```

### 2. `.nixpacks.toml` (NEW — repo root)
Pins Node 20 and ensures frontend builds before backend.
```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.build]
cmds = [
  "npm ci --workspaces",
  "npm run build --workspace=frontend",
  "npm run build --workspace=backend"
]
```

### 3. Root `package.json`
Change `"start"` from `"node backend/dist/start-in-memory.js"` → `"node backend/dist/server.js"`.

### 4. `backend/src/server.ts`
Replace `app.use(cors())` with a config that reads `ALLOWED_ORIGINS` from env,
defaulting to `http://localhost:3000,http://localhost:5000` in development.

### 5. `frontend/next.config.mjs`
Add `trailingSlash: true` so refreshing a page like `/dashboard` doesn't 404
(static files will be exported as `/dashboard/index.html`).

### 6. `backend/.env.example`
Add `ALLOWED_ORIGINS=https://your-railway-domain.up.railway.app`
(also clean up the garbled EMAIL lines).

### 7. `frontend/.env.example` + `frontend/src/lib/axios.ts`
- `.env.example`: clarify `NEXT_PUBLIC_API_URL=/api` (relative, works without knowing the domain)
- `axios.ts`: the fallback is already `/api` in production — no code change needed here
  (the existing logic is already correct).

### 8. `DEPLOY.md` (NEW — repo root)
Step-by-step Railway deployment guide listing every required env variable.

---

## Env variables needed on Railway
| Variable | Example value | Why |
|---|---|---|
| `PORT` | set by Railway automatically | Express listens on this |
| `MONGODB_URI` | `mongodb+srv://...` | Atlas connection string |
| `JWT_SECRET` | any long random string | Signs auth tokens |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `NODE_ENV` | `production` | Disables dev defaults |
| `ALLOWED_ORIGINS` | `https://yourapp.up.railway.app` | CORS whitelist |
| `EMAIL_USER` | `you@gmail.com` | SMTP sender address |
| `EMAIL_PASS` | Gmail App Password | SMTP credential |
