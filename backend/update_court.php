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

    $court_id = $data->court_id ?? null;
    $name = $data->name ?? null;
    $location = $data->location ?? null;
    $city = $data->city ?? null;
    $district = $data->district ?? null;
    $phone = $data->phone ?? null;
    $featured = $data->featured ?? null;
    $total_courts = $data->total_courts ?? null;
    $available_courts_count = $data->available_courts_count ?? null;
    $rating = $data->rating ?? null;
    $review_count = $data->review_count ?? null;
    
    $court_type = $data->court_type ?? null;
    $price_per_hour = $data->price_per_hour ?? null;
    $opening_time = $data->opening_time ?? null;
    $closing_time = $data->closing_time ?? null;
    $status = $data->status ?? null;
    $description = $data->description ?? null;
    $images = $data->images ?? null;
    $amenities = $data->amenities ?? null;
    $sub_courts = $data->sub_courts ?? null;

    if (!$court_id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Thiếu ID sân cần cập nhật."]);
        exit;
    }

    try {
        $fields = [];
        $params = [];

        if ($name !== null) { $fields[] = "name = ?"; $params[] = $name; }
        if ($location !== null) { $fields[] = "location = ?"; $params[] = $location; }
        if ($city !== null) { $fields[] = "city = ?"; $params[] = $city; }
        if ($district !== null) { $fields[] = "district = ?"; $params[] = $district; }
        if ($phone !== null) { $fields[] = "phone = ?"; $params[] = $phone; }
        if ($featured !== null) { $fields[] = "featured = ?"; $params[] = $featured; }
        if ($total_courts !== null) { $fields[] = "total_courts = ?"; $params[] = $total_courts; }
        if ($available_courts_count !== null) { $fields[] = "available_courts_count = ?"; $params[] = $available_courts_count; }
        if ($rating !== null) { $fields[] = "rating = ?"; $params[] = $rating; }
        if ($review_count !== null) { $fields[] = "review_count = ?"; $params[] = $review_count; }
        
        if ($court_type !== null) { $fields[] = "court_type = ?"; $params[] = $court_type; }
        if ($price_per_hour !== null) { $fields[] = "price_per_hour = ?"; $params[] = $price_per_hour; }
        if ($opening_time !== null) { $fields[] = "opening_time = ?"; $params[] = $opening_time; }
        if ($closing_time !== null) { $fields[] = "closing_time = ?"; $params[] = $closing_time; }
        if ($status !== null) { $fields[] = "status = ?"; $params[] = $status; }
        if ($description !== null) { $fields[] = "description = ?"; $params[] = $description; }
        if ($images !== null) { $fields[] = "images = ?"; $params[] = json_encode($images); }
        if ($amenities !== null) { $fields[] = "amenities = ?"; $params[] = json_encode($amenities); }
        if ($sub_courts !== null) { $fields[] = "sub_courts = ?"; $params[] = json_encode($sub_courts); }

        if (count($fields) === 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Không có dữ liệu nào để cập nhật."]);
            exit;
        }

        $params[] = $court_id; // Cho điều kiện WHERE

        $sql = "UPDATE courts SET " . implode(", ", $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Cập nhật sân thành công!"]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Lỗi hệ thống: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không được hỗ trợ."]);
}
?>
