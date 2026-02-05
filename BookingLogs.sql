-- -------------------------------------------------------------
-- TablePlus 6.8.0(654)
--
-- https://tableplus.com/
--
-- Database: capstone-nestjs-airbnb
-- Generation Time: 2026-02-05 10:15:39.4010
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Comments`;
CREATE TABLE `Comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roomId` int NOT NULL,
  `userId` int NOT NULL,
  `commentDate` datetime DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `BookingLogs` (`id`, `bookingId`, `action`, `performedBy`, `performedAt`) VALUES
(22, 20, 'CREATED', 3, '2026-02-04 09:32:25'),
(23, 21, 'CREATED', 6, '2026-02-04 11:32:45'),
(24, 22, 'CREATED', 6, '2026-02-04 11:35:03');

INSERT INTO `Bookings` (`id`, `roomId`, `userId`, `checkIn`, `checkOut`, `guestCount`, `createdAt`, `updatedAt`, `status`) VALUES
(20, 3, 3, '2026-06-01 00:00:00', '2026-06-03 00:00:00', 2, '2026-02-04 09:32:25', '2026-02-04 09:32:25', 'CONFIRMED'),
(21, 3, 6, '2026-05-01 00:00:00', '2026-05-03 00:00:00', 2, '2026-02-04 11:32:45', '2026-02-04 11:32:45', 'CONFIRMED'),
(22, 3, 6, '2026-04-01 00:00:00', '2026-04-03 00:00:00', 2, '2026-02-04 11:35:03', '2026-02-04 11:35:03', 'CONFIRMED');

INSERT INTO `Comments` (`id`, `roomId`, `userId`, `commentDate`, `content`, `rating`, `isDeleted`, `createdAt`, `updatedAt`) VALUES
(1, 2, 3, NULL, 'Ở lần thứ 2 vẫn rất ok', NULL, 0, '2026-01-31 10:02:45', '2026-01-31 10:15:11');

INSERT INTO `Locations` (`id`, `name`, `city`, `country`, `imageUrl`, `isDeleted`, `createdAt`, `updatedAt`) VALUES
(1, 'District 1', 'HCM', 'VN', 'https://cdn.location.com/d1-new.jpg', 0, '2026-01-29 11:27:54', '2026-01-29 11:28:35'),
(2, 'Shinjuku', 'Tokyo', 'JP', 'locationImage/ssgbptwirf3m8zg0fdcl', 0, '2026-01-29 11:27:58', '2026-02-04 09:31:25'),
(3, 'District 3', 'Ho Chi Minh', 'Vietnam', NULL, 0, '2026-01-29 11:28:01', '2026-01-29 11:28:01'),
(4, 'Shibuya', 'Tokyo', 'Japan', NULL, 0, '2026-02-03 07:52:56', '2026-02-03 07:52:56');

INSERT INTO `Rooms` (`id`, `name`, `guestCount`, `bedroomCount`, `bedCount`, `bathroomCount`, `description`, `price`, `hasWashingMachine`, `hasIron`, `hasTV`, `hasAC`, `hasWifi`, `hasKitchen`, `hasParking`, `hasPool`, `hasHeater`, `locationId`, `userId`, `imageUrl`, `isDeleted`, `createdAt`, `updatedAt`) VALUES
(1, 'Luxury Apartment', 4, 2, 2, 1, 'Updated description', 150, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 'https://cdn.room.com/room1.jpg', 0, '2026-01-29 13:54:47', '2026-02-04 09:31:15'),
(2, 'Luxury Apartment B', 3, 2, 2, 1, 'Nice room in city center', 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 'roomImage/icixjhbprqcliyglkusg', 0, '2026-01-29 13:56:22', '2026-01-30 02:38:13'),
(3, 'Cheap Apartment C', 2, 1, 1, 1, 'Cheap room', 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, NULL, 0, '2026-01-30 02:31:57', '2026-01-30 02:31:57'),
(4, 'Cheap Apartment A', 3, 2, 2, 1, 'Updated description', 150, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 3, 'roomImage/uhkla9b8h7deqfsvikhb', 0, '2026-01-30 02:34:57', '2026-02-04 09:31:15');

INSERT INTO `SavedRooms` (`userId`, `roomId`, `isDeleted`, `createdAt`, `updatedAt`) VALUES
(3, 2, 0, '2026-01-31 11:34:31', '2026-01-31 11:34:31'),
(3, 3, 0, '2026-01-31 11:34:27', '2026-01-31 11:34:27');

INSERT INTO `Users` (`id`, `name`, `email`, `password`, `phone`, `birthday`, `gender`, `role`, `avatar`, `isDeleted`, `createdAt`, `updatedAt`, `googleId`) VALUES
(1, 'Super Admin so handsome', 'nguyenvana@example.com', '$2b$10$Ad1oAssaGPt83yNAu7UN2.R46vmuRJI8viVAfMdMvLbYtsI9LAxVm', '0988777666', '1998-02-02', 'MALE', 'ADMIN', 'avatar/czykgb9ywokyikrnsejq', 0, '2026-01-29 11:23:43', '2026-02-04 12:11:12', NULL),
(2, 'Chu Thi AAAA Updated', 'chub@example.com', '$2b$10$1LKnCtvX/2ziwf9b7PNqHe9VorHcuczA8bwmGStVZevxFNQsqDgny', '0988777666', '1998-02-02', 'MALE', 'USER', 'https://cdn.avatar.com/b.png', 1, '2026-01-29 11:25:07', '2026-02-04 12:11:12', NULL),
(3, 'memee', 'leee1@example.com', '$2b$10$dcIJEYhjMVuDH8C48.yMpOKgalnqOIichFhw/8ucH.f.C3aWdFbc2', '0988777666', '1998-02-02', 'MALE', 'USER', 'avatar/ckq6bksg8kg11t3mchuz', 0, '2026-01-29 11:27:21', '2026-02-04 12:11:12', NULL),
(5, 'Tran Van F', 'tranf@example.com', '$2b$10$39ggSdcrdjb11gEUIE.vgOs5In5YFHnEBgx9rL7YIdfhleWhyGWR6', NULL, '1999-01-01', NULL, 'USER', NULL, 0, '2026-02-03 07:47:25', '2026-02-04 12:11:12', NULL),
(6, 'Le A', 'lea@example.com', '$2b$10$WqePFEWEaLi6vpcrIS7ve.ZK5J9HQv7Ed7.MAZ9XdejNp0W008a/i', '0988777666', '1998-02-02', 'MALE', 'USER', 'avatar/jvkhnav4ihseesrora2i', 0, '2026-02-04 11:30:44', '2026-02-04 12:11:24', NULL);



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;