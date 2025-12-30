CREATE TABLE `advertiser_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`displayName` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`category` enum('women','men','trans') NOT NULL,
	`bio` text,
	`age` int,
	`height` int,
	`weight` int,
	`eyeColor` varchar(50),
	`hairColor` varchar(50),
	`bodyType` varchar(50),
	`ethnicity` varchar(50),
	`whatsapp` varchar(20),
	`telegram` varchar(100),
	`city` varchar(100),
	`state` varchar(50),
	`neighborhood` varchar(100),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`hasOwnPlace` boolean DEFAULT false,
	`doesOutcalls` boolean DEFAULT false,
	`pricePerHour` decimal(10,2),
	`pricePerNight` decimal(10,2),
	`acceptsPix` boolean DEFAULT true,
	`acceptsCard` boolean DEFAULT false,
	`acceptsCash` boolean DEFAULT true,
	`availableHours` json,
	`is24Hours` boolean DEFAULT false,
	`documentsVerified` boolean DEFAULT false,
	`ageVerified` boolean DEFAULT false,
	`photosVerified` boolean DEFAULT false,
	`plan` enum('free','premium','vip') NOT NULL DEFAULT 'free',
	`planExpiresAt` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean DEFAULT false,
	`viewCount` int DEFAULT 0,
	`contactCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advertiser_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `advertiser_profiles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`state` varchar(2) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`isPopular` boolean DEFAULT false,
	CONSTRAINT `cities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`profileId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`planId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`paymentMethod` enum('pix','credit_card','debit_card') NOT NULL,
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`externalId` varchar(100),
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profile_media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`type` enum('photo','video') NOT NULL,
	`url` varchar(500) NOT NULL,
	`thumbnailUrl` varchar(500),
	`isMain` boolean DEFAULT false,
	`isVerification` boolean DEFAULT false,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `profile_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profile_services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`serviceId` int NOT NULL,
	CONSTRAINT `profile_services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profile_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`viewerIp` varchar(45),
	`userAgent` text,
	`referrer` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `profile_views_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`userId` int,
	`authorName` varchar(100),
	`rating` int NOT NULL,
	`comment` text,
	`isApproved` boolean DEFAULT false,
	`isVisible` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`category` enum('women','men','trans','all') NOT NULL DEFAULT 'all',
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `subscription_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`slug` enum('free','premium','vip') NOT NULL,
	`priceMonthly` decimal(10,2) NOT NULL,
	`priceQuarterly` decimal(10,2),
	`priceYearly` decimal(10,2),
	`maxPhotos` int DEFAULT 5,
	`maxVideos` int DEFAULT 0,
	`featuredPosition` boolean DEFAULT false,
	`verifiedBadge` boolean DEFAULT false,
	`prioritySupport` boolean DEFAULT false,
	`analyticsAccess` boolean DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `subscription_plans_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscription_plans_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `verification_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`type` enum('documents','age','photos') NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`documentUrl` varchar(500),
	`selfieUrl` varchar(500),
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`rejectionReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','advertiser') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `isVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `advertiser_profiles` ADD CONSTRAINT `advertiser_profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_profileId_advertiser_profiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `advertiser_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_profileId_advertiser_profiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `advertiser_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_planId_subscription_plans_id_fk` FOREIGN KEY (`planId`) REFERENCES `subscription_plans`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profile_media` ADD CONSTRAINT `profile_media_profileId_advertiser_profiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `advertiser_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profile_services` ADD CONSTRAINT `profile_services_profileId_advertiser_profiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `advertiser_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profile_services` ADD CONSTRAINT `profile_services_serviceId_services_id_fk` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profile_views` ADD CONSTRAINT `profile_views_profileId_advertiser_profiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `advertiser_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_profileId_advertiser_profiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `advertiser_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `verification_requests` ADD CONSTRAINT `verification_requests_profileId_advertiser_profiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `advertiser_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `verification_requests` ADD CONSTRAINT `verification_requests_reviewedBy_users_id_fk` FOREIGN KEY (`reviewedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;