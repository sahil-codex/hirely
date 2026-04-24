CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_id" uuid NOT NULL,
	"status" text DEFAULT 'APPLIED',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text,
	"skills" text[] DEFAULT '{}',
	"experience" integer
);
--> statement-breakpoint
ALTER TABLE "jobs" RENAME COLUMN "text" TO "title";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "passwrod_hash" TO "password_hash";--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "recruiter_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "skills" text[];--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_job" ON "applications" USING btree ("user_id","job_id");