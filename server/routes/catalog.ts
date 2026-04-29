import { RequestHandler } from "express";
import { db } from "../db/index.js";
import { catalog } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { catalogSchema } from "../validation.js";
import { cacheGet, cacheSet, cacheInvalidate, CACHE_KEYS, DEFAULT_TTL } from "../cache.js";

const defaultCatalog = {
  heroSection: {
    tag: "Piece of the Week",
    title: "Sapphire Blue Dresser",
    description: "Crafted with custom lacquer paint and brass details.",
    image: "",
    imageFit: "cover",
    imagePosition: "center",
    link: "/koleksiyonlar",
  },
  homepageCategories: [] as unknown[],
  sidebarCategories: [] as string[],
  products: [] as unknown[],
};

export const getCatalog: RequestHandler = async (_req, res) => {
  try {
    // Read from cache
    const cached = cacheGet<Record<string, unknown>>(CACHE_KEYS.CATALOG);
    if (cached) {
      res.json(cached);
      return;
    }

    const rows = await db.select().from(catalog).where(eq(catalog.id, 1));
    if (!rows.length) {
      const fallback = { ...defaultCatalog, lastUpdated: new Date().toISOString() };
      res.json(fallback);
      return;
    }
    const row = rows[0];
    const data = {
      heroSection: row.heroSection,
      homepageCategories: row.homepageCategories,
      sidebarCategories: row.sidebarCategories,
      products: row.products,
      whatsappNumbers: row.whatsappNumbers,
      categoryWhatsapp: row.categoryWhatsapp,
      lastUpdated: row.updatedAt,
    };

    cacheSet(CACHE_KEYS.CATALOG, data, DEFAULT_TTL);
    res.json(data);
  } catch (err) {
    console.error("Catalog fetch error:", err);
    res.status(500).json({ error: "Failed to load catalog" });
  }
};

export const updateCatalog: RequestHandler = async (req, res) => {
  try {
    const parsed = catalogSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid data", details: parsed.error.flatten().fieldErrors });
      return;
    }
    const { heroSection, homepageCategories, sidebarCategories, products, whatsappNumbers, categoryWhatsapp } = parsed.data;
    const values = {
      heroSection: heroSection ?? defaultCatalog.heroSection,
      homepageCategories: homepageCategories ?? [],
      sidebarCategories: sidebarCategories ?? [],
      products: products ?? [],
      whatsappNumbers: whatsappNumbers ?? [],
      categoryWhatsapp: categoryWhatsapp ?? [],
      updatedAt: new Date(),
    };

    await db
      .insert(catalog)
      .values({ id: 1, ...values })
      .onConflictDoUpdate({ target: catalog.id, set: values });

    // Clear the cache — the next request will fetch the updated data
    cacheInvalidate(CACHE_KEYS.CATALOG);
    cacheInvalidate(CACHE_KEYS.SETTINGS);

    res.json({ ...values, lastUpdated: values.updatedAt });
  } catch (err) {
    console.error("Catalog update error:", err);
    res.status(500).json({ error: "Failed to update catalog" });
  }
};
