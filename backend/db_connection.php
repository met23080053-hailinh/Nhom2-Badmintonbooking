<?php
// Cấu hình CORS để cho phép Frontend (React) gọi API từ cổng khác
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Xử lý request pre-flight của trình duyệt
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Trả về dữ liệu dạng JSON cho React dễ đọc
header("Content-Type: application/json; charset=UTF-8");

// Thông tin kết nối Database
$host = 'localhost';
$db_name = 'badminton_db';
$username = 'root'; 
$password = '';     
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db_name;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false, 
];

try {
    // Khởi tạo đối tượng kết nối PDO
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (\PDOException $e) {
    // Bắt lỗi và trả về JSON thay vì làm sập trang web
    echo json_encode([
        "status" => "error", 
        "message" => "Không thể kết nối cơ sở dữ liệu."
    ]);
    exit;
}
?>