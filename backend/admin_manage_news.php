<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    // Add new news
    if (isset($data->action) && $data->action === 'add') {
        $title = $data->title ?? '';
        $date_str = $data->date ?? date('d Thg m, Y');
        $image_url = $data->image ?? '/images/preview (1).webp';
        $excerpt = $data->excerpt ?? '';
        $category = $data->category ?? 'Khác';
        $content = $data->content ?? '';

        if (!$title || !$excerpt) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Thiếu thông tin."]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO news (title, date_str, image_url, excerpt, category, content) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $date_str, $image_url, $excerpt, $category, $content]);
            
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Đã thêm tin tức."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Lỗi hệ thống: " . $e->getMessage()]);
        }
    } 
    // Delete news
    else if (isset($data->action) && $data->action === 'delete') {
        $id = $data->id ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Thiếu ID."]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
            $stmt->execute([$id]);
            
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Đã xóa tin tức."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Lỗi hệ thống: " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Hành động không hợp lệ."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không hỗ trợ."]);
}
?>
