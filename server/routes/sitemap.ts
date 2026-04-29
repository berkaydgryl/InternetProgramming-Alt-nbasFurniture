import { RequestHandler } from "express";
import { db } from "../db/index.js";
import { catalog } from "../db/schema.js";
import { eq } from "drizzle-orm";

const SITE_URL =
  process.env.VITE_SITE_URL || "https://altinbasmobilya.com";

function createSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

interface SitemapEntry {
  loc: string;
  changefreq: string;
  priority: string;
}

export const serveSitemap: RequestHandler = async (_req, res) => {
  try {
    const rows = await db.select().from(catalog).where(eq(catalog.id, 1));
    const products = (rows[0]?.products as any[]) || [];
    const categories = (rows[0]?.sidebarCategories as string[]) || [];

    const entries: SitemapEntry[] = [
      { loc: "/", changefreq: "weekly", priority: "1.0" },
      { loc: "/koleksiyonlar", changefreq: "weekly", priority: "0.9" },
      { loc: "/hakkimizda", changefreq: "monthly", priority: "0.6" },
      { loc: "/iletisim", changefreq: "monthly", priority: "0.7" },
      { loc: "/gizlilik-politikasi", changefreq: "yearly", priority: "0.3" },
      { loc: "/hizmet-sartlari", changefreq: "yearly", priority: "0.3" },
    ];

    // Category pages
    for (const cat of categories) {
      entries.push({
        loc: `/koleksiyonlar?kategori=${encodeURIComponent(cat)}`,
        changefreq: "weekly",
        priority: "0.8",
      });
    }

    // Product pages (only the active ones)
    for (const p of products) {
      if (p.isActive === false) continue;
      entries.push({
        loc: `/urun/${createSlug(p.category)}/${createSlug(p.name)}`,
        changefreq: "monthly",
        priority: "0.7",
      });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url>
    <loc>${escapeXml(SITE_URL + e.loc)}</loc>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=3600"); // cache for 1 hour
    res.send(xml);
  } catch {
    res.status(500).set("Content-Type", "text/plain").send("Failed to generate sitemap");
  }
};
