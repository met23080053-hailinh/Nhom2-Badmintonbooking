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

    $matchmaking_id = $data->matchmaking_id ?? null;
    $user_name = $data->user_name ?? null;
    $user_phone = $data->user_phone ?? null;

    if (!$matchmaking_id || !$user_name || !$user_phone) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Vui lòng cung cấp đủ thông tin tham gia (Tên, SĐT, ID Nhóm)."]);
        exit;
    }

    try {
        $pdo->beginTransaction();

        // Kiểm tra xem nhóm còn chỗ không
        $stmt_check = $pdo->prepare("SELECT spots_needed, spots_filled FROM matchmaking WHERE id = ? FOR UPDATE");
        $stmt_check->execute([$matchmaking_id]);
        $match = $stmt_check->fetch();

        if (!$match) {
            $pdo->rollBack();
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Không tìm thấy nhóm này."]);
            exit;
        }

        if ($match['spots_filled'] >= $match['spots_needed']) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Nhóm này đã đủ người."]);
            exit;
        }

        // Thêm vào danh sách tham gia
        $stmt_insert = $pdo->prepare("INSERT INTO matchmaking_participants (matchmaking_id, user_name, user_phone) VALUES (?, ?, ?)");
        $stmt_insert->execute([$matchmaking_id, $user_name, $user_phone]);

        // Cập nhật số người đã tham gia
        $new_filled = $match['spots_filled'] + 1;
        $status = ($new_filled >= $match['spots_needed']) ? 'CLOSED' : 'OPEN';

        $stmt_update = $pdo->prepare("UPDATE matchmaking SET spots_filled = ?, status = ? WHERE id = ?");
        $stmt_update->execute([$new_filled, $status, $matchmaking_id]);

        $pdo->commit();

        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Tham gia nhóm thành công!"]);

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
