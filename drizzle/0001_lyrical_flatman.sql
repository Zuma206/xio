PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_activated_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`gid` text,
	FOREIGN KEY (`gid`) REFERENCES `users`(`gid`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_activated_users`("id", "name", "gid") SELECT "id", "name", "gid" FROM `activated_users`;--> statement-breakpoint
DROP TABLE `activated_users`;--> statement-breakpoint
ALTER TABLE `__new_activated_users` RENAME TO `activated_users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `activated_users_name_unique` ON `activated_users` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `activated_users_gid_unique` ON `activated_users` (`gid`);