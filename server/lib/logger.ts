import { Sentry } from "./sentry.js";

type LogLevel = "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const ctx = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${ctx}`;
}

export const logger = {
  info(message: string, context?: LogContext) {
    console.log(formatMessage("info", message, context));
  },

  warn(message: string, context?: LogContext) {
    console.warn(formatMessage("warn", message, context));
    // Add as a breadcrumb to Sentry
    Sentry.addBreadcrumb({ message, level: "warning", data: context });
  },

  error(message: string, error?: unknown, context?: LogContext) {
    console.error(formatMessage("error", message, context));
    // Send error to Sentry
    if (error instanceof Error) {
      Sentry.captureException(error, { extra: context });
    } else {
      Sentry.captureMessage(message, { level: "error", extra: { error, ...context } });
    }
  },
};
