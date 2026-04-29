import { RequestHandler } from "express";
import { timingSafeEqual } from "node:crypto";
import { signToken } from "../middleware/auth.js";

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA); // constant-time even on length mismatch
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export const login: RequestHandler = (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("❌ ADMIN_PASSWORD environment variable is not defined!");
    res.status(500).json({ error: "Server configuration error" });
    return;
  }

  if (!password || typeof password !== "string" || !safeCompare(password, adminPassword)) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }

  const token = signToken();
  res.json({ success: true, token });
};
