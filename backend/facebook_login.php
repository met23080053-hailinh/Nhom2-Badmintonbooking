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
    $token = $data->accessToken ?? null;

    if (!$token) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Thiếu Facebook Access Token."]);
        exit;
    }

    // Xác thực token qua Graph API
    $fbUrl = "https://graph.facebook.com/me?fields=id,name,email&access_token=" . $token;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $fbUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $fbData = json_decode($response);

    if ($httpCode !== 200 || isset($fbData->error)) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Facebook Token không hợp lệ hoặc đã hết hạn."]);
        exit;
    }

    $email = $fbData->email ?? null;
    $name = $fbData->name ?? "Người dùng Facebook";
    $fbId = $fbData->id;

    if (!$email) {
        // Nếu không lấy được email (người dùng không cấp quyền email hoặc đăng ký FB bằng SĐT)
        // Dùng Facebook ID làm email giả để định danh
        $email = $fbId . "@facebook.com";
    }

    try {
        $sql = "SELECT * FROM users WHERE email = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            // Đăng nhập
            unset($user['password_hash']);
            $authToken = bin2hex(random_bytes(16));
            
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Đăng nhập Facebook thành công!",
                "token" => $authToken,
                "user" => $user
            ]);
        } else {
            // Đăng ký mới
            $dummyPassword = password_hash(bin2hex(random_bytes(8)), PASSWORD_BCRYPT);
            $role = 'customer';

            $insertSql = "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)";
            $insertStmt = $pdo->prepare($insertSql);
            $insertStmt->execute([$name, $email, $dummyPassword, $role]);

            $newUserId = $pdo->lastInsertId();

            $sqlFetch = "SELECT id, full_name, email, role FROM users WHERE id = ?";
            $stmtFetch = $pdo->prepare($sqlFetch);
            $stmtFetch->execute([$newUserId]);
            $newUser = $stmtFetch->fetch();

            $authToken = bin2hex(random_bytes(16));
            
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Đăng ký bằng Facebook thành công!",
                "token" => $authToken,
                "user" => $newUser
            ]);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Lỗi hệ thống: " . $e->getMessage()]);
    }

} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không được hỗ trợ."]);
}
