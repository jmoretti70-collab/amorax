ALTER TABLE `advertiser_profiles` ADD `stripeSubscriptionId` varchar(100);--> statement-breakpoint
ALTER TABLE `payments` ADD `stripePaymentIntentId` varchar(100);--> statement-breakpoint
ALTER TABLE `payments` ADD `stripeInvoiceId` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(100);