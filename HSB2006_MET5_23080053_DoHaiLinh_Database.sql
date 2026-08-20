SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

DROP TABLE IF EXISTS  `users`;


CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('CUSTOMER','ADMIN') DEFAULT 'CUSTOMER',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` VALUES("1","Admin Cầu Lông","admin@badminton.com","0901234567","$2y$10$5YTkRzZeMWhmqPpVHob9xe4Mo1LBSPLzaq04MYODnqlChuZe8cOz6","ADMIN","2026-08-18 00:28:49");
INSERT INTO `users` VALUES("2","Nguyễn Văn A","nva@example.com","0912345678","$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi","CUSTOMER","2026-08-18 00:28:49");
INSERT INTO `users` VALUES("3","Trần Thị B","ttb@example.com","0987654321","$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi","CUSTOMER","2026-08-18 00:28:49");
INSERT INTO `users` VALUES("4","Linh Hải","haiiling005@gmail.com","G10115542506157","$2y$10$/YNn37fzUUaF9GNoEZ69ee74or7KFrTq03.7yCvYW5xfJyC3s.fUC","CUSTOMER","2026-08-18 10:10:24");
INSERT INTO `users` VALUES("5","ĐỖ HẢI LINH","met23080053@hsb.edu.vn","G10223600403797","$2y$10$vHLoBgjwaGzy2dV67MqLJ.tItlzFs8TuYKUDbhzHy1ksvWjj6tY1S","CUSTOMER","2026-08-18 10:10:46");
INSERT INTO `users` VALUES("6","Admin System","admin@badminton.vn","0999999999","$2y$10$3gx3cRtnM71eMSIyFS0WnepT.RZn0SI0YFI0lICTWhkNA.0UhipDy","ADMIN","2026-08-18 11:17:25");



DROP TABLE IF EXISTS  `courts`;


CREATE TABLE `courts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `location` varchar(255) NOT NULL,
  `court_type` enum('STANDARD','VIP') DEFAULT 'STANDARD',
  `price_per_hour` decimal(10,2) NOT NULL,
  `opening_time` time NOT NULL DEFAULT '06:00:00',
  `closing_time` time NOT NULL DEFAULT '22:00:00',
  `status` enum('AVAILABLE','MAINTENANCE') DEFAULT 'AVAILABLE',
  `description` text DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `courts` VALUES("1","Sân 1 - Tiêu chuẩn","Nhà thi đấu Cầu Giấy","STANDARD","80000.00","06:00:00","22:00:00","AVAILABLE","Sân thảm PVC tiêu chuẩn, ánh sáng tốt.","","2026-08-18 00:28:49");
INSERT INTO `courts` VALUES("2","Sân 2 - Tiêu chuẩn","Nhà thi đấu Cầu Giấy","STANDARD","80000.00","06:00:00","22:00:00","AVAILABLE","Sân thảm PVC tiêu chuẩn, gần quầy nước.","","2026-08-18 00:28:49");
INSERT INTO `courts` VALUES("3","Sân 3 - VIP","Nhà thi đấu Cầu Giấy","VIP","120000.00","06:00:00","22:00:00","AVAILABLE","Sân VIP có điều hòa và thảm Yonex cao cấp.","","2026-08-18 00:28:49");



DROP TABLE IF EXISTS  `news`;


CREATE TABLE `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `date_str` varchar(50) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `category` varchar(100) NOT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `news` VALUES("1","Giải Cầu Lông Tranh Cúp Mùa Thu 2026","20 Thg 10, 2026","/images/preview (1).webp","Giải đấu quy mô lớn nhất trong năm với tổng giải thưởng lên đến 100 triệu VNĐ dành cho các tay vợt phong trào trên toàn quốc.","Giải Đấu","Chi tiết giải đấu...","2026-08-20 13:51:03");
INSERT INTO `news` VALUES("2","Khuyến Mãi Khung Giờ Vàng: Giảm 30% Tiền Sân","18 Thg 10, 2026","/images/preview (3).webp","Từ ngày 20/10 đến 30/10, hệ thống sân cầu lông của chúng tôi giảm giá 30% cho khung giờ 9:00 - 15:00 các ngày trong tuần.","Khuyến Mãi","Chi tiết khuyến mãi...","2026-08-20 13:51:03");
INSERT INTO `news` VALUES("3","Bí Quyết Chọn Vợt Cầu Lông Cho Người Mới Bắt Đầu","15 Thg 10, 2026","/images/preview.webp","Làm thế nào để chọn một cây vợt phù hợp với lực tay và lối đánh của bạn? Cùng tìm hiểu qua bài viết dưới đây.","Kiến Thức","Chi tiết kiến thức...","2026-08-20 13:51:03");



DROP TABLE IF EXISTS  `bookings`;


CREATE TABLE `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_code` varchar(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `court_id` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('PENDING','PENDING_PAYMENT','CONFIRMED','CANCELLED','COMPLETED') DEFAULT 'PENDING',
  `is_reminded` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_code` (`booking_code`),
  KEY `user_id` (`user_id`),
  KEY `court_id` (`court_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`court_id`) REFERENCES `courts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bookings` VALUES("1","BKG-170826001","2","1","2026-08-20 18:00:00","2026-08-20 20:00:00","160000.00","CONFIRMED","0","2026-08-18 00:28:50");
INSERT INTO `bookings` VALUES("2","BKG-170826002","3","3","2026-08-21 19:00:00","2026-08-21 21:00:00","240000.00","PENDING","0","2026-08-18 00:28:50");
INSERT INTO `bookings` VALUES("3","BKG-20260819-9716","1","2","2026-08-19 18:00:00","2026-08-19 19:00:00","80000.00","PENDING","0","2026-08-19 15:14:38");



DROP TABLE IF EXISTS  `payments`;


CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `payment_method` enum('VNPAY','MOMO','BANK_TRANSFER','CASH') NOT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('PENDING','SUCCESS','FAILED','REFUNDED') DEFAULT 'PENDING',
  `payment_time` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `payments` VALUES("1","1","VNPAY","VNP123456789","160000.00","SUCCESS","2026-08-18 00:28:50");
INSERT INTO `payments` VALUES("2","2","BANK_TRANSFER","","240000.00","PENDING","2026-08-18 00:28:50");



DROP TABLE IF EXISTS  `matchmaking`;


CREATE TABLE `matchmaking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `court_id` int(11) DEFAULT NULL,
  `play_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `required_level` varchar(50) DEFAULT 'Mọi trình độ',
  `note` text DEFAULT NULL,
  `status` enum('OPEN','CLOSED') DEFAULT 'OPEN',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `spots_needed` int(11) DEFAULT 2,
  `spots_filled` int(11) DEFAULT 1,
  `cost_per_person` varchar(50) DEFAULT '40.000 VNĐ',
  `gender_req` varchar(50) DEFAULT 'Bất kỳ',
  `court_number` varchar(50) DEFAULT 'Sân 1',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `court_id` (`court_id`),
  CONSTRAINT `matchmaking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `matchmaking_ibfk_2` FOREIGN KEY (`court_id`) REFERENCES `courts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `matchmaking` VALUES("1","2","2","2026-08-22","17:00:00","19:00:00","Trung bình - Khá","Nhóm đang có 3 người, cần tìm thêm 1 nam đánh đôi.","OPEN","2026-08-18 00:28:50","2","1","40.000 VNĐ","Bất kỳ","Sân 1");



DROP TABLE IF EXISTS  `matchmaking_participants`;


CREATE TABLE `matchmaking_participants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `matchmaking_id` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_phone` varchar(20) NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `matchmaking_id` (`matchmaking_id`),
  CONSTRAINT `matchmaking_participants_ibfk_1` FOREIGN KEY (`matchmaking_id`) REFERENCES `matchmaking` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




DROP TABLE IF EXISTS  `reviews`;


CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `court_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `court_id` (`court_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`court_id`) REFERENCES `courts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




