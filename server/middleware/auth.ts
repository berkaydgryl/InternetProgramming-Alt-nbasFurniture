import { RequestHandler } from "express";
import { randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";

function getSecret(): string {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production") {
    console.error("❌ JWT_SECRET environment variable is not defined! The server cannot run securely.");
    process.exit(1);
  }
  return "dev-" + randomBytes(32).toString("hex");
}

const JWT_SECRET = getSecret();

export function signToken(): string {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authorization required" });
    return;
  }

  try {
    jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Session has expired, please log in again" });
  }
};
