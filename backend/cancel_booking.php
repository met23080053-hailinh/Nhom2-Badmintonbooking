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

    if (empty($data->booking_id) || empty($data->user_id)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Thiếu thông tin hủy đơn."]);
        exit;
    }

    $booking_id = $data->booking_id;
    $user_id = $data->user_id;

    try {
        $pdo->beginTransaction();

        // Lấy thông tin đơn
        $stmt = $pdo->prepare("SELECT status, start_time, total_price FROM bookings WHERE id = ? AND user_id = ? FOR UPDATE");
        $stmt->execute([$booking_id, $user_id]);
        $booking = $stmt->fetch();

        if (!$booking) {
            $pdo->rollBack();
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Không tìm thấy đơn hoặc không có quyền hủy."]);
            exit;
        }

        if ($booking['status'] === 'cancelled') {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Đơn này đã được hủy trước đó."]);
            exit;
        }

        // Tính khoảng thời gian chênh lệch (đơn vị: giờ)
        $start_timestamp = strtotime($booking['start_time']);
        $current_timestamp = time();
        $diff_hours = ($start_timestamp - $current_timestamp) / 3600;

        $refund_amount = 0;

        if ($diff_hours >= 4) {
            // Hoàn tiền 100%
            $refund_amount = $booking['total_price'];
            
            // Cập nhật trạng thái hủy và tiền hoàn
            $stmtUpdateBooking = $pdo->prepare("UPDATE bookings SET status = 'cancelled', refund_amount = ? WHERE id = ?");
            $stmtUpdateBooking->execute([$refund_amount, $booking_id]);

            // Cộng tiền vào ví
            $stmtUpdateWallet = $pdo->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?");
            $stmtUpdateWallet->execute([$refund_amount, $user_id]);
            
            $message = "Hủy đơn thành công. Bạn đã được hoàn " . number_format($refund_amount, 0, ',', '.') . " VNĐ vào ví điện tử do hủy trước 4 tiếng.";
        } else {
            // Phạt, không hoàn tiền
            $refund_amount = 0;

            // Cập nhật trạng thái hủy và tiền hoàn = 0
            $stmtUpdateBooking = $pdo->prepare("UPDATE bookings SET status = 'cancelled', refund_amount = 0 WHERE id = ?");
            $stmtUpdateBooking->execute([$booking_id]);

            $message = "Hủy đơn thành công. Bạn KHÔNG được hoàn tiền do hủy sát giờ (dưới 4 tiếng).";
        }

        $pdo->commit();

        http_response_code(200);
        echo json_encode(["status" => "success", "message" => $message, "refund_amount" => $refund_amount]);

    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Lỗi cơ sở dữ liệu: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không hỗ trợ."]);
}
?>
