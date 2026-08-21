<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    $name = $data->name ?? null;
    $location = $data->location ?? null;
    $city = $data->city ?? 'Hà Nội';
    $district = $data->district ?? 'Khác';
    $phone = $data->phone ?? '0901234567';
    $featured = $data->featured ?? 0;
    $total_courts = $data->total_courts ?? 1;
    $available_courts_count = $data->available_courts_count ?? 1;
    $rating = $data->rating ?? 5.0;
    $review_count = $data->review_count ?? 0;
    
    $court_type = $data->court_type ?? 'STANDARD';
    $price_per_hour = $data->price_per_hour ?? null;
    $opening_time = $data->opening_time ?? '06:00:00';
    $closing_time = $data->closing_time ?? '22:00:00';
    $status = $data->status ?? 'AVAILABLE';
    $description = $data->description ?? '';
    
    $images = $data->images ?? []; // Mảng đường dẫn ảnh
    $amenities = $data->amenities ?? ['Wifi', 'Bãi đỗ xe'];
    $sub_courts = $data->sub_courts ?? [];

    if (!$name || !$location || !$price_per_hour) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Thiếu thông tin bắt buộc (Tên sân, Vị trí, Giá)."]);
        exit;
    }

    try {
        $images_json = json_encode($images);
        $amenities_json = json_encode($amenities);
        $sub_courts_json = json_encode($sub_courts);

        $sql = "INSERT INTO courts (name, location, city, district, phone, featured, total_courts, available_courts_count, rating, review_count, court_type, price_per_hour, opening_time, closing_time, status, description, images, amenities, sub_courts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $location, $city, $district, $phone, $featured, $total_courts, $available_courts_count, $rating, $review_count, $court_type, $price_per_hour, $opening_time, $closing_time, $status, $description, $images_json, $amenities_json, $sub_courts_json]);

        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Thêm sân mới thành công!", "court_id" => $pdo->lastInsertId()]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Lỗi hệ thống: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không được hỗ trợ."]);
}
?>
