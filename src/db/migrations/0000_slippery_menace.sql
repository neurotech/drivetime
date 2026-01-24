CREATE TABLE `trips` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`start_location` text NOT NULL,
	`end_location` text NOT NULL,
	`start_kilometres` real NOT NULL,
	`end_kilometres` real NOT NULL,
	`notes` text,
	`created_at` text NOT NULL
);
