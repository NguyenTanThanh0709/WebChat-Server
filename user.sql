/*
 Navicat Premium Data Transfer

 Source Server         : local mysql
 Source Server Type    : MySQL
 Source Server Version : 90200 (9.2.0)
 Source Host           : localhost:3306
 Source Schema         : user

 Target Server Type    : MySQL
 Target Server Version : 90200 (9.2.0)
 File Encoding         : 65001

 Date: 24/04/2025 00:06:43
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for _prisma_migrations
-- ----------------------------
DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) NULL DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `rolled_back_at` datetime(3) NULL DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of _prisma_migrations
-- ----------------------------
INSERT INTO `_prisma_migrations` VALUES ('0dbd61bf-b4c0-411d-a72d-4ced02b101e9', '96fb34fd0e8f7161cbde9ba4ffb3b0ed4115c6a1ef00d94f5bbd95b90b7881ac', '2025-04-16 16:10:11.833', '20250415161115_add_token_model', NULL, NULL, '2025-04-16 16:10:11.764', 1);
INSERT INTO `_prisma_migrations` VALUES ('354647a4-bd6b-41fd-a35d-2057caf27dcc', '94e07541d081b3870e5dfb42a3d6ff4c74ac2e904f568f3bdab7310bf260636f', '2025-04-16 16:10:11.887', '20250416155919_remove_username_unique', NULL, NULL, '2025-04-16 16:10:11.834', 1);
INSERT INTO `_prisma_migrations` VALUES ('5707c0d0-e9ad-44dc-975a-48008a263aff', '3c1d5ae1ac7e0294896c4d6e6ea3499142ac260b47acaf3d57e4960fa7bdbb07', '2025-04-16 16:10:12.827', '20250416161012_init', NULL, NULL, '2025-04-16 16:10:12.784', 1);
INSERT INTO `_prisma_migrations` VALUES ('e6128242-9cce-49c9-b923-fe34028abec3', '08ba1435290f205e44492dc0d453270d318bb0d748a93eb4e308bb5d46ca13b1', '2025-04-16 16:10:11.762', '20250415143141_init', NULL, NULL, '2025-04-16 16:10:11.448', 1);

-- ----------------------------
-- Table structure for friend
-- ----------------------------
DROP TABLE IF EXISTS `friend`;
CREATE TABLE `friend`  (
  `user_phone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `friend_phone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('no','pending','accepted','blocked') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`user_phone`, `friend_phone`) USING BTREE,
  INDEX `Friend_friend_phone_idx`(`friend_phone` ASC) USING BTREE,
  CONSTRAINT `Friend_friend_phone_fkey` FOREIGN KEY (`friend_phone`) REFERENCES `user` (`phone`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Friend_user_phone_fkey` FOREIGN KEY (`user_phone`) REFERENCES `user` (`phone`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of friend
-- ----------------------------
INSERT INTO `friend` VALUES ('03351288670', '0333657670', 'accepted', '2025-04-22 13:38:59.049');
INSERT INTO `friend` VALUES ('03351288670', '09276533222', 'accepted', '2025-04-22 16:02:25.331');

-- ----------------------------
-- Table structure for group
-- ----------------------------
DROP TABLE IF EXISTS `group`;
CREATE TABLE `group`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner_phone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `Group_owner_phone_fkey`(`owner_phone` ASC) USING BTREE,
  CONSTRAINT `Group_owner_phone_fkey` FOREIGN KEY (`owner_phone`) REFERENCES `user` (`phone`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group
-- ----------------------------
INSERT INTO `group` VALUES (13, 'Nhóm 1', '0333657670', '2025-04-19 19:57:18.471');
INSERT INTO `group` VALUES (14, 'Nhóm 5 anh em siêu nhân', '0333657670', '2025-04-20 05:16:53.655');

-- ----------------------------
-- Table structure for groupmember
-- ----------------------------
DROP TABLE IF EXISTS `groupmember`;
CREATE TABLE `groupmember`  (
  `group_id` bigint NOT NULL,
  `user_phone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('member','admin','owner') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'member',
  `joined_at` datetime(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`group_id`, `user_phone`) USING BTREE,
  INDEX `GroupMember_user_phone_idx`(`user_phone` ASC) USING BTREE,
  CONSTRAINT `GroupMember_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `GroupMember_user_phone_fkey` FOREIGN KEY (`user_phone`) REFERENCES `user` (`phone`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of groupmember
-- ----------------------------
INSERT INTO `groupmember` VALUES (13, '0333657670', 'owner', '2025-04-19 19:57:18.471', 1);
INSERT INTO `groupmember` VALUES (13, '0333657674', 'member', '2025-04-20 12:03:15.129', 1);
INSERT INTO `groupmember` VALUES (14, '0333657670', 'owner', '2025-04-20 05:16:53.655', 1);
INSERT INTO `groupmember` VALUES (14, '0333657674', 'member', '2025-04-20 12:17:09.650', 1);
INSERT INTO `groupmember` VALUES (14, '09276533223', 'member', '2025-04-20 12:17:09.650', 1);

-- ----------------------------
-- Table structure for token
-- ----------------------------
DROP TABLE IF EXISTS `token`;
CREATE TABLE `token`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userPhone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `refreshToken` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `accessToken` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `Token_userPhone_fkey`(`userPhone` ASC) USING BTREE,
  CONSTRAINT `Token_userPhone_fkey` FOREIGN KEY (`userPhone`) REFERENCES `user` (`phone`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of token
-- ----------------------------
INSERT INTO `token` VALUES ('0dac0549-9cbd-49fe-bff8-de6de18f7d5f', '03351288670', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMzM1MTI4ODY3MCIsImlhdCI6MTc0NTEzMjE5MywiZXhwIjoxNzQ1NzM2OTkzfQ.FUGZ_LZffBdl_CKlynXwpW7MNxY8JzC_-gtridyRUCA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMzM1MTI4ODY3MCIsImlhdCI6MTc0NTEzMjE5MywiZXhwIjoxNzQ1MzkxMzkzfQ.S76AvHvZ8iNkAtYSHLzvP-iXF-Dj4fFYJYh4VmI6Otw', '2025-04-27 06:56:33.068', '2025-04-16 16:45:25.464', '2025-04-20 06:56:33.070');
INSERT INTO `token` VALUES ('9c9b6da3-3a0b-4339-b0c8-d2ec2f20adac', '0333657670', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMzMzNjU3NjcwIiwiaWF0IjoxNzQ1MTMyMTY5LCJleHAiOjE3NDU3MzY5Njl9.OUx_dxP7M7TK-_kS67CEmAJ49RayUe8RBvZEypyuACY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMzMzNjU3NjcwIiwiaWF0IjoxNzQ1MTMyMTY5LCJleHAiOjE3NDUzOTEzNjl9.pxV89sJdQP4fg9mCtTO6aj4uMRW_VhG139SEZLEORJA', '2025-04-27 06:56:09.220', '2025-04-16 16:48:04.958', '2025-04-20 06:56:09.223');
INSERT INTO `token` VALUES ('e184dd52-db02-4b5a-8e53-a5296e90c191', '09276533222', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwOTI3NjUzMzIyMiIsImlhdCI6MTc0NDgyMDE1NCwiZXhwIjoxNzQ1NDI0OTU0fQ.LBqaRXOnQTjGC12C2VhVeUP8o5_dxGBahSu6ycMylHU', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwOTI3NjUzMzIyMiIsImlhdCI6MTc0NDgyMDE1NCwiZXhwIjoxNzQ1MDc5MzU0fQ.sUXyzH0ku55MH_JnTM8i6ZrKAmsUXUbvCmGEvQphshk', '2025-04-23 16:15:54.595', '2025-04-16 16:13:57.835', '2025-04-16 16:15:54.597');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `phone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'OFFLINE',
  `avatar` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `createdAt` datetime(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`phone`) USING BTREE,
  UNIQUE INDEX `User_email_key`(`email` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('0333657670', 'johndoe@example.com', '$2b$10$1dA8JgtaLMtGXEr3BSAUKu5QV1mKM7zD6o3pc8jaCBPM1oTWMWJa6', 'OFFLINE', 'https://firebasestorage.googleapis.com/v0/b/uploadingfile-4ee57.appspot.com/o/images%2Fa2eceb74-d911-4849-9ffc-307ffb14fa50_z5354910797519_2ede319446bb0cd3af4579b425bf03d5.jpg?alt=media&token=23e0b51e-c185-4f49-b526-44c264e1a439', '2025-04-09 16:48:04.000', 'John Doe212');
INSERT INTO `user` VALUES ('0333657674', 'trungtuyendim2a@gmail.com', '$2b$10$xdc/uXQgMlCG/qToUpudset2a91wcUi5vJwLxQ8/q0UNR1oNqumXa', 'OFFLINE', 'https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg', '2025-04-25 16:46:00.000', '21');
INSERT INTO `user` VALUES ('03351288670', 'trungtuyendima@gmail.com', '$2b$10$1dA8JgtaLMtGXEr3BSAUKu5QV1mKM7zD6o3pc8jaCBPM1oTWMWJa6', 'OFFLINE', 'https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg', '2025-04-16 16:41:06.753', '3');
INSERT INTO `user` VALUES ('03351288674', 'trungtuyendima1@gmail.com', '$2b$10$2Eyug8EO6N0uVfBXo2SrBeS9UXTct0sjcvRbCibFePi9VQurnZLsa', 'OFFLINE', 'https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg', '2025-04-01 16:43:24.000', '2');
INSERT INTO `user` VALUES ('09276533222', 'john333.doe@example.com', '$2b$10$5zCkvk0mARq8zKixYrZXru5XdvEKj7VhrNXsNacQ1CR8MkdOlD4Xq', 'OFFLINE', 'https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg', '2025-04-18 16:13:26.000', 'john_doe232');
INSERT INTO `user` VALUES ('09276533223', 'john3333.doe@example.com', '$2b$10$5zCkvk0mARq8zKixYrZXru5XdvEKj7VhrNXsNacQ1CR8MkdOlD4Xq', 'OFFLINE', 'https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg', '2025-04-16 16:13:26.948', 'john_doe232');

SET FOREIGN_KEY_CHECKS = 1;
