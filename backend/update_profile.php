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
    $full_name = $data->full_name ?? null;
    $phone = $data->phone ?? null;

    if (!$user_id || !$full_name || !$phone) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Vui lòng cung cấp đủ user_id, full_name và phone."]);
        exit;
    }

    try {
        // Kiểm tra xem số điện thoại có bị trùng với người khác không
        $checkSql = "SELECT id FROM users WHERE phone = ? AND id != ?";
        $checkStmt = $pdo->prepare($checkSql);
        $checkStmt->execute([$phone, $user_id]);
        if ($checkStmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Số điện thoại này đã được sử dụng bởi tài khoản khác."]);
            exit;
        }

        $sql = "UPDATE users SET full_name = ?, phone = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$full_name, $phone, $user_id]);

        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Cập nhật thông tin thành công!",
            "data" => [
                "full_name" => $full_name,
                "phone" => $phone
            ]
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Lỗi hệ thống: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không được hỗ trợ."]);
}
?>
