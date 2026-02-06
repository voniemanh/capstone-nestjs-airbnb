-- -------------------------------------------------------------
-- TablePlus 6.8.0(654)
--
-- https://tableplus.com/
--
-- Database: capstone-nestjs-airbnb
-- Generation Time: 2026-02-06 22:44:22.8650
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `BookingLogs`;
CREATE TABLE `BookingLogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bookingId` int NOT NULL,
  `action` varchar(50) NOT NULL,
  `performedBy` int NOT NULL,
  `performedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bookingId` (`bookingId`),
  CONSTRAINT `BookingLogs_ibfk_1` FOREIGN KEY (`bookingId`) REFERENCES `Bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Bookings`;
CREATE TABLE `Bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roomId` int NOT NULL,
  `userId` int NOT NULL,
  `checkIn` datetime DEFAULT NULL,
  `checkOut` datetime DEFAULT NULL,
  `guestCount` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` varchar(20) NOT NULL DEFAULT 'CONFIRMED',
  PRIMARY KEY (`id`),
  KEY `idx_bookings_roomId` (`roomId`),
  KEY `idx_bookings_userId` (`userId`),
  CONSTRAINT `fk_bookings_rooms` FOREIGN KEY (`roomId`) REFERENCES `Rooms` (`id`),
  CONSTRAINT `fk_bookings_users` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Comments`;
CREATE TABLE `Comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roomId` int NOT NULL,
  `userId` int NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `rating` tinyint DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_comments_roomId` (`roomId`),
  KEY `fk_comments_users` (`userId`),
  CONSTRAINT `fk_comments_rooms` FOREIGN KEY (`roomId`) REFERENCES `Rooms` (`id`),
  CONSTRAINT `fk_comments_users` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`),
  CONSTRAINT `Comments_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Locations`;
CREATE TABLE `Locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Rooms`;
CREATE TABLE `Rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guestCount` int DEFAULT NULL,
  `bedroomCount` int DEFAULT NULL,
  `bedCount` int DEFAULT NULL,
  `bathroomCount` int DEFAULT NULL,
  `description` text,
  `price` int DEFAULT NULL,
  `hasWashingMachine` tinyint(1) DEFAULT '0',
  `hasIron` tinyint(1) DEFAULT '0',
  `hasTV` tinyint(1) DEFAULT '0',
  `hasAC` tinyint(1) DEFAULT '0',
  `hasWifi` tinyint(1) DEFAULT '0',
  `hasKitchen` tinyint(1) DEFAULT '0',
  `hasParking` tinyint(1) DEFAULT '0',
  `hasPool` tinyint(1) DEFAULT '0',
  `hasHeater` tinyint(1) DEFAULT '0',
  `locationId` int NOT NULL,
  `userId` int NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rooms_locationId` (`locationId`),
  KEY `idx_rooms_userId` (`userId`),
  CONSTRAINT `fk_rooms_locations` FOREIGN KEY (`locationId`) REFERENCES `Locations` (`id`),
  CONSTRAINT `fk_rooms_users` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `SavedRooms`;
CREATE TABLE `SavedRooms` (
  `userId` int NOT NULL,
  `roomId` int NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`,`roomId`),
  KEY `idx_savedrooms_roomId` (`roomId`),
  CONSTRAINT `fk_savedrooms_rooms` FOREIGN KEY (`roomId`) REFERENCES `Rooms` (`id`),
  CONSTRAINT `fk_savedrooms_users` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'USER',
  `avatar` varchar(255) DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `googleId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `googleId` (`googleId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `BookingLogs` (`id`, `bookingId`, `action`, `performedBy`, `performedAt`) VALUES
(1, 1, 'CREATED', 4, '2026-02-06 13:18:12'),
(2, 2, 'CREATED', 4, '2026-02-06 13:18:51'),
(3, 1, 'ADMIN_CANCELLED', 1, '2026-02-06 13:25:46');

INSERT INTO `Bookings` (`id`, `roomId`, `userId`, `checkIn`, `checkOut`, `guestCount`, `createdAt`, `updatedAt`, `status`) VALUES
(1, 2, 4, '2026-05-01 00:00:00', '2026-05-03 00:00:00', 2, '2026-02-06 13:18:12', '2026-02-06 13:25:45', 'ADMIN_CANCELLED'),
(2, 3, 4, '2026-03-01 00:00:00', '2026-03-03 00:00:00', 2, '2026-02-06 13:18:51', '2026-02-06 13:18:51', 'CONFIRMED');

INSERT INTO `Comments` (`id`, `roomId`, `userId`, `content`, `rating`, `isDeleted`, `createdAt`, `updatedAt`) VALUES
(1, 3, 4, 'Ở lần thứ 2 vẫn rất ok', NULL, 0, '2026-02-06 13:20:41', '2026-02-06 13:21:47'),
(2, 4, 4, 'Phong dep', NULL, 1, '2026-02-06 13:21:03', '2026-02-06 13:22:24'),
(3, 2, 4, 'Phong dep', NULL, 0, '2026-02-06 13:22:14', '2026-02-06 13:22:14');

INSERT INTO `Locations` (`id`, `name`, `city`, `country`, `imageUrl`, `isDeleted`, `createdAt`, `updatedAt`) VALUES
(1, 'District 2', 'Ho Chi Minh', 'Viet Nam', 'locationImage/lxrfnhjgebh7itmxaabo', 0, '2026-02-06 13:09:58', '2026-02-06 13:11:54'),
(2, 'District 3', 'HCM', 'VN', NULL, 1, '2026-02-06 13:10:03', '2026-02-06 13:25:19'),
(3, 'Shibuya', 'Tokyo', 'Japan', NULL, 1, '2026-02-06 13:10:23', '2026-02-06 13:11:38'),
(4, 'Shinjuku', 'Tokyo', 'JP', NULL, 0, '2026-02-06 13:10:30', '2026-02-06 13:10:55');

INSERT INTO `Rooms` (`id`, `name`, `guestCount`, `bedroomCount`, `bedCount`, `bathroomCount`, `description`, `price`, `hasWashingMachine`, `hasIron`, `hasTV`, `hasAC`, `hasWifi`, `hasKitchen`, `hasParking`, `hasPool`, `hasHeater`, `locationId`, `userId`, `imageUrl`, `isDeleted`, `createdAt`, `updatedAt`) VALUES
(1, 'Test Apartment A', 2, 1, 1, 1, 'test room', 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, NULL, 1, '2026-02-06 13:13:10', '2026-02-06 13:14:30'),
(2, 'Test Apartment B', 2, 1, 1, 1, 'Updated description', 160, 0, 0, 0, 0, 0, 0, 1, 1, 0, 4, 2, 'roomImage/ho9vaxjdwptf3ebkn8bs', 1, '2026-02-06 13:13:27', '2026-02-06 13:24:57'),
(3, 'Nguyen B Apartment A', 2, 1, 1, 1, 'test room', 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, NULL, 0, '2026-02-06 13:17:06', '2026-02-06 13:17:06'),
(4, 'Nguyen B Apartment B', 3, 1, 1, 1, 'nguyen b room', 300, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, NULL, 0, '2026-02-06 13:17:36', '2026-02-06 13:17:36');

INSERT INTO `SavedRooms` (`userId`, `roomId`, `isDeleted`, `createdAt`, `updatedAt`) VALUES
(4, 3, 0, '2026-02-06 13:23:54', '2026-02-06 13:23:54');

INSERT INTO `Users` (`id`, `name`, `email`, `password`, `phone`, `birthday`, `gender`, `role`, `avatar`, `isDeleted`, `createdAt`, `updatedAt`, `googleId`) VALUES
(1, 'Super Admin so handsome', 'nguyenvana@example.com', '$2b$10$iBJC43G8.3/0qN7/7JooF.hiwe7GkDyG.Q0QN40FZf5eD6ZbpWfTm', '0988777666', '1998-02-02', 'MALE', 'ADMIN', 'avatar/iq0uljn6bir69eosejrt', 0, '2026-02-06 13:02:18', '2026-02-06 13:09:32', NULL),
(2, 'Tes Ter', 'tes.ter@example.com', '$2b$10$GI1F2oC0LxGTGC7NjgtvSOhXmN9.9dGp.xpiNdnEzP3tKqT94jzB.', NULL, NULL, NULL, 'USER', NULL, 0, '2026-02-06 13:02:53', '2026-02-06 13:02:53', NULL),
(3, 'Nguyen D', 'nguyend@excample.com', NULL, NULL, NULL, NULL, 'USER', 'https://lh3.googleusercontent.com/a/ACg8ocL7AywBVOeye_Htmc70qg8XHhB6', 0, '2026-02-06 13:05:48', '2026-02-06 13:05:48', '10978364822'),
(4, 'Nguyen Thi B', 'nguyenb@example.com', '$2b$10$x7e0uTtB./uZI6R.pVjQq.3jNj7wnD2Mfbeg3AQ/IkoYv7b4wy7hO', NULL, '1999-01-01', NULL, 'USER', NULL, 0, '2026-02-06 13:07:26', '2026-02-06 13:07:26', NULL),
(5, 'Tran van C', 'tranc@example.com', '$2b$10$F6wptfzoVWPwXrq/uroEWOgSSSBPwXO.1GVdNHU9jMCEVk8ulkIbu', NULL, '1999-01-01', NULL, 'ADMIN', NULL, 1, '2026-02-06 13:07:55', '2026-02-06 13:08:33', NULL);



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;