import * as Sentry from "@sentry/node";

const SENTRY_DSN = process.env.SENTRY_DSN || "";

export function initServerSentry() {
  if (!SENTRY_DSN) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
  });
}

export { Sentry };
