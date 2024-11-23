-- Create "USERS" table
CREATE TABLE `USERS` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `email` text NOT NULL, `first_name` text NOT NULL, `last_name` text NOT NULL, `hashed_password` text NOT NULL, `profile_image` blob NULL, `balance` integer NULL DEFAULT 0);
-- Create index "USERS_email" to table: "USERS"
CREATE UNIQUE INDEX `USERS_email` ON `USERS` (`email`);
-- Create "BANNERS" table
CREATE TABLE `BANNERS` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `banner_name` text NOT NULL, `banner_image` text NOT NULL, `description` text NOT NULL);
-- Create "SERVICES" table
CREATE TABLE `SERVICES` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `service_code` text NOT NULL, `service_name` text NOT NULL, `service_icon` text NOT NULL, `service_tariff` integer NOT NULL);
-- Create index "SERVICES_service_code" to table: "SERVICES"
CREATE UNIQUE INDEX `SERVICES_service_code` ON `SERVICES` (`service_code`);
-- Create "TRANSACTIONS" table
CREATE TABLE `TRANSACTIONS` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `user_id` integer NOT NULL, `transaction_type` text NOT NULL, `service_code` text NULL, `total_amount` integer NOT NULL, `created_on` datetime NULL DEFAULT (CURRENT_TIMESTAMP), `invoice_number` text NULL, `description` text NOT NULL, CONSTRAINT `0` FOREIGN KEY (`service_code`) REFERENCES `services` (`service_code`) ON UPDATE NO ACTION ON DELETE NO ACTION, CONSTRAINT `1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION);
-- Create index "idx_transactions_user_id" to table: "TRANSACTIONS"
CREATE INDEX `idx_transactions_user_id` ON `TRANSACTIONS` (`user_id`);
