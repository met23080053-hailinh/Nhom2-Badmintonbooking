<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    $booking_id = $data->booking_id ?? null;

    if (!$booking_id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Thiếu mã đặt sân."]);
        exit;
    }

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("UPDATE bookings SET status = 'PENDING_PAYMENT' WHERE id = ?");
        $stmt->execute([$booking_id]);

        $pdo->commit();

        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Đã gửi thông báo xác nhận chuyển khoản tới Chủ sân. Vui lòng chờ duyệt!"]);

    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Lỗi hệ thống: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không được hỗ trợ."]);
}
?>
