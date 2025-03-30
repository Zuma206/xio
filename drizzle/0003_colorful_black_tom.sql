CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author` integer NOT NULL,
	`content` text NOT NULL,
	`date` integer NOT NULL,
	`channel` integer NOT NULL,
	FOREIGN KEY (`author`) REFERENCES `activated_users`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`channel`) REFERENCES `channels`(`id`) ON UPDATE cascade ON DELETE cascade
);
