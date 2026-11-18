# GitSummarizer — Frontend

GitSummarizer is an AI-powered web application that turns any public GitHub repository into a beginner-friendly overview, key features, prerequisites and plain-English release notes. This document covers the **frontend** (the `client` app): what was built, how it is structured, and how it talks to the Spring Boot backend.

> **Stack at a glance:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (Base UI) · TanStack Query · React Hook Form + Zod

## 🌐 Live Demo

**👉 [Open GitSummarizer](https://gitsummarizer-mauve.vercel.app)**

<!-- Replace https://your-app-name.vercel.app (here and in the Deployment section) with your real deployed frontend URL. -->

Create an account, paste any public GitHub repository URL (for example `vercel/next.js`), and get an instant summary.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Use Cases](#2-use-cases)
3. [Tech Stack](#3-tech-stack)
4. [Architecture and Data Flow](#4-architecture-and-data-flow)
5. [Features Implemented](#5-features-implemented)
6. [Project Structure](#6-project-structure)
7. [Routing and Route Protection](#7-routing-and-route-protection)
8. [Authentication](#8-authentication)
9. [Backend Communication (REST)](#9-backend-communication-rest)
10. [State and Data Management](#10-state-and-data-management)
11. [Component Reference](#11-component-reference)
12. [Input Validation](#12-input-validation)
13. [Error Handling](#13-error-handling)
14. [UI, Styling and Theming](#14-ui-styling-and-theming)
15. [Getting Started](#15-getting-started)
16. [Environment Variables](#16-environment-variables)
17. [Scripts](#17-scripts)
18. [Deployment](#18-deployment)
19. [Security Notes](#19-security-notes)
20. [Development Plan Mapping](#20-development-plan-mapping)
21. [Helpful Resources](#21-helpful-resources)

---

## 1. Introduction

Instead of digging through long README files or cryptic git commit logs, a user pastes a GitHub repository URL and GitSummarizer returns:

- a **beginner-friendly overview** of the project,
- **key features**,
- **prerequisites**,
- **release notes** generated from recent commits,
- the repository's **recent commits** and its raw **README**.

Every summary is saved to the signed-in user's **history**, where it can be searched, bookmarked, exported or deleted.

The frontend is responsible for the user interface, client-side validation, session handling and presentation of the summaries. All GitHub access and AI summarisation happens on the Spring Boot backend; the frontend never holds API keys.

## 2. Use Cases

| Audience | How they use it |
| --- | --- |
| Junior developers and students | Understand open-source repositories without reading dense documentation. |
| Product managers and stakeholders | Turn technical commits into clear, business-friendly release notes. |
| Open-source maintainers | Generate quick overviews and changelogs to onboard new contributors. |

These audiences are also presented on the public landing page.

## 3. Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack), React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, `tw-animate-css`, shadcn/ui (`base-nova` style), `class-variance-authority`, `tailwind-merge`, `clsx` |
| UI primitives | `@base-ui/react`, `lucide-react` icons |
| Server state | TanStack React Query 5 |
| Forms and validation | React Hook Form, Zod 4, `@hookform/resolvers` |
| Markdown | `react-markdown` + `remark-gfm` |
| Notifications | `react-hot-toast` |
| Dates | `date-fns` |
| Linting | ESLint 9 with `eslint-config-next` |

> **Note on the original plan:** the project brief listed "React (Vite)". The frontend was built with **Next.js** (which is React-based) to get file-based routing, a built-in route guard and a server-side API proxy. The backend is **Spring Boot** (not Express).

## 4. Architecture and Data Flow

```
┌──────────────────────────────────────────────┐
│  Browser — Next.js 16 frontend (this repo)   │
│  React 19 · Tailwind CSS · React Query       │
└──────────────────────┬───────────────────────┘
                       │  direct HTTPS API request
                       ▼
┌──────────────────────────────────────────────┐
│  Spring Boot backend (separate repo)         │
│  GitHub REST API  ·  LLM provider  ·  DB     │
└──────────────────────────────────────────────┘
```

**Data flow**

1. The user signs in; a bearer token is stored in the browser and every protected request sends it.
2. The user pastes a repository URL on the dashboard. The frontend validates and normalises it.
3. The frontend calls `POST /api/ai/summarize` once. The backend fetches the README and recent commits from GitHub, generates the structured summary, saves it to the user's history, and returns repository details and summary together.
4. The frontend renders the result (overview, features, prerequisites, release notes, commits, README) and refreshes the history list.

The browser sends API requests directly to `NEXT_PUBLIC_BACKEND_URL`, so the backend URL appears in the browser's Network tab. The backend must allow the frontend's origin through CORS.

## 5. Features Implemented

### Public site
- **Landing page** with hero, product preview, feature cards, "How it works" steps, target audiences and an FAQ. Sign in / Sign up appear once, in the header.
- **Public header** with logo, theme toggle and Sign in / Sign up links.

### Authentication
- Register, log in, log out.
- Forgot password and reset password (token link).
- Password show/hide input, field-level validation messages, friendly error messages.
- Persistent sessions (7-day session cookie + stored token), re-validated on every app load.

### Dashboard (signed-in)
- **Repository form** that accepts full URLs, `owner/repo` shorthand, `.git` suffixes, extra paths (`/tree/main`) and commit links. One-click example repositories (`vercel/next.js`, `spring-projects/spring-boot`, `facebook/react`).
- **Step-by-step progress indicator** and skeleton placeholders while the summary loads.
- **Repository card** with name, description, language, stars, forks and default branch, plus a Save / Unsave bookmark button.
- **Summary view**: Overview, Key features, Prerequisites, Release notes (rendered Markdown), AI provider badge, and **Copy as Markdown**.
- **Recent commits list** with short SHA links to GitHub, author and relative time; a pasted commit link is highlighted as the "linked commit".
- **Collapsible README preview** (Markdown, truncated at 30,000 characters for performance).
- **History section**:
  - summary stats (total searches, saved count, most-used language),
  - "All searches" / "Saved" tabs,
  - live search by name, description or language,
  - save/unsave, delete a single entry, **Clear** all (saved ones are kept),
  - **Export to JSON**,
  - open any past entry again with one click.

### Quality of life
- Light / dark theme, with no flash on page load and respect for the system setting.
- Toast notifications for success and error states.
- Custom error and 404 pages.
- Responsive layout (mobile to desktop), accessible labels, `role="alert"` on errors and `aria-expanded` on collapsibles.

## 6. Project Structure

```
client/
├── .env.example               # Environment template
├── components.json            # shadcn/ui configuration
├── eslint.config.mjs
├── next.config.ts             # Next.js configuration
├── package.json
├── public/                    # Static assets
└── src/
    ├── proxy.ts               # Route guard (Next.js 16 "proxy", formerly middleware)
    ├── app/
    │   ├── layout.tsx         # Root layout, metadata, no-flash theme script
    │   ├── globals.css        # Tailwind 4 theme tokens (light/dark)
    │   ├── error.tsx          # Global error boundary
    │   ├── not-found.tsx      # 404 page
    │   ├── (public)/          # Landing page ( / )
    │   ├── (auth)/            # /login /register /forgot-password /reset-password
    │   └── (app)/             # /dashboard (protected)
    ├── components/
    │   ├── ui/                # button, badge, card, input, skeleton
    │   ├── auth/              # auth provider, guard, forms, fields
    │   ├── summarizer.tsx     # Summary workflow (fetch + render)
    │   ├── summary-view.tsx   # Overview / features / prerequisites / release notes
    │   ├── repo-form.tsx      # URL input form
    │   ├── repo-card.tsx      # Repository details + save button
    │   ├── commit-list.tsx    # Recent commits
    │   ├── readme-preview.tsx # Collapsible README
    │   ├── history-section.tsx# History, saved, search, export
    │   ├── dashboard-view.tsx # Dashboard composition
    │   ├── markdown.tsx       # Safe, styled Markdown renderer
    │   ├── loading-states.tsx # Progress steps + skeletons
    │   ├── error-state.tsx    # Friendly error panel with retry
    │   ├── app-header.tsx / public-header.tsx / logo.tsx / theme-toggle.tsx
    │   └── providers.tsx      # React Query + Auth + Toaster
    └── lib/
        ├── api.ts             # Backend client, ApiError, error copy
        ├── storage.ts         # useHistory() hook (React Query)
        ├── github-url.ts      # URL parsing, normalising, Zod schema
        ├── types.ts           # DTO types mirroring the backend
        ├── utils.ts           # cn(), formatCount()
        └── auth/
            ├── constants.ts   # Route lists and resolveRoute()
            ├── types.ts       # AuthService interface, AuthError, messages
            ├── schemas.ts     # Zod schemas for auth forms
            ├── service.ts     # Picks api or mock implementation
            ├── api-service.ts # Real backend auth
            ├── mock-service.ts# Browser-only demo auth
            └── session.ts     # Token, profile and cookie helpers
```

The folders in parentheses, such as `(public)`, `(auth)` and `(app)`, are Next.js **route groups**. They give each area its own layout without changing the URL.

## 7. Routing and Route Protection

| Route | Page | Access |
| --- | --- | --- |
| `/` | Landing page | Logged out only |
| `/login` | Sign in | Logged out only |
| `/register` | Create account | Logged out only |
| `/forgot-password` | Request reset link | Logged out only |
| `/reset-password?token=…` | Choose a new password | Logged out only |
| `/dashboard` | Summarizer + history | Logged in only |
| `/dashboard?repo=<url>` | Dashboard with a summary loaded | Logged in only |
| anything else | Redirected (see below) | — |

Rules, implemented in `lib/auth/constants.ts` (`resolveRoute`) and enforced in `src/proxy.ts`:

- **Logged out:** public routes are shown; `/dashboard` and any unknown URL redirect to `/login`.
- **Logged in:** `/dashboard` is shown; `/`, `/login`, `/register` and any unknown URL redirect to `/dashboard`.

There are two layers:

1. **`proxy.ts`** runs before any page renders. It checks for the `gs_session` cookie, so a logged-out user never receives the dashboard. It skips `/api/*`, `/_next/*` and static files.
2. **`AuthGuard`** (client side, in the `(app)` layout) re-checks once the session is validated. If it is invalid or expired, the user is sent to `/login`.

The dashboard URL is shareable: `?repo=` holds the repository, so a refresh or a link re-runs the same summary.

## 8. Authentication

Authentication is built behind an `AuthService` interface (`lib/auth/types.ts`) with two interchangeable implementations, selected by `NEXT_PUBLIC_AUTH_MODE`.

| Mode | Implementation | Purpose |
| --- | --- | --- |
| `api` (default) | `api-service.ts` | Real Spring Boot authentication with bearer tokens. |
| `mock` | `mock-service.ts` | Browser-only accounts in `localStorage` (SHA-256 hashed) for a UI preview without a backend. No server history is available in this mode. |

**Session handling**

- On login or register the backend returns `{ token, user }`. The token is stored in `localStorage` (`gs:token`); the user id and profile are cached (`gs:user-id`, `gs:user-profile`).
- A lightweight cookie `gs_session` (7 days, `SameSite=Lax`, `Secure` on HTTPS) tells the route guard that a session exists.
- `AuthProvider` validates the stored session once on load via `GET /api/auth/me`. If the backend is unreachable but a token and cached profile exist, the cached user is kept so a temporary outage does not log the user out.
- `AuthProvider.apply()` is the single place that keeps cookie, storage, React Query cache and state in sync. Any user change clears the query cache so one account's data never leaks to another.
- Logout calls the backend, clears everything locally even if that call fails, and does a hard navigation to `/login`.
- Forgot-password responds identically whether or not the email exists. In development the backend can return a reset link in the `X-Dev-Reset-Link` header, which the UI displays.

**Password rules:** at least 8 characters, at least one letter and one number.

## 9. Backend Communication (REST)

All requests go directly to `NEXT_PUBLIC_BACKEND_URL/api/*`. Protected calls send `Authorization: Bearer <token>`.

| Frontend action | Method and endpoint |
| --- | --- |
| Register | `POST /api/auth/register` |
| Sign in | `POST /api/auth/login` |
| Current user | `GET /api/auth/me` |
| Sign out | `POST /api/auth/logout` |
| Request password reset | `POST /api/auth/forgot-password` |
| Reset password | `POST /api/auth/reset-password` |
| Summarize a repository | `POST /api/ai/summarize` — body `{ "url": "https://github.com/owner/repo" }` |
| Repository details only | `GET /api/github/repository?url=…` (client helper available) |
| Load history | `GET /api/history` |
| Save / unsave | `PATCH /api/history/{id}` — body `{ "saved": true \| false }` |
| Delete one entry | `DELETE /api/history/{id}` |
| Clear history | `DELETE /api/history?keepSaved=true` |

**Timeouts:** summarize and history calls abort after 120 s; auth calls after 15 s.

**Key response types** (`lib/types.ts`, mirroring the backend DTOs)

```ts
SummaryResult   { repository, summary, provider }
RepositorySummary { overview, features[], prerequisites[], releaseNotes }
GitHubRepository { owner, name, fullName, description, repositoryUrl, defaultBranch,
                   primaryLanguage, stars, forks, readme, recentCommits[] }
GitHubCommit    { sha, message, author, committedAt, url }
HistoryEntry    { id, url, fullName, description, language, stars, summary, saved, createdAt }
ApiErrorBody    { code, message, timestamp }
```

## 10. State and Data Management

- **React Query** (configured in `providers.tsx`): no automatic retries, no refetch on window focus, 5-minute `staleTime`.
  - Query key `["summary", url]` caches each repository summary, so revisiting the same repo is instant.
  - Query key `["history", userId]` holds the history, scoped per user.
- **`useHistory()`** (`lib/storage.ts`) exposes `entries`, `isLoading`, `toggleSaved(url)`, `remove(id)` and `clear(keepSaved)`. Each mutation calls the API and then invalidates the history query.
- **Auth state** lives in `AuthProvider` (React Context) and is read with `useAuth()`.
- **Form state** is handled by React Hook Form.
- **Local UI state** (active tab, search text, README expanded) uses `useState`.
- **Browser storage** access is always wrapped in `try/catch`, so private mode or blocked storage does not crash the app.

## 11. Component Reference

| Component | Responsibility |
| --- | --- |
| `Summarizer` | Reads `?repo=`, runs the summarize query, coordinates form, loading, card, summary, commits, README and error states. Submitting the same URL again refetches; a new URL navigates. |
| `RepoForm` | URL input with Zod validation, example chips and loading state. |
| `RepoCard` | Repo name, description, language, stars, forks, default branch, Save button. |
| `SummaryView` | Overview, feature and prerequisite lists, release notes, provider badge and `summaryToMarkdown()` for copying. |
| `CommitList` | Recent commits with linked SHA, first line of message, author and relative time. |
| `ReadmePreview` | Collapsible raw README, rendered as Markdown. |
| `HistorySection` | Stats, tabs, filter, save/delete/clear, JSON export, link back to a past summary. |
| `DashboardView` | Greeting plus `Summarizer` and `HistorySection`. |
| `Markdown` | `react-markdown` + GFM with per-element Tailwind styling. Raw HTML is **not** rendered. |
| `ProgressSteps`, `RepoCardSkeleton`, `SummarySkeleton` | Loading feedback. |
| `ErrorState` | Friendly title, hint, technical detail and a Retry button for retryable errors. |
| `AuthProvider`, `AuthGuard` | Session state and client-side protection. |
| `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm` | Auth forms built from `AuthCard`, `Field` and `PasswordInput`. |
| `AppHeader`, `PublicHeader`, `Logo`, `ThemeToggle` | Navigation chrome. |
| `ui/*` | `Button`, `Badge`, `Card`, `Input`, `Skeleton` (shadcn/ui). |

## 12. Input Validation

**Repository URL** (`lib/github-url.ts`) uses the same character rules as the backend. Accepted forms:

```
https://github.com/owner/repo
github.com/owner/repo
www.github.com/owner/repo
owner/repo                         (shorthand, expanded automatically)
https://github.com/owner/repo.git
https://github.com/owner/repo/tree/main
https://github.com/owner/repo/commit/<sha>   (commit is highlighted in the list)
```

Before calling the backend, input is converted to the exact canonical form `https://github.com/owner/repo`, because the backend rejects extra paths or query strings.

**Auth forms** (`lib/auth/schemas.ts`, Zod): valid email, name 2–60 characters, password rules above, and matching confirmation.

## 13. Error Handling

Every API helper throws a normalised `ApiError(message, code, status)`. `errorCopy()` maps each backend error code to a friendly title and hint:

| Code | Meaning shown to the user |
| --- | --- |
| `INVALID_GITHUB_URL`, `INVALID_REQUEST` | Not a valid repository URL |
| `GITHUB_REPOSITORY_NOT_FOUND` | Repository missing or private (only public repos supported) |
| `GITHUB_ACCESS_DENIED` | Repository restricted or private |
| `GITHUB_AUTHENTICATION_FAILED` | Server GitHub token rejected |
| `GITHUB_RATE_LIMITED` | GitHub rate limit reached; retry later |
| `GITHUB_UPSTREAM_ERROR` | GitHub is having problems |
| `AI_NOT_CONFIGURED` | Backend is missing its AI API key |
| `AI_EMPTY_RESPONSE`, `AI_UPSTREAM_ERROR` | AI failed or returned nothing; retry |
| `NETWORK_ERROR` | Backend unreachable (also used for 5xx without a body) |
| `TIMEOUT` | Request exceeded 120 s |

`isRetryable()` hides the Retry button for errors that retrying cannot fix (invalid URL, not found, access denied). Auth errors use a separate `AuthError` with messages such as "Incorrect email or password" and "An account with this email already exists". Errors surface as inline panels and toasts, and unexpected crashes are caught by `app/error.tsx`.

## 14. UI, Styling and Theming

- **Tailwind CSS 4** with design tokens defined as CSS variables in `globals.css`, used through shadcn/ui conventions (`primary`, `muted`, `card`, `border`, …).
- **Dark mode** is class-based (`.dark`). An inline script in the root layout applies the saved or system preference before first paint, avoiding a flash. `ThemeToggle` stores the choice in `localStorage` under `theme`.
- **Responsive design:** content is centred in `max-w-5xl` (app) or `max-w-6xl` (landing) containers, grids collapse on small screens, and the header hides text labels on mobile.
- **Accessibility:** labelled inputs, `aria-invalid`, `role="alert"` and `role="status"`, `aria-expanded` on the README toggle, and decorative icons hidden from screen readers.
- **Loading UX:** a three-step progress indicator ("Fetching repository", "Reading README & commits", "Generating summary") and skeletons shaped like the final content.

## 15. Getting Started

**Prerequisites**

- Node.js **20.9 or newer**
- The Spring Boot backend running (default `http://localhost:8081`). See the backend README.

**Steps**

```bash
# 1. Enter the frontend folder
cd client

# 2. Create your local environment file
cp .env.example .env.local

# 3. Install dependencies
npm ci

# 4. Start the dev server
npm run dev
```

Open <http://localhost:3000>, create an account, and summarize a repository.

**UI-only preview (no backend):** set `NEXT_PUBLIC_AUTH_MODE=mock` in `.env.local`. Accounts are stored in the browser. Summaries and history still need the backend, so use this only to look at the interface.

## 16. Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:8081` | Spring Boot base URL used by browser API requests. |
| `NEXT_PUBLIC_AUTH_MODE` | `api` | `api` for the real backend, `mock` for a UI preview. |

```dotenv
NEXT_PUBLIC_BACKEND_URL=http://localhost:8081
NEXT_PUBLIC_AUTH_MODE=api
```

`.env*` files are git-ignored. Only `.env.example` is meant to be shared.

## 17. Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server (Turbopack) |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## 18. Deployment

**Live frontend:** [https://your-app-name.vercel.app](https://your-app-name.vercel.app)

1. Deploy the Spring Boot backend first (for example on Render) and note its public URL.
2. Deploy the frontend (for example on Vercel).
3. Set `NEXT_PUBLIC_BACKEND_URL` to the deployed backend URL and keep `NEXT_PUBLIC_AUTH_MODE=api`.
4. Build with `npm run build` and run with `npm start` if self-hosting.

Configure the backend's `CORS_ALLOWED_ORIGINS` environment variable to include the deployed frontend origin (for example, `https://your-app-name.vercel.app`). For local development, the backend allows `http://localhost:3000` by default. If the AI call may exceed your host's request limit, check the platform's request timeout, since summaries can take up to two minutes.

## 19. Security Notes

- API keys (GitHub, AI provider) exist only on the backend; the browser never sees them.
- Markdown from READMEs and AI output is rendered **without raw HTML**, so untrusted content cannot inject markup. External links open with `rel="noopener noreferrer"`.
- The route guard is a **UX layer only**; the backend must authorise every API call. The `gs_session` cookie merely signals that a session exists.
- The session token is currently kept in `localStorage`. For production hardening, have the backend set an **httpOnly, Secure** cookie instead.
- Mock auth uses SHA-256 in the browser and is **not** real security; it is for previews only.
- History is scoped per user, and the query cache is cleared on every login and logout.

## 20. Development Plan Mapping

How the frontend work lines up with the one-month plan:

| Week | Planned | Frontend status |
| --- | --- | --- |
| 1 — Setup and architecture | Initialise frontend with Tailwind, base layout | Done: Next.js + Tailwind 4 + shadcn/ui, layouts, theming, providers |
| 2 — GitHub integration and URL parser | Robust URL parsing, edge cases | Done: `github-url.ts`, canonical URLs, backend error mapping for invalid/private/rate-limited |
| 3 — AI summary and commit digest | Render structured Markdown output | Done: `SummaryView`, `Markdown`, `CommitList`, `ReadmePreview` |
| 4 — History, dashboard, polish | Dashboard, spinners, error states, deploy | Done: history/saved/search/export, skeletons, progress steps, toasts, error pages. Deployment pending |

Beyond the original plan, the frontend also includes a full authentication flow (including password reset), a landing page, dark mode and Markdown copy/export.

## 21. Helpful Resources

- [Next.js documentation](https://nextjs.org/docs)
- [React documentation](https://react.dev)
- [Tailwind CSS documentation](https://tailwindcss.com/docs)
- [shadcn/ui documentation](https://ui.shadcn.com)
- [TanStack Query documentation](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com) and [Zod](https://zod.dev)
- [GitHub REST API documentation](https://docs.github.com/en/rest)
- [Spring Boot reference](https://docs.spring.io/spring-boot/index.html)