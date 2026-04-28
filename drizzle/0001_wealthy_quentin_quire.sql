ALTER TABLE `orders` ADD `payment_method` varchar(20) DEFAULT 'transferencia' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `customizable` boolean DEFAULT false NOT NULL;