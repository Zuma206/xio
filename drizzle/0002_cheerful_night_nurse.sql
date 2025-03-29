CREATE TABLE `channels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`owner` integer NOT NULL,
	FOREIGN KEY (`owner`) REFERENCES `activated_users`(`id`) ON UPDATE cascade ON DELETE cascade
);
