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
    $court_type = $data->court_type ?? 'STANDARD';
    $price_per_hour = $data->price_per_hour ?? null;
    $opening_time = $data->opening_time ?? '06:00:00';
    $closing_time = $data->closing_time ?? '22:00:00';
    $status = $data->status ?? 'AVAILABLE';
    $description = $data->description ?? '';
    $images = $data->images ?? []; // Mảng đường dẫn ảnh

    if (!$name || !$location || !$price_per_hour) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Thiếu thông tin bắt buộc (Tên sân, Vị trí, Giá)."]);
        exit;
    }

    try {
        $images_json = json_encode($images);

        $sql = "INSERT INTO courts (name, location, court_type, price_per_hour, opening_time, closing_time, status, description, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $location, $court_type, $price_per_hour, $opening_time, $closing_time, $status, $description, $images_json]);

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
