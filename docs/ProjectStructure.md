# DevOrbit — Project Structure

```
devorbit/
├── client/
│   ├── src/
│   │   ├── assets/        # static images, icons, default avatar
│   │   ├── components/    # Navbar, PostCard, PostForm, CommentList, CommentForm,
│   │   │                  # ProfileCard, FollowButton, TagFilterBar, AuthForm,
│   │   │                  # ProtectedRoute, Loader, Toast
│   │   ├── layouts/        # shared page shells (e.g. MainLayout with Navbar)
│   │   ├── pages/          # Home, Login, Register, Feed, PostDetail, Profile,
│   │   │                   # EditProfile, AdminDashboard, NotFound
│   │   ├── hooks/          # useAuth, usePosts, useFetch (custom hooks)
│   │   ├── context/        # AuthContext (Context API + useReducer)
│   │   ├── services/       # api.js (Axios instance + interceptors), postService,
│   │   │                   # userService, authService — one file per resource
│   │   ├── utils/          # formatDate, validators, constants
│   │   ├── routes/         # AppRoutes.jsx (route definitions)
│   │   ├── styles/         # Tailwind config, global.css
│   │   └── App.jsx
│   └── README.md
│
├── server/
│   ├── config/            # db.js (Mongoose connection), cloudinary.js
│   ├── controllers/       # authController, userController, postController,
│   │                      # commentController, adminController
│   ├── middleware/        # authMiddleware (verify JWT), adminMiddleware (role check),
│   │                      # errorHandler, uploadMiddleware (Multer config), rateLimiter
│   ├── models/             # User.js, Post.js, Comment.js (Mongoose schemas)
│   ├── routes/              # authRoutes, userRoutes, postRoutes, commentRoutes, adminRoutes
│   ├── services/            # cloudinaryUpload.js (upload helper)
│   ├── utils/                # generateToken.js
│   ├── validators/           # request validation schemas (per resource)
│   ├── uploads/               # (temp, gitignored — Multer local buffer before Cloudinary push)
│   ├── server.js               # starts the HTTP server
│   └── app.js                   # Express app config (middleware, routes mounted)
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