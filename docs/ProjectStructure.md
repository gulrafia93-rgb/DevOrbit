# DevOrbit — Project Structure

```
devorbit/
├── client/
│   ├── src/
│   │   ├── assets/        # static images, icons, default avatar
│   │   ├── components/    # Navbar.jsx, Footer.jsx, ProtectedRoute.jsx (built Day 3);
│   │   │                  # PostCard, PostForm, CommentList, CommentForm, ProfileCard,
│   │   │                  # FollowButton, TagFilterBar, AuthForm, Loader, Toast (Days 4+)
│   │   ├── layouts/        # MainLayout.jsx (built Day 3)
│   │   ├── pages/          # Login.jsx, Register.jsx, Feed.jsx (placeholder), NotFound.jsx
│   │   │                   # (built Day 3); PostDetail, Profile, EditProfile, AdminDashboard (Days 4+)
│   │   ├── hooks/          # useAuth, usePosts, useFetch (Days 4+)
│   │   ├── context/        # AuthContext.jsx (scaffolded Day 3, logic added Day 4)
│   │   ├── services/       # api.js (Axios instance, built Day 3); postService,
│   │   │                   # userService, authService (Days 4+)
│   │   ├── utils/          # formatDate, validators, constants (Days 4+)
│   │   ├── routes/         # AppRoutes.jsx (built Day 3)
│   │   ├── App.css, index.css  # Tailwind v4 import lives in index.css
│   │   └── App.jsx (wired to Router + AuthProvider + MainLayout, Day 3)
│   ├── vite.config.js  # includes @tailwindcss/vite plugin
│   ├── .env  # VITE_API_BASE_URL (gitignored)
│   └── README.md
│
├── server/
│   ├── config/            # db.js (Mongoose connection, built Day 3); cloudinary.js (Day 5)
│   ├── controllers/       # authController, userController, postController,
│   │                      # commentController, adminController (Days 4+)
│   ├── middleware/        # errorHandler.js (built Day 3); authMiddleware, adminMiddleware,
│   │                      # uploadMiddleware, rateLimiter (Days 4+)
│   ├── models/             # User.js, Post.js, Comment.js (Mongoose schemas, Days 4+)
│   ├── routes/              # authRoutes, userRoutes, postRoutes, commentRoutes, adminRoutes (Days 4+)
│   ├── services/            # cloudinaryUpload.js (upload helper, Day 5)
│   ├── utils/                # generateToken.js (Day 4)
│   ├── validators/           # request validation schemas (Days 4+)
│   ├── .env                   # MONGO_URI, JWT_SECRET, etc. (gitignored, built Day 3)
│   ├── server.js               # entry point — connects DB then starts HTTP server (built Day 3)
│   └── app.js                   # Express app config: cors, morgan, /api/health, errorHandler (built Day 3)
│
├── docs/                          # this folder — ARCHITECTURE, SCHEMA, API, UI-WIREFRAMES,
│                                   # PROJECT-STRUCTURE, SECURITY
│
├── README.md
├── .gitignore
└── LICENSE
```

## Why this structure is scalable and maintainable

- **Separation of concerns:** routes only define endpoints, controllers hold logic, models hold schema/validation — a bug in "how a post is validated" only ever means opening `models/Post.js`, never hunting across files.
- **`services/` on both sides** isolate external-facing logic (API calls on the client, Cloudinary upload on the server) so swapping a provider later never touches component or controller code.
- **`context/` instead of scattered prop-drilling** keeps auth state predictable as more pages get added in Days 4–9.
- **One folder per concern, not per feature** — for a project this size, feature-based folders would add navigation overhead without payoff; this structure is the simpler correct choice.
- **`docs/` living in the repo root** means the SRD, this blueprint, and all Day 2 docs travel with the code — anyone (including a future AI session) can open the repo and have full context immediately.