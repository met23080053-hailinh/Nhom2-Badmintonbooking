<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db_connection.php';

// Nhận dữ liệu JSON từ React
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->token)) {
    echo json_encode(['status' => 'error', 'message' => 'Không có token']);
    exit;
}

$id_token = $data->token;

// Gọi API của Google để xác thực Token (Cách đơn giản nhất không cần thư viện phức tạp)
$verify_url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . $id_token;

// Tắt cảnh báo nếu token không hợp lệ (Google sẽ trả về 400 Bad Request)
$context = stream_context_create([
    'http' => ['ignore_errors' => true]
]);
$response = file_get_contents($verify_url, false, $context);

if ($response === FALSE) {
    echo json_encode(['status' => 'error', 'message' => 'Không thể xác minh token với Google']);
    exit;
}

$payload = json_decode($response);

// Nếu có thuộc tính error thì token không hợp lệ
if (isset($payload->error)) {
    echo json_encode(['status' => 'error', 'message' => 'Token không hợp lệ hoặc đã hết hạn']);
    exit;
}

// Kiểm tra Client ID (aud) để đảm bảo token này dành cho ứng dụng của mình
$client_id = "236142184617-v1jlqerroes6f1mnpvu8u1m9ivf0vkrh.apps.googleusercontent.com";
if (!isset($payload->aud) || $payload->aud !== $client_id) {
    echo json_encode(['status' => 'error', 'message' => 'Client ID không khớp']);
    exit;
}

$email = $payload->email;
$full_name = $payload->name;
$google_id = $payload->sub; // ID duy nhất của người dùng Google

try {
    // 1. Kiểm tra xem email đã tồn tại trong DB chưa
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        // Đã có tài khoản -> Đăng nhập thành công
        echo json_encode([
            'status' => 'success', 
            'message' => 'Đăng nhập Google thành công', 
            'user' => ['id' => $user['id'], 'full_name' => $user['full_name'], 'email' => $user['email']]
        ]);
    } else {
        // Chưa có tài khoản -> Tạo mới
        // Vì DB đang yêu cầu phone (UNIQUE NOT NULL), ta tạo 1 số ảo dạng "Gxxxxx..." từ google_id để đáp ứng điều kiện DB
        $dummy_phone = "G" . substr($google_id, 0, 14); 
        // Mật khẩu ảo ngẫu nhiên để bảo mật
        $dummy_password = password_hash(bin2hex(random_bytes(8)), PASSWORD_BCRYPT);
        
        $stmt = $pdo->prepare("INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'CUSTOMER')");
        $stmt->execute([$full_name, $email, $dummy_phone, $dummy_password]);
        
        $new_id = $pdo->lastInsertId();
        
        echo json_encode([
            'status' => 'success', 
            'message' => 'Tạo tài khoản qua Google thành công', 
            'user' => ['id' => $new_id, 'full_name' => $full_name, 'email' => $email]
        ]);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Lỗi hệ thống: ' . $e->getMessage()]);
}
?>
