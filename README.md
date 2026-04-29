# Altınbaş Furniture

A modern e-commerce / catalog web application for Altınbaş Furniture. Customers can browse products and collections and request quotes through the contact form, while administrators can manage products, collections, and site settings via the admin panel.

> Altınbaş University — Internet Programming course project
> Developer: **Reşit Berkay Doğruyol**

---

## Features

- **Modern UI** — Fast SPA built with React 18 + Vite, styled with Tailwind CSS and Radix UI components
- **Product catalog** — Collections, product listing, and detail pages
- **3D product viewer** — Powered by `three.js` and `@react-three/fiber`
- **Contact form** — Validation with Zod, optional Cloudflare Turnstile CAPTCHA
- **Admin panel** — JWT-based authentication, CRUD for products and collections, image uploads (optimized with sharp)
- **Image management** — Upload via Multer, Supabase Storage integration, automatic resizing
- **SEO** — Meta management with `react-helmet-async`, dynamic `sitemap.xml`
- **Error tracking** (optional) — Sentry on both frontend and backend
- **Analytics** (optional) — Google Tag Manager and Hotjar integration

---

## Tech Stack

**Frontend**
- React 18 · Vite · TypeScript
- Tailwind CSS · Radix UI · shadcn-ui style components
- React Router · TanStack Query · React Hook Form + Zod
- Three.js · Framer Motion

**Backend**
- Node.js · Express 5
- Drizzle ORM · PostgreSQL (Supabase)
- JWT · Helmet · express-rate-limit
- Sharp · Multer

**Infrastructure**
- Supabase (PostgreSQL + Storage)
- Netlify (deploy + serverless functions)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` — Supabase PostgreSQL connection string
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — From the Supabase API settings
- `JWT_SECRET` — At least 32 characters, a random string
- `ADMIN_PASSWORD` — Admin panel password (minimum 8 characters)

### 3. Set up the database

```bash
npm run db:generate   # Generate schema migration files
npm run db:migrate    # Apply migrations
npm run db:seed       # (optional) Load sample data
```

### 4. Start the development server

```bash
npm run dev
```

The app runs on `http://localhost:8080` by default.

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server (Vite + Express together) |
| `npm run build` | Production build (client + server) |
| `npm start` | Start the production server (after `npm run build`) |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run tests with Vitest |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format.fix` | Format code with Prettier |
| `npm run db:generate` | Generate migrations with Drizzle |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Seed the database with sample data |

---

## Project Structure

```
.
├── client/               # React SPA
│   ├── components/       # UI components (Radix-based)
│   ├── pages/            # Page components (Index, Collections, ProductDetail, Admin, ...)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Helper utilities
│   ├── App.tsx           # Router and global providers
│   └── main.tsx          # Entry point
├── server/               # Express API
│   ├── routes/           # API endpoints (auth, catalog, contact, upload, ...)
│   ├── db/               # Drizzle schema and seed
│   ├── middleware/       # Auth, rate limit, error handler
│   └── index.ts          # Express app
├── shared/               # Types shared between client and server
├── netlify/functions/    # Netlify serverless function adapter
├── public/               # Static assets
└── scripts/              # Helper scripts
```

---

## Pages

- **`/`** — Home (featured collections)
- **`/collections`** — All collections
- **`/products/:slug`** — Product detail
- **`/about`** — About page
- **`/contact`** — Contact form
- **`/admin`** — Admin panel (JWT auth)
- **`/privacy-policy`**, **`/terms-of-service`** — Legal pages

---

## Deployment

The project is configured for [Netlify](https://www.netlify.com/). `netlify.toml` contains build and redirect rules; the Express API is deployed as a serverless function.

```bash
npm run build
# dist/spa     → static frontend
# dist/server  → server bundle
```

---

## License

This project is for academic purposes.

