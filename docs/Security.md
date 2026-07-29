# DevOrbit — Security Plan

Planning only — implementation happens during the relevant build day.

## 1. Authentication (JWT)
- Signed with a strong `JWT_SECRET` (env var, never committed)
- Expiry set (e.g. 7 days) — no infinite-lifetime tokens
- Verified on every protected route via `authMiddleware`

## 2. Password Hashing
- bcrypt with a minimum of 10 salt rounds
- Plaintext password never logged, stored, or returned in any API response
- `passwordHash` field explicitly excluded from `.find()`/`.findOne()` projections used in public responses

## 3. Protected Routes
- `authMiddleware` — rejects requests with missing/invalid/expired JWT (401)
- `adminMiddleware` — checks `role === 'admin'` after auth passes (403 if not)
- Ownership checks in controllers (e.g. only the post's author or an admin can delete it)

## 4. Input Validation
- Every POST/PUT/PATCH body validated server-side (never trust client-side validation alone)
- String length limits enforced at the schema level (prevents oversized payloads)
- Mongoose schema validation as a second layer beneath route-level validation

## 5. Rate Limiting
- `express-rate-limit` applied to `/auth/login` and `/auth/register` specifically — mitigates brute-force and spam-registration attempts
- A lighter global limiter on all `/api` routes as a baseline

## 6. CORS
- `cors` middleware configured to allow only `CLIENT_URL` (the deployed Vercel origin) — not a wildcard `*`

## 7. Environment Variables
- All secrets (`JWT_SECRET`, `MONGO_URI`, Cloudinary keys) live only in `.env` (gitignored) locally, and in Render/Vercel's dashboard env settings in production
- `.env.example` (no real values) committed to the repo so the structure is documented without leaking secrets

## 8. Error Handling
- Centralized `errorHandler` middleware — consistent JSON error shape (`{ message, statusCode }`)
- Stack traces never sent to the client in production; logged server-side only

## 9. Logging
- `morgan` for HTTP request logging in development
- Production logs kept minimal (no sensitive data — no passwords, tokens, or full request bodies logged)

## 10. File Upload Safety
- Multer configured with file-type whitelist (jpg/png/webp only) and a max file size (e.g. 5MB)
- Files pushed to Cloudinary immediately, never persisted long-term on the server's local disk