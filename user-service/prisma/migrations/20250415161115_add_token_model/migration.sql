-- CreateTable
CREATE TABLE `Token` (
    `id` VARCHAR(191) NOT NULL,
    `userPhone` VARCHAR(100) NOT NULL,
    `refreshToken` VARCHAR(191) NOT NULL,
    `accessToken` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_userPhone_fkey` FOREIGN KEY (`userPhone`) REFERENCES `User`(`phone`) ON DELETE CASCADE ON UPDATE CASCADE;
