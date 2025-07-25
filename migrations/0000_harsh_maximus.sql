CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"productName" text NOT NULL,
	"sku" text,
	"img_url" varchar,
	"description" text,
	"quantity" integer,
	"price" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"userID" serial PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar,
	"password" varchar NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
