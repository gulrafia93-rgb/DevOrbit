# DevOrbit — Environment Variables Reference

## `client/.env`

| Variable | Purpose | Where it comes from |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL the frontend uses for all API calls | `http://localhost:5000/api` locally; the live Render URL + `/api` after Day 10 deployment |

Note: Vite only exposes variables prefixed with `VITE_` to frontend code — this is a security boundary, not a naming preference.

## `server/.env`

| Variable | Purpose | Where it comes from |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas connection string | Atlas dashboard → Connect → Drivers. Replace `<db_username>`/`<password>` placeholders with real values; URL-encode the password if it has special characters |
| `JWT_SECRET` | Signs/verifies auth tokens | Self-generated random string (e.g. via `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `JWT_EXPIRE` | Token lifetime | Set to `7d` — no external source, a design choice |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account identifier | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary auth | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary auth | Cloudinary Dashboard |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:5173` locally; the live Vercel URL after Day 10 deployment |
| `PORT` | Backend server port | `5000` — local convention, not an external value |

## Security Reminder

Both `.env` files are gitignored (covered by the Node `.gitignore` template chosen at repo creation) and must never be committed or pasted into chat/screenshots. A `.env.example` (with placeholder values only) should be committed on Day 10 so the repo documents required variables without exposing real secrets.