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

    $court_id = $data->court_id ?? null;

    if (!$court_id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Thiếu ID sân cần xóa."]);
        exit;
    }

    try {
        $sql = "DELETE FROM courts WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$court_id]);

        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Đã xóa sân thành công!"]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Không tìm thấy sân này."]);
        }

    } catch (PDOException $e) {
        // Cần kiểm tra xem có ràng buộc khóa ngoại không (ví dụ đã có người đặt sân này chưa)
        // Nếu có thì nên chuyển trạng thái sang MAINTENANCE thay vì xóa cứng
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Không thể xóa do sân này đã có dữ liệu đặt chỗ. Vui lòng chuyển trạng thái sang Bảo trì thay vì xóa."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không được hỗ trợ."]);
}
?>
