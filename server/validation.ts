import { z } from "zod";

// ── String sanitizer — strip HTML tags ──
const safeString = (max = 500) =>
  z.string().max(max).transform((s) => s.replace(/<[^>]*>/g, ""));

const safeStringOptional = (max = 500) =>
  z.string().max(max).transform((s) => s.replace(/<[^>]*>/g, "")).optional().default("");

// ── Catalog schemas ──

const heroSectionSchema = z.object({
  tag: safeString(100),
  title: safeString(200),
  description: safeString(1000),
  image: z.string().max(500).default(""),
  imageFit: z.string().max(20).default("cover"),
  imagePosition: z.string().max(20).default("center"),
  link: z.string().max(300).default("/koleksiyonlar"),
}).partial();

const productSchema = z.object({
  id: z.number(),
  name: safeString(200),
  description: safeStringOptional(2000),
  category: safeString(100),
  images: z.array(z.string().max(500)).max(20).default([]),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
});

const homepageCategorySchema = z.object({
  id: z.number(),
  name: safeString(100),
  description: safeStringOptional(500),
  icon: z.string().max(10).default(""),
  image: z.string().max(500).default(""),
});

export const catalogSchema = z.object({
  heroSection: heroSectionSchema.optional(),
  homepageCategories: z.array(homepageCategorySchema).max(20).optional(),
  sidebarCategories: z.array(safeString(100)).max(50).optional(),
  products: z.array(productSchema).max(500).optional(),
  whatsappNumbers: z.array(z.object({
    id: z.number(),
    name: safeString(50),
    number: z.string().regex(/^\d{10,15}$/),
    isMain: z.boolean(),
  })).max(6).optional(),
  categoryWhatsapp: z.array(z.object({
    category: safeString(100),
    numberId: z.number(),
  })).max(50).optional(),
});

// ── Settings schemas ──

export const settingsSchema = z.object({
  showPrice: z.boolean().optional(),
  whatsappNumbers: z.array(z.object({
    id: z.number(),
    name: safeString(50),
    number: z.string().regex(/^\d{10,15}$/),
    isMain: z.boolean(),
  })).max(6).optional(),
  categoryWhatsapp: z.array(z.object({
    category: safeString(100),
    numberId: z.number(),
  })).max(50).optional(),
});
