import { RequestHandler } from "express";
import { db } from "../db/index.js";
import { settings, catalog } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { settingsSchema } from "../validation.js";
import { cacheGet, cacheSet, cacheInvalidate, CACHE_KEYS, DEFAULT_TTL } from "../cache.js";

const DEFAULT_NUMBER = "905358712233";
const DEFAULT_WA_NUMBERS = [{ id: 1, name: "Main Number", number: DEFAULT_NUMBER, isMain: true }];

export const getSettings: RequestHandler = async (_req, res) => {
  try {
    // Read from cache
    const cached = cacheGet<Record<string, unknown>>(CACHE_KEYS.SETTINGS);
    if (cached) {
      res.json(cached);
      return;
    }

    const [settingsRows, catalogRows] = await Promise.all([
      db.select().from(settings).where(eq(settings.id, 1)),
      db.select().from(catalog).where(eq(catalog.id, 1)),
    ]);

    const sRow = settingsRows[0];
    const cRow = catalogRows[0];
    const catalogData = cRow ? (cRow as any) : {};

    // Migration: if whatsappNumbers not in catalog, seed from legacy whatsappNumber
    let waNumbers = catalogData.whatsappNumbers as any[];
    if (!waNumbers || !Array.isArray(waNumbers) || waNumbers.length === 0) {
      const legacyNumber = sRow?.whatsappNumber || DEFAULT_NUMBER;
      waNumbers = [{ id: 1, name: "Main Number", number: legacyNumber, isMain: true }];
    }

    const data = {
      showPrice: sRow?.showPrice ?? false,
      whatsappNumber: sRow?.whatsappNumber || DEFAULT_NUMBER,
      whatsappNumbers: waNumbers,
      categoryWhatsapp: (catalogData.categoryWhatsapp as any[]) || [],
      lastUpdated: sRow?.updatedAt,
    };

    cacheSet(CACHE_KEYS.SETTINGS, data, DEFAULT_TTL);
    res.json(data);
  } catch (err) {
    console.error("Settings fetch error:", err);
    res.status(500).json({ error: "Failed to load settings" });
  }
};

export const updateSettings: RequestHandler = async (req, res) => {
  try {
    const parsed = settingsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid data", details: parsed.error.flatten().fieldErrors });
      return;
    }
    const { showPrice, whatsappNumbers, categoryWhatsapp } = parsed.data;
    const waNumbers = whatsappNumbers || DEFAULT_WA_NUMBERS;
    const mainNumber = waNumbers.find((n) => n.isMain)?.number || DEFAULT_NUMBER;

    // Save showPrice + legacy whatsappNumber to settings table
    const settingsValues = {
      showPrice: showPrice ?? false,
      whatsappNumber: mainNumber,
      updatedAt: new Date(),
    };

    await db
      .insert(settings)
      .values({ id: 1, ...settingsValues })
      .onConflictDoUpdate({ target: settings.id, set: settingsValues });

    // Save whatsappNumbers + categoryWhatsapp into catalog jsonb
    // We need to merge with existing catalog data
    await db.update(catalog).set({
      whatsappNumbers: waNumbers,
      categoryWhatsapp: categoryWhatsapp || [],
      updatedAt: new Date(),
    }).where(eq(catalog.id, 1));

    // Clear the cache
    cacheInvalidate(CACHE_KEYS.SETTINGS);
    cacheInvalidate(CACHE_KEYS.CATALOG);

    res.json({
      showPrice: settingsValues.showPrice,
      whatsappNumber: mainNumber,
      whatsappNumbers: waNumbers,
      categoryWhatsapp: categoryWhatsapp || [],
      lastUpdated: settingsValues.updatedAt,
    });
  } catch (err) {
    console.error("Settings update error:", err);
    res.status(500).json({ error: "Failed to update settings" });
  }
};
