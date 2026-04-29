import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { handleDemo } from "./routes/demo";
import { getSettings, updateSettings } from "./routes/settings";
import { getCatalog, updateCatalog } from "./routes/catalog";
import { login } from "./routes/auth";
import { uploadMenu, handleUpload } from "./routes/upload";
import { serveSitemap } from "./routes/sitemap";
import { handleContact } from "./routes/contact";
import { requireAuth } from "./middleware/auth";
import { getCsrfToken, verifyCsrf } from "./middleware/csrf";
import { initServerSentry, Sentry } from "./lib/sentry.js";

export function createServer() {
  initServerSentry();
  const app = express();

  // Security headers — only active in production
  // In dev, Vite manages all responses with its own middleware,
  // and helmet headers can break Vite's module responses
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    const supabaseOrigin = process.env.SUPABASE_URL || "";
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "https://www.googletagmanager.com",
            "https://www.google-analytics.com",
            "https://static.hotjar.com",
            "https://script.hotjar.com",
            "https://browser.sentry-cdn.com",
            "https://challenges.cloudflare.com",
          ],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          imgSrc: [
            "'self'", "data:", "blob:", supabaseOrigin,
            "https://www.googletagmanager.com",
            "https://www.google-analytics.com",
          ].filter(Boolean) as string[],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          connectSrc: [
            "'self'", supabaseOrigin,
            "https://www.google-analytics.com",
            "https://analytics.google.com",
            "https://*.hotjar.com",
            "https://*.hotjar.io",
            "wss://*.hotjar.com",
            "https://*.sentry.io",
            "https://challenges.cloudflare.com",
          ].filter(Boolean) as string[],
          frameSrc: ["https://vars.hotjar.com", "https://challenges.cloudflare.com"],
          frameAncestors: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
    }));
  }

  // CORS — only the site's own domain in production, open in dev
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
    : undefined;

  app.use(cors(
    allowedOrigins
      ? { origin: allowedOrigins }
      : process.env.NODE_ENV === "production"
        ? { origin: false }
        : undefined
  ));

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Rate limiting — login brute-force protection
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,                 // maximum of 10 attempts
    message: { error: "Too many login attempts. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // General API limit
  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minute
    limit: 100,            // 100 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Contact form limit — spam protection
  const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5,                  // maximum of 5 messages
    message: { error: "Too many messages sent. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api/", apiLimiter);

  // Dynamic sitemap — includes product + category URLs
  app.get("/sitemap.xml", serveSitemap);

  // Public — anyone can read
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);
  app.get("/api/settings", getSettings);
  app.get("/api/catalog", getCatalog);

  // Contact — honeypot + turnstile + rate limited
  app.post("/api/contact", contactLimiter, handleContact);

  // Auth — rate limited
  app.post("/api/auth", loginLimiter, login);

  // CSRF token endpoint — requires auth
  app.get("/api/csrf-token", requireAuth, getCsrfToken);

  // Protected — accessed via JWT + CSRF
  app.post("/api/settings", requireAuth, verifyCsrf, updateSettings);
  app.post("/api/catalog", requireAuth, verifyCsrf, updateCatalog);
  app.post("/api/upload", requireAuth, verifyCsrf, uploadMenu.single("image"), handleUpload);

  // Global error handler — send uncaught errors to Sentry
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    Sentry.captureException(err);
    console.error("Unhandled server error:", err);
    res.status(500).json({ error: "Server error" });
  });

  return app;
}
