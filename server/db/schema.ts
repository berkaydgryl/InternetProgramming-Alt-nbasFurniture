import { pgTable, integer, boolean, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";

export const settings = pgTable("settings", {
  id: integer("id").primaryKey().default(1),
  showPrice: boolean("show_price").notNull().default(false),
  whatsappNumber: varchar("whatsapp_number", { length: 20 }).notNull().default("905358712233"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const catalog = pgTable("catalog", {
  id: integer("id").primaryKey().default(1),
  heroSection: jsonb("hero_section").notNull().default({}),
  homepageCategories: jsonb("homepage_categories").notNull().default([]),
  sidebarCategories: jsonb("sidebar_categories").notNull().default([]),
  products: jsonb("products").notNull().default([]),
  whatsappNumbers: jsonb("whatsapp_numbers").notNull().default([]),
  categoryWhatsapp: jsonb("category_whatsapp").notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
