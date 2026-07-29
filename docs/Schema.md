# DevOrbit — Database Schema Design

Conceptual design only — no Mongoose model code yet (that's Day 3).

## 1. Users Collection

**Purpose:** Stores account credentials, profile info, and the social graph (followers/following). Satisfies FR-1, FR-2, FR-5, FR-6, FR-17, FR-18.

| Field | Type | Required | Default | Validation |
|---|---|---|---|---|
| name | String | Yes | — | 2–50 chars |
| username | String | Yes | — | unique, 3–20 chars, alphanumeric + underscore |
| email | String | Yes | — | unique, valid email format |
| passwordHash | String | Yes | — | never returned in API responses |
| bio | String | No | "" | max 160 chars |
| avatarUrl | String | No | default avatar URL | must be valid Cloudinary URL when set |
| role | String (enum) | Yes | "user" | one of: `user`, `admin` |
| isActive | Boolean | Yes | true | set to false by Admin deactivation (FR-20) |
| followers | [ObjectId] (ref: User) | No | [] | self-referencing |
| following | [ObjectId] (ref: User) | No | [] | self-referencing |
| createdAt / updatedAt | Date | Yes | auto (timestamps) | — |

**Indexes:** unique index on `username`, unique index on `email`.

**Relationships:** self-referencing many-to-many (followers/following); one-to-many with Posts (author) and Comments (author).

## 2. Posts Collection

**Purpose:** Core content unit — text, optional image, optional code snippet, tags. Satisfies FR-8, FR-9, FR-10, FR-11, FR-15, FR-16.

| Field | Type | Required | Default | Validation |
|---|---|---|---|---|
| author | ObjectId (ref: User) | Yes | — | must reference an existing, active user |
| content | String | Conditional | — | required if no image AND no codeSnippet; max 2000 chars |
| imageUrl | String | No | null | valid Cloudinary URL when present |
| codeSnippet | Object `{ code: String, language: String }` | No | null | code max 3000 chars |
| tags | [String] | No | [] | max 5 tags, each max 20 chars, lowercase-normalized |
| likes | [ObjectId] (ref: User) | No | [] | used to compute like count + "did I like this" |
| commentsCount | Number | Yes | 0 | denormalized counter, incremented/decremented on comment create/delete |
| createdAt / updatedAt | Date | Yes | auto (timestamps) | — |

**Indexes:** index on `author`, index on `tags`, index on `createdAt` (descending, for feed sort).

**Relationships:** many-to-one with User (author); one-to-many with Comments.

## 3. Comments Collection

**Purpose:** Threaded feedback on a post (flat, not nested, per v1.0 scope). Satisfies FR-12, FR-13, FR-14.

| Field | Type | Required | Default | Validation |
|---|---|---|---|---|
| post | ObjectId (ref: Post) | Yes | — | must reference an existing post |
| author | ObjectId (ref: User) | Yes | — | must reference an existing, active user |
| content | String | Yes | — | 1–500 chars |
| createdAt / updatedAt | Date | Yes | auto (timestamps) | — |

**Indexes:** index on `post` (for fetching all comments on a post efficiently).

**Relationships:** many-to-one with Post, many-to-one with User (author).

## 4. Design Notes

- **Likes and follows are embedded reference arrays**, not separate collections — correct for v1.0's scale. If DevOrbit ever needed to scale past a portfolio project, these would normalize into their own collections to avoid unbounded array growth. This is explicitly a *future* consideration, not a v1.0 requirement.
- **commentsCount is denormalized** on the Post document so the feed doesn't need a separate count query per post — a small write-time cost (increment/decrement) for a large read-time saving.
- Every collection maps directly to functional requirements from the SRD — no speculative fields were added.