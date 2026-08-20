-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS badminton_booking_db
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE badminton_booking_db;

-- 1. BẢNG NGƯỜI DÙNG (Tài khoản Customer & Admin)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'ADMIN') DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG SÂN CẦU LÔNG
CREATE TABLE courts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    court_type ENUM('STANDARD', 'VIP') DEFAULT 'STANDARD',
    price_per_hour DECIMAL(10,2) NOT NULL,
    opening_time TIME NOT NULL DEFAULT '06:00:00',
    closing_time TIME NOT NULL DEFAULT '22:00:00',
    status ENUM('AVAILABLE', 'MAINTENANCE') DEFAULT 'AVAILABLE',
    description TEXT,
    images JSON, -- Lưu mảng đường dẫn ảnh
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG ĐẶT SÂN
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(20) UNIQUE NOT NULL, -- Ví dụ: BKG-17082026
    user_id INT NOT NULL,
    court_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE
);

-- 4. BẢNG THANH TOÁN
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_method ENUM('VNPAY', 'MOMO', 'BANK_TRANSFER', 'CASH') NOT NULL,
    transaction_id VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- 5. BẢNG MATCHMAKING (Tìm bạn chơi)
CREATE TABLE matchmaking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    court_id INT,
    play_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    required_level VARCHAR(50) DEFAULT 'Mọi trình độ', -- Mới chơi, Trung bình, Khá
    note TEXT,
    status ENUM('OPEN', 'CLOSED') DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE SET NULL
);

-- 6. BẢNG ĐÁNH GIÁ (Reviews)
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    court_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE
);

-- ==========================================
-- DỮ LIỆU MẪU (Dành cho việc Test và chấm điểm)
-- ==========================================

-- Thêm tài khoản mẫu (Mật khẩu đã được mã hóa BCRYPT cho chữ 'password123')
INSERT INTO users (full_name, email, phone, password_hash, role) VALUES 
('Admin Cầu Lông', 'admin@badminton.com', '0901234567', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN'),
('Nguyễn Văn A', 'nva@example.com', '0912345678', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER'),
('Trần Thị B', 'ttb@example.com', '0987654321', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER');

-- Thêm sân cầu lông mẫu
INSERT INTO courts (name, location, court_type, price_per_hour, description) VALUES 
('Sân 1 - Tiêu chuẩn', 'Nhà thi đấu Cầu Giấy', 'STANDARD', 80000, 'Sân thảm PVC tiêu chuẩn, ánh sáng tốt.'),
('Sân 2 - Tiêu chuẩn', 'Nhà thi đấu Cầu Giấy', 'STANDARD', 80000, 'Sân thảm PVC tiêu chuẩn, gần quầy nước.'),
('Sân 3 - VIP', 'Nhà thi đấu Cầu Giấy', 'VIP', 120000, 'Sân VIP có điều hòa và thảm Yonex cao cấp.');

-- Thêm đơn đặt sân mẫu
INSERT INTO bookings (booking_code, user_id, court_id, start_time, end_time, total_price, status) VALUES 
('BKG-170826001', 2, 1, '2026-08-20 18:00:00', '2026-08-20 20:00:00', 160000, 'CONFIRMED'),
('BKG-170826002', 3, 3, '2026-08-21 19:00:00', '2026-08-21 21:00:00', 240000, 'PENDING');

-- Thêm giao dịch thanh toán mẫu
INSERT INTO payments (booking_id, payment_method, transaction_id, amount, status) VALUES 
(1, 'VNPAY', 'VNP123456789', 160000, 'SUCCESS'),
(2, 'BANK_TRANSFER', NULL, 240000, 'PENDING');

-- Thêm tin tìm bạn chơi mẫu
INSERT INTO matchmaking (user_id, court_id, play_date, start_time, end_time, required_level, note) VALUES 
(2, 2, '2026-08-22', '17:00:00', '19:00:00', 'Trung bình - Khá', 'Nhóm đang có 3 người, cần tìm thêm 1 nam đánh đôi.');
