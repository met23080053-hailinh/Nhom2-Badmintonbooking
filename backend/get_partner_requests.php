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
        // Lấy danh sách các bài đăng tìm bạn chơi (OPEN)
        // Kết nối bảng users để lấy tên người đăng, và courts để lấy tên sân
        $sql = "
            SELECT m.id, m.play_date, m.start_time, m.end_time, m.required_level, m.note, m.status, m.created_at,
                   m.spots_needed, m.spots_filled, m.cost_per_person, m.gender_req, m.court_number,
                   u.full_name as author_name, u.id as author_id, u.phone as author_phone,
                   c.name as court_name, c.location as court_location
            FROM matchmaking m
            JOIN users u ON m.user_id = u.id
            LEFT JOIN courts c ON m.court_id = c.id
            WHERE m.status = 'OPEN' AND m.play_date >= CURDATE()
            ORDER BY m.play_date ASC, m.start_time ASC
        ";

        $stmt = $pdo->query($sql);
        $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch participants for each request
        foreach ($requests as &$req) {
            $sql_parts = "SELECT user_name, user_phone FROM matchmaking_participants WHERE matchmaking_id = ?";
            $stmt_parts = $pdo->prepare($sql_parts);
            $stmt_parts->execute([$req['id']]);
            $req['participants'] = $stmt_parts->fetchAll(PDO::FETCH_ASSOC);
        }

        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Lấy danh sách tìm đồng đội thành công.",
            "data" => $requests
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
