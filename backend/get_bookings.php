<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db_connection.php';

// Lấy user_id từ đường dẫn URL
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($user_id > 0) {
    // Lấy lịch sử đặt sân của 1 user
    $sql = "SELECT b.*, c.name as court_name, u.full_name as user_name, u.phone as user_phone 
            FROM bookings b 
            JOIN courts c ON b.court_id = c.id 
            JOIN users u ON b.user_id = u.id 
            WHERE b.user_id = :user_id 
            ORDER BY b.created_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['user_id' => $user_id]);
} else {
    // Lấy tất cả cho admin
    $sql = "SELECT b.*, c.name as court_name, u.full_name as user_name, u.phone as user_phone 
            FROM bookings b 
            JOIN courts c ON b.court_id = c.id 
            JOIN users u ON b.user_id = u.id 
            ORDER BY b.created_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
}

$bookings = [];
if ($stmt->rowCount() > 0) {
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $bookings[] = $row;
    }
}
echo json_encode(["status" => "success", "data" => $bookings]);
?>
