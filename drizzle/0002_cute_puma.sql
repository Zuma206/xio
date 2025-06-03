PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_in_channel` (
	`userId` text NOT NULL,
	`channelId` text NOT NULL,
	PRIMARY KEY(`userId`, `channelId`),
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`channelId`) REFERENCES `channels`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_in_channel`("userId", "channelId") SELECT "userId", "channelId" FROM `user_in_channel`;--> statement-breakpoint
DROP TABLE `user_in_channel`;--> statement-breakpoint
ALTER TABLE `__new_user_in_channel` RENAME TO `user_in_channel`;--> statement-breakpoint
PRAGMA foreign_keys=ON;