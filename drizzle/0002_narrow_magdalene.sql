ALTER TABLE "seller_profiles" ALTER COLUMN "shop_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "seller_profiles" ADD COLUMN "shop_description" text;--> statement-breakpoint
ALTER TABLE "seller_profiles" ADD COLUMN "city" text DEFAULT 'Lomé' NOT NULL;--> statement-breakpoint
ALTER TABLE "seller_profiles" ADD COLUMN "district" text;--> statement-breakpoint
ALTER TABLE "seller_profiles" ADD COLUMN "contact_phone" text;--> statement-breakpoint
ALTER TABLE "seller_profiles" ADD COLUMN "rccm" text;--> statement-breakpoint
ALTER TABLE "seller_profiles" ADD COLUMN "id_document_path" text NOT NULL;--> statement-breakpoint
ALTER TABLE "seller_profiles" ADD COLUMN "rccm_document_path" text;--> statement-breakpoint
ALTER TABLE "seller_profiles" ADD COLUMN "rejection_reason" text;--> statement-breakpoint
ALTER TABLE "seller_profiles" ADD COLUMN "reviewed_at" timestamp with time zone;