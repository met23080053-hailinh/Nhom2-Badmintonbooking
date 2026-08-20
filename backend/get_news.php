<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $sql = "SELECT * FROM news ORDER BY created_at DESC";
        $stmt = $pdo->query($sql);
        $news = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Format for frontend
        $formattedNews = array_map(function($n) {
            return [
                'id' => $n['id'],
                'title' => $n['title'],
                'date' => $n['date_str'],
                'image' => $n['image_url'],
                'excerpt' => $n['excerpt'],
                'category' => $n['category'],
                'content' => $n['content']
            ];
        }, $news);

        http_response_code(200);
        echo json_encode(["status" => "success", "data" => $formattedNews]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Lỗi hệ thống: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không hỗ trợ."]);
}
?>
