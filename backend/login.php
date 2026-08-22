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

// Chỉ chấp nhận POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->email) && !empty($data->password)) {
        // Here, the frontend might send a phone number in the 'email' field.
        $login_identifier = htmlspecialchars(strip_tags($data->email));
        $password = $data->password;

        try {
            // Tìm người dùng theo Email hoặc Số điện thoại
            $sql = "SELECT id, full_name, email, phone, password_hash, role FROM users WHERE email = ? OR phone = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$login_identifier, $login_identifier]);
            $user = $stmt->fetch();

            // Nếu tìm thấy người dùng VÀ mật khẩu nhập vào khớp với mã hash trong CSDL
            if ($user && password_verify($password, $user['password_hash'])) {
                
                // Xóa password_hash trước khi trả dữ liệu về Frontend để bảo mật
                unset($user['password_hash']);

                // Tạo một token đơn giản (Trong thực tế thường dùng JWT)
                $token = bin2hex(random_bytes(16)); 

                http_response_code(200); // 200 OK
                echo json_encode([
                    "status" => "success",
                    "message" => "Đăng nhập thành công!",
                    "token" => $token,
                    "user" => $user
                ]);
            } else {
                http_response_code(401); // 401 Unauthorized
                echo json_encode(["status" => "error", "message" => "Email hoặc mật khẩu không chính xác."]);
            }

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Lỗi hệ thống: " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Vui lòng nhập Email và Mật khẩu."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không được hỗ trợ."]);
}
?>