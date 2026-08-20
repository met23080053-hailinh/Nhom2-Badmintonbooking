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

    $booking_id = $data->booking_id ?? null;
    $status = $data->status ?? null;
    // status chỉ được phép là: PENDING, CONFIRMED, CANCELLED, COMPLETED

    $allowed_statuses = ['PENDING', 'PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'Paid'];

    if (!$booking_id || !$status || !in_array($status, $allowed_statuses)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Thiếu booking_id hoặc status không hợp lệ."]);
        exit;
    }

    try {
        $sql = "UPDATE bookings SET status = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$status, $booking_id]);

        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Cập nhật trạng thái đơn đặt sân thành công!"]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Không tìm thấy đơn đặt sân hoặc trạng thái không thay đổi."]);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Lỗi hệ thống: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không được hỗ trợ."]);
}
?>
