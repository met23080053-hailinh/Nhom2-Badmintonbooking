<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require 'db_connection.php';

try {
    $sql = "SELECT id, code, discount_type, discount_value, description, valid_from, valid_to, used_count, max_limit, status, updated_at FROM promotions ORDER BY id DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $promotions = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Map to frontend Promotion interface
        $promotions[] = [
            'id' => 'prm-' . $row['id'],
            'code' => $row['code'],
            'discountType' => $row['discount_type'],
            'discountValue' => (float)$row['discount_value'],
            'description' => $row['description'],
            'validPeriod' => ($row['valid_from'] && $row['valid_to']) ? date('d/m/Y', strtotime($row['valid_from'])) . ' - ' . date('d/m/Y', strtotime($row['valid_to'])) : 'Không giới hạn',
            'usedCount' => (int)$row['used_count'],
            'maxLimit' => $row['max_limit'] ? (int)$row['max_limit'] : 'Vô hạn',
            'status' => $row['status'] === 'ACTIVE' ? 'ĐANG CHẠY' : 'TẠM DỪNG',
            'updatedAt' => 'Cập nhật ' . date('d/m/Y', strtotime($row['updated_at']))
        ];
    }
    
    echo json_encode(["status" => "success", "data" => $promotions]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Lỗi CSDL: " . $e->getMessage()]);
}
?>
