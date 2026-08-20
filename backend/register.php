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

// Chỉ chấp nhận request dạng POST (vì có chứa thông tin nhạy cảm như mật khẩu)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lấy dữ liệu JSON từ Frontend gửi lên
    $data = json_decode(file_get_contents("php://input"));

    // Kiểm tra xem các trường bắt buộc có tồn tại và không bị trống hay không (email là tùy chọn)
    if (!empty($data->full_name) && !empty($data->phone) && !empty($data->password)) {
        
        $full_name = htmlspecialchars(strip_tags($data->full_name));
        $phone = htmlspecialchars(strip_tags($data->phone));
        $email = !empty($data->email) ? filter_var($data->email, FILTER_SANITIZE_EMAIL) : $phone . '@badminton.com';
        
        // MÃ HÓA MẬT KHẨU: Sử dụng BCRYPT - Tiêu chuẩn bảo mật cao nhất của PHP
        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

        try {
            // Kiểm tra xem Email hoặc Số điện thoại đã tồn tại chưa
            $check_sql = "SELECT id FROM users WHERE email = ? OR phone = ?";
            $check_stmt = $pdo->prepare($check_sql);
            $check_stmt->execute([$email, $phone]);

            if ($check_stmt->rowCount() > 0) {
                http_response_code(400); // 400 Bad Request
                echo json_encode(["status" => "error", "message" => "Email hoặc Số điện thoại đã được sử dụng!"]);
                exit;
            }

            // Nếu chưa tồn tại, tiến hành thêm mới vào CSDL (Mặc định role là CUSTOMER)
            $insert_sql = "INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'CUSTOMER')";
            $insert_stmt = $pdo->prepare($insert_sql);
            
            if ($insert_stmt->execute([$full_name, $email, $phone, $password_hash])) {
                http_response_code(201); // 201 Created
                echo json_encode(["status" => "success", "message" => "Đăng ký tài khoản thành công!"]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Không thể tạo tài khoản. Vui lòng thử lại sau."]);
            }

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Lỗi cơ sở dữ liệu: " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Vui lòng điền đầy đủ thông tin (Họ tên, Email, Số điện thoại, Mật khẩu)."]);
    }
} else {
    http_response_code(405); // 405 Method Not Allowed
    echo json_encode(["status" => "error", "message" => "Phương thức không được hỗ trợ (Chỉ dùng POST)."]);
}
?>
