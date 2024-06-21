ALTER TABLE "tasks" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "lists" DROP COLUMN IF EXISTS "plaid_id";