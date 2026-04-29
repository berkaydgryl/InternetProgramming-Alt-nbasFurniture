import { RequestHandler } from "express";
import { randomBytes } from "node:crypto";

// In-memory token store — paired with the JWT session
const csrfTokens = new Map<string, { token: string; expiresAt: number }>();

const CSRF_TTL = 60 * 60 * 1000; // 1 hour

/** Generate and return a new CSRF token */
export const getCsrfToken: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization || "";
  const jwt = authHeader.replace("Bearer ", "");
  if (!jwt) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = randomBytes(32).toString("hex");
  csrfTokens.set(jwt, { token, expiresAt: Date.now() + CSRF_TTL });

  // Clean up old tokens
  for (const [key, val] of csrfTokens) {
    if (val.expiresAt < Date.now()) csrfTokens.delete(key);
  }

  res.json({ csrfToken: token });
};

/** CSRF token validation middleware */
export const verifyCsrf: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const jwt = authHeader.replace("Bearer ", "");
  const csrfHeader = req.headers["x-csrf-token"] as string;

  if (!csrfHeader) {
    res.status(403).json({ error: "CSRF token missing" });
    return;
  }

  const stored = csrfTokens.get(jwt);
  if (!stored || stored.expiresAt < Date.now()) {
    csrfTokens.delete(jwt);
    res.status(403).json({ error: "CSRF token is invalid or has expired" });
    return;
  }

  if (stored.token !== csrfHeader) {
    res.status(403).json({ error: "CSRF token mismatch" });
    return;
  }

  next();
};
