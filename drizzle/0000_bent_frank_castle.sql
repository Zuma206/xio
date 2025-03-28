CREATE TABLE `users` (
	`gid` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`dev` integer DEFAULT 0 NOT NULL,
	`pfp` integer NOT NULL
);
