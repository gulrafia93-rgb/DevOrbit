# DevOrbit — 10-Day MERN Implementation Blueprint

This is the single source of truth for the remaining build. Each day's section below has enough technical context that a fresh AI session (or a different assistant) can pick up implementation immediately — no redesign needed. This document assumes SRD.docx, ARCHITECTURE.md, SCHEMA.md, API.md, PROJECT-STRUCTURE.md, and SECURITY.md (all in `docs/`) as the approved design source.

**Stack:** React (Vite) + Tailwind + React Router + Axios + Context API | Node + Express + Mongoose | MongoDB Atlas | JWT + bcrypt | Multer + Cloudinary
**Repo:** github.com/gulrafia93-rgb/DevOrbit

---

## Days 1–3 Recap (Completed)

- **Day 1:** Product discovery. Project selected: DevOrbit — a MERN social platform for student/dev community (profiles, posts w/ text+image+code+tags, comments, likes, follow, admin moderation). SRD generated.
- **Day 2:** System design. Architecture, database schema (Users/Posts/Comments), full REST API spec (18 endpoints), UI/UX wireframes, project structure, and security plan documented in `docs/`.
- **Day 3:** Project setup & foundation. MongoDB Atlas cluster + Cloudinary account created. Client (Vite+React+Tailwind) and server (Express) scaffolded per PROJECT-STRUCTURE.md. DB connection, base Express app, error-handling middleware, and Axios config set up. Goal: a working "Hello World" — frontend talking to backend, backend talking to MongoDB.

---

## Day 4 — Authentication (First User-Facing Feature)

🎯 **Objective:** Working register/login with JWT issuance and protected-route middleware — the foundation every other feature depends on.

📖 **Concepts:** password hashing (bcrypt salt rounds), JWT signing/verification, stateless auth, protected route middleware pattern, React Context for auth state.

🛠 **Backend:** `models/User.js` (per SCHEMA.md fields) · `controllers/authController.js` (register, login) · `routes/authRoutes.js` · `middleware/authMiddleware.js` (verifies JWT, attaches `req.user`) · `utils/generateToken.js`.

🛠 **Frontend:** `pages/Register.jsx`, `pages/Login.jsx` · shared `components/AuthForm.jsx` · `context/AuthContext.jsx` (login/logout/user state via useReducer) · `components/ProtectedRoute.jsx` · `services/authService.js` (Axios calls) · Axios interceptor to attach JWT from context to every request.

📂 **Files:** as listed in PROJECT-STRUCTURE.md under `server/{models,controllers,routes,middleware,utils}` and `client/src/{pages,components,context,services}`.

🔗 **APIs:** `POST /auth/register`, `POST /auth/login` (per API.md — exact request/response shapes already specified there).

🗄 **Database:** Users collection live — verify unique index on `email`/`username` actually rejects duplicates at the DB layer.

🧪 **Testing:** Postman — register success, duplicate email (expect 409), login wrong password (expect 401), access a protected test route with/without token.

🐞 **Debugging Tips:** if JWT verification fails silently, check `Authorization: Bearer <token>` header format exactly; if bcrypt compare always fails, confirm you're hashing on register, not double-hashing on login.

✅ **End-of-Day Checklist:** register/login working end-to-end from UI · token persists across page refresh · protected route redirects unauthenticated users to Login.

📸 **Screenshots:** Register form, Login form, Postman 401 response for missing token, browser dev tools showing JWT stored.

➡️ **Handoff Notes:** AuthContext and ProtectedRoute are now available for every future page. `req.user` (with `id` and `role`) is available in every controller after `authMiddleware`.

---

## Day 5 — Profiles & Follow System

🎯 **Objective:** View/edit profile, avatar upload, and the follow/unfollow system.

📖 **Concepts:** Multer multipart parsing, uploading a buffer to Cloudinary, self-referencing Mongoose relationships (followers/following arrays).

🛠 **Backend:** `controllers/userController.js` (getProfile, updateProfile, followUser, unfollowUser) · `routes/userRoutes.js` · `middleware/uploadMiddleware.js` (Multer config: image types only, 5MB max) · `services/cloudinaryUpload.js`.

🛠 **Frontend:** `pages/Profile.jsx`, `pages/EditProfile.jsx` · `components/ProfileCard.jsx`, `components/FollowButton.jsx` · `services/userService.js`.

🔗 **APIs:** `GET /users/:id`, `PUT /users/:id`, `POST/DELETE /users/:id/follow` (per API.md).

🗄 **Database:** confirm `.populate()` correctly resolves follower/following counts without over-fetching full user documents.

🧪 **Testing:** upload an oversized image (expect rejection), follow yourself (expect 400), follow/unfollow toggling reflects instantly in UI.

🐞 **Debugging Tips:** if Cloudinary upload hangs, check API secret isn't accidentally quoted in `.env`; if avatar doesn't update in UI, confirm the response's `avatarUrl` is being re-fetched into context, not cached.

✅ **End-of-Day Checklist:** profile view/edit works · avatar uploads and displays · follow/unfollow updates counts live.

📸 **Screenshots:** own profile, another user's profile with Follow button, edit-profile form with image preview.

➡️ **Handoff Notes:** `cloudinaryUpload.js` service is now reusable for post images in Day 6 — don't rebuild it.

---

## Day 6 — Posts (Core Feature)

🎯 **Objective:** Create and view posts — text, optional image, optional code snippet, tags — plus the global feed with tag filtering.

📖 **Concepts:** conditional Mongoose validation (content required unless image/code present), feed pagination, denormalized counters (`commentsCount`).

🛠 **Backend:** `models/Post.js` · `controllers/postController.js` (createPost, getFeed, getPostById, deletePost) · `routes/postRoutes.js`.

🛠 **Frontend:** `pages/Feed.jsx` · `components/PostForm.jsx` (text/image/code/tag inputs), `components/PostCard.jsx`, `components/TagFilterBar.jsx` · `services/postService.js`.

🔗 **APIs:** `GET /posts` (with `?tag=` and pagination), `POST /posts`, `GET /posts/:id`, `DELETE /posts/:id` (per API.md).

🗄 **Database:** indexes on `author`, `tags`, `createdAt` (per SCHEMA.md) — confirm feed sort is actually using the index (no full collection scans).

🧪 **Testing:** create post with only an image (no text), tag filter returns correct subset, delete-by-non-owner returns 403.

🐞 **Debugging Tips:** if tag filter returns nothing, check tags are lowercase-normalized on save AND on query.

✅ **End-of-Day Checklist:** feed loads and paginates · post creation (all 3 content types) works · tag filter works · owner-only delete enforced.

📸 **Screenshots:** feed with multiple posts, post with code snippet rendered, tag filter in action.

➡️ **Handoff Notes:** PostCard component will be reused (read-only) inside Post Detail page tomorrow — keep it presentational, not feed-specific.

---

## Day 7 — Comments & Likes

🎯 **Objective:** Post Detail page with comment thread, and like/unlike on posts.

📖 **Concepts:** array-based like tracking (`likes: [ObjectId]`), incrementing/decrementing denormalized counters safely.

🛠 **Backend:** `models/Comment.js` · `controllers/commentController.js` (addComment, getComments, deleteComment) · like/unlike handlers added to `postController.js`.

🛠 **Frontend:** `pages/PostDetail.jsx` · `components/CommentList.jsx`, `components/CommentForm.jsx` · like button wired into `PostCard.jsx`.

🔗 **APIs:** `GET/POST /posts/:id/comments`, `DELETE /comments/:id`, `POST/DELETE /posts/:id/like` (per API.md).

🗄 **Database:** confirm `commentsCount` on Post increments on comment create and decrements on delete — check for drift after several add/delete cycles.

🧪 **Testing:** like same post twice (expect 409 on second), delete comment as non-owner/non-admin (expect 403), comment on nonexistent post (expect 404).

🐞 **Debugging Tips:** if like count drifts from actual array length, recompute count from `likes.length` rather than trusting a separately-incremented field.

✅ **End-of-Day Checklist:** comments display and post correctly · like/unlike toggles and count is accurate · Post Detail shows full thread.

📸 **Screenshots:** Post Detail with comments, like button in liked/unliked states.

➡️ **Handoff Notes:** Admin dashboard tomorrow will reuse `deleteComment`/`deletePost` controller logic — same ownership-or-admin check pattern, just triggered from a different route.

---

## Day 8 — Admin Dashboard & UI Polish

🎯 **Objective:** Admin moderation (delete any post/comment, deactivate users) and a pass over loading/empty/error states across all pages per UI-WIREFRAMES.md.

📖 **Concepts:** role-based middleware (`adminMiddleware`), UI state handling patterns (skeleton loaders, empty states, error boundaries/toasts).

🛠 **Backend:** `middleware/adminMiddleware.js` · `controllers/adminController.js` (listUsers, deactivateUser, listAllPosts) · `routes/adminRoutes.js`.

🛠 **Frontend:** `pages/AdminDashboard.jsx` · `components/AdminUserRow.jsx`, `components/AdminPostRow.jsx` · retrofit `Loader`/`Toast` components into Feed, Profile, PostDetail per the states defined in UI-WIREFRAMES.md.

🔗 **APIs:** `GET /admin/users`, `PATCH /admin/users/:id`, `GET /admin/posts` (per API.md).

🗄 **Database:** add `isActive` check into login flow (deactivated users get 403, not 401).

🧪 **Testing:** non-admin hitting `/admin/*` routes (expect 403), deactivated user attempting login (expect 403 with clear message).

🐞 **Debugging Tips:** if a deactivated user's existing JWT still works, that's expected (stateless JWT) — the check must happen at login and can optionally be re-checked per-request if you want immediate lockout.

✅ **End-of-Day Checklist:** admin can deactivate a user and delete any content · every major page has a working loading/empty/error state · no console errors anywhere.

📸 **Screenshots:** Admin dashboard, a deactivated user's blocked login attempt, an empty-feed state.

➡️ **Handoff Notes:** all core features are now functionally complete. Day 9 is testing-only — no new features.

---

## Day 9 — Testing & Bug Fixing

🎯 **Objective:** Full regression pass across every feature; fix what's broken; no new features.

📖 **Concepts:** manual test-case writing, edge-case thinking, responsive/accessibility spot-checks.

🛠 **Backend:** re-run every endpoint in API.md through Postman/Thunder Client, including every listed error case.

🛠 **Frontend:** full click-through of every user journey from UI-WIREFRAMES.md — Guest, Registered User, Admin.

📂 **Files:** no new files expected — only fixes inside existing controllers/components.

🔗 **APIs:** verify all 18 endpoints against their documented status codes.

🗄 **Database:** spot-check Atlas collections directly (via Atlas UI) to confirm data shape matches SCHEMA.md exactly.

🧪 **Testing Tasks:** duplicate email/username, expired/invalid token, unauthorized delete attempts, empty feed state, oversized/failed image upload, following yourself, mobile viewport check (Chrome DevTools device toolbar).

🐞 **Debugging Tips:** keep a running bug list as you go; fix in batches by feature area rather than one at a time to avoid re-testing the same flow repeatedly.

✅ **End-of-Day Checklist:** every functional requirement (FR-1 through FR-20 in the SRD) manually verified working.

📸 **Screenshots:** before/after of any notable bug fix, mobile view of the feed.

➡️ **Handoff Notes:** app is feature-complete and tested. Day 10 is deployment only.

---

## Day 10 — Deployment & Wrap-Up

🎯 **Objective:** DevOrbit live on the public internet, repo polished, portfolio-ready.

📖 **Concepts:** environment variable configuration on hosting dashboards, CORS in production, cold starts on free-tier hosting.

🛠 **Backend:** deploy `server/` to Render (free web service) — set all env vars from ARCHITECTURE.md's env list in Render's dashboard, not in code.

🛠 **Frontend:** deploy `client/` to Vercel — set `VITE_API_BASE_URL` to the live Render URL.

📂 **Files:** add root `README.md` with project description, tech stack, live demo link, and setup instructions; add `.env.example` (no real values) to both `client/` and `server/`.

🔗 **APIs:** smoke-test all 18 endpoints against the live Render URL (not localhost).

🗄 **Database:** confirm Atlas network access allows Render's outbound IPs (0.0.0.0/0, already configured Day 3).

🧪 **Testing Tasks:** full user journey on the live deployed URL — register, post, comment, like, follow, admin moderate.

🐞 **Debugging Tips:** if the live frontend can't reach the backend, check CORS `CLIENT_URL` matches the exact Vercel domain (including https://, no trailing slash).

✅ **End-of-Day Checklist:** live URL works end-to-end · GitHub repo public with complete README · all `docs/` files present · screenshots collected for portfolio.

📸 **Screenshots:** live deployed app (desktop + mobile), Vercel/Render dashboards showing successful deploys.

➡️ **Handoff Notes:** capstone complete. Future work (out of scope per SRD): DMs, notifications, search, personalized feed, nested replies, report queue, dark mode.