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

    $user_id = $data->user_id ?? null;
    $old_password = $data->old_password ?? null;
    $new_password = $data->new_password ?? null;

    if (!$user_id || !$old_password || !$new_password) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Vui lòng cung cấp đủ user_id, mật khẩu cũ và mật khẩu mới."]);
        exit;
    }

    try {
        $sql = "SELECT password_hash FROM users WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user_id]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Không tìm thấy người dùng."]);
            exit;
        }

        // Kiểm tra mật khẩu cũ
        if (!password_verify($old_password, $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Mật khẩu cũ không chính xác."]);
            exit;
        }

        // Cập nhật mật khẩu mới
        $new_hash = password_hash($new_password, PASSWORD_BCRYPT);
        $updateSql = "UPDATE users SET password_hash = ? WHERE id = ?";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([$new_hash, $user_id]);

        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Đổi mật khẩu thành công!"]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Lỗi hệ thống: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không được hỗ trợ."]);
}
?>
