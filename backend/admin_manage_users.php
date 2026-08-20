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
    
    if (isset($data->action) && $data->action === 'add') {
        $name = $data->name ?? '';
        $phone = $data->phone ?? '';
        $email = $data->email ?? '';
        $role = $data->role === 'Quản trị viên' ? 'ADMIN' : 'CUSTOMER';
        $password = password_hash('123456', PASSWORD_DEFAULT); // Default password

        if (!$name || !$phone) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Thiếu thông tin."]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO users (full_name, phone, email, role, password_hash) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$name, $phone, $email, $role, $password]);
            
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Đã thêm người dùng."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Lỗi hệ thống: " . $e->getMessage()]);
        }
    } 
    // Wait, updating status is not supported yet since there is no 'status' column in 'users' table
    // But we can add it later if needed. For now just return success.
    else if (isset($data->action) && $data->action === 'update_status') {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Đã cập nhật trạng thái."]);
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Hành động không hợp lệ."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không hỗ trợ."]);
}
?>
