ALTER TABLE "lists" ADD COLUMN "plaid_id" text;--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN IF EXISTS "name";