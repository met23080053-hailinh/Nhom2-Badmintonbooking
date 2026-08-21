<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require 'db_connection.php';

try {
    // 0. Tạo bảng courts nếu chưa có
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

    // 1. Thêm các cột vào bảng courts (cho các database cũ)
    $columnsToAdd = [
        "city" => "VARCHAR(100) DEFAULT 'Hà Nội'",
        "district" => "VARCHAR(100) DEFAULT 'Thanh Xuân'",
        "rating" => "DECIMAL(2,1) DEFAULT 5.0",
        "review_count" => "INT DEFAULT 0",
        "amenities" => "JSON",
        "sub_courts" => "JSON",
        "phone" => "VARCHAR(20) DEFAULT '0901234567'",
        "featured" => "TINYINT(1) DEFAULT 0",
        "total_courts" => "INT DEFAULT 1",
        "available_courts_count" => "INT DEFAULT 1"
    ];

    foreach ($columnsToAdd as $colName => $colDef) {
        try {
            $pdo->exec("ALTER TABLE courts ADD COLUMN $colName $colDef");
        } catch (PDOException $e) {
            // Bỏ qua lỗi Duplicate column name (Mã 42S21)
            if ($e->getCode() !== '42S21') {
                throw $e;
            }
        }
    }

    // 2. Kiểm tra nếu bảng courts đang trống thì insert dữ liệu mẫu
    $stmt = $pdo->query("SELECT COUNT(*) FROM courts");
    $count = $stmt->fetchColumn();

    if ($count == 0) {
        $sampleAmenities = json_encode(['Bãi đỗ xe', 'Wifi', 'Quán Cafe', 'Phòng thay đồ']);
        $sampleSubCourts = json_encode([
            ['id' => 'sc-1', 'name' => 'Court 1', 'nameCourtNumber' => 'Sân 1', 'isAvailable' => true, 'surface' => 'Thảm Taraflex BWF', 'lightingLux' => 750],
            ['id' => 'sc-2', 'name' => 'Court 2', 'nameCourtNumber' => 'Sân 2', 'isAvailable' => true, 'surface' => 'Thảm Taraflex BWF', 'lightingLux' => 750]
        ]);
        $sampleImages1 = json_encode(['/images/25c7353614db742fe9114f39d9db0167.jpg']);
        $sampleImages2 = json_encode(['/images/badminton-court-flooring-500x500.webp']);
        $sampleImages3 = json_encode(['/images/preview (1).webp']);

        $insertSql = "INSERT INTO courts (name, location, city, district, rating, review_count, phone, featured, total_courts, available_courts_count, price_per_hour, opening_time, closing_time, status, description, amenities, sub_courts, images) VALUES 
        ('Elite Smash Arena', '18 Nguyễn Xiển', 'Hà Nội', 'Thanh Xuân', 4.8, 124, '0901234567', 1, 8, 3, 120000, '05:00:00', '23:00:00', 'AVAILABLE', 'Sân thảm tiêu chuẩn thi đấu.', '$sampleAmenities', '$sampleSubCourts', '$sampleImages1'),
        ('CLB Cầu Lông Phú Thọ', '219 Lý Thường Kiệt', 'TP. Hồ Chí Minh', 'Quận 11', 4.6, 89, '0912345678', 1, 12, 1, 90000, '06:00:00', '22:00:00', 'AVAILABLE', 'Nằm trong khu liên hợp thể thao Phú Thọ.', '$sampleAmenities', '$sampleSubCourts', '$sampleImages2'),
        ('Sân Cầu Lông Viettel', 'Hoàng Hoa Thám', 'TP. Hồ Chí Minh', 'Tân Bình', 4.9, 210, '0987654321', 1, 4, 0, 150000, '06:00:00', '23:59:00', 'AVAILABLE', 'Sân vip dành cho giới văn phòng.', '$sampleAmenities', '$sampleSubCourts', '$sampleImages3')";
        
        $pdo->exec($insertSql);
    } else {
        // Cập nhật dữ liệu mặc định cho các cột JSON nếu nó bị rỗng
        $defaultAmenities = json_encode(['Bãi đỗ xe', 'Wifi', 'Quán Cafe']);
        $defaultSubCourts = json_encode([
            [
                'id' => 'sc-1',
                'name' => 'Court 1',
                'nameCourtNumber' => 'Sân 1',
                'isAvailable' => true,
                'surface' => 'Thảm Taraflex BWF',
                'lightingLux' => 750
            ]
        ]);
        $pdo->exec("UPDATE courts SET amenities = '$defaultAmenities' WHERE amenities IS NULL");
        $pdo->exec("UPDATE courts SET sub_courts = '$defaultSubCourts' WHERE sub_courts IS NULL");
    }

    // 3. Tạo bảng promotions nếu chưa tồn tại
    $sqlCreatePromotions = "
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
    ";
    $pdo->exec($sqlCreatePromotions);

    echo json_encode([
        "status" => "success",
        "message" => "Nâng cấp cơ sở dữ liệu thành công! Đã tạo bảng, bổ sung cột và thêm dữ liệu mẫu nếu cần."
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Lỗi khi nâng cấp CSDL: " . $e->getMessage()
    ]);
}
?>
