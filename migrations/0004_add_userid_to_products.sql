-- Add userID column to products table without NOT NULL constraint first
ALTER TABLE "products" ADD COLUMN "userID" integer;--> statement-breakpoint

-- Set all existing products to userID = 1
UPDATE "products" SET "userID" = 1 WHERE "userID" IS NULL;--> statement-breakpoint

-- Now add the NOT NULL constraint
ALTER TABLE "products" ALTER COLUMN "userID" SET NOT NULL;--> statement-breakpoint

-- Add foreign key constraint
ALTER TABLE "products" ADD CONSTRAINT "products_userID_users_userID_fk" FOREIGN KEY ("userID") REFERENCES "public"."users"("userID") ON DELETE no action ON UPDATE no action;