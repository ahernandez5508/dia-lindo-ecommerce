ALTER TABLE `orders` ADD `tracking_token` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_tracking_token_unique` UNIQUE(`tracking_token`);