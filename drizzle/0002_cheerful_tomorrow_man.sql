CREATE TABLE `appointment_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`senderType` enum('client','advertiser','system') NOT NULL,
	`message` text NOT NULL,
	`isRead` boolean DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `appointment_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`userId` int,
	`clientName` varchar(100),
	`clientPhone` varchar(20),
	`clientEmail` varchar(320),
	`appointmentDate` timestamp NOT NULL,
	`duration` int NOT NULL,
	`serviceType` varchar(100),
	`locationType` enum('advertiser_place','client_place','hotel') NOT NULL DEFAULT 'advertiser_place',
	`locationAddress` text,
	`estimatedPrice` decimal(10,2),
	`status` enum('pending','confirmed','cancelled','completed','no_show') NOT NULL DEFAULT 'pending',
	`clientNotes` text,
	`advertiserNotes` text,
	`cancelledBy` enum('client','advertiser'),
	`cancellationReason` text,
	`cancelledAt` timestamp,
	`confirmedAt` timestamp,
	`completedAt` timestamp,
	`reminderSentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `availability_slots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`dayOfWeek` int NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `availability_slots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blocked_dates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`date` timestamp NOT NULL,
	`reason` varchar(200),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blocked_dates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `appointment_messages` ADD CONSTRAINT `appointment_messages_appointmentId_appointments_id_fk` FOREIGN KEY (`appointmentId`) REFERENCES `appointments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_profileId_advertiser_profiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `advertiser_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `availability_slots` ADD CONSTRAINT `availability_slots_profileId_advertiser_profiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `advertiser_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blocked_dates` ADD CONSTRAINT `blocked_dates_profileId_advertiser_profiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `advertiser_profiles`(`id`) ON DELETE no action ON UPDATE no action;