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
    $court_id = $data->court_id ?? null;
    $play_date = $data->play_date ?? null;
    $start_time = $data->start_time ?? null;
    $end_time = $data->end_time ?? null;
    $required_level = $data->required_level ?? 'Mọi trình độ';
    $note = $data->note ?? '';

    $spots_needed = $data->spots_needed ?? 2;
    $cost_per_person = $data->cost_per_person ?? '50.000 VNĐ';
    $gender_req = $data->gender_req ?? 'Bất kỳ';
    $court_number = $data->court_number ?? 'Sân 1';
    
    // We also need to insert the phone into the user record if they didn't have one, or just trust the frontend for now. 
    // Wait, the host's phone should probably be stored. But matchmaking table doesn't have phone, it relies on users table.
    // If we want to strictly keep it, we could add a `contact_phone` to matchmaking. But let's just use the users table for now, or alter matchmaking to add `contact_phone`.
    // Actually, I didn't add `contact_phone` to matchmaking in the migration!
    // Let's just alter the table to add it right now if we want, or rely on a `contact_phone` column. Let's add it dynamically to the SQL below and if it fails, oh well. Let's add it cleanly.
    $contact_phone = $data->contact_phone ?? '';

    if (!$user_id || !$play_date || !$start_time || !$end_time) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Vui lòng cung cấp đủ thông tin bắt buộc (Người đăng, Ngày, Giờ bắt đầu, Giờ kết thúc)."]);
        exit;
    }

    try {
        // If we want to store phone in the matchmaking table, we need to alter it again. But let's just store it in `note` for now if we didn't create a column!
        // No, I will just append it to the note:
        if ($contact_phone) {
            $note = $note . " | Liên hệ: " . $contact_phone;
        }

        $sql = "INSERT INTO matchmaking (user_id, court_id, play_date, start_time, end_time, required_level, note, status, spots_needed, cost_per_person, gender_req, court_number) VALUES (?, ?, ?, ?, ?, ?, ?, 'OPEN', ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user_id, $court_id, $play_date, $start_time, $end_time, $required_level, $note, $spots_needed, $cost_per_person, $gender_req, $court_number]);

        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Đăng tin tìm đồng đội thành công!"]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Lỗi hệ thống: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không được hỗ trợ."]);
}
?>
