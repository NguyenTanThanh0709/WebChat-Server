-- CreateTable
CREATE TABLE `User` (
    `phone` VARCHAR(100) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password_hash` TEXT NOT NULL,
    `profile_picture` TEXT NULL,
    `status` VARCHAR(20) NULL DEFAULT 'OFFLINE',
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`phone`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Friend` (
    `user_phone` VARCHAR(100) NOT NULL,
    `friend_phone` VARCHAR(100) NOT NULL,
    `status` ENUM('no', 'pending', 'accepted', 'blocked') NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Friend_friend_phone_idx`(`friend_phone`),
    PRIMARY KEY (`user_phone`, `friend_phone`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Group` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `owner_phone` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GroupMember` (
    `group_id` BIGINT NOT NULL,
    `user_phone` VARCHAR(100) NOT NULL,
    `role` ENUM('member', 'admin', 'owner') NULL DEFAULT 'member',
    `joined_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `GroupMember_user_phone_idx`(`user_phone`),
    PRIMARY KEY (`group_id`, `user_phone`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Friend` ADD CONSTRAINT `Friend_user_phone_fkey` FOREIGN KEY (`user_phone`) REFERENCES `User`(`phone`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friend` ADD CONSTRAINT `Friend_friend_phone_fkey` FOREIGN KEY (`friend_phone`) REFERENCES `User`(`phone`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_owner_phone_fkey` FOREIGN KEY (`owner_phone`) REFERENCES `User`(`phone`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupMember` ADD CONSTRAINT `GroupMember_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupMember` ADD CONSTRAINT `GroupMember_user_phone_fkey` FOREIGN KEY (`user_phone`) REFERENCES `User`(`phone`) ON DELETE CASCADE ON UPDATE CASCADE;
