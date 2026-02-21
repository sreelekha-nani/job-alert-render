# Deployment Guide (Beginner-friendly)

This guide explains two simple options: deploy the frontend to Vercel (easy, recommended) and deploy the backend to a host that supports long-running Node services (Render, Railway, Fly, etc.).

## Quick overview
- Frontend: static app built with Vite (folder: frontend) — deploy to Vercel.
- Backend: Node + Express + Prisma + MongoDB + Redis — deploy to a host that supports Docker or long-running Node processes.

## 1) Deploy frontend to Vercel (recommended for first-time deploy)

1. Create a free Vercel account at https://vercel.com.
2. Connect your Git repository (GitHub/GitLab/Bitbucket) or use the Vercel CLI.
3. When importing the project, set the root to the repository root (we added vercel.json to build the frontend).

Build details (Vercel dashboard):
- Build command: (root) `npm run build` — this runs `cd frontend && npm ci && npm run build`.
- Output directory: `frontend/dist` (the provided vercel.json should already configure this).

Using the Vercel CLI (alternative):

```bash
# from project root
npm install
cd frontend
npm install
npx vercel --prod
```

After deployment Vercel will provide a production URL.

## 2) Deploy backend (options and basic steps)

Important: the backend requires a MongoDB and a Redis instance and uses Prisma. You must provide production credentials as environment variables on the host.

Recommended hosts:
- Render (Docker-supported): link repo and use the existing backend/Dockerfile.
- Railway / Fly / DigitalOcean App Platform: these also support Docker or Node deployments.

General steps (Docker approach, works on Render):

1. Create accounts for a hosted MongoDB (MongoDB Atlas) and hosted Redis (Redis Cloud) and obtain connection strings.
2. In your chosen host (Render/Railway), create a new service:
   - Choose repository, point to the backend folder (or root if you keep Dockerfile in backend/).
   - If using Docker, the platform will use backend/Dockerfile to build the image.
   - If using plain Node, set build/start commands: `npm ci && npm run build` then `npm run start`.
3. Add environment variables (see list below).
4. Trigger deploy — the platform will build and run your service.
5. Run Prisma migrations / generate client on first deploy if required:
   - Either add a build step `npx prisma generate && npx prisma migrate deploy` or run migrations manually from the platform's console.

## Required environment variables (common list)
- `DATABASE_URL` — MongoDB connection string (example: `mongodb+srv://USER:PASS@cluster0.../dbname`).
- `REDIS_HOST` and `REDIS_PORT` or `REDIS_URL` — Redis connection details.
- `JWT_SECRET`, `JWT_REFRESH_SECRET` — secrets used by your app.
- `OPENAI_API_KEY` — if features use OpenAI.
- SMTP/EMAIL settings for `nodemailer` (if emails are used): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.
- Any OAuth client secrets (e.g., Google): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`.

Check backend/.env.example if present, or look in backend/src/config/index.ts for exact keys.

## Local testing before deploy

1. Start MongoDB and Redis locally (or use Docker Compose provided in backend/docker-compose.yml):

```bash
cd backend
docker compose up --build
```

2. In another terminal, run the backend in dev mode:

```bash
cd backend
npm install
npm run dev
```

3. Build and run frontend locally:

```bash
cd frontend
npm install
npm run dev
```

## Optional: I can do this for you
- I can create a ready-to-use render.yaml or railway config to deploy the backend automatically.
- I can set up a sample production .env.example.prod listing all env vars (without secrets) so you can fill them in on the hosting UI.

---
Files added/updated by this guide:
- [vercel.json](vercel.json) — config for frontend build on Vercel
- [package.json](package.json) — root scripts to build frontend
- [DEPLOYMENT.md](DEPLOYMENT.md) — this file

If you'd like, tell me which host you prefer for the backend (Render, Railway, Fly, DigitalOcean, or a VM) and I will prepare the exact deploy config and a .env.example.prod you can fill in. If you want, I can also run the frontend deploy with your Vercel account using the Vercel CLI instructions above.
