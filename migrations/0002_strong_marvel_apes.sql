ALTER TABLE "products" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "sku" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "quantity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;