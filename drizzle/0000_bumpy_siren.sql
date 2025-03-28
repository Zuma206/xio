CREATE TABLE `activated_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`gid` text,
	FOREIGN KEY (`gid`) REFERENCES `users`(`gid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`gid` text PRIMARY KEY NOT NULL,
	`picture` text NOT NULL
);
