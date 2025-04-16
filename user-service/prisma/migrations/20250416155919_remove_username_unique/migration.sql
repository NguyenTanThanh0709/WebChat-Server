-- DropIndex
DROP INDEX `User_username_key` ON `user`;

-- AlterTable
ALTER TABLE `groupmember` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;
