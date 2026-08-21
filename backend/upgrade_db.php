<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require 'db_connection.php';

try {
    // 1. Tạo bảng Users
    $pdo->exec("
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('customer', 'admin') DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // Insert Admin User if not exists
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    if ($stmt->fetchColumn() == 0) {
        $hash = password_hash('123456', PASSWORD_BCRYPT);
        $pdo->exec("INSERT INTO users (full_name, email, password_hash, phone, role) VALUES ('Admin Nguyễn', 'admin@example.com', '$hash', '0900000000', 'admin')");
        $pdo->exec("INSERT INTO users (full_name, email, password_hash, phone, role) VALUES ('Khách Hàng', 'khachhang@example.com', '$hash', '0911111111', 'customer')");
    }

    // 2. Tạo bảng Courts
    $sqlCreateCourts = "
    CREATE TABLE IF NOT EXISTS courts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        city VARCHAR(100) DEFAULT 'Hà Nội',
        district VARCHAR(100) DEFAULT 'Thanh Xuân',
        rating DECIMAL(2,1) DEFAULT 5.0,
        review_count INT DEFAULT 0,
        phone VARCHAR(20) DEFAULT '0901234567',
        featured TINYINT(1) DEFAULT 0,
        total_courts INT DEFAULT 1,
        available_courts_count INT DEFAULT 1,
        court_type VARCHAR(50) DEFAULT 'indoor',
        price_per_hour DECIMAL(10,2) DEFAULT 100000.00,
        opening_time TIME DEFAULT '06:00:00',
        closing_time TIME DEFAULT '22:00:00',
        status ENUM('AVAILABLE', 'MAINTENANCE') DEFAULT 'AVAILABLE',
        description TEXT,
        amenities JSON,
        sub_courts JSON,
        images JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    $pdo->exec($sqlCreateCourts);

    $columnsToAdd = [
        "city" => "VARCHAR(100) DEFAULT 'Hà Nội'",
        "district" => "VARCHAR(100) DEFAULT 'Thanh Xuân'",
        "rating" => "DECIMAL(2,1) DEFAULT 5.0",
        "review_count" => "INT DEFAULT 0",
        "phone" => "VARCHAR(20) DEFAULT '0901234567'",
        "featured" => "TINYINT(1) DEFAULT 0",
        "total_courts" => "INT DEFAULT 1",
        "available_courts_count" => "INT DEFAULT 1",
        "court_type" => "VARCHAR(50) DEFAULT 'indoor'",
        "price_per_hour" => "DECIMAL(10,2) DEFAULT 100000.00",
        "opening_time" => "TIME DEFAULT '06:00:00'",
        "closing_time" => "TIME DEFAULT '22:00:00'",
        "status" => "ENUM('AVAILABLE', 'MAINTENANCE') DEFAULT 'AVAILABLE'",
        "description" => "TEXT",
        "amenities" => "JSON",
        "sub_courts" => "JSON",
        "images" => "JSON"
    ];

    foreach ($columnsToAdd as $colName => $colDef) {
        try {
            $pdo->exec("ALTER TABLE courts ADD COLUMN $colName $colDef");
        } catch (PDOException $e) {
            if ($e->getCode() !== '42S21') throw $e;
        }
    }

    $stmt = $pdo->query("SELECT COUNT(*) FROM courts");
    if ($stmt->fetchColumn() == 0) {
        $sampleAmenities = json_encode(['Bãi đỗ xe', 'Wifi', 'Quán Cafe', 'Phòng thay đồ'], JSON_UNESCAPED_UNICODE);
        $sampleSubCourts = json_encode([
            ['id' => 'sc-1', 'name' => 'Court 1', 'nameCourtNumber' => 'Sân 1', 'isAvailable' => true, 'surface' => 'Thảm Taraflex BWF', 'lightingLux' => 750],
            ['id' => 'sc-2', 'name' => 'Court 2', 'nameCourtNumber' => 'Sân 2', 'isAvailable' => true, 'surface' => 'Thảm Taraflex BWF', 'lightingLux' => 750]
        ], JSON_UNESCAPED_UNICODE);
        $sampleImages1 = json_encode(['/images/25c7353614db742fe9114f39d9db0167.jpg'], JSON_UNESCAPED_UNICODE);
        $sampleImages2 = json_encode(['/images/badminton-court-flooring-500x500.webp'], JSON_UNESCAPED_UNICODE);
        $sampleImages3 = json_encode(['/images/preview (1).webp'], JSON_UNESCAPED_UNICODE);

        $insertSql = "INSERT INTO courts (name, location, city, district, rating, review_count, phone, featured, total_courts, available_courts_count, price_per_hour, opening_time, closing_time, status, description, amenities, sub_courts, images) VALUES 
        ('Elite Smash Arena', '18 Nguyễn Xiển', 'Hà Nội', 'Thanh Xuân', 4.8, 124, '0901234567', 1, 8, 3, 120000, '05:00:00', '23:00:00', 'AVAILABLE', 'Sân thảm tiêu chuẩn thi đấu.', '$sampleAmenities', '$sampleSubCourts', '$sampleImages1'),
        ('CLB Cầu Lông Phú Thọ', '219 Lý Thường Kiệt', 'Hà Nội', 'Hoàn Kiếm', 4.6, 89, '0912345678', 1, 12, 1, 90000, '06:00:00', '22:00:00', 'AVAILABLE', 'Nằm trong khu liên hợp thể thao.', '$sampleAmenities', '$sampleSubCourts', '$sampleImages2'),
        ('Sân Cầu Lông Viettel', 'Hoàng Hoa Thám', 'Hà Nội', 'Cầu Giấy', 4.9, 210, '0987654321', 1, 4, 0, 150000, '06:00:00', '23:59:00', 'AVAILABLE', 'Sân vip dành cho giới văn phòng.', '$sampleAmenities', '$sampleSubCourts', '$sampleImages3')";
        $pdo->exec($insertSql);
    } else {
        $pdo->exec("UPDATE courts SET featured = 1 LIMIT 4");
    }

    // 3. Tạo bảng Bookings
    $pdo->exec("
    CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_code VARCHAR(50),
        user_id INT NOT NULL,
        court_id INT NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        player_name VARCHAR(255) DEFAULT '',
        player_phone VARCHAR(20) DEFAULT '',
        total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
        payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 4. Tạo bảng Promotions
    $pdo->exec("
    CREATE TABLE IF NOT EXISTS promotions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        discount_type ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
        discount_value DECIMAL(10,2) NOT NULL,
        description TEXT,
        valid_from DATE,
        valid_to DATE,
        used_count INT DEFAULT 0,
        max_limit INT DEFAULT 100,
        status ENUM('ACTIVE', 'PAUSED') DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 5. Tạo bảng News
    $pdo->exec("
    CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date_str VARCHAR(50),
        image_url VARCHAR(255),
        excerpt TEXT,
        category VARCHAR(100),
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    $stmt = $pdo->query("SELECT COUNT(*) FROM news");
    if ($stmt->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO news (title, date_str, image_url, excerpt, category, content) VALUES 
        ('Khai mạc giải cầu lông mở rộng 2026', '24 Tháng 10, 2026', '/images/news1.webp', 'Giải đấu thường niên thu hút hơn 200 tay vợt phong trào tham gia...', 'Giải Đấu', 'Nội dung chi tiết giải đấu...'),
        ('Kỹ thuật đập cầu cơ bản cho người mới', '22 Tháng 10, 2026', '/images/news2.webp', 'Hướng dẫn cách đập cầu uy lực và chính xác mà không tốn quá nhiều sức.', 'Kỹ Thuật', 'Nội dung chi tiết kỹ thuật...'),
        ('Ưu đãi giờ vàng: Giảm 50% tiền sân', '20 Tháng 10, 2026', '/images/news3.webp', 'Chương trình khuyến mãi cực sốc áp dụng cho các khung giờ từ 8h - 11h sáng.', 'Khuyến Mãi', 'Nội dung chi tiết khuyến mãi...')
        ");
    }

    // 6. Tạo bảng Partner Requests
    $pdo->exec("
    CREATE TABLE IF NOT EXISTS partner_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        court_id INT,
        level VARCHAR(100),
        date_str VARCHAR(100),
        time_str VARCHAR(100),
        players_needed INT DEFAULT 1,
        contact_name VARCHAR(100),
        contact_phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    $stmt = $pdo->query("SELECT COUNT(*) FROM partner_requests");
    if ($stmt->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO partner_requests (title, court_id, level, date_str, time_str, players_needed, contact_name, contact_phone) VALUES 
        ('Tìm cặp đánh đôi nam tối thứ 6', 1, 'Trung Bình - Khá', 'Thứ 6, 26/10', '19:00 - 21:00', 2, 'Hoàng', '0912345678'),
        ('Giao lưu nam nữ dưỡng sinh', 2, 'Cơ Bản', 'Chủ Nhật, 28/10', '08:00 - 10:00', 4, 'Lan Anh', '0987654321')
        ");
    }

    echo json_encode([
        "status" => "success",
        "message" => "Khởi tạo TOÀN BỘ cấu trúc Database (Users, Courts, Bookings, Promotions, News, Partners) và dữ liệu mẫu thành công tuyệt đối!"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Lỗi CSDL: " . $e->getMessage()
    ]);
}
?>
