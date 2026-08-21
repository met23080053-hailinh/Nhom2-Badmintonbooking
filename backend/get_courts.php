<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Gọi file kết nối cơ sở dữ liệu
require 'db_connection.php';

try {
    // Viết câu lệnh SQL cơ bản
    $sql = "SELECT id, name, location, city, district, rating, review_count, phone, featured, total_courts, available_courts_count, court_type, price_per_hour, opening_time, closing_time, status, description, amenities, sub_courts, images FROM courts WHERE 1=1";
    $params = [];

    // Xử lý lọc theo quận (district/location)
    if (isset($_GET['district']) && !empty($_GET['district'])) {
        $sql .= " AND location LIKE ?";
        $params[] = '%' . $_GET['district'] . '%';
    }

    // Xử lý lọc theo trạng thái
    if (isset($_GET['status']) && !empty($_GET['status']) && $_GET['status'] !== 'all') {
        $sql .= " AND status = ?";
        $params[] = $_GET['status'];
    }

    // Xử lý lọc theo loại sân
    if (isset($_GET['court_type']) && !empty($_GET['court_type']) && $_GET['court_type'] !== 'all') {
        $sql .= " AND court_type = ?";
        $params[] = $_GET['court_type'];
    }

    // Xử lý lọc theo khoảng giá
    if (isset($_GET['price_range']) && !empty($_GET['price_range'])) {
        $range = explode('-', $_GET['price_range']);
        if (count($range) === 2) {
            $sql .= " AND price_per_hour >= ? AND price_per_hour <= ?";
            $params[] = (float)$range[0];
            $params[] = (float)$range[1];
        }
    }

    $sql .= " ORDER BY id ASC";
    
    // Thực thi câu lệnh bằng PDO
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    // Lấy toàn bộ dữ liệu trả về dưới dạng mảng kết hợp (Associative Array)
    $courts = $stmt->fetchAll();

    // Xử lý cột images: vì trong DB lưu là chuỗi JSON, ta cần decode nó ra thành mảng/object thực thụ 
    // để khi trả về cho React, nó không bị biến thành chuỗi text khó đọc.
    foreach ($courts as &$court) {
        if (!empty($court['images'])) {
            $court['images'] = json_decode($court['images']);
        } else {
            $court['images'] = []; // Trả về mảng rỗng nếu chưa có ảnh
        }
        
        if (!empty($court['amenities'])) {
            $court['amenities'] = json_decode($court['amenities']);
        } else {
            $court['amenities'] = [];
        }
        
        if (!empty($court['sub_courts'])) {
            $court['sub_courts'] = json_decode($court['sub_courts']);
        } else {
            $court['sub_courts'] = [];
        }
        
        // Transform keys to match frontend CourtFacility interface exactly
        $court['id'] = (int)$court['id'];
        $court['rating'] = (float)$court['rating'];
        $court['reviewCount'] = (int)$court['review_count'];
        $court['pricePerHour'] = (float)$court['price_per_hour'];
        $court['formattedPrice'] = number_format((float)$court['price_per_hour'], 0, ',', '.') . ' VNĐ';
        $court['openingHours'] = substr($court['opening_time'], 0, 5) . ' - ' . substr($court['closing_time'], 0, 5);
        $court['totalCourts'] = (int)$court['total_courts'];
        $court['availableCourtsCount'] = (int)$court['available_courts_count'];
        $court['featured'] = (bool)$court['featured'];
        $court['subCourts'] = $court['sub_courts'];
        $court['imageUrl'] = !empty($court['images']) ? $court['images'][0] : '/images/preview (3).webp';
        $court['galleryImages'] = $court['images'];
        $court['statusBadge'] = $court['status'] === 'AVAILABLE' ? 'ĐANG TRỐNG' : 'BẢO TRÌ';
    }

    // Trả về cục dữ liệu JSON thành công
    echo json_encode([
        "status" => "success",
        "message" => "Lấy danh sách sân thành công",
        "data" => $courts
    ]);

} catch (PDOException $e) {
    // Bắt lỗi nếu truy vấn SQL thất bại (ví dụ: sai tên bảng)
    // Ẩn lỗi chi tiết của hệ thống để bảo mật, chỉ báo lỗi chung
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Đã xảy ra lỗi khi lấy danh sách sân."
    ]);
}
?>