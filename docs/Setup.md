# DevOrbit — Setup Guide

Steps to get the full development environment running from scratch.

## 1. Prerequisites

- Node.js (v18+ recommended; this project verified on v22.18.0)
- npm (comes with Node)
- Git
- VS Code, with extensions: ESLint, Prettier, Tailwind CSS IntelliSense, Error Lens, GitLens, Thunder Client

## 2. External Services (one-time account setup)

- **MongoDB Atlas** (free M0 cluster) — database user + network access (0.0.0.0/0) + connection string
- **Cloudinary** (free tier) — Cloud Name, API Key, API Secret from the Dashboard

## 3. Client Setup

```bash
cd client
npm install
```

**Tailwind CSS v4 note:** this project uses the current Tailwind setup — `@tailwindcss/vite` plugin registered in `vite.config.js`, with `@import "tailwindcss";` in `src/index.css`. There is no `tailwind.config.js` and no `npx tailwindcss init` step — that command is deprecated in v4.

```bash
npm run dev
```
Runs at `http://localhost:5173`.

## 4. Server Setup

```bash
cd server
npm install
```

Create `server/.env` (see ENVIRONMENT.md for full variable reference), then:

```bash
npm run dev
```
Runs at `http://localhost:5000`. Health check: `GET http://localhost:5000/api/health`.

## 5. Common Setup Issues (encountered and fixed during Day 3)

- **`bad auth: authentication failed`** — usually means the MongoDB connection string still has the literal `<db_username>` or `<password>` placeholder, or the password contains special characters that need URL-encoding (`encodeURIComponent`).
- **404 on a context/component file** — file name casing must exactly match the import statement (e.g. `AuthContext.jsx`, not `authContext.js`). Windows' filesystem is case-insensitive but Vite's dev server resolution is not.
- **`npx tailwindcss init -p` fails** — expected in Tailwind v4; use the `@tailwindcss/vite` plugin approach instead (no init step).