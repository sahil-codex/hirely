ALTER TABLE "users" ADD COLUMN "full_name" text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "full_name" DROP DEFAULT;