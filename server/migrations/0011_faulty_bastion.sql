CREATE TABLE IF NOT EXISTS "ProductVariants" (
	"id" serial PRIMARY KEY NOT NULL,
	"color" text NOT NULL,
	"productType" text NOT NULL,
	"productID" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "variantImages" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL,
	"variantID" serial NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ProductVariants" ADD CONSTRAINT "ProductVariants_productID_products_id_fk" FOREIGN KEY ("productID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantImages" ADD CONSTRAINT "variantImages_variantID_ProductVariants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."ProductVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
