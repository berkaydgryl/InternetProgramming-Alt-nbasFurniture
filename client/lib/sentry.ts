import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || "";

export function initSentry() {
  if (!SENTRY_DSN) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    // 20% trace sampling in production, 100% in dev
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
    // Session replay — records what the user did at the time of the error
    replaysSessionSampleRate: 0,     // No recording for normal sessions
    replaysOnErrorSampleRate: 1.0,   // 100% recording when an error occurs
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // KVKK compliance: mask sensitive data
        maskAllText: false,
        maskAllInputs: true,      // Mask form inputs
        blockAllMedia: false,
      }),
    ],
    // Filter out unnecessary errors
    beforeSend(event) {
      // Browser extension errors
      if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
        (f) => f.filename?.includes("extension://")
      )) {
        return null;
      }
      return event;
    },
  });
}

export { Sentry };
