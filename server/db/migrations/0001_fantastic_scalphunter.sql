ALTER TABLE "catalog" ADD COLUMN "whatsapp_numbers" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "catalog" ADD COLUMN "category_whatsapp" jsonb DEFAULT '[]'::jsonb NOT NULL;