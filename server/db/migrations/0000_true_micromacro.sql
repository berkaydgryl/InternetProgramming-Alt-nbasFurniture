CREATE TABLE "catalog" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"hero_section" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"homepage_categories" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sidebar_categories" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"products" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"show_price" boolean DEFAULT false NOT NULL,
	"whatsapp_number" varchar(20) DEFAULT '905358712233' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
