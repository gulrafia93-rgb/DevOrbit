# DevOrbit — REST API Specification

Base URL: `VITE_API_BASE_URL` (e.g. `https://devorbit-api.onrender.com/api`)
All request/response bodies are JSON. Protected routes require `Authorization: Bearer <token>`.

---

## Auth

### POST /auth/register
- **Purpose:** Create a new account
- **Auth:** Public
- **Body:** `{ name, username, email, password }`
- **Response 201:** `{ user: { id, name, username, email, avatarUrl, role }, token }`
- **Validation:** name 2–50 chars; username 3–20 chars unique; valid email, unique; password min 8 chars
- **Errors:** 400 (validation failure), 409 (email/username already exists)

### POST /auth/login
- **Purpose:** Authenticate, issue JWT
- **Auth:** Public
- **Body:** `{ email, password }`
- **Response 200:** `{ user: {...}, token }`
- **Errors:** 400 (missing fields), 401 (invalid credentials), 403 (account deactivated)

---

## Posts

### GET /posts
- **Purpose:** Retrieve global feed
- **Auth:** Public
- **Query params:** `?tag=react` (optional filter), `?page=1&limit=10` (pagination)
- **Response 200:** `{ posts: [...], totalPages, currentPage }`

### POST /posts
- **Purpose:** Create a post
- **Auth:** User
- **Body:** `multipart/form-data` — `content`, `image` (file, optional), `codeSnippet` (optional JSON string), `tags` (comma-separated)
- **Response 201:** created post object
- **Validation:** content required unless image or codeSnippet present; max 5 tags
- **Errors:** 400 (validation), 401 (no/invalid token)

### GET /posts/:id
- **Purpose:** View a single post
- **Auth:** Public
- **URL params:** `id` (Post ObjectId)
- **Response 200:** post object
- **Errors:** 404 (not found)

### DELETE /posts/:id
- **Purpose:** Delete a post
- **Auth:** Owner or Admin
- **Response 200:** `{ message: "Post deleted" }`
- **Errors:** 401, 403 (not owner/admin), 404

### POST /posts/:id/like
- **Purpose:** Like a post
- **Auth:** User
- **Response 200:** `{ likesCount, liked: true }`
- **Errors:** 401, 404, 409 (already liked)

### DELETE /posts/:id/like
- **Purpose:** Unlike a post
- **Auth:** User
- **Response 200:** `{ likesCount, liked: false }`
- **Errors:** 401, 404

---

## Comments

### GET /posts/:id/comments
- **Purpose:** View all comments on a post
- **Auth:** Public
- **Response 200:** `{ comments: [...] }`

### POST /posts/:id/comments
- **Purpose:** Add a comment
- **Auth:** User
- **Body:** `{ content }`
- **Response 201:** created comment object
- **Validation:** content 1–500 chars
- **Errors:** 400, 401, 404 (post not found)

### DELETE /comments/:id
- **Purpose:** Delete a comment
- **Auth:** Owner or Admin
- **Response 200:** `{ message: "Comment deleted" }`
- **Errors:** 401, 403, 404

---

## Users

### GET /users/:id
- **Purpose:** View a profile
- **Auth:** Public
- **Response 200:** `{ id, name, username, bio, avatarUrl, followersCount, followingCount, postsCount }`
- **Errors:** 404

### PUT /users/:id
- **Purpose:** Edit own profile
- **Auth:** Self only
- **Body:** `{ name?, bio?, avatar? (file) }`
- **Response 200:** updated user object
- **Errors:** 401, 403 (not self), 400 (validation)

### POST /users/:id/follow
- **Purpose:** Follow a user
- **Auth:** User
- **Response 200:** `{ followingCount, isFollowing: true }`
- **Errors:** 400 (cannot follow self), 401, 404, 409 (already following)

### DELETE /users/:id/follow
- **Purpose:** Unfollow a user
- **Auth:** User
- **Response 200:** `{ followingCount, isFollowing: false }`
- **Errors:** 401, 404

---

## Admin

### GET /admin/users
- **Purpose:** List all users for moderation
- **Auth:** Admin
- **Response 200:** `{ users: [...] }`
- **Errors:** 401, 403 (not admin)

### PATCH /admin/users/:id
- **Purpose:** Deactivate/reactivate a user
- **Auth:** Admin
- **Body:** `{ isActive: false }`
- **Response 200:** updated user object
- **Errors:** 401, 403, 404

### GET /admin/posts
- **Purpose:** List all posts for moderation
- **Auth:** Admin
- **Response 200:** `{ posts: [...] }`
- **Errors:** 401, 403

---

## HTTP Status Code Summary

| Code | Meaning (in this API) |
|---|---|
| 200 | Success (read/update/delete) |
| 201 | Resource created |
| 400 | Validation error |
| 401 | Missing/invalid JWT |
| 403 | Authenticated but not authorized (wrong owner/role) |
| 404 | Resource not found |
| 409 | Conflict (duplicate email/username, already liked/following) |
| 500 | Unexpected server error |