CREATE TABLE `user_in_channel` (
	`userId` text,
	`channelId` text,
	PRIMARY KEY(`userId`, `channelId`),
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`channelId`) REFERENCES `channels`(`id`) ON UPDATE cascade ON DELETE cascade
);
