<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->user_id) && !empty($data->court_id) && !empty($data->start_time) && !empty($data->end_time) && !empty($data->player_name) && !empty($data->player_phone)) {
        
        $user_id = $data->user_id;
        $court_id = $data->court_id;
        $start_time = $data->start_time; // Định dạng YYYY-MM-DD HH:MM:SS
        $end_time = $data->end_time;
        $player_name = $data->player_name;
        $player_phone = $data->player_phone;

        try {
            // Cập nhật tên và SĐT của user nếu họ thay đổi trong lúc đặt sân
            $update_user_sql = "UPDATE users SET full_name = ?, phone = ? WHERE id = ?";
            $update_user_stmt = $pdo->prepare($update_user_sql);
            $update_user_stmt->execute([$player_name, $player_phone, $user_id]);
            // 1. THUẬT TOÁN KIỂM TRA TRÙNG LỊCH (OVERLAP CHECK)
            // Lấy các đơn đặt sân chưa bị Hủy của cùng một sân
            // Điều kiện trùng: Giờ bắt đầu của đơn cũ < Giờ kết thúc đơn mới VÀ Giờ kết thúc đơn cũ > Giờ bắt đầu đơn mới
            $check_sql = "SELECT id FROM bookings WHERE court_id = ? AND status != 'CANCELLED' AND (start_time < ? AND end_time > ?)";
            $check_stmt = $pdo->prepare($check_sql);
            $check_stmt->execute([$court_id, $end_time, $start_time]);

            if ($check_stmt->rowCount() > 0) {
                // Đã có người đặt trong khoảng thời gian này
                http_response_code(409); // 409 Conflict
                echo json_encode(["status" => "error", "message" => "Rất tiếc, sân này đã được đặt trong khung giờ bạn chọn. Vui lòng chọn giờ khác!"]);
                exit;
            }

            // Lấy giá sân từ DB để tính tiền (Bảo mật: Tính tiền ở Server)
            $court_sql = "SELECT price_per_hour FROM courts WHERE id = ?";
            $court_stmt = $pdo->prepare($court_sql);
            $court_stmt->execute([$court_id]);
            $court_data = $court_stmt->fetch();
            
            if (!$court_data) {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Sân không tồn tại!"]);
                exit;
            }

            // Tính số giờ đặt
            $start_timestamp = strtotime($start_time);
            $end_timestamp = strtotime($end_time);
            $duration_hours = ($end_timestamp - $start_timestamp) / 3600;
            
            if ($duration_hours <= 0) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Thời gian đặt sân không hợp lệ."]);
                exit;
            }

            $total_price = $duration_hours * $court_data['price_per_hour'];

            // 2. TẠO MÃ ĐẶT SÂN TỰ ĐỘNG VÀ LƯU VÀO CSDL
            // Tạo mã có dạng: BKG-YYYYMMDD-HệSốNgẫuNhiên
            $booking_code = 'BKG-' . date('Ymd') . '-' . rand(1000, 9999);

            $insert_sql = "INSERT INTO bookings (booking_code, user_id, court_id, start_time, end_time, total_price, status) VALUES (?, ?, ?, ?, ?, ?, 'PENDING')";
            $insert_stmt = $pdo->prepare($insert_sql);
            
            if ($insert_stmt->execute([$booking_code, $user_id, $court_id, $start_time, $end_time, $total_price])) {
                $booking_id = $pdo->lastInsertId(); // Lấy ID của đơn vừa đặt
                
                // 3. TẠO MÃ VIETQR
                // Template VietQR: https://img.vietqr.io/image/{bank}-{account}-{template}.png?amount={amount}&addInfo={content}&accountName={name}
                $bank_id = "MB"; // Ngân hàng MB Bank
                $account_no = "0987654321"; // STK Demo
                $account_name = "NGUYEN VAN A";
                
                $qr_url = "https://img.vietqr.io/image/{$bank_id}-{$account_no}-compact2.png?amount={$total_price}&addInfo={$booking_code}&accountName=" . urlencode($account_name);

                http_response_code(201);
                echo json_encode([
                    "status" => "success", 
                    "message" => "Đặt sân thành công!",
                    "data" => [
                        "booking_id" => $booking_id,
                        "booking_code" => $booking_code,
                        "total_price" => $total_price,
                        "payment_qr_url" => $qr_url
                    ]
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Có lỗi xảy ra khi tạo đơn đặt sân."]);
            }

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Lỗi cơ sở dữ liệu: " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Dữ liệu gửi lên không đầy đủ."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không được hỗ trợ."]);
}
?>