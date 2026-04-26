# ShreyasIDE — Full-Stack Online Code Editor

A browser-based IDE where users can write HTML, CSS, and JavaScript with a live preview, save projects to the cloud, and access them from anywhere.

**Live:** https://shreyaside.vercel.app

---

## Table of Contents

1. [What is this project?](#1-what-is-this-project)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Project Structure](#4-project-structure)
5. [Features](#5-features)
6. [Data Models](#6-data-models)
7. [API Reference](#7-api-reference)
8. [Authentication Flow](#8-authentication-flow)
9. [Editor — How it Works](#9-editor--how-it-works)
10. [State Management](#10-state-management)
11. [Deployment](#11-deployment)
12. [Environment Variables](#12-environment-variables)
13. [Local Setup](#13-local-setup)
14. [Interview Q&A](#14-interview-qa)

---

## 1. What is this project?

ShreyasIDE is a full-stack web application that replicates the core experience of tools like CodePen or JSFiddle. Users register, log in, create named projects, write front-end code in a Monaco-powered editor, and see the output rendered live in an iframe — all persisted in MongoDB.

---

## 2. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + Vite | Fast HMR, component model, modern tooling |
| Styling | Tailwind CSS | Utility-first, no context switching |
| Code Editor | Monaco Editor (`@monaco-editor/react`) | Same engine as VS Code — syntax highlighting, IntelliSense |
| Routing | React Router v6 | Declarative, nested routes, `Navigate` guards |
| Notifications | React Toastify | Non-blocking user feedback |
| Backend | Node.js + Express | Lightweight REST API, large ecosystem |
| Database | MongoDB + Mongoose | Schema-flexible, JSON-native, easy cloud hosting |
| Auth | JWT + bcryptjs | Stateless tokens, password hashing |
| Deployment | Vercel (frontend) + Railway/Render (backend) | Zero-config CI/CD |

---

## 3. Architecture Overview

```
Browser
  │
  ├── React SPA (Vite build → Vercel)
  │     ├── /login  /signUp          ← Public routes
  │     ├── /                        ← Protected: project dashboard
  │     └── /editior/:projectID      ← Protected: Monaco editor + iframe preview
  │
  └── REST API calls (CORS-enabled)
        │
        ├── Express Server (Node.js → Railway/Render)
        │     ├── POST /signUp
        │     ├── POST /login
        │     ├── POST /getUserDetails
        │     ├── POST /createProject
        │     ├── POST /getProjects
        │     ├── POST /getProject
        │     ├── POST /updateProject
        │     └── POST /deleteProject
        │
        └── MongoDB Atlas
              ├── users collection
              └── projects collection
```

**Key design decision:** The frontend and backend are completely decoupled — separate repos/deployments communicating over HTTP. This makes them independently scalable.

---

## 4. Project Structure

```
OnlineIDE/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx        ← Auth form
│       │   ├── SignUp.jsx       ← Registration form
│       │   ├── Home.jsx         ← Project dashboard
│       │   ├── Editior.jsx      ← Monaco editor + live preview
│       │   └── NoPage.jsx       ← 404
│       ├── components/
│       │   ├── Navbar.jsx       ← Dashboard nav (grid/list toggle)
│       │   ├── EditiorNavbar.jsx ← Editor nav (save, download, toggle view)
│       │   ├── GridCard.jsx     ← Project card (grid layout)
│       │   └── ListCard.jsx     ← Project card (list layout)
│       ├── context/
│       │   └── ThemeContext.jsx ← Global dark/light mode state
│       ├── helper.js            ← api_base_url from env
│       └── App.jsx              ← Router + auth guards
│
└── backend/
    ├── models/
    │   ├── userModel.js         ← Mongoose User schema
    │   └── projectModel.js      ← Mongoose Project schema
    ├── routes/
    │   └── index.js             ← All API endpoints
    ├── db.js                    ← MongoDB connection
    ├── app.js                   ← Express app setup, CORS, middleware
    └── bin/www                  ← HTTP server entry point
```

---

## 5. Features

- **User Auth** — Register with username/email/password, login returns a JWT stored in localStorage
- **Project Dashboard** — View all your projects in grid or list layout, search by name
- **Create / Delete Projects** — Named projects with duplicate-title prevention
- **Monaco Editor** — VS Code-quality editor for HTML, CSS, JS with syntax highlighting
- **Live Preview** — iframe re-renders within 300ms of every keystroke (debounced)
- **Save Projects** — Manual save button + `Ctrl+S` keyboard shortcut
- **Download Code** — Exports the full combined HTML file to disk
- **Dark / Light Mode** — Persisted in localStorage via React Context
- **Responsive** — Mobile view toggles between editor and preview pane
- **Expand Mode** — Editor can go full-width hiding the preview

---

## 6. Data Models

### User
```js
{
  name: String,
  username: { type: String, unique: true },
  email:    { type: String, unique: true },
  password: String,          // bcrypt hash, never plain text
  date:     { type: Date, default: Date.now },
  isBlocked: { type: Boolean, default: false },
  isAdmin:   { type: Boolean, default: false }
}
```

### Project
```js
{
  title:     String,
  createdBy: String,         // userId (string reference, not ObjectId ref)
  date:      { type: Date, default: Date.now },
  htmlCode:  { type: String, default: "<!DOCTYPE html>..." },
  cssCode:   { type: String, default: "body { margin: 0; ... }" },
  jsCode:    { type: String, default: 'console.log("Hello World")' }
}
```

**Note:** `createdBy` stores the userId as a plain String rather than a Mongoose `ObjectId` ref — this works but means you can't use `.populate()`. A future improvement would be `{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }`.

---

## 7. API Reference

All endpoints are `POST`. All responses follow `{ success: Boolean, message: String, ...data }`.

| Endpoint | Body | Response |
|---|---|---|
| `/signUp` | `{ username, name, email, password }` | `{ success, message }` |
| `/login` | `{ email, password }` | `{ success, token, userId }` |
| `/getUserDetails` | `{ userId }` | `{ success, user: { username, name, email } }` |
| `/createProject` | `{ userId, title }` | `{ success, projectId }` |
| `/getProjects` | `{ userId }` | `{ success, projects: [...] }` |
| `/getProject` | `{ userId, projId }` | `{ success, project }` |
| `/updateProject` | `{ userId, projId, htmlCode, cssCode, jsCode }` | `{ success }` |
| `/deleteProject` | `{ userId, progId }` | `{ success }` |

**Why all POST?** Simplicity — avoids URL parameter encoding for IDs and keeps request bodies consistent. In a production REST API you'd use GET/PUT/DELETE with proper resource URLs.

---

## 8. Authentication Flow

```
1. User submits login form
        ↓
2. POST /login → bcrypt.compare(plainPassword, hashedPassword)
        ↓
3. On match → jwt.sign({ email, userId }, JWT_SECRET, { expiresIn: '7d' })
        ↓
4. Token + userId stored in localStorage
        ↓
5. React reads localStorage on mount → sets isLoggedIn state
        ↓
6. React Router <Navigate> guards redirect unauthenticated users to /login
        ↓
7. All API calls send userId in body (token is stored but not yet sent as Bearer header)
```

**Password hashing:** bcryptjs with salt rounds = 10. bcrypt is intentionally slow (work factor), making brute-force attacks expensive.

**JWT:** Stateless — the server doesn't store sessions. Any server instance can verify the token using the shared secret.

**Current limitation:** The JWT token is stored in localStorage (XSS-vulnerable). A more secure approach is `httpOnly` cookies. Also, the API currently validates by `userId` in the body rather than verifying the JWT on each request — adding a middleware that verifies the token would be a clear improvement.

---

## 9. Editor — How it Works

The editor page (`Editior.jsx`) is the most complex component. Here's the data flow:

```
User types in Monaco Editor
        ↓
onChange → setHtmlCode / setCssCode / setJsCode (React state)
        ↓
useEffect watches [htmlCode, cssCode, jsCode]
        ↓
setTimeout 300ms debounce → run()
        ↓
run() builds: html + <style>css</style> + <script>js</script>
        ↓
Sets iframe.srcdoc = combined string
        ↓
Browser renders the iframe in a sandboxed context
```

**Why `srcdoc` instead of `src`?** `srcdoc` injects HTML directly as a string without a network request — faster and works offline. The iframe acts as a sandboxed execution environment so user JS can't access the parent page's DOM.

**Debounce:** The 300ms `setTimeout` (cleared on each keystroke via `clearTimeout`) prevents the iframe from re-rendering on every single character, which would be janky and expensive.

**Ctrl+S save:** A `keydown` event listener is added in a `useEffect` and properly cleaned up on unmount to avoid memory leaks.

---

## 10. State Management

No Redux or Zustand — state is managed with React's built-in tools:

- **Local state (`useState`)** — form inputs, loading flags, project data, editor content
- **Context API (`ThemeContext`)** — global dark/light mode shared across all components
- **localStorage** — auth persistence (`isLoggedIn`, `userId`, `token`, `theme`)

**ThemeContext pattern:**
```
ThemeProvider (wraps entire app in main.jsx)
  └── provides { isLightMode, toggleTheme }
        └── consumed via useTheme() hook in any component
```

The theme is also applied as a CSS class (`lightMode`) on `document.body`, allowing Tailwind variants to style accordingly.

---

## 11. Deployment

### Frontend → Vercel
- `vite build` produces a `dist/` folder
- `vercel.json` rewrites all routes to `/` so React Router handles client-side navigation (SPA fallback)
- `VITE_API_BASE_URL` env var points to the live backend URL

### Backend → Render
- `npm start` runs `node ./bin/www`
- `PORT`, `MONGODB_URI`, `JWT_SECRET` set as environment variables
- CORS is configured to allow only `localhost:5173` (dev) and `shreyaside.vercel.app` (prod)

---

## 12. Environment Variables

**Backend `.env`**
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/onlineide
JWT_SECRET=<your_secret_key>
PORT=3000
```

**Frontend `.env`**
```
VITE_API_BASE_URL=https://your-backend-url.com
```

Vite only exposes variables prefixed with `VITE_` to the browser bundle.

---

## 13. Local Setup

```bash
# Clone
git clone <repo-url>
cd OnlineIDE

# Backend
cd backend
npm install
# create .env with MONGODB_URI and JWT_SECRET
npm run dev        # nodemon on port 3000

# Frontend (new terminal)
cd frontend
npm install
# create .env with VITE_API_BASE_URL=http://localhost:3000
npm run dev        # Vite on port 5173
```

---

## 14. Interview Q&A

### General / Architecture

**Q: Explain this project in one sentence.**
> A full-stack online IDE where users authenticate, create projects, write HTML/CSS/JS in a Monaco editor, and see a live preview rendered in a sandboxed iframe — all persisted in MongoDB.

**Q: Why did you choose the MERN stack?**
> MongoDB's document model maps naturally to projects (storing code as strings), Express is minimal and flexible for a REST API, React's component model is ideal for a complex UI like an editor with multiple panels, and Node.js keeps the language consistent across the stack.

**Q: How is the frontend and backend connected?**
> They're completely decoupled. The React SPA makes HTTP POST requests to the Express REST API. CORS is configured on the backend to whitelist the frontend's origin. The API base URL is injected via an environment variable so the same frontend code works in both dev and production.

---

### React

**Q: How does the live preview work?**
> When the user types, Monaco's `onChange` updates React state. A `useEffect` watches those state values and runs a debounced function (300ms setTimeout) that concatenates the HTML, CSS (wrapped in `<style>`), and JS (wrapped in `<script>`) into a single string and sets it as the `srcdoc` attribute of an iframe. The browser then renders it in an isolated context.

**Q: Why debounce the preview?**
> Without debouncing, the iframe would re-render on every single keystroke. With a 300ms debounce, it only re-renders after the user pauses typing, which is much smoother and avoids unnecessary DOM operations.

**Q: How does authentication work on the frontend?**
> After a successful login, the JWT token and userId are stored in localStorage. The `App.jsx` component reads `isLoggedIn` from localStorage on mount. React Router's `<Navigate>` component is used as a guard — unauthenticated users are redirected to `/login` before any protected route renders.

**Q: What is the Context API used for here?**
> For global theme state (dark/light mode). A `ThemeProvider` wraps the entire app and exposes `{ isLightMode, toggleTheme }` via a custom `useTheme()` hook. Any component can consume it without prop drilling. The theme is also persisted in localStorage so it survives page refreshes.

**Q: How do you handle the Ctrl+S shortcut?**
> In a `useEffect`, I add a `keydown` event listener to `window` that checks for `event.ctrlKey && event.key === 's'`, calls `event.preventDefault()` to stop the browser's default save dialog, then calls `saveProject()`. The cleanup function removes the listener to prevent memory leaks. The effect re-runs when `htmlCode`, `cssCode`, `jsCode`, or `projectID` change so it always has the latest values in its closure.

**Q: Why does the Editor useEffect have `htmlCode, cssCode, jsCode` in the dependency array?**
> Because the `run()` function inside the effect reads those values. If they weren't in the dependency array, the effect would close over stale values (a stale closure bug) and the iframe would always show the initial code.

---

### Node.js / Express

**Q: Walk me through what happens when a user signs up.**
> 1. Frontend POSTs `{ username, name, email, password }` to `/signUp`. 2. Express checks if the email already exists in MongoDB. 3. If not, `bcrypt.genSalt(10)` generates a salt, `bcrypt.hash(password, salt)` hashes the password. 4. `userModel.create()` saves the new user. 5. A success response is returned and the frontend redirects to `/login`.

**Q: How is the JWT generated and what does it contain?**
> `jwt.sign({ email: user.email, userId: user._id }, JWT_SECRET, { expiresIn: '7d' })`. The payload contains the user's email and MongoDB `_id`. It's signed with a secret key from the environment. The `7d` expiry means the token becomes invalid after 7 days.

**Q: What is CORS and why do you need it?**
> Cross-Origin Resource Sharing. Browsers block requests from one origin (e.g., `localhost:5173`) to a different origin (e.g., `localhost:3000`) by default. The `cors` middleware on the Express server adds `Access-Control-Allow-Origin` headers to responses, explicitly allowing the frontend origins to make requests.

**Q: Why use `async/await` with try/catch in the routes?**
> Mongoose operations return Promises. Without `try/catch`, an unhandled rejection (e.g., DB connection drop) would crash the server. Wrapping in try/catch lets us return a clean `{ success: false, message: "Server error" }` response instead.

---

### MongoDB / Mongoose

**Q: Why MongoDB over a relational database like PostgreSQL?**
> Projects store code as large text strings — there are no complex joins needed. MongoDB's document model is a natural fit: each project is a self-contained document. It also scales horizontally and MongoDB Atlas provides easy cloud hosting with a free tier.

**Q: What does `{ new: true }` do in `findOneAndUpdate`?**
> By default, `findOneAndUpdate` returns the document *before* the update. `{ new: true }` makes it return the document *after* the update. This is useful when you need to confirm what was actually saved.

**Q: What's the difference between `findOne` and `findById`?**
> `findById(id)` is shorthand for `findOne({ _id: id })`. Both work here, but `findById` is more semantic when you're querying by the primary key.

**Q: How would you improve the data model?**
> Change `createdBy` from a plain `String` to `{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }`. This enables `.populate('createdBy')` to fetch user details in a single query instead of two separate queries. Also add indexes on `createdBy` in the Project schema for faster lookups.

---

### Security

**Q: What security concerns exist in this project?**
> 1. **JWT in localStorage** — vulnerable to XSS. Better: `httpOnly` cookies. 2. **No JWT verification middleware** — the API trusts the `userId` in the request body. A proper auth middleware should verify the JWT on every protected route. 3. **No rate limiting** — the login endpoint is vulnerable to brute-force. Should add `express-rate-limit`. 4. **No input sanitization** — code stored in MongoDB could contain malicious content if ever rendered server-side (not an issue here since it's rendered in a sandboxed iframe client-side).

**Q: Is the iframe preview safe?**
> Reasonably safe. The iframe uses `srcdoc` which runs in a sandboxed context. The user's JS runs in the iframe's own browsing context and cannot access the parent page's DOM, cookies, or localStorage due to the same-origin policy. Adding a `sandbox` attribute to the iframe would further restrict capabilities.

---

### Performance

**Q: How would you scale this application?**
> 1. Add Redis caching for frequently accessed projects. 2. Use MongoDB indexes on `createdBy` field. 3. Implement pagination on `/getProjects` instead of fetching all projects at once. 4. Add a CDN for static assets. 5. The backend is stateless (JWT auth), so horizontal scaling behind a load balancer is straightforward.

**Q: What is the purpose of the debounce in the editor?**
> Performance optimization. Without it, every keystroke triggers an iframe re-render which involves DOM manipulation and JavaScript execution. The 300ms debounce batches rapid keystrokes and only triggers one render after the user pauses, keeping the UI smooth.

---

### Deployment

**Q: What does `vercel.json` do?**
> It configures a catch-all rewrite: any URL path (`/(.*)`) is served by the root `index.html`. This is required for client-side routing — without it, navigating directly to `/editior/123` would return a 404 from Vercel's file server because that file doesn't exist on disk. The rewrite lets React Router handle the URL.

**Q: How do environment variables work differently in Vite vs Node?**
> In Node.js, `process.env.VAR_NAME` accesses env vars loaded by `dotenv`. In Vite, only variables prefixed with `VITE_` are embedded into the client bundle at build time and accessed via `import.meta.env.VITE_VAR_NAME`. Non-prefixed variables are intentionally excluded to prevent accidentally exposing server secrets to the browser.
