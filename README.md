# NoteHub (09-auth) 🗒️✨

A modern notes app built with **Next.js (App Router)** featuring **cookie-based authentication**, **protected routes**, and a fast **SSR + CSR** data layer powered by **TanStack Query**.

**🔗 Repo:** https://github.com/Vitalism0/09-auth  
**📚 API Docs:** https://notehub-api.goit.study/docs  
**🌍 Live Demo:** _https://09-auth-flax-two.vercel.app_

---

## 🚀 What you can do
✅ **Auth & Session**
- Sign up / Sign in  
- Session check on navigation  
- Logout (clears auth cookies + resets state)

✅ **Profile**
- View profile (`/profile`)
- Edit username (`/profile/edit`)

✅ **Notes**
- Browse notes with **pagination** (12 per page)
- **Search** notes (debounced)
- **Filter by tag**
- Open note details (`/notes/[id]`)
- Preview note in a **modal** (intercepting routes)
- Create note + **draft saved** in localStorage (Zustand persist)
- Delete notes

---

## 🧠 How it works (quick)
- **Route protection:** `proxy.ts` redirects users based on cookies  
  - guest → private routes ⇒ `/sign-in`
  - logged-in → auth routes ⇒ `/profile`
- **SSR + hydration:** server prefetch with `serverApi` → client reuse cache with `HydrationBoundary`
- **API separation:**
  - `lib/api/clientApi.ts` → client components
  - `lib/api/serverApi.ts` → server components (adds cookies)

---

## 🧰 Tech Stack
**Next.js • TypeScript • Axios • TanStack Query • Zustand • CSS Modules**

---

## ⚙️ Setup
### 1) Install
```bash
npm install

Environment

Create .env:

NEXT_PUBLIC_API_URL=http://localhost:3000


For Vercel:

NEXT_PUBLIC_API_URL=https://YOUR-VERCEL-DOMAIN.vercel.app

3) Run
npm run dev


Open: http://localhost:3000

🗺️ Useful routes

/sign-in · /sign-up

/profile · /profile/edit

/notes/filter/all

/notes/action/create
