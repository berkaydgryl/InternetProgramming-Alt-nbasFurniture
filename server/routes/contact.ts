import { RequestHandler } from "express";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).max(200).transform((s) => s.replace(/<[^>]*>/g, "")),
  email: z.string().email().max(200),
  phone: z.string().max(20).optional().default(""),
  message: z.string().min(1).max(5000).transform((s) => s.replace(/<[^>]*>/g, "")),
  website: z.string().optional().default(""), // honeypot
  turnstileToken: z.string().optional().default(""),
});

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Skip if Turnstile is not configured

  if (!token) return false;

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });

  const data = await res.json() as { success: boolean };
  return data.success;
}

export const handleContact: RequestHandler = async (req, res) => {
  // Validate input
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid form data." });
    return;
  }

  const { website, turnstileToken } = parsed.data;

  // Honeypot check — silently accept if filled by a bot
  if (website) {
    res.json({ success: true });
    return;
  }

  // Turnstile validation
  const turnstileValid = await verifyTurnstile(turnstileToken);
  if (!turnstileValid) {
    res.status(403).json({ error: "Security verification failed. Please try again." });
    return;
  }

  res.json({ success: true });
};
