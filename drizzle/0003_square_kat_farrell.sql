DROP INDEX "sessions_token_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `accounts` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `sessions` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `verifications` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `verifications` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL;