<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $action = $data->action ?? null;

    if (!$action) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Thiếu action."]);
        exit;
    }

    try {
        if ($action === 'add') {
            $code = $data->code ?? null;
            $discount_type = $data->discountType ?? 'percentage';
            $discount_value = $data->discountValue ?? 0;
            $description = $data->description ?? '';
            $max_limit = $data->maxLimit === 'Vô hạn' ? null : (int)$data->maxLimit;
            $status = 'ACTIVE';

            if (!$code || $discount_value <= 0) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Dữ liệu không hợp lệ."]);
                exit;
            }

            $sql = "INSERT INTO promotions (code, discount_type, discount_value, description, max_limit, status) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$code, $discount_type, $discount_value, $description, $max_limit, $status]);
            
            echo json_encode([
                "status" => "success", 
                "message" => "Thêm khuyến mãi thành công.",
                "id" => 'prm-' . $pdo->lastInsertId()
            ]);

        } elseif ($action === 'update_status') {
            $id_str = $data->id ?? '';
            $id = (int)str_replace('prm-', '', $id_str);
            $new_status = $data->status === 'ĐANG CHẠY' ? 'ACTIVE' : 'PAUSED';
            
            if (!$id) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Thiếu ID khuyến mãi."]);
                exit;
            }

            $sql = "UPDATE promotions SET status = ? WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$new_status, $id]);

            echo json_encode(["status" => "success", "message" => "Cập nhật trạng thái thành công."]);
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Hành động không hợp lệ."]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Lỗi CSDL: " . $e->getMessage()]);
    }
}
?>
