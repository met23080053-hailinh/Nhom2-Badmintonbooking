<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require 'db_connection.php';

try {
    // 1. Thêm các cột vào bảng courts nếu chưa có
    // Sử dụng kỹ thuật catch lỗi Duplicate column name nếu cột đã tồn tại
    
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

    // 2. Cập nhật dữ liệu mặc định cho các cột JSON nếu nó bị rỗng (NULL)
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
        "message" => "Nâng cấp cơ sở dữ liệu thành công! Đã bổ sung các cột cần thiết cho bảng courts và tạo bảng promotions."
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Lỗi khi nâng cấp CSDL: " . $e->getMessage()
    ]);
}
?>
